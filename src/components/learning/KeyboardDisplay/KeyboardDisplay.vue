<template>
  <div class="keyboard-display">
    <div class="keyboard-container">
      <div class="keyboard-header">
        <h3 class="keyboard-title">{{ scheme.name }} 键盘布局</h3>
        <div class="keyboard-controls">
          <button 
            @click="toggleLabels" 
            class="control-btn"
            :class="{ active: showLabels }"
          >
            {{ showLabels ? '隐藏标签' : '显示标签' }}
          </button>
          <button 
            @click="toggleHighlight" 
            class="control-btn"
            :class="{ active: highlightMode }"
          >
            {{ highlightMode ? '关闭高亮' : '开启高亮' }}
          </button>
        </div>
      </div>
      
      <div class="keyboard-layout">
        <!-- 键盘行 -->
        <div 
          v-for="(row, rowIndex) in keyboardRows" 
          :key="rowIndex" 
          class="keyboard-row"
          :class="`keyboard-row-${rowIndex + 1}`"
        >
          <div
            v-for="key in row"
            :key="key.key"
            class="key"
            :class="getKeyClass(key)"
            @click="handleKeyClick(key)"
            @mouseenter="handleKeyHover(key)"
            @mouseleave="handleKeyLeave(key)"
          >
            <!-- 键位字母 -->
            <div class="key-main">{{ key.display }}</div>
            
            <!-- 声母标签 -->
            <div v-if="showLabels && key.shengmu" class="key-label key-label-shengmu">
              {{ key.shengmu }}
            </div>
            
            <!-- 韵母标签 -->
            <div v-if="showLabels && key.yunmu" class="key-label key-label-yunmu">
              {{ key.yunmu }}
            </div>
            
            <!-- 多重映射标签 -->
            <div v-if="showLabels && key.mappings && key.mappings.length > 1" class="key-labels-multi">
              <span 
                v-for="mapping in key.mappings" 
                :key="mapping.value"
                class="multi-label"
                :class="`multi-label-${mapping.type}`"
              >
                {{ mapping.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 键位说明 -->
      <div class="keyboard-legend">
        <div class="legend-item">
          <div class="legend-color legend-shengmu"></div>
          <span>声母</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-yunmu"></div>
          <span>韵母</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-both"></div>
          <span>声母+韵母</span>
        </div>
        <div class="legend-item">
          <div class="legend-color legend-highlight"></div>
          <span>当前学习</span>
        </div>
      </div>
      
      <!-- 键位详情面板 -->
      <div v-if="selectedKey" class="key-details">
        <h4 class="details-title">{{ selectedKey.display.toUpperCase() }} 键详情</h4>
        <div class="details-content">
          <div v-if="selectedKey.shengmu" class="detail-item">
            <span class="detail-label">声母:</span>
            <span class="detail-value">{{ selectedKey.shengmu }}</span>
          </div>
          <div v-if="selectedKey.yunmu" class="detail-item">
            <span class="detail-label">韵母:</span>
            <span class="detail-value">{{ selectedKey.yunmu }}</span>
          </div>
          <div v-if="selectedKey.examples && selectedKey.examples.length > 0" class="detail-item">
            <span class="detail-label">示例字符:</span>
            <div class="examples">
              <span 
                v-for="example in selectedKey.examples" 
                :key="example"
                class="example-char"
              >
                {{ example }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useShuangpinStore } from '@/stores/shuangpin'

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
  currentLesson: {
    type: Object,
    default: null
  },
  showLabels: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['key-click', 'key-hover'])

// Store
const shuangpinStore = useShuangpinStore()

// 响应式状态
const showLabels = ref(props.showLabels)
const highlightMode = ref(true)
const selectedKey = ref(null)
const hoveredKey = ref(null)

// 键盘布局定义
const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
]

// 计算属性
const keyboardRows = computed(() => {
  return keyboardLayout.map(row => 
    row.map(key => {
      const keyData = {
        key,
        display: key === ';' ? ';' : key.toUpperCase(),
        shengmu: null,
        yunmu: null,
        mappings: [],
        examples: []
      }

      // 查找声母映射
      for (const [shengmu, mappedKey] of Object.entries(props.scheme.shengmu || {})) {
        if (mappedKey === key) {
          keyData.shengmu = shengmu
          keyData.mappings.push({ type: 'shengmu', value: shengmu })
          break
        }
      }

      // 查找韵母映射
      for (const [yunmu, mappedKey] of Object.entries(props.scheme.yunmu || {})) {
        if (mappedKey === key) {
          keyData.yunmu = yunmu
          keyData.mappings.push({ type: 'yunmu', value: yunmu })
        }
      }

      // 获取示例字符
      keyData.examples = shuangpinStore.getExamplesForKey(key)

      return keyData
    })
  )
})

// 方法
const getKeyClass = (key) => {
  const classes = ['key-item']
  
  // 基础类型
  if (key.shengmu && key.yunmu) {
    classes.push('key-both')
  } else if (key.shengmu) {
    classes.push('key-shengmu')
  } else if (key.yunmu) {
    classes.push('key-yunmu')
  } else {
    classes.push('key-normal')
  }
  
  // 高亮状态
  if (props.highlightedKeys.includes(key.key)) {
    classes.push('key-highlighted')
  }
  
  // 选中状态
  if (selectedKey.value?.key === key.key) {
    classes.push('key-selected')
  }
  
  // 悬停状态
  if (hoveredKey.value?.key === key.key) {
    classes.push('key-hovered')
  }
  
  // 交互模式
  if (props.interactive) {
    classes.push('key-interactive')
  }
  
  return classes
}

const handleKeyClick = (key) => {
  if (!props.interactive) return
  
  selectedKey.value = selectedKey.value?.key === key.key ? null : key
  emit('key-click', key.key)
}

const handleKeyHover = (key) => {
  hoveredKey.value = key
  emit('key-hover', key.key)
}

const handleKeyLeave = (key) => {
  hoveredKey.value = null
}

const toggleLabels = () => {
  showLabels.value = !showLabels.value
}

const toggleHighlight = () => {
  highlightMode.value = !highlightMode.value
}

// 监听器
watch(() => props.showLabels, (newValue) => {
  showLabels.value = newValue
})

// 生命周期
onMounted(() => {
  // 组件挂载完成
})
</script>

<style scoped>
.keyboard-display {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.app--dark .keyboard-display {
  @apply bg-gray-800 border-gray-700;
}

.keyboard-header {
  @apply flex items-center justify-between mb-6;
}

.keyboard-title {
  @apply text-lg font-semibold text-gray-900;
}

.app--dark .keyboard-title {
  @apply text-gray-100;
}

.keyboard-controls {
  @apply flex gap-2;
}

.control-btn {
  @apply px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors;
}

.control-btn.active {
  @apply bg-blue-500 text-white border-blue-500;
}

.app--dark .control-btn {
  @apply border-gray-600 text-gray-300 hover:bg-gray-700;
}

.app--dark .control-btn.active {
  @apply bg-blue-600 border-blue-600;
}

.keyboard-layout {
  @apply space-y-2 mb-6;
}

.keyboard-row {
  @apply flex justify-center gap-1;
}

.keyboard-row-1 {
  @apply ml-0;
}

.keyboard-row-2 {
  @apply ml-4;
}

.keyboard-row-3 {
  @apply ml-8;
}

.key-item {
  @apply relative w-12 h-12 flex flex-col items-center justify-center;
  @apply border border-gray-300 rounded-md transition-all duration-200;
  @apply bg-gray-50 text-gray-900 text-sm font-medium;
}

.key-interactive {
  @apply cursor-pointer hover:shadow-md;
}

.key-normal {
  @apply bg-gray-100 border-gray-300;
}

.key-shengmu {
  @apply bg-blue-50 border-blue-300 text-blue-900;
}

.key-yunmu {
  @apply bg-green-50 border-green-300 text-green-900;
}

.key-both {
  @apply bg-purple-50 border-purple-300 text-purple-900;
}

.key-highlighted {
  @apply ring-2 ring-yellow-400 bg-yellow-100 border-yellow-400;
}

.key-selected {
  @apply ring-2 ring-blue-500 bg-blue-100 border-blue-500;
}

.key-hovered {
  @apply scale-105 shadow-lg;
}

.key-main {
  @apply text-base font-bold;
}

.key-label {
  @apply absolute text-xs font-medium;
}

.key-label-shengmu {
  @apply top-0 left-1 text-blue-600;
}

.key-label-yunmu {
  @apply bottom-0 right-1 text-green-600;
}

.key-labels-multi {
  @apply absolute top-0 left-0 right-0 flex justify-between text-xs;
}

.multi-label {
  @apply px-1 py-0.5 rounded-sm text-xs font-medium;
}

.multi-label-shengmu {
  @apply bg-blue-100 text-blue-700;
}

.multi-label-yunmu {
  @apply bg-green-100 text-green-700;
}

.keyboard-legend {
  @apply flex items-center justify-center gap-6 py-4 border-t border-gray-200;
}

.app--dark .keyboard-legend {
  @apply border-gray-700;
}

.legend-item {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.app--dark .legend-item {
  @apply text-gray-400;
}

.legend-color {
  @apply w-4 h-4 rounded border;
}

.legend-shengmu {
  @apply bg-blue-50 border-blue-300;
}

.legend-yunmu {
  @apply bg-green-50 border-green-300;
}

.legend-both {
  @apply bg-purple-50 border-purple-300;
}

.legend-highlight {
  @apply bg-yellow-100 border-yellow-400;
}

.key-details {
  @apply mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200;
}

.app--dark .key-details {
  @apply bg-gray-700 border-gray-600;
}

.details-title {
  @apply text-base font-semibold text-gray-900 mb-3;
}

.app--dark .details-title {
  @apply text-gray-100;
}

.details-content {
  @apply space-y-2;
}

.detail-item {
  @apply flex items-start gap-2;
}

.detail-label {
  @apply text-sm font-medium text-gray-600 min-w-16;
}

.app--dark .detail-label {
  @apply text-gray-400;
}

.detail-value {
  @apply text-sm text-gray-900 font-medium;
}

.app--dark .detail-value {
  @apply text-gray-100;
}

.examples {
  @apply flex gap-1 flex-wrap;
}

.example-char {
  @apply px-2 py-1 text-sm bg-white rounded border text-gray-900;
}

.app--dark .example-char {
  @apply bg-gray-600 border-gray-500 text-gray-100;
}

/* 暗色主题下的键盘样式 */
.app--dark .key-item {
  @apply bg-gray-700 border-gray-600 text-gray-100;
}

.app--dark .key-normal {
  @apply bg-gray-600 border-gray-500;
}

.app--dark .key-shengmu {
  @apply bg-blue-900/50 border-blue-700 text-blue-200;
}

.app--dark .key-yunmu {
  @apply bg-green-900/50 border-green-700 text-green-200;
}

.app--dark .key-both {
  @apply bg-purple-900/50 border-purple-700 text-purple-200;
}

.app--dark .key-highlighted {
  @apply ring-yellow-500 bg-yellow-900/30 border-yellow-600;
}

.app--dark .key-selected {
  @apply ring-blue-400 bg-blue-900/30 border-blue-600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .keyboard-row-2 {
    @apply ml-2;
  }
  
  .keyboard-row-3 {
    @apply ml-4;
  }
  
  .key-item {
    @apply w-8 h-8 text-xs;
  }
  
  .key-main {
    @apply text-sm;
  }
  
  .keyboard-legend {
    @apply gap-3 text-xs;
  }
  
  .legend-color {
    @apply w-3 h-3;
  }
  
  .keyboard-controls {
    @apply flex-col gap-1;
  }
  
  .control-btn {
    @apply text-xs px-2 py-1;
  }
}
</style>