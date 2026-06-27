<script setup lang="ts">
const search = ref('');
const statusFilter = ref('');
const languageFilter = ref('');

const queryParams = computed(() => ({
  ...(search.value && { search: search.value }),
  ...(statusFilter.value && { status: statusFilter.value }),
  ...(languageFilter.value && { language: languageFilter.value }),
  limit: 50,
}));

const { data: lessons, refresh } = await useFetch('/api/lessons', {
  query: queryParams,
  watch: [queryParams],
});

const { data: stats } = await useFetch('/api/stats');

const statusIcons: Record<string, string> = {
  new: '🆕', learning: '📖', learned: '✅', mastered: '🏆',
};

function parseTags(tagsJson: string): string[] {
  try { return JSON.parse(tagsJson || '[]'); }
  catch { return []; }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

function daysUntilReview(nextReview: string | null): string {
  if (!nextReview) return 'Due';
  const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 86400000);
  if (days <= 0) return '⚠️ Due';
  return `${days}d`;
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>📚 All Lessons</h1>
      <p class="subtitle">{{ lessons?.length || 0 }} lessons captured from your coding sessions</p>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <input
        v-model="search"
        type="text"
        class="filter-input"
        placeholder="🔍 Search lessons..."
      />
      <select v-model="statusFilter" class="filter-select">
        <option value="">All Status</option>
        <option value="new">🆕 New</option>
        <option value="learning">📖 Learning</option>
        <option value="learned">✅ Learned</option>
        <option value="mastered">🏆 Mastered</option>
      </select>
      <select v-model="languageFilter" class="filter-select">
        <option value="">All Languages</option>
        <option v-for="lang in (stats?.languages || [])" :key="lang.language" :value="lang.language">
          {{ lang.language }} ({{ lang.c }})
        </option>
      </select>
    </div>

    <!-- Lessons List -->
    <div v-if="lessons?.length" class="lessons-grid">
      <NuxtLink
        v-for="lesson in lessons"
        :key="lesson.id"
        :to="`/lessons/${lesson.id}`"
        class="lesson-card animate-in"
      >
        <div class="card-header">
          <span class="card-title">{{ lesson.title }}</span>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="status-badge" :class="lesson.status">
              {{ statusIcons[lesson.status] }} {{ lesson.status }}
            </span>
            <span class="card-id">#{{ lesson.id }}</span>
          </div>
        </div>
        <div class="card-body">{{ lesson.problem?.substring(0, 200) }}{{ lesson.problem?.length > 200 ? '...' : '' }}</div>
        <div class="card-footer">
          <div class="card-tags">
            <span v-for="tag in parseTags(lesson.tags).slice(0, 5)" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="card-meta">
            <span>{{ lesson.language || 'N/A' }}</span>
            <span>Reviews: {{ lesson.review_count }}</span>
            <span>{{ formatDate(lesson.created_at) }}</span>
            <span>{{ daysUntilReview(lesson.next_review_at) }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty -->
    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <p v-if="search || statusFilter || languageFilter">No lessons match your filters. Try adjusting.</p>
      <p v-else>No lessons yet. Start coding with Athar MCP!</p>
    </div>
  </div>
</template>
