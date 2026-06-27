<script setup lang="ts">
const route = useRoute();
const id = route.params.id;

const { data: lesson, error } = await useFetch(`/api/lessons/${id}`);

const statusIcons: Record<string, string> = {
  new: '🆕', learning: '📖', learned: '✅', mastered: '🏆',
};

function parseTags(tagsJson: string): string[] {
  try { return JSON.parse(tagsJson || '[]'); }
  catch { return []; }
}

function parseQuestions(questionsJson: string): Array<{ q: string; a: string }> {
  try { return JSON.parse(questionsJson || '[]'); }
  catch { return []; }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

function daysUntilReview(nextReview: string | null): string {
  if (!nextReview) return 'Due now';
  const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 86400000);
  if (days <= 0) return 'Due now ⚠️';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}
</script>

<template>
  <div>
    <NuxtLink to="/lessons" class="back-link">← Back to Lessons</NuxtLink>

    <div v-if="error" class="empty-state">
      <div class="empty-icon">❌</div>
      <p>Lesson not found.</p>
    </div>

    <div v-else-if="lesson">
      <!-- Header -->
      <div class="page-header" style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;">
        <div>
          <h1 style="font-size:1.5rem;">{{ lesson.title }}</h1>
          <p class="subtitle" style="display:flex;align-items:center;gap:12px;margin-top:10px;flex-wrap:wrap;">
            <span class="status-badge" :class="lesson.status">
              {{ statusIcons[lesson.status] }} {{ lesson.status }}
            </span>
            <span style="color: var(--text-muted); font-size: 0.8rem;">
              #{{ lesson.id }} · {{ lesson.language || 'N/A' }} · {{ formatDate(lesson.created_at) }}
            </span>
          </p>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Next Review</span>
          <span style="font-size:0.95rem;font-weight:600;color:var(--accent-primary);">
            {{ daysUntilReview(lesson.next_review_at) }}
          </span>
          <span style="font-size:0.72rem;color:var(--text-muted);">
            Reviews: {{ lesson.review_count }} · Interval: {{ lesson.interval_days }}d
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px;">
        <span v-for="tag in parseTags(lesson.tags)" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <!-- Problem -->
      <div class="detail-section">
        <h3>❗ Problem</h3>
        <div class="detail-card">
          <p>{{ lesson.problem }}</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="lesson.error_message" class="detail-section">
        <h3>💢 Error Message</h3>
        <div class="code-block bad">{{ lesson.error_message }}</div>
      </div>

      <!-- Root Cause -->
      <div class="detail-section">
        <h3>🔍 Root Cause</h3>
        <div class="detail-card">
          <p>{{ lesson.root_cause }}</p>
        </div>
      </div>

      <!-- Code Comparison -->
      <div v-if="lesson.bad_code && lesson.good_code" class="detail-section">
        <h3>💻 Code Comparison</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div>
            <div class="code-label bad">✗ Bad Code</div>
            <div class="code-block bad">{{ lesson.bad_code }}</div>
          </div>
          <div>
            <div class="code-label good">✓ Good Code</div>
            <div class="code-block good">{{ lesson.good_code }}</div>
          </div>
        </div>
      </div>

      <!-- Lesson / Takeaway -->
      <div class="detail-section">
        <h3>💡 Key Lesson</h3>
        <div class="detail-card" style="border-left: 3px solid var(--accent-primary);">
          <p style="font-weight:500;">{{ lesson.lesson }}</p>
        </div>
      </div>

      <!-- Review Questions -->
      <div v-if="parseQuestions(lesson.review_questions).length" class="detail-section">
        <h3>❓ Review Questions</h3>
        <div
          v-for="(qa, i) in parseQuestions(lesson.review_questions)"
          :key="i"
          class="review-qa"
        >
          <div class="question">Q{{ i + 1 }}: {{ qa.q }}</div>
          <div class="answer">{{ qa.a }}</div>
        </div>
      </div>

      <!-- Git Diff -->
      <div v-if="lesson.git_diff" class="detail-section">
        <h3>📝 Git Diff</h3>
        <div class="code-block">{{ lesson.git_diff }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
</style>
