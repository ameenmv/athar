export default defineEventHandler((event) => {
  try {
    const db = getAtharDb();
    const id = getRouterParam(event, 'id');

    const lesson = db.prepare(`
      SELECT * FROM lessons WHERE id = ?
    `).get(id);

    if (!lesson) {
      throw createError({ statusCode: 404, message: 'Lesson not found' });
    }

    return lesson;
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to fetch lesson',
    });
  }
});
