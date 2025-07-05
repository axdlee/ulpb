<template>
  <div class="learning-settings">
    <h3 class="component-title">学习设置</h3>
    <p class="component-description">学习参数配置组件</p>
  </div>
</template>

<script setup>
// 学习设置组件
</script>

<style scoped>
.learning-settings {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .learning-settings {
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