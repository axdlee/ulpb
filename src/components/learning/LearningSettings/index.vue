<template>
  <LearningSettings v-bind="$attrs" />
</template>

<script>
import LearningSettings from './LearningSettings.vue'
export default {
  name: 'LearningSettingsIndex',
  components: { LearningSettings },
  inheritAttrs: false
}
</script>