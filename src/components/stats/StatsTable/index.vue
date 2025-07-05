<template>
  <StatsTable v-bind="$attrs" />
</template>

<script>
import StatsTable from './StatsTable.vue'
export default {
  name: 'StatsTableIndex',
  components: { StatsTable },
  inheritAttrs: false
}
</script>