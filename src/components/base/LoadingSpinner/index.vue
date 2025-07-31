<template>
  <div 
    class="loading-spinner"
    :class="[
      `spinner--${size}`,
      `spinner--${variant}`,
      { 'spinner--centered': centered }
    ]"
  >
    <div class="spinner-circle"></div>
    <div v-if="text" class="spinner-text">{{ text }}</div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary',
    validator: value => ['primary', 'secondary', 'white'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-spinner {
  @apply inline-flex flex-col items-center justify-center;
}

.spinner--centered {
  @apply w-full h-full;
}

.spinner-circle {
  @apply border-4 border-solid rounded-full animate-spin;
  border-color: transparent;
}

/* 尺寸变体 */
.spinner--small .spinner-circle {
  @apply w-4 h-4 border-2;
}

.spinner--medium .spinner-circle {
  @apply w-6 h-6 border-2;
}

.spinner--large .spinner-circle {
  @apply w-8 h-8 border-4;
}

.spinner--xl .spinner-circle {
  @apply w-12 h-12 border-4;
}

/* 颜色变体 */
.spinner--primary .spinner-circle {
  border-top-color: theme('colors.blue.600');
  border-right-color: theme('colors.blue.200');
}

.spinner--secondary .spinner-circle {
  border-top-color: theme('colors.gray.600');
  border-right-color: theme('colors.gray.200');
}

.spinner--white .spinner-circle {
  border-top-color: white;
  border-right-color: rgba(255, 255, 255, 0.3);
}

.spinner-text {
  @apply mt-2 text-sm text-gray-600 font-medium;
}

.spinner--small .spinner-text {
  @apply text-xs mt-1;
}

.spinner--large .spinner-text {
  @apply text-base mt-3;
}

.spinner--xl .spinner-text {
  @apply text-lg mt-4;
}

/* 暗色主题 */
[data-theme='dark'] .spinner--primary .spinner-circle {
  border-top-color: theme('colors.blue.400');
  border-right-color: theme('colors.blue.800');
}

[data-theme='dark'] .spinner--secondary .spinner-circle {
  border-top-color: theme('colors.gray.400');
  border-right-color: theme('colors.gray.700');
}

[data-theme='dark'] .spinner-text {
  @apply text-gray-300;
}
</style>