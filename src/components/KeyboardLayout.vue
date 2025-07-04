<!-- KeyboardLayout.vue -->
<template>
  <div class="keyboard-layout">
    <div class="keyboard-container bg-gray-100 rounded-lg p-4">
      <!-- 第一行 -->
      <div class="keyboard-row flex justify-center space-x-1 mb-2">
        <KeyButton
          v-for="key in row1"
          :key="key.key"
          :keyData="key"
          :isHighlighted="highlightedKeys.includes(key.key)"
          :isPressed="pressedKeys.includes(key.key)"
          @keyPress="handleKeyPress"
        />
      </div>
      
      <!-- 第二行 -->
      <div class="keyboard-row flex justify-center space-x-1 mb-2">
        <KeyButton
          v-for="key in row2"
          :key="key.key"
          :keyData="key"
          :isHighlighted="highlightedKeys.includes(key.key)"
          :isPressed="pressedKeys.includes(key.key)"
          @keyPress="handleKeyPress"
        />
      </div>
      
      <!-- 第三行 -->
      <div class="keyboard-row flex justify-center space-x-1 mb-2">
        <KeyButton
          v-for="key in row3"
          :key="key.key"
          :keyData="key"
          :isHighlighted="highlightedKeys.includes(key.key)"
          :isPressed="pressedKeys.includes(key.key)"
          @keyPress="handleKeyPress"
        />
      </div>
      
      <!-- 空格键 -->
      <div class="keyboard-row flex justify-center">
        <KeyButton
          :keyData="{ key: 'space', label: '空格', width: 'wide' }"
          :isHighlighted="highlightedKeys.includes('space')"
          :isPressed="pressedKeys.includes('space')"
          @keyPress="handleKeyPress"
        />
      </div>
    </div>
    
    <!-- 图例 -->
    <div v-if="showLegend" class="mt-4 flex flex-wrap justify-center space-x-4 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-blue-500 rounded"></div>
        <span>声母</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-green-500 rounded"></div>
        <span>韵母</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-purple-500 rounded"></div>
        <span>声母+韵母</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-yellow-400 rounded"></div>
        <span>高亮</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'
import KeyButton from './KeyButton.vue'

const store = useShuangpinStore()

const props = defineProps({
  highlightedKeys: {
    type: Array,
    default: () => []
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['keyPress'])

// 当前按下的键
const pressedKeys = ref([])

// 键盘布局
const keyboardLayout = computed(() => store.getCurrentSchemeLayout)

const row1 = computed(() => keyboardLayout.value.slice(0, 10))
const row2 = computed(() => keyboardLayout.value.slice(10, 20))
const row3 = computed(() => keyboardLayout.value.slice(20, 30))

// 处理按键事件
const handleKeyPress = (key) => {
  emit('keyPress', key)
}

// 键盘事件监听
const handleKeyDown = (event) => {
  if (!props.interactive) return
  
  const key = event.key.toLowerCase()
  if (!pressedKeys.value.includes(key)) {
    pressedKeys.value.push(key)
  }
  
  // 阻止默认行为
  if (/^[a-z;,./]$/.test(key) || key === ' ') {
    event.preventDefault()
    handleKeyPress(key === ' ' ? 'space' : key)
  }
}

const handleKeyUp = (event) => {
  if (!props.interactive) return
  
  const key = event.key.toLowerCase()
  pressedKeys.value = pressedKeys.value.filter(k => k !== key)
}

// 生命周期
onMounted(() => {
  if (props.interactive) {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }
})

onUnmounted(() => {
  if (props.interactive) {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
})
</script>

<style scoped>
.keyboard-layout {
  max-width: 600px;
  margin: 0 auto;
}

.keyboard-row {
  min-height: 48px;
}
</style>