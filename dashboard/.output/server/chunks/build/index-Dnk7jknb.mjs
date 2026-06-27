import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, computed, withAsyncContext, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
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
    const search = ref("");
    const statusFilter = ref("");
    const languageFilter = ref("");
    const queryParams = computed(() => ({
      ...search.value && { search: search.value },
      ...statusFilter.value && { status: statusFilter.value },
      ...languageFilter.value && { language: languageFilter.value },
      limit: 50
    }));
    const { data: lessons, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/lessons",
      {
        query: queryParams,
        watch: [queryParams]
      },
      "$HVe5g_L7CK"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: stats } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/stats",
      "$B2-gJUuxmc"
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
        day: "numeric"
      });
    }
    function daysUntilReview(nextReview) {
      if (!nextReview) return "Due";
      const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 864e5);
      if (days <= 0) return "⚠️ Due";
      return `${days}d`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="page-header"><h1>📚 All Lessons</h1><p class="subtitle">${ssrInterpolate(unref(lessons)?.length || 0)} lessons captured from your coding sessions</p></div><div class="filters-bar"><input${ssrRenderAttr("value", unref(search))} type="text" class="filter-input" placeholder="🔍 Search lessons..."><select class="filter-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "") : ssrLooseEqual(unref(statusFilter), "")) ? " selected" : ""}>All Status</option><option value="new"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "new") : ssrLooseEqual(unref(statusFilter), "new")) ? " selected" : ""}>🆕 New</option><option value="learning"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "learning") : ssrLooseEqual(unref(statusFilter), "learning")) ? " selected" : ""}>📖 Learning</option><option value="learned"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "learned") : ssrLooseEqual(unref(statusFilter), "learned")) ? " selected" : ""}>✅ Learned</option><option value="mastered"${ssrIncludeBooleanAttr(Array.isArray(unref(statusFilter)) ? ssrLooseContain(unref(statusFilter), "mastered") : ssrLooseEqual(unref(statusFilter), "mastered")) ? " selected" : ""}>🏆 Mastered</option></select><select class="filter-select"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(languageFilter)) ? ssrLooseContain(unref(languageFilter), "") : ssrLooseEqual(unref(languageFilter), "")) ? " selected" : ""}>All Languages</option><!--[-->`);
      ssrRenderList(unref(stats)?.languages || [], (lang) => {
        _push(`<option${ssrRenderAttr("value", lang.language)}${ssrIncludeBooleanAttr(Array.isArray(unref(languageFilter)) ? ssrLooseContain(unref(languageFilter), lang.language) : ssrLooseEqual(unref(languageFilter), lang.language)) ? " selected" : ""}>${ssrInterpolate(lang.language)} (${ssrInterpolate(lang.c)}) </option>`);
      });
      _push(`<!--]--></select></div>`);
      if (unref(lessons)?.length) {
        _push(`<div class="lessons-grid"><!--[-->`);
        ssrRenderList(unref(lessons), (lesson) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: lesson.id,
            to: `/lessons/${lesson.id}`,
            class: "lesson-card animate-in"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="card-header"${_scopeId}><span class="card-title"${_scopeId}>${ssrInterpolate(lesson.title)}</span><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "8px" })}"${_scopeId}><span class="${ssrRenderClass([lesson.status, "status-badge"])}"${_scopeId}>${ssrInterpolate(statusIcons[lesson.status])} ${ssrInterpolate(lesson.status)}</span><span class="card-id"${_scopeId}>#${ssrInterpolate(lesson.id)}</span></div></div><div class="card-body"${_scopeId}>${ssrInterpolate(lesson.problem?.substring(0, 200))}${ssrInterpolate(lesson.problem?.length > 200 ? "..." : "")}</div><div class="card-footer"${_scopeId}><div class="card-tags"${_scopeId}><!--[-->`);
                ssrRenderList(parseTags(lesson.tags).slice(0, 5), (tag) => {
                  _push2(`<span class="tag"${_scopeId}>${ssrInterpolate(tag)}</span>`);
                });
                _push2(`<!--]--></div><div class="card-meta"${_scopeId}><span${_scopeId}>${ssrInterpolate(lesson.language || "N/A")}</span><span${_scopeId}>Reviews: ${ssrInterpolate(lesson.review_count)}</span><span${_scopeId}>${ssrInterpolate(formatDate(lesson.created_at))}</span><span${_scopeId}>${ssrInterpolate(daysUntilReview(lesson.next_review_at))}</span></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "card-header" }, [
                    createVNode("span", { class: "card-title" }, toDisplayString(lesson.title), 1),
                    createVNode("div", { style: { "display": "flex", "align-items": "center", "gap": "8px" } }, [
                      createVNode("span", {
                        class: ["status-badge", lesson.status]
                      }, toDisplayString(statusIcons[lesson.status]) + " " + toDisplayString(lesson.status), 3),
                      createVNode("span", { class: "card-id" }, "#" + toDisplayString(lesson.id), 1)
                    ])
                  ]),
                  createVNode("div", { class: "card-body" }, toDisplayString(lesson.problem?.substring(0, 200)) + toDisplayString(lesson.problem?.length > 200 ? "..." : ""), 1),
                  createVNode("div", { class: "card-footer" }, [
                    createVNode("div", { class: "card-tags" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(parseTags(lesson.tags).slice(0, 5), (tag) => {
                        return openBlock(), createBlock("span", {
                          key: tag,
                          class: "tag"
                        }, toDisplayString(tag), 1);
                      }), 128))
                    ]),
                    createVNode("div", { class: "card-meta" }, [
                      createVNode("span", null, toDisplayString(lesson.language || "N/A"), 1),
                      createVNode("span", null, "Reviews: " + toDisplayString(lesson.review_count), 1),
                      createVNode("span", null, toDisplayString(formatDate(lesson.created_at)), 1),
                      createVNode("span", null, toDisplayString(daysUntilReview(lesson.next_review_at)), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="empty-state"><div class="empty-icon">📭</div>`);
        if (unref(search) || unref(statusFilter) || unref(languageFilter)) {
          _push(`<p>No lessons match your filters. Try adjusting.</p>`);
        } else {
          _push(`<p>No lessons yet. Start coding with Athar MCP!</p>`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lessons/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dnk7jknb.mjs.map
