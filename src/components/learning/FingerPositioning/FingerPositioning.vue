<template>
  <div class="finger-positioning">
    <h3 class="component-title">指法定位</h3>
    <p class="component-description">指法指导组件</p>
  </div>
</template>

<script setup>
// 指法定位组件
</script>

<style scoped>
.finger-positioning {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .finger-positioning {
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