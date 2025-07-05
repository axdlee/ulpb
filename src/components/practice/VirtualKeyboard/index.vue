<!-- VirtualKeyboard 虚拟键盘组件 - 交互式虚拟键盘 -->
<template>
  <div class="virtual-keyboard">
    <div class="keyboard-container">
      <!-- 键盘标题和信息 -->
      <div class="keyboard-header">
        <div class="keyboard-title">
          <span class="scheme-name">{{ scheme?.name || '双拼键盘' }}</span>
          <span class="scheme-info" v-if="scheme?.description">
            {{ scheme.description }}
          </span>
        </div>
        <div class="keyboard-controls">
          <button 
            class="control-button"
            :class="{ 'active': showPinyin }"
            @click="togglePinyin"
          >
            <span class="control-icon">拼</span>
            <span class="control-text">拼音</span>
          </button>
          <button 
            class="control-button"
            :class="{ 'active': showFingerHints }"
            @click="toggleFingerHints"
          >
            <span class="control-icon">👆</span>
            <span class="control-text">指法</span>
          </button>
        </div>
      </div>

      <!-- 功能键行 -->
      <div class="keyboard-row function-row">
        <div 
          v-for="key in functionKeys" 
          :key="key.code"
          class="key function-key"
          :class="getKeyClasses(key)"
          @click="handleKeyClick(key)"
          @mousedown="handleKeyDown(key)"
          @mouseup="handleKeyUp(key)"
        >
          <span class="key-main">{{ key.display }}</span>
          <span class="key-sub" v-if="key.sub">{{ key.sub }}</span>
        </div>
      </div>

      <!-- 数字键行 -->
      <div class="keyboard-row number-row">
        <div 
          v-for="key in numberKeys" 
          :key="key.code"
          class="key number-key"
          :class="getKeyClasses(key)"
          @click="handleKeyClick(key)"
          @mousedown="handleKeyDown(key)"
          @mouseup="handleKeyUp(key)"
        >
          <span class="key-main">{{ key.display }}</span>
          <span class="key-sub" v-if="key.sub">{{ key.sub }}</span>
        </div>
      </div>

      <!-- 字母键行1 -->
      <div class="keyboard-row letter-row">
        <div 
          v-for="key in letterRow1" 
          :key="key.code"
          class="key letter-key"
          :class="getKeyClasses(key)"
          @click="handleKeyClick(key)"
          @mousedown="handleKeyDown(key)"
          @mouseup="handleKeyUp(key)"
        >
          <span class="key-main">{{ key.display }}</span>
          <div class="key-pinyin" v-if="showPinyin && key.pinyin">
            <span class="pinyin-shengmu" v-if="key.pinyin.shengmu">{{ key.pinyin.shengmu }}</span>
            <span class="pinyin-yunmu" v-if="key.pinyin.yunmu">{{ key.pinyin.yunmu }}</span>
          </div>
          <div class="key-finger" v-if="showFingerHints">
            <span class="finger-indicator" :data-finger="key.finger">{{ getFingerIndicator(key.finger) }}</span>
          </div>
        </div>
      </div>

      <!-- 字母键行2 -->
      <div class="keyboard-row letter-row">
        <div 
          v-for="key in letterRow2" 
          :key="key.code"
          class="key letter-key"
          :class="getKeyClasses(key)"
          @click="handleKeyClick(key)"
          @mousedown="handleKeyDown(key)"
          @mouseup="handleKeyUp(key)"
        >
          <span class="key-main">{{ key.display }}</span>
          <div class="key-pinyin" v-if="showPinyin && key.pinyin">
            <span class="pinyin-shengmu" v-if="key.pinyin.shengmu">{{ key.pinyin.shengmu }}</span>
            <span class="pinyin-yunmu" v-if="key.pinyin.yunmu">{{ key.pinyin.yunmu }}</span>
          </div>
          <div class="key-finger" v-if="showFingerHints">
            <span class="finger-indicator" :data-finger="key.finger">{{ getFingerIndicator(key.finger) }}</span>
          </div>
        </div>
      </div>

      <!-- 字母键行3 -->
      <div class="keyboard-row letter-row">
        <div 
          v-for="key in letterRow3" 
          :key="key.code"
          class="key letter-key"
          :class="getKeyClasses(key)"
          @click="handleKeyClick(key)"
          @mousedown="handleKeyDown(key)"
          @mouseup="handleKeyUp(key)"
        >
          <span class="key-main">{{ key.display }}</span>
          <div class="key-pinyin" v-if="showPinyin && key.pinyin">
            <span class="pinyin-shengmu" v-if="key.pinyin.shengmu">{{ key.pinyin.shengmu }}</span>
            <span class="pinyin-yunmu" v-if="key.pinyin.yunmu">{{ key.pinyin.yunmu }}</span>
          </div>
          <div class="key-finger" v-if="showFingerHints">
            <span class="finger-indicator" :data-finger="key.finger">{{ getFingerIndicator(key.finger) }}</span>
          </div>
        </div>
      </div>

      <!-- 空格键行 -->
      <div class="keyboard-row space-row">
        <div class="key modifier-key" :class="getKeyClasses({ code: 'ControlLeft' })">
          <span class="key-main">Ctrl</span>
        </div>
        <div class="key modifier-key" :class="getKeyClasses({ code: 'MetaLeft' })">
          <span class="key-main">⌘</span>
        </div>
        <div class="key modifier-key" :class="getKeyClasses({ code: 'AltLeft' })">
          <span class="key-main">Alt</span>
        </div>
        <div 
          class="key space-key"
          :class="getKeyClasses({ code: 'Space' })"
          @click="handleKeyClick({ code: 'Space', key: ' ' })"
        >
          <span class="key-main">空格</span>
        </div>
        <div class="key modifier-key" :class="getKeyClasses({ code: 'AltRight' })">
          <span class="key-main">Alt</span>
        </div>
        <div class="key modifier-key" :class="getKeyClasses({ code: 'MetaRight' })">
          <span class="key-main">⌘</span>
        </div>
        <div class="key modifier-key" :class="getKeyClasses({ code: 'ControlRight' })">
          <span class="key-main">Ctrl</span>
        </div>
      </div>

      <!-- 键盘统计信息 -->
      <div class="keyboard-stats" v-if="showStats">
        <div class="stat-item">
          <span class="stat-label">总按键:</span>
          <span class="stat-value">{{ totalKeyPresses }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">错误次数:</span>
          <span class="stat-value">{{ errorCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">准确率:</span>
          <span class="stat-value">{{ accuracy }}%</span>
        </div>
      </div>
    </div>

    <!-- 手部姿势提示 -->
    <div class="hand-position-guide" v-if="showHandGuide">
      <div class="guide-container">
        <div class="hand-illustration">
          <div class="hand left-hand">
            <div class="finger" v-for="finger in leftHandFingers" :key="finger.id" :class="finger.class">
              {{ finger.label }}
            </div>
          </div>
          <div class="hand right-hand">
            <div class="finger" v-for="finger in rightHandFingers" :key="finger.id" :class="finger.class">
              {{ finger.label }}
            </div>
          </div>
        </div>
        <div class="guide-text">
          保持正确的手部姿势，十指放在基准键位上
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  scheme: {
    type: Object,
    required: true
  },
  highlightedKeys: {
    type: Array,
    default: () => []
  },
  pressedKeys: {
    type: Array,
    default: () => []
  },
  errorKeys: {
    type: Array,
    default: () => []
  },
  showStats: {
    type: Boolean,
    default: false
  },
  showHandGuide: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['keyPress', 'keyDown', 'keyUp'])

// 响应式状态
const showPinyin = ref(true)
const showFingerHints = ref(false)
const totalKeyPresses = ref(0)
const errorCount = ref(0)

// 键盘布局定义
const functionKeys = ref([
  { code: 'Escape', display: 'Esc', key: 'Escape' },
  { code: 'F1', display: 'F1', key: 'F1' },
  { code: 'F2', display: 'F2', key: 'F2' },
  { code: 'F3', display: 'F3', key: 'F3' },
  { code: 'F4', display: 'F4', key: 'F4' },
  { code: 'F5', display: 'F5', key: 'F5' },
  { code: 'F6', display: 'F6', key: 'F6' },
  { code: 'F7', display: 'F7', key: 'F7' },
  { code: 'F8', display: 'F8', key: 'F8' },
  { code: 'F9', display: 'F9', key: 'F9' },
  { code: 'F10', display: 'F10', key: 'F10' },
  { code: 'F11', display: 'F11', key: 'F11' },
  { code: 'F12', display: 'F12', key: 'F12' }
])

const numberKeys = ref([
  { code: 'Backquote', display: '`', sub: '~', key: '`', finger: 'L5' },
  { code: 'Digit1', display: '1', sub: '!', key: '1', finger: 'L5' },
  { code: 'Digit2', display: '2', sub: '@', key: '2', finger: 'L4' },
  { code: 'Digit3', display: '3', sub: '#', key: '3', finger: 'L3' },
  { code: 'Digit4', display: '4', sub: '$', key: '4', finger: 'L2' },
  { code: 'Digit5', display: '5', sub: '%', key: '5', finger: 'L1' },
  { code: 'Digit6', display: '6', sub: '^', key: '6', finger: 'R1' },
  { code: 'Digit7', display: '7', sub: '&', key: '7', finger: 'R2' },
  { code: 'Digit8', display: '8', sub: '*', key: '8', finger: 'R3' },
  { code: 'Digit9', display: '9', sub: '(', key: '9', finger: 'R4' },
  { code: 'Digit0', display: '0', sub: ')', key: '0', finger: 'R5' },
  { code: 'Minus', display: '-', sub: '_', key: '-', finger: 'R5' },
  { code: 'Equal', display: '=', sub: '+', key: '=', finger: 'R5' },
  { code: 'Backspace', display: '⌫', key: 'Backspace', finger: 'R5' }
])

// 字母键行 - 基于双拼方案动态生成
const letterRow1 = computed(() => 
  'qwertyuiop'.split('').map(letter => ({
    code: `Key${letter.toUpperCase()}`,
    display: letter.toUpperCase(),
    key: letter,
    finger: getFingerForKey(letter),
    pinyin: props.scheme?.mapping?.[letter] || null
  }))
)

const letterRow2 = computed(() => 
  'asdfghjkl'.split('').map(letter => ({
    code: `Key${letter.toUpperCase()}`,
    display: letter.toUpperCase(),
    key: letter,
    finger: getFingerForKey(letter),
    pinyin: props.scheme?.mapping?.[letter] || null
  }))
)

const letterRow3 = computed(() => 
  'zxcvbnm'.split('').map(letter => ({
    code: `Key${letter.toUpperCase()}`,
    display: letter.toUpperCase(),
    key: letter,
    finger: getFingerForKey(letter),
    pinyin: props.scheme?.mapping?.[letter] || null
  }))
)

// 手指分布
const leftHandFingers = ref([
  { id: 'L5', label: '小指', class: 'finger-pinky' },
  { id: 'L4', label: '无名指', class: 'finger-ring' },
  { id: 'L3', label: '中指', class: 'finger-middle' },
  { id: 'L2', label: '食指', class: 'finger-index' },
  { id: 'L1', label: '拇指', class: 'finger-thumb' }
])

const rightHandFingers = ref([
  { id: 'R1', label: '拇指', class: 'finger-thumb' },
  { id: 'R2', label: '食指', class: 'finger-index' },
  { id: 'R3', label: '中指', class: 'finger-middle' },
  { id: 'R4', label: '无名指', class: 'finger-ring' },
  { id: 'R5', label: '小指', class: 'finger-pinky' }
])

// 计算属性
const accuracy = computed(() => {
  if (totalKeyPresses.value === 0) return 100
  return Math.round(((totalKeyPresses.value - errorCount.value) / totalKeyPresses.value) * 100)
})

// 方法
const getFingerForKey = (key) => {
  const fingerMap = {
    'q': 'L5', 'w': 'L4', 'e': 'L3', 'r': 'L2', 't': 'L2',
    'y': 'R2', 'u': 'R2', 'i': 'R3', 'o': 'R4', 'p': 'R5',
    'a': 'L5', 's': 'L4', 'd': 'L3', 'f': 'L2', 'g': 'L2',
    'h': 'R2', 'j': 'R2', 'k': 'R3', 'l': 'R4',
    'z': 'L5', 'x': 'L4', 'c': 'L3', 'v': 'L2', 'b': 'L2',
    'n': 'R2', 'm': 'R2'
  }
  return fingerMap[key] || 'unknown'
}

const getFingerIndicator = (finger) => {
  const indicators = {
    'L5': '👍', 'L4': '👆', 'L3': '🖕', 'L2': '👉', 'L1': '👍',
    'R1': '👍', 'R2': '👈', 'R3': '🖕', 'R4': '👆', 'R5': '👍'
  }
  return indicators[finger] || '❓'
}

const getKeyClasses = (key) => {
  const keyCode = key.code || key.key
  const keyChar = key.key?.toLowerCase()
  
  return {
    'key--highlighted': props.highlightedKeys.includes(keyChar) || props.highlightedKeys.includes(keyCode),
    'key--pressed': props.pressedKeys.includes(keyChar) || props.pressedKeys.includes(keyCode),
    'key--error': props.errorKeys.includes(keyChar) || props.errorKeys.includes(keyCode),
    'key--shengmu': key.pinyin?.shengmu,
    'key--yunmu': key.pinyin?.yunmu,
    'key--both': key.pinyin?.shengmu && key.pinyin?.yunmu
  }
}

const handleKeyClick = (key) => {
  totalKeyPresses.value++
  emit('keyPress', key.key || key.code)
}

const handleKeyDown = (key) => {
  emit('keyDown', key.key || key.code)
}

const handleKeyUp = (key) => {
  emit('keyUp', key.key || key.code)
}

const togglePinyin = () => {
  showPinyin.value = !showPinyin.value
}

const toggleFingerHints = () => {
  showFingerHints.value = !showFingerHints.value
}

// 键盘事件监听
const handlePhysicalKeyDown = (event) => {
  const key = event.key.toLowerCase()
  if (!props.pressedKeys.includes(key)) {
    emit('keyDown', key)
  }
}

const handlePhysicalKeyUp = (event) => {
  const key = event.key.toLowerCase()
  emit('keyUp', key)
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handlePhysicalKeyDown)
  document.addEventListener('keyup', handlePhysicalKeyUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handlePhysicalKeyDown)
  document.removeEventListener('keyup', handlePhysicalKeyUp)
})

// 暴露方法
defineExpose({
  togglePinyin,
  toggleFingerHints,
  totalKeyPresses,
  errorCount,
  accuracy
})
</script>

<style scoped>
.virtual-keyboard {
  @apply w-full space-y-6;
}

.keyboard-container {
  @apply bg-white rounded-lg shadow-sm p-6 space-y-4;
  max-width: 1200px;
  margin: 0 auto;
}

/* 键盘头部 */
.keyboard-header {
  @apply flex items-center justify-between pb-4 border-b border-gray-200;
}

.keyboard-title {
  @apply space-y-1;
}

.scheme-name {
  @apply text-lg font-semibold text-gray-900;
}

.scheme-info {
  @apply block text-sm text-gray-600;
}

.keyboard-controls {
  @apply flex space-x-2;
}

.control-button {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200;
  @apply hover:bg-gray-50 transition-colors;
}

.control-button.active {
  @apply bg-blue-50 border-blue-200 text-blue-700;
}

.control-icon {
  @apply text-lg;
}

.control-text {
  @apply text-sm font-medium;
}

/* 键盘行 */
.keyboard-row {
  @apply flex justify-center space-x-1;
}

.function-row {
  @apply space-x-2;
}

.number-row .key {
  @apply min-w-12;
}

.letter-row .key {
  @apply min-w-12;
}

.space-row {
  @apply space-x-2;
}

/* 按键样式 */
.key {
  @apply relative bg-gray-100 hover:bg-gray-200 rounded-lg;
  @apply flex flex-col items-center justify-center;
  @apply cursor-pointer select-none transition-all duration-150;
  @apply border border-gray-300 shadow-sm;
  @apply h-12 text-sm font-medium;
  @apply active:scale-95 active:shadow-inner;
}

.key:hover {
  @apply transform -translate-y-0.5 shadow-md;
}

.function-key {
  @apply min-w-12 text-xs;
}

.letter-key {
  @apply min-w-12;
}

.space-key {
  @apply min-w-48;
}

.modifier-key {
  @apply min-w-16 text-xs;
}

/* 按键状态 */
.key--highlighted {
  @apply bg-blue-100 border-blue-300 text-blue-700;
  @apply ring-2 ring-blue-200;
  animation: highlight-pulse 1.5s infinite;
}

.key--pressed {
  @apply bg-green-200 border-green-400 text-green-800;
  @apply scale-95 shadow-inner;
}

.key--error {
  @apply bg-red-100 border-red-300 text-red-700;
  animation: error-shake 0.5s;
}

.key--shengmu {
  @apply bg-blue-50 border-blue-200;
}

.key--yunmu {
  @apply bg-green-50 border-green-200;
}

.key--both {
  @apply bg-gradient-to-r from-blue-50 to-green-50;
  @apply border-purple-200;
}

/* 按键内容 */
.key-main {
  @apply text-gray-900 font-medium;
}

.key-sub {
  @apply absolute top-1 right-1 text-xs text-gray-500;
}

.key-pinyin {
  @apply absolute bottom-1 left-1 right-1;
  @apply flex flex-col text-xs leading-tight;
}

.pinyin-shengmu {
  @apply text-blue-600 font-medium;
}

.pinyin-yunmu {
  @apply text-green-600 font-medium;
}

.key-finger {
  @apply absolute top-1 left-1;
}

.finger-indicator {
  @apply text-xs;
}

/* 键盘统计 */
.keyboard-stats {
  @apply flex items-center justify-center space-x-6 pt-4 border-t border-gray-200;
  @apply text-sm;
}

.stat-item {
  @apply flex items-center space-x-2;
}

.stat-label {
  @apply text-gray-600;
}

.stat-value {
  @apply font-semibold text-gray-900;
}

/* 手部姿势指导 */
.hand-position-guide {
  @apply bg-gray-50 rounded-lg p-6;
}

.guide-container {
  @apply text-center space-y-4;
}

.hand-illustration {
  @apply flex justify-center space-x-8;
}

.hand {
  @apply flex space-x-2;
}

.finger {
  @apply w-8 h-12 bg-gray-200 rounded-lg flex items-center justify-center;
  @apply text-xs font-medium text-gray-700;
}

.finger-thumb {
  @apply bg-blue-200 text-blue-700;
}

.finger-index {
  @apply bg-green-200 text-green-700;
}

.finger-middle {
  @apply bg-yellow-200 text-yellow-700;
}

.finger-ring {
  @apply bg-orange-200 text-orange-700;
}

.finger-pinky {
  @apply bg-red-200 text-red-700;
}

.guide-text {
  @apply text-sm text-gray-600;
}

/* 动画 */
@keyframes highlight-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* 暗色主题 */
[data-theme='dark'] .keyboard-container {
  @apply bg-gray-800 border-gray-700;
}

[data-theme='dark'] .keyboard-header {
  @apply border-gray-700;
}

[data-theme='dark'] .scheme-name {
  @apply text-gray-100;
}

[data-theme='dark'] .scheme-info {
  @apply text-gray-400;
}

[data-theme='dark'] .control-button {
  @apply border-gray-600 text-gray-300;
}

[data-theme='dark'] .control-button:hover {
  @apply bg-gray-700;
}

[data-theme='dark'] .key {
  @apply bg-gray-700 border-gray-600 text-gray-300;
}

[data-theme='dark'] .key:hover {
  @apply bg-gray-600;
}

[data-theme='dark'] .key-main {
  @apply text-gray-200;
}

[data-theme='dark'] .key-sub {
  @apply text-gray-500;
}

[data-theme='dark'] .keyboard-stats {
  @apply border-gray-700;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-400;
}

[data-theme='dark'] .stat-value {
  @apply text-gray-200;
}

[data-theme='dark'] .hand-position-guide {
  @apply bg-gray-800;
}

[data-theme='dark'] .finger {
  @apply bg-gray-600 text-gray-300;
}

[data-theme='dark'] .guide-text {
  @apply text-gray-400;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .keyboard-container {
    @apply px-4;
  }
  
  .keyboard-row {
    @apply space-x-0.5;
  }
  
  .key {
    @apply h-10 min-w-10 text-xs;
  }
  
  .space-key {
    @apply min-w-32;
  }
  
  .function-row {
    @apply hidden;
  }
}

@media (max-width: 768px) {
  .keyboard-header {
    @apply flex-col space-y-4 items-start;
  }
  
  .keyboard-controls {
    @apply w-full justify-center;
  }
  
  .key {
    @apply h-8 min-w-8;
  }
  
  .key-pinyin {
    @apply hidden;
  }
  
  .hand-position-guide {
    @apply hidden;
  }
}
</style>