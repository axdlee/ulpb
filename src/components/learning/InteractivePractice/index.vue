<template>
  <InteractivePractice v-bind="$attrs" />
</template>

<script>
import InteractivePractice from './InteractivePractice.vue'
export default {
  name: 'InteractivePracticeIndex',
  components: { InteractivePractice },
  inheritAttrs: false
}
</script>