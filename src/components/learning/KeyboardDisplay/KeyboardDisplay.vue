<template>
  <div class="keyboard-display">
    <div class="keyboard-container">
      <h3 class="keyboard-title">双拼键盘布局</h3>
      <div class="keyboard-layout">
        <!-- 这里可以显示键盘布局 -->
        <div class="keyboard-placeholder">
          <p>键盘显示组件</p>
          <p>用于显示双拼键位布局</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 键盘显示组件 - 用于显示双拼键位布局
</script>

<style scoped>
.keyboard-display {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.app--dark .keyboard-display {
  @apply bg-gray-800 border-gray-700;
}

.keyboard-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.app--dark .keyboard-title {
  @apply text-gray-100;
}

.keyboard-placeholder {
  @apply text-center py-8 text-gray-600;
}

.app--dark .keyboard-placeholder {
  @apply text-gray-400;
}
</style>