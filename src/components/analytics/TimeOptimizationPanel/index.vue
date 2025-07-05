<template>
  <TimeOptimizationPanel v-bind="$attrs" />
</template>

<script>
import TimeOptimizationPanel from './TimeOptimizationPanel.vue'
export default {
  name: 'TimeOptimizationPanelIndex',
  components: { TimeOptimizationPanel },
  inheritAttrs: false
}
</script>