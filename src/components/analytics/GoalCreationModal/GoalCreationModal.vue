<template>
  <div class="goal-creation-modal">
    <div class="modal-header">
      <h3 class="modal-title">目标创建</h3>
    </div>
    <div class="modal-content">
      <p class="modal-placeholder">🎯 目标创建模态框组件</p>
    </div>
  </div>
</template>

<script setup>
// 目标创建模态框组件
</script>

<style scoped>
.goal-creation-modal {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .goal-creation-modal {
  @apply bg-gray-800 border-gray-700;
}
.modal-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}
.app--dark .modal-title {
  @apply text-gray-100;
}
.modal-placeholder {
  @apply text-center text-gray-600 py-8;
}
.app--dark .modal-placeholder {
  @apply text-gray-400;
}
</style>