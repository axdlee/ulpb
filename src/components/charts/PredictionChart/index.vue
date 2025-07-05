<template>
  <PredictionChart v-bind="$attrs" />
</template>

<script>
import PredictionChart from './PredictionChart.vue'
export default {
  name: 'PredictionChartIndex',
  components: { PredictionChart },
  inheritAttrs: false
}
</script>