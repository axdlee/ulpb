<template>
  <div class="keyboard-display">
    <div class="keyboard-container">
      <!-- 键盘布局 -->
      <div class="keyboard-layout">
        <div
          v-for="(row, rowIndex) in keyboardLayout"
          :key="rowIndex"
          class="keyboard-row"
          :class="`keyboard-row--${rowIndex + 1}`"
        >
          <div
            v-for="key in row.keys"
            :key="key.key"
            class="keyboard-key"
            :class="[
              `key--${key.type}`,
              {
                'key--highlighted': isKeyHighlighted(key.key),
                'key--active': activeKey === key.key,
                'key--correct': correctKeys.includes(key.key),
                'key--incorrect': incorrectKeys.includes(key.key)
              }
            ]"
            @click="handleKeyClick(key)"
            @mouseenter="handleKeyHover(key)"
            @mouseleave="handleKeyLeave(key)"
          >
            <!-- 键位标签 -->
            <div class="key-main">{{ key.display }}</div>
            
            <!-- 拼音标签 -->
            <div v-if="showLabels && key.labels" class="key-labels">
              <div
                v-for="label in key.labels"
                :key="label.value"
                class="key-label"
                :class="`label--${label.type}`"
              >
                {{ label.value }}
              </div>
            </div>

            <!-- 键位提示 -->
            <div v-if="key.hint && showHints" class="key-hint">
              {{ key.hint }}
            </div>
          </div>
        </div>
      </div>

      <!-- 键盘说明 -->
      <div v-if="showLegend" class="keyboard-legend">
        <div class="legend-item">
          <div class="legend-key key--shengmu"></div>
          <span class="legend-text">声母</span>
        </div>
        <div class="legend-item">
          <div class="legend-key key--yunmu"></div>
          <span class="legend-text">韵母</span>
        </div>
        <div class="legend-item">
          <div class="legend-key key--both"></div>
          <span class="legend-text">声韵母</span>
        </div>
      </div>

      <!-- 当前键位信息 -->
      <transition name="key-info">
        <div v-if="hoveredKey" class="key-info-panel">
          <div class="key-info-header">
            <span class="key-info-key">{{ hoveredKey.display }}</span>
            <span class="key-info-type">{{ getKeyTypeText(hoveredKey.type) }}</span>
          </div>
          <div class="key-info-content">
            <div v-if="hoveredKey.labels" class="key-info-mappings">
              <div
                v-for="label in hoveredKey.labels"
                :key="label.value"
                class="mapping-item"
              >
                <span class="mapping-type">{{ label.type === 'shengmu' ? '声母' : '韵母' }}</span>
                <span class="mapping-value">{{ label.value }}</span>
              </div>
            </div>
            <div v-if="hoveredKey.examples" class="key-info-examples">
              <span class="examples-label">示例字符:</span>
              <span class="examples-list">{{ hoveredKey.examples.join('、') }}</span>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  scheme: {
    type: Object,
    required: true
  },
  highlightedKeys: {
    type: Array,
    default: () => []
  },
  currentLesson: {
    type: Object,
    default: null
  },
  showLabels: {
    type: Boolean,
    default: true
  },
  showHints: {
    type: Boolean,
    default: false
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: false
  },
  activeKey: {
    type: String,
    default: ''
  },
  correctKeys: {
    type: Array,
    default: () => []
  },
  incorrectKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['key-click', 'key-hover', 'key-leave'])

// 响应式状态
const hoveredKey = ref(null)

// 计算属性
const keyboardLayout = computed(() => {
  const layout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ]

  return layout.map((row, rowIndex) => ({
    row: rowIndex + 1,
    keys: row.map(key => generateKeyData(key))
  }))
})

// 方法
const generateKeyData = (key) => {
  const keyData = {
    key,
    display: key === ';' ? '分号' : key.toUpperCase(),
    type: 'normal',
    labels: [],
    examples: getKeyExamples(key)
  }

  // 查找声母映射
  for (const [shengmu, mappedKey] of Object.entries(props.scheme.shengmu || {})) {
    if (mappedKey === key) {
      keyData.type = 'shengmu'
      keyData.labels.push({ type: 'shengmu', value: shengmu })
      break
    }
  }

  // 查找韵母映射
  for (const [yunmu, mappedKey] of Object.entries(props.scheme.yunmu || {})) {
    if (mappedKey === key) {
      keyData.type = keyData.type === 'shengmu' ? 'both' : 'yunmu'
      keyData.labels.push({ type: 'yunmu', value: yunmu })
    }
  }

  return keyData
}

const getKeyExamples = (key) => {
  const examples = {
    'q': ['曲', '全', '去'],
    'w': ['我', '问', '为'],
    'e': ['额', '恶', '鹅'],
    'r': ['人', '如', '然'],
    't': ['他', '天', '太'],
    'y': ['有', '一', '要'],
    'u': ['是', '上', '时'],
    'i': ['在', '中', '之'],
    'o': ['的', '了', '到'],
    'p': ['不', '把', '被'],
    'a': ['啊', '安', '案'],
    's': ['三', '十', '说'],
    'd': ['大', '对', '都'],
    'f': ['发', '分', '非'],
    'g': ['个', '国', '过'],
    'h': ['和', '会', '还'],
    'j': ['就', '家', '见'],
    'k': ['可', '看', '开'],
    'l': ['来', '老', '了'],
    'z': ['这', '知', '只'],
    'x': ['小', '下', '想'],
    'c': ['从', '出', '长'],
    'v': ['很', '和', '或'],
    'b': ['本', '比', '别'],
    'n': ['那', '你', '年'],
    'm': ['没', '么', '们']
  }
  return examples[key] || []
}

const isKeyHighlighted = (key) => {
  return props.highlightedKeys.includes(key)
}

const getKeyTypeText = (type) => {
  const typeMap = {
    'shengmu': '声母键',
    'yunmu': '韵母键',
    'both': '声韵母键',
    'normal': '普通键'
  }
  return typeMap[type] || '未知'
}

const handleKeyClick = (key) => {
  if (props.interactive) {
    emit('key-click', key)
  }
}

const handleKeyHover = (key) => {
  hoveredKey.value = key
  emit('key-hover', key)
}

const handleKeyLeave = (key) => {
  hoveredKey.value = null
  emit('key-leave', key)
}

// 监听器
watch(() => props.scheme, () => {
  // 方案变化时重新生成键盘布局
}, { deep: true })
</script>

<style scoped>
.keyboard-display {
  @apply w-full max-w-4xl mx-auto;
}

.keyboard-container {
  @apply relative bg-gray-100 rounded-2xl p-6 shadow-lg;
}

.keyboard-layout {
  @apply space-y-2;
}

.keyboard-row {
  @apply flex justify-center space-x-2;
}

.keyboard-row--1 {
  @apply pl-0;
}

.keyboard-row--2 {
  @apply pl-4;
}

.keyboard-row--3 {
  @apply pl-8;
}

.keyboard-key {
  @apply relative w-12 h-12 bg-white rounded-lg shadow-sm;
  @apply flex flex-col items-center justify-center;
  @apply border-2 border-gray-200 cursor-pointer;
  @apply transition-all duration-200 hover:shadow-md;
  @apply text-sm font-medium;
}

.key-main {
  @apply text-gray-900 font-bold;
}

.key-labels {
  @apply absolute -top-1 -right-1 flex flex-col space-y-0.5;
}

.key-label {
  @apply px-1 py-0.5 text-xs rounded;
  @apply font-medium leading-none;
}

.label--shengmu {
  @apply bg-blue-100 text-blue-700;
}

.label--yunmu {
  @apply bg-green-100 text-green-700;
}

.key-hint {
  @apply absolute -bottom-6 left-1/2 transform -translate-x-1/2;
  @apply text-xs text-gray-600 whitespace-nowrap;
}

/* 键位类型样式 */
.key--shengmu {
  @apply border-blue-300 bg-blue-50;
}

.key--yunmu {
  @apply border-green-300 bg-green-50;
}

.key--both {
  @apply border-purple-300 bg-purple-50;
}

.key--normal {
  @apply border-gray-200 bg-white;
}

/* 键位状态样式 */
.key--highlighted {
  @apply ring-4 ring-yellow-300 ring-opacity-50;
  @apply border-yellow-400 bg-yellow-100;
  @apply animate-pulse;
}

.key--active {
  @apply ring-4 ring-blue-400 ring-opacity-50;
  @apply border-blue-500 bg-blue-100;
  @apply scale-105;
}

.key--correct {
  @apply ring-4 ring-green-400 ring-opacity-50;
  @apply border-green-500 bg-green-100;
}

.key--incorrect {
  @apply ring-4 ring-red-400 ring-opacity-50;
  @apply border-red-500 bg-red-100;
  @apply animate-bounce;
}

/* 键盘说明 */
.keyboard-legend {
  @apply flex justify-center space-x-6 mt-6 pt-4 border-t border-gray-200;
}

.legend-item {
  @apply flex items-center space-x-2;
}

.legend-key {
  @apply w-6 h-6 rounded border-2;
}

.legend-text {
  @apply text-sm text-gray-600;
}

/* 键位信息面板 */
.key-info-panel {
  @apply absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4;
  @apply border border-gray-200 min-w-48;
}

.key-info-header {
  @apply flex items-center justify-between mb-3;
}

.key-info-key {
  @apply text-lg font-bold text-gray-900;
}

.key-info-type {
  @apply text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded;
}

.key-info-content {
  @apply space-y-3;
}

.key-info-mappings {
  @apply space-y-2;
}

.mapping-item {
  @apply flex items-center justify-between;
}

.mapping-type {
  @apply text-sm text-gray-600;
}

.mapping-value {
  @apply text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded;
}

.key-info-examples {
  @apply pt-2 border-t border-gray-100;
}

.examples-label {
  @apply text-sm text-gray-600;
}

.examples-list {
  @apply text-sm font-medium text-gray-900 ml-2;
}

/* 动画 */
.key-info-enter-active,
.key-info-leave-active {
  @apply transition-all duration-200;
}

.key-info-enter-from,
.key-info-leave-to {
  @apply opacity-0 transform scale-95;
}

/* 暗色主题 */
[data-theme='dark'] .keyboard-container {
  @apply bg-gray-800;
}

[data-theme='dark'] .keyboard-key {
  @apply bg-gray-700 border-gray-600 text-gray-100;
}

[data-theme='dark'] .key--shengmu {
  @apply border-blue-500 bg-blue-900;
}

[data-theme='dark'] .key--yunmu {
  @apply border-green-500 bg-green-900;
}

[data-theme='dark'] .key--both {
  @apply border-purple-500 bg-purple-900;
}

[data-theme='dark'] .key--normal {
  @apply border-gray-600 bg-gray-700;
}

[data-theme='dark'] .key-info-panel {
  @apply bg-gray-800 border-gray-600;
}

[data-theme='dark'] .key-info-key {
  @apply text-gray-100;
}

[data-theme='dark'] .key-info-type {
  @apply text-gray-300 bg-gray-700;
}

[data-theme='dark'] .mapping-value {
  @apply text-gray-100 bg-gray-700;
}

[data-theme='dark'] .examples-list {
  @apply text-gray-100;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .keyboard-key {
    @apply w-8 h-8 text-xs;
  }
  
  .key-labels {
    @apply hidden;
  }
  
  .key-info-panel {
    @apply fixed bottom-4 left-4 right-4 top-auto;
  }
  
  .keyboard-legend {
    @apply flex-col space-y-2 space-x-0;
  }
}
</style>