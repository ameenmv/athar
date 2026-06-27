import { getDatabase } from '../db/connection.js';
import { createLogger } from '../utils/logger.js';
import type { MemoryInput } from './validators.js';

const log = createLogger('memory');

interface LessonResult {
  id: number;
  title: string;
  problem: string;
  root_cause: string;
  lesson: string;
  bad_code: string | null;
  good_code: string | null;
  tags: string;
  language: string | null;
  status: string;
  review_count: number;
  created_at: string;
}

/**
 * Search and retrieve past lessons from memory.
 * Called by the MCP memory tool handler.
 */
export function searchMemory(input: MemoryInput): { results: LessonResult[]; message: string } {
  const db = getDatabase();

  log.info(`Searching memory: query="${input.query}", limit=${input.limit}`);

  let results: LessonResult[] = [];

  // Strategy 1: Try FTS5 full-text search first
  try {
    const ftsQuery = input.query
      .replace(/[^\w\s]/g, ' ')    // Remove special chars
      .split(/\s+/)
      .filter(w => w.length > 1)
      .map(w => `"${w}"`)          // Exact phrase matching per word
      .join(' OR ');

    if (ftsQuery) {
      let sql = `
        SELECT l.id, l.title, l.problem, l.root_cause, l.lesson,
               l.bad_code, l.good_code, l.tags, l.language,
               l.status, l.review_count, l.created_at
        FROM lessons_fts fts
        JOIN lessons l ON l.id = fts.rowid
      `;

      const conditions: string[] = [];
      const params: (string | number)[] = [];

      conditions.push('lessons_fts MATCH ?');
      params.push(ftsQuery);

      if (input.language) {
        conditions.push('l.language = ?');
        params.push(input.language);
      }

      if (input.tags && input.tags.length > 0) {
        // Match any tag using JSON
        const tagConditions = input.tags.map(() => 'l.tags LIKE ?');
        conditions.push(`(${tagConditions.join(' OR ')})`);
        params.push(...input.tags.map(t => `%"${t}"%`));
      }

      sql += ' WHERE ' + conditions.join(' AND ');
      sql += ` ORDER BY rank LIMIT ?`;
      params.push(input.limit);

      const stmt = db.prepare(sql);
      results = stmt.all(...params) as unknown as LessonResult[];
    }
  } catch (err) {
    log.debug('FTS search failed, falling back to LIKE search', String(err));
  }

  // Strategy 2: Fallback to LIKE search if FTS returns nothing
  if (results.length === 0) {
    let sql = `
      SELECT id, title, problem, root_cause, lesson,
             bad_code, good_code, tags, language,
             status, review_count, created_at
      FROM lessons
      WHERE (
        title LIKE ? OR
        problem LIKE ? OR
        root_cause LIKE ? OR
        lesson LIKE ? OR
        tags LIKE ?
      )
    `;

    const likeQuery = `%${input.query}%`;
    const params: (string | number)[] = [likeQuery, likeQuery, likeQuery, likeQuery, likeQuery];

    if (input.language) {
      sql += ' AND language = ?';
      params.push(input.language);
    }

    if (input.tags && input.tags.length > 0) {
      const tagConditions = input.tags.map(() => 'tags LIKE ?');
      sql += ` AND (${tagConditions.join(' OR ')})`;
      params.push(...input.tags.map(t => `%"${t}"%`));
    }

    sql += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(input.limit);

    const stmt = db.prepare(sql);
    results = stmt.all(...params) as unknown as LessonResult[];
  }

  log.info(`Found ${results.length} matching lessons`);

  if (results.length === 0) {
    return {
      results: [],
      message: `No lessons found matching "${input.query}". This might be a new type of mistake — if resolved, consider saving it as a lesson.`,
    };
  }

  // Format results for the AI assistant
  const formatted = results.map((r, i) => {
    const tags = JSON.parse(r.tags || '[]') as string[];
    let text = `\n### ${i + 1}. ${r.title} (ID: ${r.id})\n`;
    text += `**Status:** ${r.status} | **Reviews:** ${r.review_count} | **Language:** ${r.language || 'N/A'}\n`;
    text += `**Tags:** ${tags.join(', ')}\n\n`;
    text += `**Problem:** ${r.problem}\n\n`;
    text += `**Root Cause:** ${r.root_cause}\n\n`;
    text += `**Lesson:** ${r.lesson}\n`;

    if (r.bad_code) {
      text += `\n**Bad Code:**\n\`\`\`\n${r.bad_code}\n\`\`\`\n`;
    }
    if (r.good_code) {
      text += `\n**Good Code:**\n\`\`\`\n${r.good_code}\n\`\`\`\n`;
    }

    return text;
  }).join('\n---\n');

  return {
    results,
    message: `Found ${results.length} relevant lesson(s) from memory:\n${formatted}`,
  };
}
