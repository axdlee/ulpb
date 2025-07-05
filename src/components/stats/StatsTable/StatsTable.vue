<template>
  <div class="stats-table">
    <div class="table-placeholder">
      <p>📋 统计表格</p>
      <p>数据表格组件</p>
    </div>
  </div>
</template>

<script setup>
// 统计表格组件
</script>

<style scoped>
.stats-table {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}
.app--dark .stats-table {
  @apply bg-gray-800 border-gray-700;
}
.table-placeholder {
  @apply text-center text-gray-600 py-8;
}
.app--dark .table-placeholder {
  @apply text-gray-400;
}
</style>