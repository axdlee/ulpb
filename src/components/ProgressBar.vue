<!-- ProgressBar.vue -->
<template>
  <div class="progress-bar">
    <div class="flex justify-between items-center mb-2" v-if="showLabel">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm text-gray-500">{{ Math.round(progress) }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full overflow-hidden" :class="sizeClass">
      <div
        class="progress-fill h-full rounded-full transition-all duration-300 ease-out"
        :class="colorClass"
        :style="{ width: `${Math.min(progress, 100)}%` }"
      >
        <div
          v-if="animated"
          class="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"
        ></div>
      </div>
    </div>
    <div v-if="showText && $slots.default" class="mt-2 text-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    progress: {
      type: Number,
      default: 0,
      validator: value => value >= 0 && value <= 100
    },
    label: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showText: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    color: {
      type: String,
      default: 'blue',
      validator: value => ['blue', 'green', 'red', 'yellow', 'purple', 'indigo'].includes(value)
    },
    animated: {
      type: Boolean,
      default: false
    }
  })

  const sizeClass = computed(() => {
    const sizes = {
      small: 'h-2',
      medium: 'h-3',
      large: 'h-4'
    }
    return sizes[props.size]
  })

  const colorClass = computed(() => {
    const colors = {
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      yellow: 'bg-yellow-600',
      purple: 'bg-purple-600',
      indigo: 'bg-indigo-600'
    }
    return colors[props.color]
  })
</script>

<style scoped>
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
</style>
