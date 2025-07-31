<!-- KeyButton.vue -->
<template>
  <button
    class="key-button flex flex-col items-center justify-center rounded-md transition-all duration-150 focus:outline-none"
    :class="[sizeClass, colorClass, stateClass]"
    @click="handleClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseLeave"
  >
    <!-- 主键位标签 -->
    <div class="text-sm font-medium">
      {{ keyData.label || keyData.key.toUpperCase() }}
    </div>

    <!-- 双拼信息 -->
    <div v-if="keyData.shengmu || keyData.yunmu" class="text-xs opacity-75 mt-1">
      <div v-if="keyData.shengmu" class="text-blue-600">{{ keyData.shengmu }}</div>
      <div v-if="keyData.yunmu" class="text-green-600">{{ keyData.yunmu }}</div>
    </div>

    <!-- 指法提示 -->
    <div
      v-if="showFinger && fingerInfo"
      class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center"
      :class="fingerColorClass"
    >
      {{ fingerInfo.number }}
    </div>
  </button>
</template>

<script setup>
  import { computed, ref } from 'vue'

  const props = defineProps({
    keyData: {
      type: Object,
      required: true
    },
    isHighlighted: {
      type: Boolean,
      default: false
    },
    isPressed: {
      type: Boolean,
      default: false
    },
    showFinger: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    }
  })

  const emit = defineEmits(['keyPress'])

  const isMousePressed = ref(false)

  // 键位大小
  const sizeClass = computed(() => {
    if (props.keyData.width === 'wide') {
      return 'w-32 h-12'
    }

    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    }
    return sizes[props.size]
  })

  // 键位颜色
  const colorClass = computed(() => {
    if (props.isHighlighted) {
      return 'bg-yellow-400 text-gray-900 border-yellow-500'
    }

    if (props.keyData.type === 'shengmu') {
      return 'bg-blue-50 text-blue-700 border-blue-200'
    } else if (props.keyData.type === 'yunmu') {
      return 'bg-green-50 text-green-700 border-green-200'
    } else if (props.keyData.type === 'both') {
      return 'bg-purple-50 text-purple-700 border-purple-200'
    }

    return 'bg-white text-gray-700 border-gray-200'
  })

  // 按键状态
  const stateClass = computed(() => {
    const classes = ['border', 'select-none', 'relative']

    if (props.isPressed || isMousePressed.value) {
      classes.push('scale-95', 'shadow-inner')
    } else {
      classes.push('hover:bg-gray-50', 'shadow-sm', 'hover:shadow')
    }

    return classes.join(' ')
  })

  // 指法信息
  const fingerInfo = computed(() => {
    const fingerMap = {
      q: { number: 1, color: 'bg-red-400' },
      w: { number: 2, color: 'bg-orange-400' },
      e: { number: 3, color: 'bg-yellow-400' },
      r: { number: 4, color: 'bg-green-400' },
      t: { number: 4, color: 'bg-green-400' },
      y: { number: 7, color: 'bg-green-400' },
      u: { number: 7, color: 'bg-green-400' },
      i: { number: 8, color: 'bg-yellow-400' },
      o: { number: 9, color: 'bg-orange-400' },
      p: { number: 10, color: 'bg-red-400' },
      a: { number: 1, color: 'bg-red-400' },
      s: { number: 2, color: 'bg-orange-400' },
      d: { number: 3, color: 'bg-yellow-400' },
      f: { number: 4, color: 'bg-green-400' },
      g: { number: 4, color: 'bg-green-400' },
      h: { number: 7, color: 'bg-green-400' },
      j: { number: 7, color: 'bg-green-400' },
      k: { number: 8, color: 'bg-yellow-400' },
      l: { number: 9, color: 'bg-orange-400' },
      ';': { number: 10, color: 'bg-red-400' },
      z: { number: 1, color: 'bg-red-400' },
      x: { number: 2, color: 'bg-orange-400' },
      c: { number: 3, color: 'bg-yellow-400' },
      v: { number: 4, color: 'bg-green-400' },
      b: { number: 4, color: 'bg-green-400' },
      n: { number: 7, color: 'bg-green-400' },
      m: { number: 7, color: 'bg-green-400' },
      ',': { number: 8, color: 'bg-yellow-400' },
      '.': { number: 9, color: 'bg-orange-400' },
      '/': { number: 10, color: 'bg-red-400' }
    }
    return fingerMap[props.keyData.key]
  })

  const fingerColorClass = computed(() => {
    return fingerInfo.value ? fingerInfo.value.color + ' text-white text-xs' : ''
  })

  // 事件处理
  const handleClick = () => {
    emit('keyPress', props.keyData.key)
  }

  const handleMouseDown = () => {
    isMousePressed.value = true
  }

  const handleMouseUp = () => {
    isMousePressed.value = false
  }

  const handleMouseLeave = () => {
    isMousePressed.value = false
  }
</script>

<style scoped>
  .key-button {
    transition:
      transform 0.1s ease-out,
      box-shadow 0.1s ease-out;
  }
</style>
