<template>
  <RadarChart v-bind="$attrs" />
</template>

<script>
import RadarChart from './RadarChart.vue'
export default {
  name: 'RadarChartIndex',
  components: { RadarChart },
  inheritAttrs: false
}
</script>