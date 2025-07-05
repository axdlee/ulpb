<template>
  <ExportModal v-bind="$attrs" />
</template>

<script>
import ExportModal from './ExportModal.vue'
export default {
  name: 'ExportModalIndex',
  components: { ExportModal },
  inheritAttrs: false
}
</script>