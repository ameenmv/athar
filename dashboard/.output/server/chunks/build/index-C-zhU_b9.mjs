import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withAsyncContext, unref, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { u as useFetch } from './fetch-BlczD9wj.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import '@vue/shared';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: stats } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/stats",
      "$cCaXXO-PVy"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: lessons } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/lessons",
      { query: { limit: 5 } },
      "$HsTkVEtrW1"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const statusIcons = {
      new: "🆕",
      learning: "📖",
      learned: "✅",
      mastered: "🏆"
    };
    function parseTags(tagsJson) {
      try {
        return JSON.parse(tagsJson || "[]");
      } catch {
        return [];
      }
    }
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
    function daysUntilReview(nextReview) {
      if (!nextReview) return "Due now";
      const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 864e5);
      if (days <= 0) return "⚠️ Due now";
      if (days === 1) return "Tomorrow";
      return `${days} days`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="page-header"><h1>📊 Dashboard</h1><p class="subtitle">Your programming lesson memory at a glance</p></div>`);
      if (unref(stats)) {
        _push(`<div class="stats-grid"><div class="stat-card animate-in"><div class="stat-label">Total Lessons</div><div class="stat-value accent">${ssrInterpolate(unref(stats).total)}</div></div><div class="stat-card animate-in"><div class="stat-label">Due Today</div><div class="${ssrRenderClass([unref(stats).dueToday > 0 ? "warning" : "success", "stat-value"])}">${ssrInterpolate(unref(stats).dueToday)}</div></div><div class="stat-card animate-in"><div class="stat-label">Due This Week</div><div class="${ssrRenderClass([unref(stats).dueThisWeek > 0 ? "warning" : "success", "stat-value"])}">${ssrInterpolate(unref(stats).dueThisWeek)}</div></div><div class="stat-card animate-in"><div class="stat-label">Mastered</div><div class="stat-value success">${ssrInterpolate(unref(stats).byStatus?.mastered || 0)}</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(stats) && unref(stats).total > 0) {
        _push(`<div class="detail-section"><h3>📈 Status Breakdown</h3><div class="stats-grid" style="${ssrRenderStyle({ "margin-bottom": "0" })}"><!--[-->`);
        ssrRenderList(["new", "learning", "learned", "mastered"], (s) => {
          _push(`<div class="stat-card animate-in"><div class="stat-label" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "6px" })}"><span>${ssrInterpolate(statusIcons[s])}</span><span>${ssrInterpolate(s)}</span></div><div class="stat-value">${ssrInterpolate(unref(stats).byStatus?.[s] || 0)}</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(stats) && unref(stats).topTags?.length) {
        _push(`<div class="detail-section" style="${ssrRenderStyle({ "margin-top": "32px" })}"><h3>🏷️ Top Tags</h3><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "gap": "8px" })}"><!--[-->`);
        ssrRenderList(unref(stats).topTags, (t) => {
          _push(`<span class="tag" style="${ssrRenderStyle({ "font-size": "0.82rem", "padding": "6px 14px" })}">${ssrInterpolate(t.tag)} <span style="${ssrRenderStyle({ "opacity": "0.5", "margin-left": "4px" })}">(${ssrInterpolate(t.count)})</span></span>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(lessons)?.length) {
        _push(`<div class="detail-section" style="${ssrRenderStyle({ "margin-top": "32px" })}"><h3 style="${ssrRenderStyle({ "display": "flex", "justify-content": "space-between", "align-items": "center" })}"><span>📚 Recent Lessons</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/lessons",
          style: { "font-size": "0.8rem", "text-transform": "none", "letter-spacing": "0" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View All → `);
            } else {
              return [
                createTextVNode(" View All → ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</h3><div class="lessons-grid"><!--[-->`);
        ssrRenderList(unref(lessons), (lesson) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: lesson.id,
            to: `/lessons/${lesson.id}`,
            class: "lesson-card animate-in"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="card-header"${_scopeId}><span class="card-title"${_scopeId}>${ssrInterpolate(lesson.title)}</span><span class="${ssrRenderClass([lesson.status, "status-badge"])}"${_scopeId}>${ssrInterpolate(statusIcons[lesson.status])} ${ssrInterpolate(lesson.status)}</span></div><div class="card-body"${_scopeId}>${ssrInterpolate(lesson.problem?.substring(0, 150))}${ssrInterpolate(lesson.problem?.length > 150 ? "..." : "")}</div><div class="card-footer"${_scopeId}><div class="card-tags"${_scopeId}><!--[-->`);
                ssrRenderList(parseTags(lesson.tags), (tag) => {
                  _push2(`<span class="tag"${_scopeId}>${ssrInterpolate(tag)}</span>`);
                });
                _push2(`<!--]--></div><div class="card-meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(lesson.language || "N/A")}</span><span${_scopeId}>${ssrInterpolate(formatDate(lesson.created_at))}</span><span${_scopeId}>Next: ${ssrInterpolate(daysUntilReview(lesson.next_review_at))}</span></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "card-header" }, [
                    createVNode("span", { class: "card-title" }, toDisplayString(lesson.title), 1),
                    createVNode("span", {
                      class: ["status-badge", lesson.status]
                    }, toDisplayString(statusIcons[lesson.status]) + " " + toDisplayString(lesson.status), 3)
                  ]),
                  createVNode("div", { class: "card-body" }, toDisplayString(lesson.problem?.substring(0, 150)) + toDisplayString(lesson.problem?.length > 150 ? "..." : ""), 1),
                  createVNode("div", { class: "card-footer" }, [
                    createVNode("div", { class: "card-tags" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(parseTags(lesson.tags), (tag) => {
                        return openBlock(), createBlock("span", {
                          key: tag,
                          class: "tag"
                        }, toDisplayString(tag), 1);
                      }), 128))
                    ]),
                    createVNode("div", { class: "card-meta" }, [
                      createVNode("span", null, toDisplayString(lesson.language || "N/A"), 1),
                      createVNode("span", null, toDisplayString(formatDate(lesson.created_at)), 1),
                      createVNode("span", null, "Next: " + toDisplayString(daysUntilReview(lesson.next_review_at)), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(stats) && unref(stats).total === 0) {
        _push(`<div class="empty-state"><div class="empty-icon">🔮</div><p>No lessons yet.<br>Start coding with Athar MCP in your IDE and lessons will appear here!</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C-zhU_b9.mjs.map
