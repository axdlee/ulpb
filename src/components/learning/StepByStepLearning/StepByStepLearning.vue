<template>
  <div class="step-by-step-learning">
    <h3 class="component-title">分步学习</h3>
    <p class="component-description">循序渐进的学习模式</p>
  </div>
</template>

<script setup>
// 分步学习组件
</script>

<style scoped>
.step-by-step-learning {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .step-by-step-learning {
  @apply bg-gray-800 border-gray-700;
}
.component-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}
.app--dark .component-title {
  @apply text-gray-100;
}
.component-description {
  @apply text-gray-600;
}
.app--dark .component-description {
  @apply text-gray-400;
}
</style>