<template>
  <BarChart v-bind="$attrs" />
</template>

<script>
import BarChart from './BarChart.vue'
export default {
  name: 'BarChartIndex',
  components: { BarChart },
  inheritAttrs: false
}
</script>