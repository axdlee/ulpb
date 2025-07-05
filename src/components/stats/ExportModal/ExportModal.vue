<template>
  <div class="export-modal">
    <div class="modal-placeholder">
      <p>📤 导出模态框</p>
      <p>数据导出功能组件</p>
    </div>
  </div>
</template>

<script setup>
// 导出模态框组件
</script>

<style scoped>
.export-modal {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .export-modal {
  @apply bg-gray-800 border-gray-700;
}
.modal-placeholder {
  @apply text-center text-gray-600 py-8;
}
.app--dark .modal-placeholder {
  @apply text-gray-400;
}
</style>