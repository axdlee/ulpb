<template>
  <Modal v-bind="$attrs" />
</template>

<script>
import Modal from './Modal.vue'

export default {
  name: 'ModalIndex',
  components: {
    Modal
  },
  inheritAttrs: false
}
</script>