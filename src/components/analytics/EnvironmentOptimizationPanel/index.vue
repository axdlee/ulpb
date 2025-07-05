<template>
  <EnvironmentOptimizationPanel v-bind="$attrs" />
</template>

<script>
import EnvironmentOptimizationPanel from './EnvironmentOptimizationPanel.vue'
export default {
  name: 'EnvironmentOptimizationPanelIndex',
  components: { EnvironmentOptimizationPanel },
  inheritAttrs: false
}
</script>