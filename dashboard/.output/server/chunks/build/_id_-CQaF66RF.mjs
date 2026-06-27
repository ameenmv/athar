import { _ as _export_sfc, b as useRoute, a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withAsyncContext, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const id = route.params.id;
    const { data: lesson, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/lessons/${id}`,
      "$v7w6lj0v0v"
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
    function parseQuestions(questionsJson) {
      try {
        return JSON.parse(questionsJson || "[]");
      } catch {
        return [];
      }
    }
    function formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    }
    function daysUntilReview(nextReview) {
      if (!nextReview) return "Due now";
      const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 864e5);
      if (days <= 0) return "Due now ⚠️";
      if (days === 1) return "Tomorrow";
      return `In ${days} days`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-ef150ae1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/lessons",
        class: "back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Back to Lessons`);
          } else {
            return [
              createTextVNode("← Back to Lessons")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(error)) {
        _push(`<div class="empty-state" data-v-ef150ae1><div class="empty-icon" data-v-ef150ae1>❌</div><p data-v-ef150ae1>Lesson not found.</p></div>`);
      } else if (unref(lesson)) {
        _push(`<div data-v-ef150ae1><div class="page-header" style="${ssrRenderStyle({ "display": "flex", "align-items": "flex-start", "justify-content": "space-between", "gap": "20px", "flex-wrap": "wrap" })}" data-v-ef150ae1><div data-v-ef150ae1><h1 style="${ssrRenderStyle({ "font-size": "1.5rem" })}" data-v-ef150ae1>${ssrInterpolate(unref(lesson).title)}</h1><p class="subtitle" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "gap": "12px", "margin-top": "10px", "flex-wrap": "wrap" })}" data-v-ef150ae1><span class="${ssrRenderClass([unref(lesson).status, "status-badge"])}" data-v-ef150ae1>${ssrInterpolate(statusIcons[unref(lesson).status])} ${ssrInterpolate(unref(lesson).status)}</span><span style="${ssrRenderStyle({ "color": "var(--text-muted)", "font-size": "0.8rem" })}" data-v-ef150ae1> #${ssrInterpolate(unref(lesson).id)} · ${ssrInterpolate(unref(lesson).language || "N/A")} · ${ssrInterpolate(formatDate(unref(lesson).created_at))}</span></p></div><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "flex-end", "gap": "4px" })}" data-v-ef150ae1><span style="${ssrRenderStyle({ "font-size": "0.75rem", "color": "var(--text-muted)" })}" data-v-ef150ae1>Next Review</span><span style="${ssrRenderStyle({ "font-size": "0.95rem", "font-weight": "600", "color": "var(--accent-primary)" })}" data-v-ef150ae1>${ssrInterpolate(daysUntilReview(unref(lesson).next_review_at))}</span><span style="${ssrRenderStyle({ "font-size": "0.72rem", "color": "var(--text-muted)" })}" data-v-ef150ae1> Reviews: ${ssrInterpolate(unref(lesson).review_count)} · Interval: ${ssrInterpolate(unref(lesson).interval_days)}d </span></div></div><div style="${ssrRenderStyle({ "display": "flex", "flex-wrap": "wrap", "gap": "6px", "margin-bottom": "28px" })}" data-v-ef150ae1><!--[-->`);
        ssrRenderList(parseTags(unref(lesson).tags), (tag) => {
          _push(`<span class="tag" data-v-ef150ae1>${ssrInterpolate(tag)}</span>`);
        });
        _push(`<!--]--></div><div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>❗ Problem</h3><div class="detail-card" data-v-ef150ae1><p data-v-ef150ae1>${ssrInterpolate(unref(lesson).problem)}</p></div></div>`);
        if (unref(lesson).error_message) {
          _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>💢 Error Message</h3><div class="code-block bad" data-v-ef150ae1>${ssrInterpolate(unref(lesson).error_message)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>🔍 Root Cause</h3><div class="detail-card" data-v-ef150ae1><p data-v-ef150ae1>${ssrInterpolate(unref(lesson).root_cause)}</p></div></div>`);
        if (unref(lesson).bad_code && unref(lesson).good_code) {
          _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>💻 Code Comparison</h3><div style="${ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr 1fr", "gap": "16px" })}" data-v-ef150ae1><div data-v-ef150ae1><div class="code-label bad" data-v-ef150ae1>✗ Bad Code</div><div class="code-block bad" data-v-ef150ae1>${ssrInterpolate(unref(lesson).bad_code)}</div></div><div data-v-ef150ae1><div class="code-label good" data-v-ef150ae1>✓ Good Code</div><div class="code-block good" data-v-ef150ae1>${ssrInterpolate(unref(lesson).good_code)}</div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>💡 Key Lesson</h3><div class="detail-card" style="${ssrRenderStyle({ "border-left": "3px solid var(--accent-primary)" })}" data-v-ef150ae1><p style="${ssrRenderStyle({ "font-weight": "500" })}" data-v-ef150ae1>${ssrInterpolate(unref(lesson).lesson)}</p></div></div>`);
        if (parseQuestions(unref(lesson).review_questions).length) {
          _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>❓ Review Questions</h3><!--[-->`);
          ssrRenderList(parseQuestions(unref(lesson).review_questions), (qa, i) => {
            _push(`<div class="review-qa" data-v-ef150ae1><div class="question" data-v-ef150ae1>Q${ssrInterpolate(i + 1)}: ${ssrInterpolate(qa.q)}</div><div class="answer" data-v-ef150ae1>${ssrInterpolate(qa.a)}</div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(lesson).git_diff) {
          _push(`<div class="detail-section" data-v-ef150ae1><h3 data-v-ef150ae1>📝 Git Diff</h3><div class="code-block" data-v-ef150ae1>${ssrInterpolate(unref(lesson).git_diff)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/lessons/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef150ae1"]]);

export { _id_ as default };
//# sourceMappingURL=_id_-CQaF66RF.mjs.map
