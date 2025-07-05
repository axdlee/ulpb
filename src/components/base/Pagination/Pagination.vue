<template>
  <div class="pagination">
    <div class="pagination-placeholder">
      <p>📄 分页组件</p>
      <p>页面导航组件</p>
    </div>
  </div>
</template>

<script setup>
// 分页组件
</script>

<style scoped>
.pagination {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
}
.app--dark .pagination {
  @apply bg-gray-800 border-gray-700;
}
.pagination-placeholder {
  @apply text-center text-gray-600;
}
.app--dark .pagination-placeholder {
  @apply text-gray-400;
}
</style>