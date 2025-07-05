<template>
  <div class="comparison-chart">
    <div class="chart-placeholder">
      <p>📊 对比图表</p>
      <p>数据对比可视化组件</p>
    </div>
  </div>
</template>

<script setup>
// 对比图表组件
</script>

<style scoped>
.comparison-chart {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[300px] flex items-center justify-center;
}
.app--dark .comparison-chart {
  @apply bg-gray-800 border-gray-700;
}
.chart-placeholder {
  @apply text-center text-gray-600;
}
.app--dark .chart-placeholder {
  @apply text-gray-400;
}
</style>