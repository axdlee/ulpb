<template>
  <Card v-bind="$attrs" />
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'CardIndex',
  components: {
    Card
  },
  inheritAttrs: false
}
</script>