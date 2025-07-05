<template>
  <Input v-bind="$attrs" />
</template>

<script>
import Input from './Input.vue'

export default {
  name: 'InputIndex',
  components: {
    Input
  },
  inheritAttrs: false
}
</script>