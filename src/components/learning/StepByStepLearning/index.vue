<template>
  <div class="step-by-step-learning">
    <div class="step-content">
      <h3 class="step-title">分步学习 - 第{{ currentStep + 1 }}步</h3>
      <p class="step-description">{{ getCurrentStepDescription() }}</p>
      
      <!-- 这里将实现具体的分步学习逻辑 -->
      <div class="step-placeholder">
        <p>分步学习组件正在开发中...</p>
        <Button @click="$emit('step-complete')">完成当前步骤</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/base/Button/index.vue'

const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  lesson: {
    type: Object,
    required: true
  },
  scheme: {
    type: Object,
    required: true
  }
})

defineEmits(['step-complete', 'next-step', 'prev-step'])

const getCurrentStepDescription = () => {
  const descriptions = [
    '观察键位布局',
    '理解拼音映射',
    '练习手指位置',
    '巩固记忆',
    '完成学习'
  ]
  return descriptions[props.currentStep] || '学习步骤'
}
</script>

<style scoped>
.step-by-step-learning {
  @apply p-6 bg-white rounded-lg;
}

.step-title {
  @apply text-xl font-semibold mb-2;
}

.step-description {
  @apply text-gray-600 mb-4;
}

.step-placeholder {
  @apply text-center py-8;
}
</style>