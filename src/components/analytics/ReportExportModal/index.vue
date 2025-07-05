<template>
  <ReportExportModal v-bind="$attrs" />
</template>

<script>
import ReportExportModal from './ReportExportModal.vue'
export default {
  name: 'ReportExportModalIndex',
  components: { ReportExportModal },
  inheritAttrs: false
}
</script>