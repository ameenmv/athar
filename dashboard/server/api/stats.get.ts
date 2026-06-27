export default defineEventHandler(() => {
  try {
    const db = getAtharDb();

    const total = (db.prepare('SELECT COUNT(*) as c FROM lessons').get() as any).c;

    const now = new Date().toISOString();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const dueToday = (db.prepare(
      'SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ? OR next_review_at IS NULL'
    ).get(now) as any).c;

    const dueThisWeek = (db.prepare(
      'SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ?'
    ).get(weekFromNow.toISOString()) as any).c;

    const statusRows = db.prepare(
      'SELECT status, COUNT(*) as c FROM lessons GROUP BY status'
    ).all() as any[];

    const byStatus: Record<string, number> = {};
    for (const row of statusRows) {
      byStatus[row.status] = row.c;
    }

    const allTags = db.prepare('SELECT tags FROM lessons').all() as any[];
    const tagCounts = new Map<string, number>();
    for (const row of allTags) {
      try {
        const tags = JSON.parse(row.tags || '[]') as string[];
        for (const tag of tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      } catch { /* skip */ }
    }

    const topTags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    const languages = db.prepare(
      'SELECT language, COUNT(*) as c FROM lessons WHERE language IS NOT NULL GROUP BY language ORDER BY c DESC'
    ).all();

    return { total, dueToday, dueThisWeek, byStatus, topTags, languages };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to fetch stats',
    });
  }
});
