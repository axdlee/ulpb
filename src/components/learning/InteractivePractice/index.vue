<template>
  <div class="interactive-practice">
    <div class="practice-content">
      <h3 class="practice-title">互动练习</h3>
      <p class="practice-description">通过互动练习巩固键位记忆</p>
      
      <!-- 这里将实现具体的互动练习逻辑 -->
      <div class="practice-placeholder">
        <p>互动练习组件正在开发中...</p>
        <Button @click="$emit('practice-complete')">完成练习</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/base/Button/index.vue'

defineProps({
  lesson: {
    type: Object,
    required: true
  },
  scheme: {
    type: Object,
    required: true
  }
})

defineEmits(['practice-complete'])
</script>

<style scoped>
.interactive-practice {
  @apply p-6 bg-white rounded-lg;
}

.practice-title {
  @apply text-xl font-semibold mb-2;
}

.practice-description {
  @apply text-gray-600 mb-4;
}

.practice-placeholder {
  @apply text-center py-8;
}
</style>