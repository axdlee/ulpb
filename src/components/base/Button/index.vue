<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="disabled || loading"
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--loading': loading,
        'btn--disabled': disabled,
        'btn--block': block,
        'btn--icon-only': iconOnly
      }
    ]"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="btn-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- 按钮内容 -->
    <div class="btn-content" :class="{ 'opacity-0': loading }">
      <slot name="icon-left" />
      <span v-if="!iconOnly" class="btn-text">
        <slot>{{ text }}</slot>
      </span>
      <slot name="icon-right" />
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'solid',
    validator: value => ['solid', 'outline', 'ghost', 'link'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: value => ['xs', 'sm', 'medium', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button',
    validator: value => ['button', 'submit', 'reset'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  href: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  }
})

const emit = defineEmits(['click'])

const tag = computed(() => {
  if (props.href) return 'a'
  if (props.to) return 'router-link'
  return 'button'
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn {
  @apply relative inline-flex items-center justify-center;
  @apply font-medium rounded-lg transition-all duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:cursor-not-allowed;
}

/* 尺寸变体 */
.btn--xs {
  @apply px-2 py-1 text-xs;
}

.btn--sm {
  @apply px-3 py-1.5 text-sm;
}

.btn--medium {
  @apply px-4 py-2 text-base;
}

.btn--lg {
  @apply px-6 py-3 text-lg;
}

.btn--xl {
  @apply px-8 py-4 text-xl;
}

/* 样式变体 */
.btn--solid {
  @apply bg-blue-600 text-white border border-transparent;
  @apply hover:bg-blue-700 focus:ring-blue-500;
  @apply disabled:bg-gray-300 disabled:text-gray-500;
}

.btn--outline {
  @apply bg-transparent text-blue-600 border border-blue-600;
  @apply hover:bg-blue-50 focus:ring-blue-500;
  @apply disabled:border-gray-300 disabled:text-gray-300;
}

.btn--ghost {
  @apply bg-transparent text-blue-600 border border-transparent;
  @apply hover:bg-blue-50 focus:ring-blue-500;
  @apply disabled:text-gray-300;
}

.btn--link {
  @apply bg-transparent text-blue-600 border border-transparent;
  @apply hover:text-blue-700 hover:underline focus:ring-blue-500;
  @apply disabled:text-gray-300;
}

/* 状态修饰符 */
.btn--loading {
  @apply cursor-wait;
}

.btn--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn--block {
  @apply w-full;
}

.btn--icon-only {
  @apply p-2;
}

.btn--icon-only.btn--xs {
  @apply p-1;
}

.btn--icon-only.btn--sm {
  @apply p-1.5;
}

.btn--icon-only.btn--lg {
  @apply p-3;
}

.btn--icon-only.btn--xl {
  @apply p-4;
}

/* 内容布局 */
.btn-content {
  @apply flex items-center justify-center space-x-2;
}

.btn-text {
  @apply whitespace-nowrap;
}

/* 加载动画 */
.btn-loading {
  @apply absolute inset-0 flex items-center justify-center;
}

.loading-spinner {
  @apply w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin;
}

/* 暗色主题 */
[data-theme='dark'] .btn--solid {
  @apply bg-blue-500 hover:bg-blue-600;
}

[data-theme='dark'] .btn--outline {
  @apply text-blue-400 border-blue-400 hover:bg-blue-900;
}

[data-theme='dark'] .btn--ghost {
  @apply text-blue-400 hover:bg-blue-900;
}

[data-theme='dark'] .btn--link {
  @apply text-blue-400 hover:text-blue-300;
}
</style>