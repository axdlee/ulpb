<template>
  <div
    :class="cardClasses"
    :style="cardStyles"
    @click="handleClick"
  >
    <!-- 卡片头部 -->
    <div v-if="$slots.header || title || subtitle" :class="headerClasses">
      <slot name="header">
        <div v-if="title || subtitle" class="flex-1 min-w-0">
          <h3 v-if="title" :class="titleClasses">{{ title }}</h3>
          <p v-if="subtitle" :class="subtitleClasses">{{ subtitle }}</p>
        </div>
      </slot>
      
      <!-- 头部操作区域 -->
      <div v-if="$slots.actions" class="flex-shrink-0">
        <slot name="actions" />
      </div>
    </div>

    <!-- 卡片图片 -->
    <div v-if="$slots.image || image" class="relative overflow-hidden">
      <slot name="image">
        <img 
          v-if="image"
          :src="image"
          :alt="imageAlt"
          :class="imageClasses"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </slot>
      
      <!-- 图片覆盖层 -->
      <div v-if="$slots.overlay" class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <slot name="overlay" />
      </div>
    </div>

    <!-- 卡片内容 -->
    <div v-if="$slots.default" :class="bodyClasses">
      <slot />
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>

    <!-- 加载状态覆盖层 -->
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-inherit"
    >
      <LoadingSpinner :size="32" />
    </div>

    <!-- 选中指示器 -->
    <div 
      v-if="selected && showSelection" 
      class="absolute top-2 right-2 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- 悬浮操作菜单 -->
    <div 
      v-if="$slots.quickActions"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <slot name="quickActions" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.vue'

const props = defineProps({
  // 内容属性
  title: String,
  subtitle: String,
  image: String,
  imageAlt: String,
  
  // 样式属性
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated', 'filled'].includes(value)
  },
  
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  rounded: {
    type: [Boolean, String],
    default: true
  },
  
  shadow: {
    type: [Boolean, String],
    default: true
  },
  
  // 状态属性
  loading: Boolean,
  disabled: Boolean,
  selected: Boolean,
  hoverable: {
    type: Boolean,
    default: true
  },
  
  // 功能属性
  clickable: Boolean,
  selectable: Boolean,
  showSelection: {
    type: Boolean,
    default: true
  },
  
  // 布局属性
  horizontal: Boolean,
  fullHeight: Boolean,
  
  // 间距属性
  padding: {
    type: [Boolean, String],
    default: true
  },
  
  headerPadding: {
    type: [Boolean, String],
    default: true
  },
  
  bodyPadding: {
    type: [Boolean, String],
    default: true
  },
  
  footerPadding: {
    type: [Boolean, String],
    default: true
  }
})

const emit = defineEmits(['click', 'imageLoad', 'imageError'])

const imageLoaded = ref(false)
const imageError = ref(false)

// 计算卡片样式类
const cardClasses = computed(() => {
  const classes = ['card', 'relative', 'group', 'transition-all', 'duration-200']
  
  // 变体样式
  switch (props.variant) {
    case 'outlined':
      classes.push('border-2', 'border-gray-200', 'bg-white')
      break
    case 'elevated':
      classes.push('shadow-lg', 'hover:shadow-xl', 'bg-white')
      break
    case 'filled':
      classes.push('bg-gray-100', 'border-0')
      break
    default:
      classes.push('border', 'border-gray-200', 'bg-white')
  }
  
  // 圆角样式
  if (props.rounded === true) {
    classes.push('rounded-lg')
  } else if (typeof props.rounded === 'string') {
    classes.push(`rounded-${props.rounded}`)
  }
  
  // 阴影样式
  if (props.shadow === true) {
    classes.push('shadow-sm')
  } else if (typeof props.shadow === 'string') {
    classes.push(`shadow-${props.shadow}`)
  }
  
  // 悬浮效果
  if (props.hoverable && !props.disabled) {
    classes.push('hover:shadow-md', 'hover:-translate-y-1')
  }
  
  // 可点击状态
  if (props.clickable && !props.disabled) {
    classes.push('cursor-pointer', 'active:scale-98')
  }
  
  // 选中状态
  if (props.selected) {
    classes.push('ring-2', 'ring-primary-500', 'ring-offset-2')
  }
  
  // 禁用状态
  if (props.disabled) {
    classes.push('opacity-60', 'cursor-not-allowed')
  }
  
  // 布局
  if (props.horizontal) {
    classes.push('flex')
  }
  
  if (props.fullHeight) {
    classes.push('h-full')
  }
  
  // 尺寸
  switch (props.size) {
    case 'sm':
      classes.push('text-sm')
      break
    case 'lg':
      classes.push('text-lg')
      break
  }
  
  return classes
})

const cardStyles = computed(() => {
  const styles = {}
  
  if (props.loading) {
    styles.pointerEvents = 'none'
  }
  
  return styles
})

// 头部样式
const headerClasses = computed(() => {
  const classes = ['flex', 'items-start', 'justify-between']
  
  if (props.headerPadding === true) {
    classes.push('px-6', 'pt-6', 'pb-4')
  } else if (typeof props.headerPadding === 'string') {
    classes.push(props.headerPadding)
  }
  
  return classes
})

// 标题样式
const titleClasses = computed(() => {
  const classes = ['font-semibold', 'text-gray-900', 'truncate']
  
  switch (props.size) {
    case 'sm':
      classes.push('text-sm')
      break
    case 'lg':
      classes.push('text-xl')
      break
    default:
      classes.push('text-lg')
  }
  
  return classes
})

// 副标题样式
const subtitleClasses = computed(() => {
  const classes = ['text-gray-500', 'mt-1', 'truncate']
  
  switch (props.size) {
    case 'sm':
      classes.push('text-xs')
      break
    case 'lg':
      classes.push('text-base')
      break
    default:
      classes.push('text-sm')
  }
  
  return classes
})

// 图片样式
const imageClasses = computed(() => {
  const classes = ['w-full', 'object-cover']
  
  if (props.horizontal) {
    classes.push('h-full', 'max-w-48')
  } else {
    classes.push('h-48')
  }
  
  if (!imageLoaded.value) {
    classes.push('opacity-0')
  } else {
    classes.push('opacity-100', 'transition-opacity', 'duration-300')
  }
  
  return classes
})

// 内容区域样式
const bodyClasses = computed(() => {
  const classes = []
  
  if (props.horizontal) {
    classes.push('flex-1', 'flex', 'flex-col')
  }
  
  if (props.bodyPadding === true) {
    classes.push('px-6', 'pb-6')
  } else if (typeof props.bodyPadding === 'string') {
    classes.push(props.bodyPadding)
  }
  
  return classes
})

// 底部样式
const footerClasses = computed(() => {
  const classes = ['border-t', 'border-gray-100']
  
  if (props.footerPadding === true) {
    classes.push('px-6', 'py-4')
  } else if (typeof props.footerPadding === 'string') {
    classes.push(props.footerPadding)
  }
  
  return classes
})

// 事件处理
const handleClick = (event) => {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
}

const handleImageLoad = (event) => {
  imageLoaded.value = true
  emit('imageLoad', event)
}

const handleImageError = (event) => {
  imageError.value = true
  emit('imageError', event)
}
</script>

<script>
export default {
  name: 'Card'
}
</script>

<style scoped>
.card {
  overflow: hidden;
}

.rounded-inherit {
  border-radius: inherit;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .card {
    @apply bg-gray-800 border-gray-700;
  }
  
  .card .text-gray-900 {
    @apply text-white;
  }
  
  .card .text-gray-500 {
    @apply text-gray-400;
  }
  
  .card .border-gray-100 {
    @apply border-gray-700;
  }
  
  .card.bg-gray-100 {
    @apply bg-gray-700;
  }
}

/* 动画增强 */
.card:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.active\:scale-98:active {
  transform: scale(0.98);
}

/* 选择状态动画 */
.card.ring-2 {
  transition: all 0.2s ease-out;
}

/* 加载状态样式优化 */
.card .loading-overlay {
  backdrop-filter: blur(2px);
}
</style>