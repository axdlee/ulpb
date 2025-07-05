<template>
  <Pagination v-bind="$attrs" />
</template>

<script>
import Pagination from './Pagination.vue'
export default {
  name: 'PaginationIndex',
  components: { Pagination },
  inheritAttrs: false
}
</script>