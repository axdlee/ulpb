<template>
  <div class="learning-stats">
    <Card>
      <template #header>
        <div class="stats-header">
          <h3 class="stats-title">学习统计</h3>
          <Button variant="ghost" size="sm" @click="$emit('close')">✕</Button>
        </div>
      </template>
      
      <div class="stats-content">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ lessonStats?.progress || 0 }}%</div>
            <div class="stat-label">课程进度</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ lessonStats?.timeSpent || 0 }}分钟</div>
            <div class="stat-label">学习时长</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ overallProgress?.completedLessons || 0 }}</div>
            <div class="stat-label">完成课程</div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/base/Card/index.vue'
import Button from '@/components/base/Button/index.vue'

defineProps({
  lessonStats: {
    type: Object,
    default: null
  },
  overallProgress: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])
</script>

<style scoped>
.learning-stats {
  @apply fixed top-20 left-4 w-80 z-50;
}

.stats-header {
  @apply flex items-center justify-between;
}

.stats-title {
  @apply text-lg font-semibold;
}

.stats-content {
  @apply space-y-4;
}

.stats-grid {
  @apply grid grid-cols-1 gap-4;
}

.stat-item {
  @apply text-center p-4 bg-gray-50 rounded-lg;
}

.stat-value {
  @apply text-2xl font-bold text-blue-600;
}

.stat-label {
  @apply text-sm text-gray-600 mt-1;
}

[data-theme='dark'] .stat-item {
  @apply bg-gray-700;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-300;
}
</style>