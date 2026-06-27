export default defineEventHandler((event) => {
  try {
    const db = getAtharDb();

    const query = getQuery(event);
    const status = query.status as string | undefined;
    const tag = query.tag as string | undefined;
    const search = query.search as string | undefined;
    const language = query.language as string | undefined;
    const limit = parseInt(query.limit as string) || 50;

    let sql = `
      SELECT id, title, problem, root_cause, lesson,
             tags, language, status, review_count,
             interval_days, next_review_at, created_at
      FROM lessons
    `;
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (tag) {
      conditions.push('tags LIKE ?');
      params.push(`%"${tag}"%`);
    }

    if (language) {
      conditions.push('language = ?');
      params.push(language);
    }

    if (search) {
      conditions.push('(title LIKE ? OR problem LIKE ? OR root_cause LIKE ? OR lesson LIKE ?)');
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);

    const lessons = db.prepare(sql).all(...params);
    return lessons;
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to fetch lessons',
    });
  }
});
