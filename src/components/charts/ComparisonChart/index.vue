<template>
  <ComparisonChart v-bind="$attrs" />
</template>

<script>
import ComparisonChart from './ComparisonChart.vue'
export default {
  name: 'ComparisonChartIndex',
  components: { ComparisonChart },
  inheritAttrs: false
}
</script>