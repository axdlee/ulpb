<template>
  <GoalCreationModal v-bind="$attrs" />
</template>

<script>
import GoalCreationModal from './GoalCreationModal.vue'
export default {
  name: 'GoalCreationModalIndex',
  components: { GoalCreationModal },
  inheritAttrs: false
}
</script>