<!-- LoadingSpinner.vue -->
<template>
  <div class="loading-spinner flex items-center justify-center" :class="containerClass">
    <div class="relative">
      <!-- 默认加载动画 -->
      <div v-if="type === 'spinner'" class="animate-spin rounded-full border-4 border-gray-200" :class="[sizeClass, colorClass]">
        <div class="rounded-full border-4 border-transparent" :class="[sizeClass, borderColorClass]"></div>
      </div>
      
      <!-- 点状加载动画 -->
      <div v-else-if="type === 'dots'" class="flex space-x-1">
        <div v-for="i in 3" :key="i" 
             class="rounded-full animate-pulse" 
             :class="[dotSizeClass, dotColorClass]"
             :style="{ animationDelay: `${i * 0.15}s` }">
        </div>
      </div>
      
      <!-- 波浪加载动画 -->
      <div v-else-if="type === 'wave'" class="flex items-end space-x-1">
        <div v-for="i in 4" :key="i"
             class="rounded-full animate-bounce"
             :class="[barSizeClass, barColorClass]"
             :style="{ animationDelay: `${i * 0.1}s` }">
        </div>
      </div>
      
      <!-- 脉冲加载动画 -->
      <div v-else-if="type === 'pulse'" 
           class="rounded-full animate-ping"
           :class="[sizeClass, pulseColorClass]">
      </div>
    </div>
    
    <!-- 加载文本 -->
    <div v-if="showText && text" class="mt-4 text-center">
      <p class="text-sm font-medium text-gray-700">{{ text }}</p>
      <p v-if="description" class="text-xs text-gray-500 mt-1">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'dots', 'wave', 'pulse'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'gray'].includes(value)
  },
  text: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: true
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() => {
  return props.fullScreen ? 'fixed inset-0 bg-white bg-opacity-90 z-50' : ''
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const dotSizeClass = computed(() => {
  const sizes = {
    small: 'w-1 h-1',
    medium: 'w-2 h-2',
    large: 'w-3 h-3',
    xl: 'w-4 h-4'
  }
  return sizes[props.size]
})

const barSizeClass = computed(() => {
  const sizes = {
    small: 'w-1 h-4',
    medium: 'w-2 h-6',
    large: 'w-3 h-8',
    xl: 'w-4 h-10'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    blue: 'border-r-blue-600',
    green: 'border-r-green-600',
    red: 'border-r-red-600',
    yellow: 'border-r-yellow-600',
    purple: 'border-r-purple-600',
    indigo: 'border-r-indigo-600',
    gray: 'border-r-gray-600'
  }
  return colors[props.color]
})

const borderColorClass = computed(() => {
  const colors = {
    blue: 'border-t-blue-600',
    green: 'border-t-green-600',
    red: 'border-t-red-600',
    yellow: 'border-t-yellow-600',
    purple: 'border-t-purple-600',
    indigo: 'border-t-indigo-600',
    gray: 'border-t-gray-600'
  }
  return colors[props.color]
})

const dotColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
    indigo: 'bg-indigo-600',
    gray: 'bg-gray-600'
  }
  return colors[props.color]
})

const barColorClass = computed(() => {
  return dotColorClass.value
})

const pulseColorClass = computed(() => {
  const colors = {
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-400',
    indigo: 'bg-indigo-400',
    gray: 'bg-gray-400'
  }
  return colors[props.color]
})
</script>