<template>
  <div class="finger-positioning">
    <div class="positioning-content">
      <h3 class="positioning-title">指法训练</h3>
      <p class="positioning-description">学习正确的手指位置和打字姿势</p>
      
      <!-- 这里将实现具体的指法训练逻辑 -->
      <div class="positioning-placeholder">
        <p>指法训练组件正在开发中...</p>
        <Button @click="$emit('positioning-complete')">完成训练</Button>
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

defineEmits(['positioning-complete'])
</script>

<style scoped>
.finger-positioning {
  @apply p-6 bg-white rounded-lg;
}

.positioning-title {
  @apply text-xl font-semibold mb-2;
}

.positioning-description {
  @apply text-gray-600 mb-4;
}

.positioning-placeholder {
  @apply text-center py-8;
}
</style>