<template>
  <DoughnutChart v-bind="$attrs" />
</template>

<script>
import DoughnutChart from './DoughnutChart.vue'
export default {
  name: 'DoughnutChartIndex',
  components: { DoughnutChart },
  inheritAttrs: false
}
</script>