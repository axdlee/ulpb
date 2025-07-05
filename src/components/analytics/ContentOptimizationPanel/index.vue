<template>
  <ContentOptimizationPanel v-bind="$attrs" />
</template>

<script>
import ContentOptimizationPanel from './ContentOptimizationPanel.vue'
export default {
  name: 'ContentOptimizationPanelIndex',
  components: { ContentOptimizationPanel },
  inheritAttrs: false
}
</script>