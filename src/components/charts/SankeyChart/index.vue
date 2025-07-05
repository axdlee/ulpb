<template>
  <SankeyChart v-bind="$attrs" />
</template>

<script>
import SankeyChart from './SankeyChart.vue'
export default {
  name: 'SankeyChartIndex',
  components: { SankeyChart },
  inheritAttrs: false
}
</script>