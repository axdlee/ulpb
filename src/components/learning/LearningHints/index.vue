<template>
  <div class="learning-hints">
    <Card>
      <template #header>
        <h3 class="hints-title">学习提示</h3>
      </template>
      
      <div class="hints-content">
        <div class="hint-item" v-for="hint in currentHints" :key="hint.id">
          <div class="hint-icon">{{ hint.icon }}</div>
          <div class="hint-text">{{ hint.text }}</div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/base/Card/index.vue'

const props = defineProps({
  currentLesson: {
    type: Object,
    default: null
  },
  currentStep: {
    type: Number,
    default: 0
  },
  learningMode: {
    type: String,
    default: ''
  },
  highlightedKeys: {
    type: Array,
    default: () => []
  }
})

const currentHints = computed(() => {
  // 根据当前学习状态生成提示
  const hints = []
  
  if (props.learningMode === 'overview') {
    hints.push({
      id: 1,
      icon: '👀',
      text: '仔细观察键盘布局，了解每个键位的拼音映射'
    })
  }
  
  if (props.highlightedKeys.length > 0) {
    hints.push({
      id: 2,
      icon: '✨',
      text: `当前高亮键位: ${props.highlightedKeys.join(', ')}`
    })
  }
  
  hints.push({
    id: 3,
    icon: '💡',
    text: '建议每天练习15-20分钟，保持学习连续性'
  })
  
  return hints
})
</script>

<style scoped>
.learning-hints {
  @apply fixed bottom-4 right-4 w-80 z-50;
}

.hints-title {
  @apply text-lg font-semibold;
}

.hints-content {
  @apply space-y-3;
}

.hint-item {
  @apply flex items-start space-x-3 p-3 bg-blue-50 rounded-lg;
}

.hint-icon {
  @apply text-lg flex-shrink-0;
}

.hint-text {
  @apply text-sm text-gray-700;
}

[data-theme='dark'] .hint-item {
  @apply bg-blue-900 text-gray-200;
}
</style>