<template>
  <div
    :class="spinnerClasses"
    :style="spinnerStyles"
    role="status"
    :aria-label="label"
  >
    <svg
      class="animate-spin"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        class="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
        class="opacity-75"
      />
    </svg>
    
    <span v-if="showLabel" class="sr-only">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  
  color: {
    type: String,
    default: 'current'
  },
  
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  
  speed: {
    type: String,
    default: 'normal',
    validator: (value) => ['slow', 'normal', 'fast'].includes(value)
  },
  
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'dots', 'pulse', 'bars'].includes(value)
  },
  
  label: {
    type: String,
    default: '加载中...'
  },
  
  showLabel: {
    type: Boolean,
    default: false
  },
  
  centered: {
    type: Boolean,
    default: false
  }
})

const spinnerClasses = computed(() => {
  const classes = []
  
  if (props.centered) {
    classes.push('flex', 'items-center', 'justify-center')
  }
  
  // 添加速度类
  switch (props.speed) {
    case 'slow':
      classes.push('animate-spin-slow')
      break
    case 'fast':
      classes.push('animate-spin-fast')
      break
    default:
      classes.push('animate-spin')
  }
  
  return classes
})

const spinnerStyles = computed(() => {
  const styles = {}
  
  if (props.color !== 'current') {
    styles.color = props.color
  }
  
  return styles
})

const circumference = computed(() => {
  return 2 * Math.PI * 10 // r = 10
})

const dashOffset = computed(() => {
  return circumference.value * 0.25 // 显示75%的圆
})
</script>

<script>
export default {
  name: 'LoadingSpinner'
}
</script>

<style scoped>
/* 自定义动画速度 */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-fast {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}

.animate-spin-fast {
  animation: spin-fast 0.5s linear infinite;
}

/* 脉动变体 */
.pulse-spinner {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 点状加载器 */
.dots-spinner {
  display: flex;
  gap: 4px;
}

.dots-spinner > div {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
  animation: dots-bounce 1.4s ease-in-out infinite both;
}

.dots-spinner > div:nth-child(1) { animation-delay: -0.32s; }
.dots-spinner > div:nth-child(2) { animation-delay: -0.16s; }
.dots-spinner > div:nth-child(3) { animation-delay: 0s; }

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* 条状加载器 */
.bars-spinner {
  display: flex;
  gap: 2px;
  align-items: end;
}

.bars-spinner > div {
  width: 3px;
  background-color: currentColor;
  animation: bars-stretch 1.2s ease-in-out infinite;
}

.bars-spinner > div:nth-child(1) { animation-delay: -1.1s; }
.bars-spinner > div:nth-child(2) { animation-delay: -1.0s; }
.bars-spinner > div:nth-child(3) { animation-delay: -0.9s; }
.bars-spinner > div:nth-child(4) { animation-delay: -0.8s; }
.bars-spinner > div:nth-child(5) { animation-delay: -0.7s; }

@keyframes bars-stretch {
  0%, 40%, 100% {
    height: 8px;
  }
  20% {
    height: 20px;
  }
}
</style>