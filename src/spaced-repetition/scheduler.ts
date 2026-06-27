import { getDatabase } from '../db/connection.js';
import { calculateSM2 } from './sm2.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('scheduler');

export interface LessonForReview {
  id: number;
  title: string;
  problem: string;
  root_cause: string;
  lesson: string;
  bad_code: string | null;
  good_code: string | null;
  tags: string;
  language: string | null;
  review_questions: string;
  repetitions: number;
  easiness_factor: number;
  interval_days: number;
  status: string;
  review_count: number;
  created_at: string;
}

/**
 * Get all lessons that are due for review (next_review_at <= now).
 */
export function getDueReviews(): LessonForReview[] {
  const db = getDatabase();
  const now = new Date().toISOString();

  const stmt = db.prepare(`
    SELECT id, title, problem, root_cause, lesson,
           bad_code, good_code, tags, language,
           review_questions, repetitions, easiness_factor,
           interval_days, status, review_count, created_at
    FROM lessons
    WHERE next_review_at <= ? OR next_review_at IS NULL
    ORDER BY next_review_at ASC
  `);

  return stmt.all(now) as unknown as LessonForReview[];
}

/**
 * Update a lesson after a review session.
 * Applies the SM-2 algorithm and updates the database.
 */
export function recordReview(lessonId: number, quality: number): {
  success: boolean;
  nextReviewAt: Date;
  newStatus: string;
  intervalDays: number;
} {
  const db = getDatabase();

  // Get current state
  const lesson = db.prepare(`
    SELECT repetitions, easiness_factor, interval_days
    FROM lessons WHERE id = ?
  `).get(lessonId) as unknown as { repetitions: number; easiness_factor: number; interval_days: number } | undefined;

  if (!lesson) {
    throw new Error(`Lesson with ID ${lessonId} not found`);
  }

  // Calculate SM-2
  const result = calculateSM2(
    {
      repetitions: lesson.repetitions,
      easinessFactor: lesson.easiness_factor,
      intervalDays: lesson.interval_days,
    },
    quality
  );

  // Update database
  db.prepare(`
    UPDATE lessons SET
      repetitions = ?,
      easiness_factor = ?,
      interval_days = ?,
      next_review_at = ?,
      last_reviewed_at = datetime('now'),
      status = ?,
      quality_score = ?,
      review_count = review_count + 1,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    result.repetitions,
    result.easinessFactor,
    result.intervalDays,
    result.nextReviewAt.toISOString(),
    result.status,
    quality,
    lessonId
  );

  log.info(`Review recorded: lesson=${lessonId}, quality=${quality}, next_review=${result.intervalDays}d, status=${result.status}`);

  return {
    success: true,
    nextReviewAt: result.nextReviewAt,
    newStatus: result.status,
    intervalDays: result.intervalDays,
  };
}

/**
 * Get statistics about all lessons.
 */
export function getStats(): {
  total: number;
  dueToday: number;
  dueThisWeek: number;
  byStatus: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
} {
  const db = getDatabase();
  const now = new Date().toISOString();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const total = (db.prepare('SELECT COUNT(*) as c FROM lessons').get() as unknown as { c: number }).c;

  const dueToday = (db.prepare(
    'SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ? OR next_review_at IS NULL'
  ).get(now) as unknown as { c: number }).c;

  const dueThisWeek = (db.prepare(
    'SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ?'
  ).get(weekFromNow.toISOString()) as unknown as { c: number }).c;

  const statusRows = db.prepare(
    'SELECT status, COUNT(*) as c FROM lessons GROUP BY status'
  ).all() as unknown as Array<{ status: string; c: number }>;

  const byStatus: Record<string, number> = {};
  for (const row of statusRows) {
    byStatus[row.status] = row.c;
  }

  // Extract and count tags
  const allTags = db.prepare('SELECT tags FROM lessons').all() as unknown as Array<{ tags: string }>;
  const tagCounts = new Map<string, number>();
  for (const row of allTags) {
    try {
      const tags = JSON.parse(row.tags || '[]') as string[];
      for (const tag of tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    } catch { /* skip malformed */ }
  }

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tag, count]) => ({ tag, count }));

  return { total, dueToday, dueThisWeek, byStatus, topTags };
}
