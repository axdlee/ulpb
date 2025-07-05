<template>
  <div class="learning-hints">
    <h3 class="component-title">学习提示</h3>
    <p class="component-description">学习辅助提示组件</p>
  </div>
</template>

<script setup>
// 学习提示组件
</script>

<style scoped>
.learning-hints {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .learning-hints {
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