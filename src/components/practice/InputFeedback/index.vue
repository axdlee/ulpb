<!-- InputFeedback 输入反馈组件 - 显示输入提示和反馈 -->
<template>
  <div class="input-feedback">
    <!-- 主要反馈区域 -->
    <div class="feedback-main" v-if="feedback">
      <transition name="feedback-slide" mode="out-in">
        <div 
          :key="feedback.id"
          class="feedback-content"
          :class="getFeedbackClasses()"
        >
          <!-- 反馈图标 -->
          <div class="feedback-icon">
            {{ getFeedbackIcon() }}
          </div>

          <!-- 反馈消息 -->
          <div class="feedback-message">
            <div class="feedback-title">{{ feedback.title }}</div>
            <div class="feedback-description" v-if="feedback.description">
              {{ feedback.description }}
            </div>
          </div>

          <!-- 反馈动作 -->
          <div class="feedback-actions" v-if="feedback.actions?.length">
            <button
              v-for="action in feedback.actions"
              :key="action.id"
              class="feedback-action"
              :class="action.type || 'default'"
              @click="handleActionClick(action)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- 输入提示区域 -->
    <div class="hints-section" v-if="showHints">
      <div class="hints-container">
        <!-- 键位提示 -->
        <div class="hint-item key-hint" v-if="currentKeyHint">
          <div class="hint-icon">⌨️</div>
          <div class="hint-content">
            <div class="hint-title">按键提示</div>
            <div class="hint-description">
              按下 <kbd class="hint-key">{{ currentKeyHint.toUpperCase() }}</kbd> 键
            </div>
          </div>
        </div>

        <!-- 指法提示 -->
        <div class="hint-item finger-hint" v-if="currentFingerHint">
          <div class="hint-icon">👆</div>
          <div class="hint-content">
            <div class="hint-title">指法提示</div>
            <div class="hint-description">
              使用{{ getFingerName(currentFingerHint) }}按键
            </div>
          </div>
        </div>

        <!-- 拼音提示 */
        <div class="hint-item pinyin-hint" v-if="currentPinyinHint">
          <div class="hint-icon">🎵</div>
          <div class="hint-content">
            <div class="hint-title">拼音构成</div>
            <div class="hint-description">
              <span class="pinyin-part shengmu">{{ currentPinyinHint.shengmu }}</span>
              <span class="pinyin-separator">+</span>
              <span class="pinyin-part yunmu">{{ currentPinyinHint.yunmu }}</span>
              <span class="pinyin-separator">=</span>
              <span class="pinyin-result">{{ currentPinyinHint.complete }}</span>
            </div>
          </div>
        </div>

        <!-- 进度提示 */
        <div class="hint-item progress-hint" v-if="progressInfo">
          <div class="hint-icon">📊</div>
          <div class="hint-content">
            <div class="hint-title">练习进度</div>
            <div class="hint-description">
              已完成 {{ progressInfo.completed }} / {{ progressInfo.total }} 个字符
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: `${progressInfo.percentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误分析 -->
    <div class="error-analysis" v-if="showErrorAnalysis && errorInfo">
      <div class="analysis-container">
        <div class="analysis-header">
          <h3 class="analysis-title">错误分析</h3>
          <button 
            class="close-analysis"
            @click="closeErrorAnalysis"
          >
            ✕
          </button>
        </div>

        <div class="analysis-content">
          <!-- 错误详情 -->
          <div class="error-details">
            <div class="error-item">
              <span class="error-label">期望输入:</span>
              <kbd class="error-expected">{{ errorInfo.expected }}</kbd>
            </div>
            <div class="error-item">
              <span class="error-label">实际输入:</span>
              <kbd class="error-actual">{{ errorInfo.actual }}</kbd>
            </div>
            <div class="error-item">
              <span class="error-label">错误类型:</span>
              <span class="error-type">{{ getErrorTypeName(errorInfo.type) }}</span>
            </div>
          </div>

          <!-- 改进建议 -->
          <div class="improvement-suggestions">
            <div class="suggestion-title">改进建议:</div>
            <ul class="suggestion-list">
              <li 
                v-for="suggestion in errorInfo.suggestions" 
                :key="suggestion.id"
                class="suggestion-item"
              >
                {{ suggestion.text }}
              </li>
            </ul>
          </div>

          <!-- 练习推荐 -->
          <div class="practice-recommendations" v-if="errorInfo.recommendations?.length">
            <div class="recommendation-title">推荐练习:</div>
            <div class="recommendation-list">
              <button
                v-for="rec in errorInfo.recommendations"
                :key="rec.id"
                class="recommendation-item"
                @click="handleRecommendationClick(rec)"
              >
                <span class="rec-icon">{{ rec.icon }}</span>
                <span class="rec-text">{{ rec.title }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成就通知 -->
    <transition name="achievement">
      <div class="achievement-notification" v-if="achievementInfo">
        <div class="achievement-content">
          <div class="achievement-icon">🏆</div>
          <div class="achievement-info">
            <div class="achievement-title">{{ achievementInfo.title }}</div>
            <div class="achievement-description">{{ achievementInfo.description }}</div>
          </div>
          <button 
            class="achievement-close"
            @click="closeAchievement"
          >
            ✕
          </button>
        </div>
      </div>
    </transition>

    <!-- 快捷操作提示 */
    <div class="shortcut-hints" v-if="showShortcuts">
      <div class="shortcut-container">
        <div class="shortcut-title">快捷键</div>
        <div class="shortcut-list">
          <div class="shortcut-item">
            <kbd>Space</kbd>
            <span>开始/暂停</span>
          </div>
          <div class="shortcut-item">
            <kbd>Esc</kbd>
            <span>退出</span>
          </div>
          <div class="shortcut-item">
            <kbd>Tab</kbd>
            <span>重试</span>
          </div>
          <div class="shortcut-item">
            <kbd>?</kbd>
            <span>帮助</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  feedback: {
    type: Object,
    default: () => null
  },
  showHints: {
    type: Boolean,
    default: true
  },
  currentKeyHint: {
    type: String,
    default: ''
  },
  currentFingerHint: {
    type: String,
    default: ''
  },
  currentPinyinHint: {
    type: Object,
    default: () => null
  },
  progressInfo: {
    type: Object,
    default: () => null
  },
  errorInfo: {
    type: Object,
    default: () => null
  },
  achievementInfo: {
    type: Object,
    default: () => null
  },
  showErrorAnalysis: {
    type: Boolean,
    default: false
  },
  showShortcuts: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['actionClick', 'recommendationClick', 'closeErrorAnalysis', 'closeAchievement'])

// 响应式状态
const isVisible = ref(true)

// 计算属性
const getFeedbackClasses = () => {
  if (!props.feedback) return ''
  
  return {
    'feedback-content--success': props.feedback.type === 'success',
    'feedback-content--error': props.feedback.type === 'error',
    'feedback-content--warning': props.feedback.type === 'warning',
    'feedback-content--info': props.feedback.type === 'info',
    'feedback-content--tip': props.feedback.type === 'tip'
  }
}

// 方法
const getFeedbackIcon = () => {
  if (!props.feedback) return ''
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    tip: '💡',
    correct: '🎉',
    incorrect: '😞',
    progress: '📈',
    achievement: '🏆'
  }
  
  return icons[props.feedback.type] || 'ℹ️'
}

const getFingerName = (fingerCode) => {
  const fingerNames = {
    'L1': '左手拇指',
    'L2': '左手食指',
    'L3': '左手中指',
    'L4': '左手无名指',
    'L5': '左手小指',
    'R1': '右手拇指',
    'R2': '右手食指',
    'R3': '右手中指',
    'R4': '右手无名指',
    'R5': '右手小指'
  }
  
  return fingerNames[fingerCode] || '对应手指'
}

const getErrorTypeName = (errorType) => {
  const errorTypes = {
    'wrong_key': '按错键位',
    'wrong_finger': '手指位置错误',
    'timing': '节奏问题',
    'sequence': '顺序错误',
    'missed': '漏键',
    'extra': '多余按键'
  }
  
  return errorTypes[errorType] || '未知错误'
}

const handleActionClick = (action) => {
  emit('actionClick', action)
}

const handleRecommendationClick = (recommendation) => {
  emit('recommendationClick', recommendation)
}

const closeErrorAnalysis = () => {
  emit('closeErrorAnalysis')
}

const closeAchievement = () => {
  emit('closeAchievement')
}

// 自动消失逻辑
const startAutoHide = (duration = 3000) => {
  setTimeout(() => {
    if (props.feedback?.autoHide !== false) {
      isVisible.value = false
    }
  }, duration)
}

// 暴露方法
defineExpose({
  startAutoHide
})
</script>

<style scoped>
.input-feedback {
  @apply space-y-4;
}

/* 主要反馈区域 */
.feedback-main {
  @apply relative;
}

.feedback-content {
  @apply flex items-center space-x-4 p-4 rounded-lg;
  @apply transition-all duration-300;
}

.feedback-content--success {
  @apply bg-green-100 border border-green-200 text-green-800;
}

.feedback-content--error {
  @apply bg-red-100 border border-red-200 text-red-800;
}

.feedback-content--warning {
  @apply bg-yellow-100 border border-yellow-200 text-yellow-800;
}

.feedback-content--info {
  @apply bg-blue-100 border border-blue-200 text-blue-800;
}

.feedback-content--tip {
  @apply bg-purple-100 border border-purple-200 text-purple-800;
}

.feedback-icon {
  @apply text-2xl flex-shrink-0;
}

.feedback-message {
  @apply flex-1 space-y-1;
}

.feedback-title {
  @apply font-semibold;
}

.feedback-description {
  @apply text-sm opacity-90;
}

.feedback-actions {
  @apply flex space-x-2;
}

.feedback-action {
  @apply px-3 py-1 text-sm font-medium rounded;
  @apply transition-colors duration-200;
}

.feedback-action.default {
  @apply bg-white bg-opacity-50 hover:bg-opacity-70;
}

.feedback-action.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

/* 提示区域 */
.hints-section {
  @apply bg-gray-50 rounded-lg p-4;
}

.hints-container {
  @apply space-y-3;
}

.hint-item {
  @apply flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm;
}

.hint-icon {
  @apply text-lg flex-shrink-0 mt-0.5;
}

.hint-content {
  @apply flex-1 space-y-1;
}

.hint-title {
  @apply font-medium text-gray-900;
}

.hint-description {
  @apply text-sm text-gray-600;
}

.hint-key {
  @apply inline-flex items-center px-2 py-1 bg-gray-200 text-gray-900;
  @apply text-xs font-mono rounded;
}

.key-hint {
  @apply border-l-4 border-blue-500;
}

.finger-hint {
  @apply border-l-4 border-green-500;
}

.pinyin-hint {
  @apply border-l-4 border-purple-500;
}

.progress-hint {
  @apply border-l-4 border-yellow-500;
}

.pinyin-part {
  @apply font-mono font-medium;
}

.pinyin-part.shengmu {
  @apply text-blue-600;
}

.pinyin-part.yunmu {
  @apply text-green-600;
}

.pinyin-separator {
  @apply mx-1 text-gray-400;
}

.pinyin-result {
  @apply font-mono font-bold text-purple-600;
}

.progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full mt-2;
}

.progress-fill {
  @apply h-full bg-yellow-500 rounded-full transition-all duration-500;
}

/* 错误分析 */
.error-analysis {
  @apply bg-red-50 border border-red-200 rounded-lg p-4;
}

.analysis-container {
  @apply space-y-4;
}

.analysis-header {
  @apply flex items-center justify-between;
}

.analysis-title {
  @apply text-lg font-semibold text-red-800;
}

.close-analysis {
  @apply text-red-500 hover:text-red-700 text-lg;
}

.analysis-content {
  @apply space-y-4;
}

.error-details {
  @apply space-y-2;
}

.error-item {
  @apply flex items-center space-x-3;
}

.error-label {
  @apply text-sm font-medium text-red-700 min-w-20;
}

.error-expected {
  @apply px-2 py-1 bg-green-200 text-green-800 text-sm font-mono rounded;
}

.error-actual {
  @apply px-2 py-1 bg-red-200 text-red-800 text-sm font-mono rounded;
}

.error-type {
  @apply text-sm text-red-600 font-medium;
}

.improvement-suggestions {
  @apply space-y-2;
}

.suggestion-title {
  @apply font-medium text-red-800;
}

.suggestion-list {
  @apply list-disc list-inside space-y-1 text-sm text-red-700;
}

.suggestion-item {
  @apply ml-2;
}

.practice-recommendations {
  @apply space-y-2;
}

.recommendation-title {
  @apply font-medium text-red-800;
}

.recommendation-list {
  @apply flex flex-wrap gap-2;
}

.recommendation-item {
  @apply flex items-center space-x-2 px-3 py-2;
  @apply bg-red-200 hover:bg-red-300 text-red-800;
  @apply rounded-lg text-sm transition-colors;
}

.rec-icon {
  @apply text-base;
}

/* 成就通知 */
.achievement-notification {
  @apply fixed top-4 right-4 z-50;
  @apply bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg;
  @apply max-w-sm;
}

.achievement-content {
  @apply flex items-center space-x-3 p-4;
}

.achievement-icon {
  @apply text-2xl;
}

.achievement-info {
  @apply flex-1 space-y-1;
}

.achievement-title {
  @apply font-semibold text-yellow-800;
}

.achievement-description {
  @apply text-sm text-yellow-700;
}

.achievement-close {
  @apply text-yellow-500 hover:text-yellow-700;
}

/* 快捷键提示 */
.shortcut-hints {
  @apply bg-gray-100 rounded-lg p-3;
}

.shortcut-container {
  @apply space-y-2;
}

.shortcut-title {
  @apply text-sm font-medium text-gray-700;
}

.shortcut-list {
  @apply grid grid-cols-2 gap-2;
}

.shortcut-item {
  @apply flex items-center space-x-2 text-sm text-gray-600;
}

.shortcut-item kbd {
  @apply px-1.5 py-0.5 bg-gray-200 text-gray-800 text-xs font-mono rounded;
}

/* 动画 */
.feedback-slide-enter-active,
.feedback-slide-leave-active {
  @apply transition-all duration-300;
}

.feedback-slide-enter-from {
  @apply opacity-0 transform translate-y-4;
}

.feedback-slide-leave-to {
  @apply opacity-0 transform -translate-y-4;
}

.achievement-enter-active,
.achievement-leave-active {
  @apply transition-all duration-500;
}

.achievement-enter-from {
  @apply opacity-0 transform translate-x-full;
}

.achievement-leave-to {
  @apply opacity-0 transform translate-x-full;
}

/* 暗色主题 */
[data-theme='dark'] .hints-section {
  @apply bg-gray-800;
}

[data-theme='dark'] .hint-item {
  @apply bg-gray-700 text-gray-300;
}

[data-theme='dark'] .hint-title {
  @apply text-gray-200;
}

[data-theme='dark'] .hint-description {
  @apply text-gray-400;
}

[data-theme='dark'] .hint-key {
  @apply bg-gray-600 text-gray-200;
}

[data-theme='dark'] .progress-bar {
  @apply bg-gray-600;
}

[data-theme='dark'] .error-analysis {
  @apply bg-gray-800 border-gray-700;
}

[data-theme='dark'] .analysis-title {
  @apply text-red-400;
}

[data-theme='dark'] .close-analysis {
  @apply text-red-400;
}

[data-theme='dark'] .error-label {
  @apply text-red-400;
}

[data-theme='dark'] .shortcut-hints {
  @apply bg-gray-800;
}

[data-theme='dark'] .shortcut-title {
  @apply text-gray-300;
}

[data-theme='dark'] .shortcut-item {
  @apply text-gray-400;
}

[data-theme='dark'] .shortcut-item kbd {
  @apply bg-gray-700 text-gray-300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feedback-content {
    @apply flex-col space-y-3 space-x-0 text-center;
  }
  
  .feedback-actions {
    @apply w-full justify-center;
  }
  
  .hint-item {
    @apply flex-col space-y-2 space-x-0 text-center;
  }
  
  .achievement-notification {
    @apply left-4 right-4 max-w-none;
  }
  
  .shortcut-list {
    @apply grid-cols-1;
  }
}
</style>