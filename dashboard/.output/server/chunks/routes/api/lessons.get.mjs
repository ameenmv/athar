import { d as defineEventHandler, g as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { g as getAtharDb } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'node:sqlite';
import 'node:os';

const lessons_get = defineEventHandler((event) => {
  try {
    const db = getAtharDb();
    const query = getQuery(event);
    const status = query.status;
    const tag = query.tag;
    const search = query.search;
    const language = query.language;
    const limit = parseInt(query.limit) || 50;
    let sql = `
      SELECT id, title, problem, root_cause, lesson,
             tags, language, status, review_count,
             interval_days, next_review_at, created_at
      FROM lessons
    `;
    const conditions = [];
    const params = [];
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }
    if (tag) {
      conditions.push("tags LIKE ?");
      params.push(`%"${tag}"%`);
    }
    if (language) {
      conditions.push("language = ?");
      params.push(language);
    }
    if (search) {
      conditions.push("(title LIKE ? OR problem LIKE ? OR root_cause LIKE ? OR lesson LIKE ?)");
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY created_at DESC LIMIT ?";
    params.push(limit);
    const lessons = db.prepare(sql).all(...params);
    return lessons;
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err.message || "Failed to fetch lessons"
    });
  }
});

export { lessons_get as default };
//# sourceMappingURL=lessons.get.mjs.map
