<template>
  <ScatterChart v-bind="$attrs" />
</template>

<script>
import ScatterChart from './ScatterChart.vue'
export default {
  name: 'ScatterChartIndex',
  components: { ScatterChart },
  inheritAttrs: false
}
</script>