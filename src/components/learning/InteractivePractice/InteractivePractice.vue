<template>
  <div class="interactive-practice">
    <h3 class="component-title">互动练习</h3>
    <p class="component-description">交互式练习组件</p>
  </div>
</template>

<script setup>
// 互动练习组件
</script>

<style scoped>
.interactive-practice {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .interactive-practice {
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