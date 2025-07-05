<template>
  <AdvancedTable v-bind="$attrs" />
</template>

<script>
import AdvancedTable from './AdvancedTable.vue'
export default {
  name: 'AdvancedTableIndex',
  components: { AdvancedTable },
  inheritAttrs: false
}
</script>