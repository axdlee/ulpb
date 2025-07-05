<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
    v-bind="$attrs"
  >
    <LoadingSpinner 
      v-if="loading" 
      :size="iconSize"
      class="animate-spin"
    />
    <component
      v-else-if="icon && iconPosition === 'left'"
      :is="icon"
      :class="iconClasses"
    />
    
    <span v-if="$slots.default" :class="textClasses">
      <slot />
    </span>
    
    <component
      v-if="icon && iconPosition === 'right' && !loading"
      :is="icon"
      :class="iconClasses"
    />
    
    <!-- 波纹效果 -->
    <span 
      v-if="ripple"
      ref="rippleEl"
      class="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
    />
  </component>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.vue'

const props = defineProps({
  // 基础属性
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'warning', 'danger', 
      'ghost', 'outline', 'link'
    ].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // 状态
  disabled: Boolean,
  loading: Boolean,
  active: Boolean,
  
  // 类型
  type: {
    type: String,
    default: 'button'
  },
  tag: {
    type: String,
    default: 'button'
  },
  href: String,
  
  // 图标
  icon: [String, Object],
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value)
  },
  
  // 样式选项
  block: Boolean,
  rounded: Boolean,
  square: Boolean,
  ripple: {
    type: Boolean,
    default: true
  },
  
  // 功能选项
  preventDefault: Boolean
})

const emit = defineEmits(['click'])

const rippleEl = ref(null)

// 计算样式类
const buttonClasses = computed(() => {
  const classes = ['btn', 'relative', 'font-medium', 'transition-all', 'duration-200']
  
  // 变体样式
  classes.push(`btn-${props.variant}`)
  
  // 尺寸样式
  classes.push(`btn-${props.size}`)
  
  // 状态样式
  if (props.disabled || props.loading) {
    classes.push('btn-disabled')
  }
  if (props.active) {
    classes.push('btn-active')
  }
  
  // 布局样式
  if (props.block) {
    classes.push('w-full')
  }
  if (props.square) {
    classes.push('aspect-square')
  }
  if (props.rounded) {
    classes.push('rounded-full')
  }
  
  return classes
})

const textClasses = computed(() => {
  if (props.loading) {
    return 'opacity-0'
  }
  return ''
})

const iconClasses = computed(() => {
  const classes = ['flex-shrink-0']
  
  // 根据尺寸调整图标大小
  switch (props.size) {
    case 'xs':
      classes.push('w-3 h-3')
      break
    case 'sm':
      classes.push('w-4 h-4')
      break
    case 'md':
      classes.push('w-5 h-5')
      break
    case 'lg':
      classes.push('w-6 h-6')
      break
    case 'xl':
      classes.push('w-7 h-7')
      break
  }
  
  return classes
})

const iconSize = computed(() => {
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  }
  return sizeMap[props.size] || 20
})

// 点击处理
const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  if (props.preventDefault) {
    event.preventDefault()
  }
  
  // 创建波纹效果
  if (props.ripple && rippleEl.value) {
    createRipple(event)
  }
  
  emit('click', event)
}

// 创建波纹效果
const createRipple = (event) => {
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  const ripple = document.createElement('span')
  ripple.className = 'absolute rounded-full bg-current opacity-25 pointer-events-none animate-ping'
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.style.transform = 'scale(0)'
  ripple.style.animation = 'ripple 0.6s linear'
  
  rippleEl.value.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 600)
}

// 定义按钮动画
const style = document.createElement('style')
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)
</script>

<style scoped>
/* 基础按钮样式 */
.btn {
  @apply inline-flex items-center justify-center border font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200;
}

/* 尺寸变体 */
.btn-xs {
  @apply px-2.5 py-1.5 text-xs rounded;
}

.btn-sm {
  @apply px-3 py-2 text-sm rounded-md;
}

.btn-md {
  @apply px-4 py-2 text-sm rounded-md;
}

.btn-lg {
  @apply px-6 py-3 text-base rounded-md;
}

.btn-xl {
  @apply px-8 py-4 text-lg rounded-lg;
}

/* 主要变体 */
.btn-primary {
  @apply bg-blue-600 border-blue-600 text-white shadow-sm;
}

.btn-primary:hover:not(.btn-disabled) {
  @apply bg-blue-700 border-blue-700;
}

.btn-primary:focus {
  @apply ring-blue-500;
}

.btn-primary:active:not(.btn-disabled) {
  @apply bg-blue-800 border-blue-800;
}

/* 次要变体 */
.btn-secondary {
  @apply bg-gray-600 border-gray-600 text-white shadow-sm;
}

.btn-secondary:hover:not(.btn-disabled) {
  @apply bg-gray-700 border-gray-700;
}

.btn-secondary:focus {
  @apply ring-gray-500;
}

/* 成功变体 */
.btn-success {
  @apply bg-green-600 border-green-600 text-white shadow-sm;
}

.btn-success:hover:not(.btn-disabled) {
  @apply bg-green-700 border-green-700;
}

.btn-success:focus {
  @apply ring-green-500;
}

/* 警告变体 */
.btn-warning {
  @apply bg-yellow-500 border-yellow-500 text-white shadow-sm;
}

.btn-warning:hover:not(.btn-disabled) {
  @apply bg-yellow-600 border-yellow-600;
}

.btn-warning:focus {
  @apply ring-yellow-500;
}

/* 危险变体 */
.btn-danger {
  @apply bg-red-600 border-red-600 text-white shadow-sm;
}

.btn-danger:hover:not(.btn-disabled) {
  @apply bg-red-700 border-red-700;
}

.btn-danger:focus {
  @apply ring-red-500;
}

/* 幽灵变体 */
.btn-ghost {
  @apply bg-transparent border-transparent text-gray-700;
}

.btn-ghost:hover:not(.btn-disabled) {
  @apply bg-gray-100 text-gray-900;
}

.btn-ghost:focus {
  @apply ring-gray-500;
}

/* 轮廓变体 */
.btn-outline {
  @apply bg-transparent border-gray-300 text-gray-700;
}

.btn-outline:hover:not(.btn-disabled) {
  @apply bg-gray-50 border-gray-400 text-gray-900;
}

.btn-outline:focus {
  @apply ring-gray-500;
}

/* 链接变体 */
.btn-link {
  @apply bg-transparent border-transparent text-blue-600 p-0 shadow-none;
}

.btn-link:hover:not(.btn-disabled) {
  @apply text-blue-700 underline;
}

.btn-link:focus {
  @apply ring-blue-500;
}

/* 禁用状态 */
.btn-disabled {
  @apply opacity-50 cursor-not-allowed;
}

.btn-disabled:hover {
  @apply transform-none;
}

/* 激活状态 */
.btn-active {
  @apply transform scale-95;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .btn-ghost {
    @apply text-gray-300;
  }
  
  .btn-ghost:hover:not(.btn-disabled) {
    @apply bg-gray-800 text-white;
  }
  
  .btn-outline {
    @apply border-gray-600 text-gray-300;
  }
  
  .btn-outline:hover:not(.btn-disabled) {
    @apply bg-gray-800 border-gray-500 text-white;
  }
}
</style>