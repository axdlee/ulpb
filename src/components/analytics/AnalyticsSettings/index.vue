<template>
  <AnalyticsSettings v-bind="$attrs" />
</template>

<script>
import AnalyticsSettings from './AnalyticsSettings.vue'
export default {
  name: 'AnalyticsSettingsIndex',
  components: { AnalyticsSettings },
  inheritAttrs: false
}
</script>