<template>
  <HeatmapChart v-bind="$attrs" />
</template>

<script>
import HeatmapChart from './HeatmapChart.vue'
export default {
  name: 'HeatmapChartIndex',
  components: { HeatmapChart },
  inheritAttrs: false
}
</script>