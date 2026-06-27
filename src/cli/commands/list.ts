import chalk from 'chalk';
import { getDatabase } from '../../db/connection.js';
import { closeDatabase } from '../../db/connection.js';

interface ListOptions {
  tag?: string;
  language?: string;
  status?: string;
  search?: string;
  limit: string;
}

export async function listCommand(options: ListOptions): Promise<void> {
  try {
    const db = getDatabase();
    const limit = parseInt(options.limit, 10) || 20;

    let sql = `
      SELECT id, title, tags, language, status, review_count,
             interval_days, next_review_at, created_at
      FROM lessons
    `;
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (options.tag) {
      conditions.push('tags LIKE ?');
      params.push(`%"${options.tag}"%`);
    }

    if (options.language) {
      conditions.push('language = ?');
      params.push(options.language);
    }

    if (options.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }

    if (options.search) {
      conditions.push('(title LIKE ? OR problem LIKE ? OR root_cause LIKE ? OR lesson LIKE ?)');
      const q = `%${options.search}%`;
      params.push(q, q, q, q);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const lessons = db.prepare(sql).all(...params) as unknown as Array<{
      id: number;
      title: string;
      tags: string;
      language: string | null;
      status: string;
      review_count: number;
      interval_days: number;
      next_review_at: string | null;
      created_at: string;
    }>;

    if (lessons.length === 0) {
      console.log(chalk.gray('\n  No lessons found matching your criteria.\n'));
      return;
    }

    console.log(chalk.bold(`\n📚 Lessons (${lessons.length} results)\n`));

    const statusIcons: Record<string, string> = {
      new: '🆕',
      learning: '📖',
      learned: '✅',
      mastered: '🏆',
    };

    for (const lesson of lessons) {
      const tags = JSON.parse(lesson.tags || '[]') as string[];
      const icon = statusIcons[lesson.status] || '❓';
      const date = lesson.created_at.split('T')[0];

      console.log(`  ${icon} ${chalk.bold.white(`#${lesson.id}`)} ${chalk.white(lesson.title)}`);
      console.log(`     ${chalk.gray(date)} · ${chalk.blue(tags.join(', '))} · ${chalk.gray(lesson.language || 'N/A')} · Reviews: ${chalk.white(lesson.review_count)}`);

      if (lesson.next_review_at) {
        const nextReview = new Date(lesson.next_review_at);
        const now = new Date();
        const daysUntil = Math.ceil((nextReview.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil <= 0) {
          console.log(`     ${chalk.yellow('⚠️  Due for review!')}`);
        } else {
          console.log(`     ${chalk.gray(`Next review in ${daysUntil} day(s)`)}`);
        }
      }
      console.log();
    }
  } finally {
    closeDatabase();
  }
}
