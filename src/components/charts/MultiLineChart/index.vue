<template>
  <MultiLineChart v-bind="$attrs" />
</template>

<script>
import MultiLineChart from './MultiLineChart.vue'
export default {
  name: 'MultiLineChartIndex',
  components: { MultiLineChart },
  inheritAttrs: false
}
</script>