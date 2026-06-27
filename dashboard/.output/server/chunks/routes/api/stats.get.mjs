import { d as defineEventHandler, c as createError } from '../../nitro/nitro.mjs';
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

const stats_get = defineEventHandler(() => {
  try {
    const db = getAtharDb();
    const total = db.prepare("SELECT COUNT(*) as c FROM lessons").get().c;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const weekFromNow = /* @__PURE__ */ new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const dueToday = db.prepare(
      "SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ? OR next_review_at IS NULL"
    ).get(now).c;
    const dueThisWeek = db.prepare(
      "SELECT COUNT(*) as c FROM lessons WHERE next_review_at <= ?"
    ).get(weekFromNow.toISOString()).c;
    const statusRows = db.prepare(
      "SELECT status, COUNT(*) as c FROM lessons GROUP BY status"
    ).all();
    const byStatus = {};
    for (const row of statusRows) {
      byStatus[row.status] = row.c;
    }
    const allTags = db.prepare("SELECT tags FROM lessons").all();
    const tagCounts = /* @__PURE__ */ new Map();
    for (const row of allTags) {
      try {
        const tags = JSON.parse(row.tags || "[]");
        for (const tag of tags) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      } catch {
      }
    }
    const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count }));
    const languages = db.prepare(
      "SELECT language, COUNT(*) as c FROM lessons WHERE language IS NOT NULL GROUP BY language ORDER BY c DESC"
    ).all();
    return { total, dueToday, dueThisWeek, byStatus, topTags, languages };
  } catch (err) {
    throw createError({
      statusCode: 500,
      message: err.message || "Failed to fetch stats"
    });
  }
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
