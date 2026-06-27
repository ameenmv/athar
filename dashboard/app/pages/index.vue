<script setup lang="ts">
const { data: stats } = await useFetch('/api/stats');
const { data: lessons } = await useFetch('/api/lessons', { query: { limit: 5 } });

const statusIcons: Record<string, string> = {
  new: '🆕',
  learning: '📖',
  learned: '✅',
  mastered: '🏆',
};

function parseTags(tagsJson: string): string[] {
  try { return JSON.parse(tagsJson || '[]'); }
  catch { return []; }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function daysUntilReview(nextReview: string | null): string {
  if (!nextReview) return 'Due now';
  const days = Math.ceil((new Date(nextReview).getTime() - Date.now()) / 86400000);
  if (days <= 0) return '⚠️ Due now';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>📊 Dashboard</h1>
      <p class="subtitle">Your programming lesson memory at a glance</p>
    </div>

    <!-- Stats Grid -->
    <div v-if="stats" class="stats-grid">
      <div class="stat-card animate-in">
        <div class="stat-label">Total Lessons</div>
        <div class="stat-value accent">{{ stats.total }}</div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-label">Due Today</div>
        <div class="stat-value" :class="stats.dueToday > 0 ? 'warning' : 'success'">
          {{ stats.dueToday }}
        </div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-label">Due This Week</div>
        <div class="stat-value" :class="stats.dueThisWeek > 0 ? 'warning' : 'success'">
          {{ stats.dueThisWeek }}
        </div>
      </div>
      <div class="stat-card animate-in">
        <div class="stat-label">Mastered</div>
        <div class="stat-value success">{{ stats.byStatus?.mastered || 0 }}</div>
      </div>
    </div>

    <!-- Status Breakdown -->
    <div v-if="stats && stats.total > 0" class="detail-section">
      <h3>📈 Status Breakdown</h3>
      <div class="stats-grid" style="margin-bottom: 0;">
        <div v-for="s in ['new', 'learning', 'learned', 'mastered']" :key="s" class="stat-card animate-in">
          <div class="stat-label" style="display:flex;align-items:center;gap:6px;">
            <span>{{ statusIcons[s] }}</span>
            <span>{{ s }}</span>
          </div>
          <div class="stat-value">{{ stats.byStatus?.[s] || 0 }}</div>
        </div>
      </div>
    </div>

    <!-- Top Tags -->
    <div v-if="stats && stats.topTags?.length" class="detail-section" style="margin-top: 32px;">
      <h3>🏷️ Top Tags</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <span v-for="t in stats.topTags" :key="t.tag" class="tag" style="font-size: 0.82rem; padding: 6px 14px;">
          {{ t.tag }} <span style="opacity:0.5; margin-left: 4px;">({{ t.count }})</span>
        </span>
      </div>
    </div>

    <!-- Recent Lessons -->
    <div v-if="lessons?.length" class="detail-section" style="margin-top: 32px;">
      <h3 style="display:flex;justify-content:space-between;align-items:center;">
        <span>📚 Recent Lessons</span>
        <NuxtLink to="/lessons" style="font-size: 0.8rem; text-transform: none; letter-spacing: 0;">
          View All →
        </NuxtLink>
      </h3>
      <div class="lessons-grid">
        <NuxtLink
          v-for="lesson in lessons"
          :key="lesson.id"
          :to="`/lessons/${lesson.id}`"
          class="lesson-card animate-in"
        >
          <div class="card-header">
            <span class="card-title">{{ lesson.title }}</span>
            <span class="status-badge" :class="lesson.status">
              {{ statusIcons[lesson.status] }} {{ lesson.status }}
            </span>
          </div>
          <div class="card-body">{{ lesson.problem?.substring(0, 150) }}{{ lesson.problem?.length > 150 ? '...' : '' }}</div>
          <div class="card-footer">
            <div class="card-tags">
              <span v-for="tag in parseTags(lesson.tags)" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="card-meta">
              <span>{{ lesson.language || 'N/A' }}</span>
              <span>{{ formatDate(lesson.created_at) }}</span>
              <span>Next: {{ daysUntilReview(lesson.next_review_at) }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="stats && stats.total === 0" class="empty-state">
      <div class="empty-icon">🔮</div>
      <p>No lessons yet.<br>Start coding with Athar MCP in your IDE and lessons will appear here!</p>
    </div>
  </div>
</template>
