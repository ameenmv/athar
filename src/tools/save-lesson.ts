import { getDatabase } from '../db/connection.js';
import { createLogger } from '../utils/logger.js';
import type { SaveLessonInput } from './validators.js';

const log = createLogger('save-lesson');

/** Patterns that indicate a trivial, non-educational change */
const TRIVIAL_PATTERNS = [
  /^(fix|change|update)\s+(indent|format|spacing|whitespace)/i,
  /^(add|remove)\s+(semicolon|comma|bracket|parenthes)/i,
  /^(prettier|eslint|lint)\s+(fix|format|auto)/i,
  /^(import|export)\s+(order|sort|organiz)/i,
  /^(rename|typo|spell)/i,
];

/**
 * Validate that this lesson has real educational value.
 * Returns null if valid, or an error message if rejected.
 */
function validateLessonQuality(input: SaveLessonInput): string | null {
  // 1. Check for trivial patterns in the title
  for (const pattern of TRIVIAL_PATTERNS) {
    if (pattern.test(input.title)) {
      return `Rejected: "${input.title}" appears to be a trivial formatting/style change, not a genuine learning moment. Only save lessons for real mistakes with root cause analysis.`;
    }
  }

  // 2. Problem and root_cause should not be near-identical
  const problemNorm = input.problem.toLowerCase().trim();
  const rootCauseNorm = input.root_cause.toLowerCase().trim();
  if (problemNorm === rootCauseNorm) {
    return 'Rejected: "problem" and "root_cause" are identical. The root cause should explain WHY the problem happened, not restate the problem.';
  }

  // 3. If bad_code provided, good_code should also be provided (and vice versa)
  if (input.bad_code && !input.good_code) {
    return 'Rejected: "bad_code" was provided but "good_code" is missing. Both must be provided for a meaningful comparison.';
  }
  if (input.good_code && !input.bad_code) {
    return 'Rejected: "good_code" was provided but "bad_code" is missing. Both must be provided for a meaningful comparison.';
  }

  // 4. Lesson should not just restate the problem
  const lessonNorm = input.lesson.toLowerCase().trim();
  if (lessonNorm === problemNorm) {
    return 'Rejected: The "lesson" is just a restatement of the "problem". The lesson should be an actionable takeaway.';
  }

  return null; // Valid
}

/**
 * Check for duplicate lessons (similar title + root_cause).
 */
function checkDuplicate(input: SaveLessonInput): { isDuplicate: boolean; existingId?: number; existingTitle?: string } {
  const db = getDatabase();

  // Search FTS for similar content
  const stmt = db.prepare(`
    SELECT l.id, l.title
    FROM lessons_fts fts
    JOIN lessons l ON l.id = fts.rowid
    WHERE lessons_fts MATCH ?
    LIMIT 3
  `);

  // Build a search query from key terms in title and root_cause
  const searchTerms = `${input.title} ${input.root_cause}`
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5)
    .join(' OR ');

  if (!searchTerms) return { isDuplicate: false };

  try {
    const results = stmt.all(searchTerms) as unknown as Array<{ id: number; title: string }>;

    // Simple similarity check: if any existing title is very close
    for (const result of results) {
      const similarity = calculateSimilarity(input.title.toLowerCase(), result.title.toLowerCase());
      if (similarity > 0.8) {
        return { isDuplicate: true, existingId: result.id, existingTitle: result.title };
      }
    }
  } catch {
    // FTS might fail on empty table — that's fine
    log.debug('FTS search failed (possibly empty table), skipping duplicate check');
  }

  return { isDuplicate: false };
}

/**
 * Simple Jaccard similarity between two strings (word-level).
 */
function calculateSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));
  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Save a new programming lesson to the database.
 * Called by the MCP save_lesson tool handler.
 */
export function saveLesson(input: SaveLessonInput): { success: boolean; message: string; lessonId?: number } {
  // Step 1: Validate lesson quality
  const qualityError = validateLessonQuality(input);
  if (qualityError) {
    log.warn(`Lesson rejected: ${qualityError}`);
    return { success: false, message: qualityError };
  }

  // Step 2: Check for duplicates
  const dupCheck = checkDuplicate(input);
  if (dupCheck.isDuplicate) {
    const msg = `Duplicate detected: A similar lesson already exists (ID: ${dupCheck.existingId}, Title: "${dupCheck.existingTitle}"). No new lesson saved.`;
    log.warn(msg);
    return { success: false, message: msg };
  }

  // Step 3: Insert into database
  const db = getDatabase();

  // Calculate first review: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextReviewAt = tomorrow.toISOString();

  const stmt = db.prepare(`
    INSERT INTO lessons (
      title, problem, error_message, root_cause,
      bad_code, good_code, lesson, tags, language,
      file_path, git_diff, review_questions,
      next_review_at, status
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, 'new'
    )
  `);

  const result = stmt.run(
    input.title,
    input.problem,
    input.error_message || null,
    input.root_cause,
    input.bad_code || null,
    input.good_code || null,
    input.lesson,
    JSON.stringify(input.tags),
    input.language || null,
    input.file_path || null,
    input.git_diff || null,
    JSON.stringify(input.review_questions),
    nextReviewAt,
  );

  const lessonId = Number(result.lastInsertRowid);
  log.info(`Lesson saved successfully: ID=${lessonId}, Title="${input.title}"`);

  return {
    success: true,
    message: `✅ Lesson saved successfully!\n\n📖 **${input.title}**\n🆔 ID: ${lessonId}\n🏷️ Tags: ${input.tags.join(', ')}\n📅 First review scheduled: tomorrow\n\nThe developer will be reminded to review this lesson using spaced repetition.`,
    lessonId,
  };
}
