<template>
  <Button v-bind="$attrs" />
</template>

<script>
import Button from './Button.vue'

export default {
  name: 'ButtonIndex',
  components: {
    Button
  },
  inheritAttrs: false
}
</script>