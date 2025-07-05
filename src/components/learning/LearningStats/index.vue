<template>
  <LearningStats v-bind="$attrs" />
</template>

<script>
import LearningStats from './LearningStats.vue'
export default {
  name: 'LearningStatsIndex',
  components: { LearningStats },
  inheritAttrs: false
}
</script>