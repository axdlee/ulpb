<template>
  <TimelineChart v-bind="$attrs" />
</template>

<script>
import TimelineChart from './TimelineChart.vue'
export default {
  name: 'TimelineChartIndex',
  components: { TimelineChart },
  inheritAttrs: false
}
</script>