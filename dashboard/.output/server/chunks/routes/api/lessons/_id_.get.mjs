import { d as defineEventHandler, a as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { g as getAtharDb } from '../../../_/db.mjs';
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

const _id__get = defineEventHandler((event) => {
  try {
    const db = getAtharDb();
    const id = getRouterParam(event, "id");
    const lesson = db.prepare(`
      SELECT * FROM lessons WHERE id = ?
    `).get(id);
    if (!lesson) {
      throw createError({ statusCode: 404, message: "Lesson not found" });
    }
    return lesson;
  } catch (err) {
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      message: err.message || "Failed to fetch lesson"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
