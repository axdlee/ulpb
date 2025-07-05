<template>
  <StepByStepLearning v-bind="$attrs" />
</template>

<script>
import StepByStepLearning from './StepByStepLearning.vue'
export default {
  name: 'StepByStepLearningIndex',
  components: { StepByStepLearning },
  inheritAttrs: false
}
</script>