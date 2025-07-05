<template>
  <KeyboardDisplay v-bind="$attrs" />
</template>

<script>
import KeyboardDisplay from './KeyboardDisplay.vue'

export default {
  name: 'KeyboardDisplayIndex',
  components: {
    KeyboardDisplay
  },
  inheritAttrs: false
}
</script>