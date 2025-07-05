<!-- CharacterDisplay 字符显示组件 - 显示当前练习字符和拼音 -->
<template>
  <div class="character-display">
    <div class="display-container">
      <!-- 当前字符大显示 -->
      <div class="character-section">
        <div class="character-main" :class="characterClasses">
          {{ character || '准备' }}
        </div>
        <div class="character-info">
          <div class="character-unicode" v-if="character">
            Unicode: {{ getCharacterUnicode(character) }}
          </div>
          <div class="character-meaning" v-if="characterMeaning">
            {{ characterMeaning }}
          </div>
        </div>
      </div>

      <!-- 拼音分解显示 -->
      <div class="pinyin-section" v-if="pinyin">
        <div class="pinyin-breakdown">
          <!-- 声母 -->
          <div class="pinyin-part pinyin-shengmu">
            <div class="pinyin-label">声母</div>
            <div class="pinyin-value" :class="shengmuClasses">
              {{ pinyin.shengmu?.toUpperCase() || '-' }}
            </div>
            <div class="pinyin-key" v-if="pinyin.shengmuKey">
              按键: {{ pinyin.shengmuKey.toUpperCase() }}
            </div>
          </div>

          <!-- 连接符 -->
          <div class="pinyin-connector">+</div>

          <!-- 韵母 -->
          <div class="pinyin-part pinyin-yunmu">
            <div class="pinyin-label">韵母</div>
            <div class="pinyin-value" :class="yunmuClasses">
              {{ pinyin.yunmu?.toUpperCase() || '-' }}
            </div>
            <div class="pinyin-key" v-if="pinyin.yunmuKey">
              按键: {{ pinyin.yunmuKey.toUpperCase() }}
            </div>
          </div>

          <!-- 声调 -->
          <div class="pinyin-part pinyin-tone" v-if="pinyin.tone">
            <div class="pinyin-label">声调</div>
            <div class="pinyin-value">
              {{ getToneSymbol(pinyin.tone) }}
            </div>
            <div class="tone-number">{{ pinyin.tone }}声</div>
          </div>
        </div>

        <!-- 完整拼音显示 -->
        <div class="complete-pinyin">
          <div class="complete-label">完整拼音</div>
          <div class="complete-value">
            {{ getCompletePinyin() }}
          </div>
        </div>
      </div>

      <!-- 输入状态指示器 -->
      <div class="input-status" :class="statusClasses">
        <div class="status-icon">{{ getStatusIcon() }}</div>
        <div class="status-text">{{ getStatusText() }}</div>
      </div>

      <!-- 进度指示 -->
      <div class="progress-indicator" v-if="showProgress">
        <div class="progress-dots">
          <div 
            v-for="(step, index) in progressSteps" 
            :key="index"
            class="progress-dot"
            :class="getProgressDotClass(index)"
          >
            {{ step.icon }}
          </div>
        </div>
        <div class="progress-text">{{ getProgressText() }}</div>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="character-history" v-if="showHistory && recentCharacters.length">
      <div class="history-label">最近练习</div>
      <div class="history-items">
        <div 
          v-for="(historyChar, index) in recentCharacters" 
          :key="index"
          class="history-item"
          :class="{ 'history-item--error': historyChar.hasError }"
        >
          {{ historyChar.char }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Props
const props = defineProps({
  character: {
    type: String,
    default: ''
  },
  pinyin: {
    type: Object,
    default: () => null
  },
  state: {
    type: String,
    default: 'waiting', // waiting, input, correct, error, completed
    validator: (value) => ['waiting', 'input', 'correct', 'error', 'completed'].includes(value)
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  showHistory: {
    type: Boolean,
    default: true
  },
  currentStep: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 1
  },
  recentCharacters: {
    type: Array,
    default: () => []
  }
})

// 响应式状态
const characterMeaning = ref('')

// 计算属性
const characterClasses = computed(() => ({
  'character-main--waiting': props.state === 'waiting',
  'character-main--input': props.state === 'input',
  'character-main--correct': props.state === 'correct',
  'character-main--error': props.state === 'error',
  'character-main--completed': props.state === 'completed'
}))

const shengmuClasses = computed(() => ({
  'pinyin-value--waiting': props.state === 'waiting',
  'pinyin-value--current': props.state === 'input' && getCurrentInputStep() === 'shengmu',
  'pinyin-value--completed': props.state === 'correct' || (props.state === 'input' && getCurrentInputStep() !== 'shengmu')
}))

const yunmuClasses = computed(() => ({
  'pinyin-value--waiting': props.state === 'waiting' || (props.state === 'input' && getCurrentInputStep() === 'shengmu'),
  'pinyin-value--current': props.state === 'input' && getCurrentInputStep() === 'yunmu',
  'pinyin-value--completed': props.state === 'correct'
}))

const statusClasses = computed(() => ({
  'input-status--waiting': props.state === 'waiting',
  'input-status--input': props.state === 'input',
  'input-status--correct': props.state === 'correct',
  'input-status--error': props.state === 'error',
  'input-status--completed': props.state === 'completed'
}))

const progressSteps = computed(() => [
  { icon: '👀', label: '观察' },
  { icon: '🎯', label: '声母' },
  { icon: '🎵', label: '韵母' },
  { icon: '✅', label: '完成' }
])

// 方法
const getCharacterUnicode = (char) => {
  return `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`
}

const getToneSymbol = (tone) => {
  const toneSymbols = {
    1: '¯',
    2: '´',
    3: 'ˇ',
    4: '`',
    5: '·'
  }
  return toneSymbols[tone] || ''
}

const getCompletePinyin = () => {
  if (!props.pinyin) return ''
  
  const { shengmu, yunmu, tone } = props.pinyin
  let pinyin = (shengmu || '') + (yunmu || '')
  
  if (tone && tone !== 5) {
    const toneMarks = {
      'a': ['a', 'á', 'ǎ', 'à'],
      'o': ['o', 'ó', 'ǒ', 'ò'],
      'e': ['e', 'é', 'ě', 'è'],
      'i': ['i', 'í', 'ǐ', 'ì'],
      'u': ['u', 'ú', 'ǔ', 'ù'],
      'ü': ['ü', 'ǘ', 'ǚ', 'ǜ']
    }
    
    // 简化版声调标记，实际应用中需要更复杂的逻辑
    for (const [vowel, marks] of Object.entries(toneMarks)) {
      if (pinyin.includes(vowel)) {
        pinyin = pinyin.replace(vowel, marks[tone - 1])
        break
      }
    }
  }
  
  return pinyin
}

const getCurrentInputStep = () => {
  // 这里应该从store或props获取当前输入步骤
  if (props.state === 'input') {
    // 简化逻辑，实际应该根据用户输入进度判断
    return 'shengmu' // 或 'yunmu'
  }
  return null
}

const getStatusIcon = () => {
  const icons = {
    waiting: '⏳',
    input: '✍️',
    correct: '✅',
    error: '❌',
    completed: '🎉'
  }
  return icons[props.state] || '⏳'
}

const getStatusText = () => {
  const texts = {
    waiting: '准备开始',
    input: '正在输入...',
    correct: '输入正确！',
    error: '输入错误，请重试',
    completed: '练习完成！'
  }
  return texts[props.state] || '等待中'
}

const getProgressDotClass = (index) => {
  const currentProgressStep = Math.min(Math.floor((props.currentStep / props.totalSteps) * progressSteps.value.length), progressSteps.value.length - 1)
  
  return {
    'progress-dot--completed': index < currentProgressStep,
    'progress-dot--current': index === currentProgressStep,
    'progress-dot--upcoming': index > currentProgressStep
  }
}

const getProgressText = () => {
  const percentage = Math.round((props.currentStep / props.totalSteps) * 100)
  return `${props.currentStep}/${props.totalSteps} (${percentage}%)`
}

// 查找字符含义（可以连接词典API）
const lookupCharacterMeaning = async (char) => {
  // 这里可以实现字典查询功能
  // 暂时返回空，实际项目中可以连接在线词典
  return ''
}

// 监听字符变化
const updateCharacterInfo = async () => {
  if (props.character) {
    characterMeaning.value = await lookupCharacterMeaning(props.character)
  }
}

// 生命周期处理
const onCharacterChange = () => {
  updateCharacterInfo()
}

// 暴露方法给父组件
defineExpose({
  onCharacterChange
})
</script>

<style scoped>
.character-display {
  @apply text-center space-y-8;
}

.display-container {
  @apply space-y-6;
}

/* 字符主显示 */
.character-section {
  @apply space-y-4;
}

.character-main {
  @apply text-8xl font-bold transition-all duration-500;
  @apply text-gray-400;
}

.character-main--waiting {
  @apply text-gray-400 scale-90;
}

.character-main--input {
  @apply text-blue-600 scale-100;
  animation: pulse-subtle 2s infinite;
}

.character-main--correct {
  @apply text-green-600 scale-110;
  animation: success-bounce 0.6s ease-out;
}

.character-main--error {
  @apply text-red-600 scale-95;
  animation: error-shake 0.6s ease-out;
}

.character-main--completed {
  @apply text-purple-600 scale-105;
}

.character-info {
  @apply space-y-2 text-sm text-gray-600;
}

.character-unicode {
  @apply font-mono;
}

.character-meaning {
  @apply font-medium text-gray-700;
}

/* 拼音分解 */
.pinyin-section {
  @apply space-y-6;
}

.pinyin-breakdown {
  @apply flex items-center justify-center space-x-8;
}

.pinyin-part {
  @apply text-center space-y-2;
}

.pinyin-label {
  @apply text-sm font-medium text-gray-600;
}

.pinyin-value {
  @apply text-4xl font-bold transition-all duration-300;
  @apply text-gray-300;
}

.pinyin-value--waiting {
  @apply text-gray-300;
}

.pinyin-value--current {
  @apply text-blue-600 scale-110;
  animation: highlight-pulse 1.5s infinite;
}

.pinyin-value--completed {
  @apply text-green-600;
}

.pinyin-key {
  @apply text-xs text-gray-500 font-mono;
}

.pinyin-connector {
  @apply text-2xl font-bold text-gray-400;
}

.pinyin-shengmu .pinyin-value {
  @apply text-blue-600;
}

.pinyin-yunmu .pinyin-value {
  @apply text-green-600;
}

.pinyin-tone .pinyin-value {
  @apply text-purple-600 text-3xl;
}

.tone-number {
  @apply text-xs text-purple-500;
}

.complete-pinyin {
  @apply bg-gray-50 rounded-lg p-4 space-y-2;
}

.complete-label {
  @apply text-sm font-medium text-gray-600;
}

.complete-value {
  @apply text-2xl font-bold text-gray-900;
}

/* 状态指示器 */
.input-status {
  @apply flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-300;
}

.input-status--waiting {
  @apply bg-gray-100 text-gray-600;
}

.input-status--input {
  @apply bg-blue-100 text-blue-700;
}

.input-status--correct {
  @apply bg-green-100 text-green-700;
}

.input-status--error {
  @apply bg-red-100 text-red-700;
}

.input-status--completed {
  @apply bg-purple-100 text-purple-700;
}

.status-icon {
  @apply text-2xl;
}

.status-text {
  @apply font-medium;
}

/* 进度指示器 */
.progress-indicator {
  @apply space-y-3;
}

.progress-dots {
  @apply flex items-center justify-center space-x-4;
}

.progress-dot {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300;
  @apply bg-gray-200 text-gray-400;
}

.progress-dot--completed {
  @apply bg-green-100 text-green-600 scale-90;
}

.progress-dot--current {
  @apply bg-blue-100 text-blue-600 scale-110 ring-4 ring-blue-200;
  animation: current-pulse 2s infinite;
}

.progress-dot--upcoming {
  @apply bg-gray-100 text-gray-400 scale-75;
}

.progress-text {
  @apply text-sm font-medium text-gray-600;
}

/* 历史记录 */
.character-history {
  @apply bg-gray-50 rounded-lg p-4 space-y-3;
}

.history-label {
  @apply text-sm font-medium text-gray-600;
}

.history-items {
  @apply flex flex-wrap gap-2 justify-center;
}

.history-item {
  @apply w-10 h-10 bg-white rounded-lg flex items-center justify-center;
  @apply text-lg font-medium text-gray-700 border-2 border-green-200;
}

.history-item--error {
  @apply border-red-200 text-red-600;
}

/* 动画 */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes success-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1.1); }
}

@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes highlight-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}

@keyframes current-pulse {
  0%, 100% { transform: scale(1.1); }
  50% { transform: scale(1.15); }
}

/* 暗色主题 */
[data-theme='dark'] .character-main {
  @apply text-gray-500;
}

[data-theme='dark'] .character-main--waiting {
  @apply text-gray-500;
}

[data-theme='dark'] .character-info {
  @apply text-gray-400;
}

[data-theme='dark'] .character-meaning {
  @apply text-gray-300;
}

[data-theme='dark'] .pinyin-label {
  @apply text-gray-400;
}

[data-theme='dark'] .pinyin-value--waiting {
  @apply text-gray-600;
}

[data-theme='dark'] .pinyin-connector {
  @apply text-gray-500;
}

[data-theme='dark'] .complete-pinyin {
  @apply bg-gray-800;
}

[data-theme='dark'] .complete-label {
  @apply text-gray-400;
}

[data-theme='dark'] .complete-value {
  @apply text-gray-100;
}

[data-theme='dark'] .progress-dot {
  @apply bg-gray-700 text-gray-500;
}

[data-theme='dark'] .progress-dot--upcoming {
  @apply bg-gray-800 text-gray-600;
}

[data-theme='dark'] .character-history {
  @apply bg-gray-800;
}

[data-theme='dark'] .history-label {
  @apply text-gray-400;
}

[data-theme='dark'] .history-item {
  @apply bg-gray-700 text-gray-300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .character-main {
    @apply text-6xl;
  }
  
  .pinyin-breakdown {
    @apply flex-col space-y-4 space-x-0;
  }
  
  .pinyin-connector {
    @apply hidden;
  }
  
  .pinyin-value {
    @apply text-3xl;
  }
  
  .progress-dots {
    @apply space-x-2;
  }
  
  .progress-dot {
    @apply w-10 h-10 text-lg;
  }
}
</style>