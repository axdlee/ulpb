<template>
  <LoadingSpinner v-bind="$attrs" />
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'LoadingSpinnerIndex',
  components: {
    LoadingSpinner
  },
  inheritAttrs: false
}
</script>