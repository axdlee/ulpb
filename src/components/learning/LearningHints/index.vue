<template>
  <LearningHints v-bind="$attrs" />
</template>

<script>
import LearningHints from './LearningHints.vue'
export default {
  name: 'LearningHintsIndex',
  components: { LearningHints },
  inheritAttrs: false
}
</script>