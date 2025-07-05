<template>
  <MethodOptimizationPanel v-bind="$attrs" />
</template>

<script>
import MethodOptimizationPanel from './MethodOptimizationPanel.vue'
export default {
  name: 'MethodOptimizationPanelIndex',
  components: { MethodOptimizationPanel },
  inheritAttrs: false
}
</script>