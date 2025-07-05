<template>
  <LineChart v-bind="$attrs" />
</template>

<script>
import LineChart from './LineChart.vue'
export default {
  name: 'LineChartIndex',
  components: { LineChart },
  inheritAttrs: false
}
</script>