<template>
  <FingerPositioning v-bind="$attrs" />
</template>

<script>
import FingerPositioning from './FingerPositioning.vue'
export default {
  name: 'FingerPositioningIndex',
  components: { FingerPositioning },
  inheritAttrs: false
}
</script>