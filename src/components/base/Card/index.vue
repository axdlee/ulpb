<template>
  <div 
    class="card"
    :class="[
      `card--${variant}`,
      `card--${size}`,
      {
        'card--hoverable': hoverable,
        'card--loading': loading
      }
    ]"
  >
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 class="card-title">{{ title }}</h3>
      </slot>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <div v-if="loading" class="card-loading">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ loadingText || '加载中...' }}</p>
      </div>
      <slot v-else></slot>
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'bordered', 'shadow', 'elevated'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.card {
  @apply bg-white rounded-lg overflow-hidden transition-all duration-200;
}

.card--default {
  @apply border border-gray-200;
}

.card--bordered {
  @apply border-2 border-gray-300;
}

.card--shadow {
  @apply shadow-md;
}

.card--elevated {
  @apply shadow-lg;
}

.card--small {
  @apply text-sm;
}

.card--medium {
  @apply text-base;
}

.card--large {
  @apply text-lg;
}

.card--hoverable {
  @apply cursor-pointer hover:shadow-lg hover:-translate-y-1;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200 bg-gray-50;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 m-0;
}

.card-body {
  @apply px-6 py-4 relative;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
}

.card-loading {
  @apply flex flex-col items-center justify-center py-8;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4;
}

.loading-text {
  @apply text-gray-600 text-sm;
}

/* 暗色主题 */
[data-theme='dark'] .card {
  @apply bg-gray-800 border-gray-700;
}

[data-theme='dark'] .card-header {
  @apply bg-gray-700 border-gray-600;
}

[data-theme='dark'] .card-title {
  @apply text-gray-100;
}

[data-theme='dark'] .card-footer {
  @apply bg-gray-700 border-gray-600;
}

[data-theme='dark'] .loading-text {
  @apply text-gray-300;
}
</style>