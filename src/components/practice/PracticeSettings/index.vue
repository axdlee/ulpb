<!-- PracticeSettings 练习设置组件 - 练习相关设置面板 -->
<template>
  <teleport to="body">
    <div class="settings-overlay" @click="handleOverlayClick">
      <div class="settings-modal" @click.stop>
        <!-- 设置头部 -->
        <div class="settings-header">
          <h2 class="settings-title">练习设置</h2>
          <button 
            class="close-button"
            @click="handleClose"
          >
            ✕
          </button>
        </div>

        <!-- 设置内容 -->
        <div class="settings-body">
          <div class="settings-sections">
            <!-- 基础设置 -->
            <div class="settings-section">
              <h3 class="section-title">基础设置</h3>
              <div class="section-content">
                <!-- 练习模式 -->
                <div class="setting-item">
                  <label class="setting-label">练习模式</label>
                  <select v-model="localSettings.practiceMode" class="setting-select">
                    <option value="guided">引导练习</option>
                    <option value="speed">速度测试</option>
                    <option value="accuracy">准确性训练</option>
                    <option value="custom">自定义</option>
                  </select>
                  <p class="setting-description">选择适合的练习模式</p>
                </div>

                <!-- 难度级别 -->
                <div class="setting-item">
                  <label class="setting-label">难度级别</label>
                  <div class="difficulty-options">
                    <button
                      v-for="level in difficultyLevels"
                      :key="level.value"
                      class="difficulty-button"
                      :class="{ 'active': localSettings.difficulty === level.value }"
                      @click="localSettings.difficulty = level.value"
                    >
                      <span class="difficulty-icon">{{ level.icon }}</span>
                      <span class="difficulty-text">{{ level.label }}</span>
                    </button>
                  </div>
                  <p class="setting-description">{{ getDifficultyDescription() }}</p>
                </div>

                <!-- 文本长度 -->
                <div class="setting-item">
                  <label class="setting-label">文本长度</label>
                  <div class="range-input">
                    <input
                      type="range"
                      v-model="localSettings.textLength"
                      :min="textLengthRange.min"
                      :max="textLengthRange.max"
                      :step="textLengthRange.step"
                      class="range-slider"
                    >
                    <div class="range-display">{{ localSettings.textLength }} 字符</div>
                  </div>
                  <p class="setting-description">每次练习的文本字符数量</p>
                </div>

                <!-- 时间限制 -->
                <div class="setting-item">
                  <label class="setting-label">时间限制</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.enableTimeLimit"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">启用时间限制</span>
                  </div>
                  <div v-if="localSettings.enableTimeLimit" class="time-input">
                    <input
                      type="number"
                      v-model="localSettings.timeLimit"
                      :min="30"
                      :max="600"
                      class="number-input"
                    >
                    <span class="input-unit">秒</span>
                  </div>
                  <p class="setting-description">限制每次练习的最长时间</p>
                </div>
              </div>
            </div>

            <!-- 显示设置 -->
            <div class="settings-section">
              <h3 class="section-title">显示设置</h3>
              <div class="section-content">
                <!-- 显示提示 -->
                <div class="setting-item">
                  <label class="setting-label">显示提示</label>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showKeyHints"
                      >
                      <span class="checkbox-text">键位提示</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showFingerHints"
                      >
                      <span class="checkbox-text">指法提示</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showPinyinHints"
                      >
                      <span class="checkbox-text">拼音提示</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showProgressBar"
                      >
                      <span class="checkbox-text">进度条</span>
                    </label>
                  </div>
                </div>

                <!-- 键盘显示 -->
                <div class="setting-item">
                  <label class="setting-label">虚拟键盘</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        value="show"
                        v-model="localSettings.keyboardDisplay"
                      >
                      <span class="radio-text">始终显示</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        value="auto"
                        v-model="localSettings.keyboardDisplay"
                      >
                      <span class="radio-text">自动显示</span>
                    </label>
                    <label class="radio-item">
                      <input 
                        type="radio" 
                        value="hide"
                        v-model="localSettings.keyboardDisplay"
                      >
                      <span class="radio-text">隐藏</span>
                    </label>
                  </div>
                </div>

                <!-- 字体设置 -->
                <div class="setting-item">
                  <label class="setting-label">显示字体</label>
                  <select v-model="localSettings.fontFamily" class="setting-select">
                    <option value="system">系统默认</option>
                    <option value="serif">衬线字体</option>
                    <option value="sans-serif">无衬线字体</option>
                    <option value="monospace">等宽字体</option>
                    <option value="cursive">手写字体</option>
                  </select>
                </div>

                <!-- 字体大小 -->
                <div class="setting-item">
                  <label class="setting-label">字体大小</label>
                  <div class="font-size-options">
                    <button
                      v-for="size in fontSizes"
                      :key="size.value"
                      class="font-size-button"
                      :class="{ 'active': localSettings.fontSize === size.value }"
                      @click="localSettings.fontSize = size.value"
                    >
                      {{ size.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 反馈设置 -->
            <div class="settings-section">
              <h3 class="section-title">反馈设置</h3>
              <div class="section-content">
                <!-- 声音反馈 -->
                <div class="setting-item">
                  <label class="setting-label">声音反馈</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.enableSound"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">启用声音</span>
                  </div>
                  <div v-if="localSettings.enableSound" class="sound-options">
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.soundOnCorrect"
                      >
                      <span class="checkbox-text">正确音效</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.soundOnError"
                      >
                      <span class="checkbox-text">错误音效</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.soundOnComplete"
                      >
                      <span class="checkbox-text">完成音效</span>
                    </label>
                  </div>
                </div>

                <!-- 视觉反馈 -->
                <div class="setting-item">
                  <label class="setting-label">视觉反馈</label>
                  <div class="checkbox-group">
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.highlightErrors"
                      >
                      <span class="checkbox-text">高亮错误</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showKeyAnimation"
                      >
                      <span class="checkbox-text">按键动画</span>
                    </label>
                    <label class="checkbox-item">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.showStreakEffect"
                      >
                      <span class="checkbox-text">连击效果</span>
                    </label>
                  </div>
                </div>

                <!-- 震动反馈（移动端） -->
                <div class="setting-item" v-if="isMobile">
                  <label class="setting-label">震动反馈</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.enableVibration"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">启用震动</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 高级设置 -->
            <div class="settings-section">
              <h3 class="section-title">高级设置</h3>
              <div class="section-content">
                <!-- 智能推荐 -->
                <div class="setting-item">
                  <label class="setting-label">智能推荐</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.enableSmartRecommendation"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">根据表现推荐练习</span>
                  </div>
                </div>

                <!-- 自动保存 -->
                <div class="setting-item">
                  <label class="setting-label">自动保存</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.autoSave"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">自动保存练习进度</span>
                  </div>
                </div>

                <!-- 数据统计 -->
                <div class="setting-item">
                  <label class="setting-label">统计分析</label>
                  <div class="toggle-group">
                    <label class="toggle-switch">
                      <input 
                        type="checkbox" 
                        v-model="localSettings.enableAnalytics"
                      >
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-text">详细统计分析</span>
                  </div>
                </div>

                <!-- 错误记录 -->
                <div class="setting-item">
                  <label class="setting-label">错误记录</label>
                  <select v-model="localSettings.errorRecordMode" class="setting-select">
                    <option value="all">记录所有错误</option>
                    <option value="repeated">仅记录重复错误</option>
                    <option value="severe">仅记录严重错误</option>
                    <option value="none">不记录错误</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置底部 -->
        <div class="settings-footer">
          <div class="footer-actions">
            <button 
              class="action-button secondary"
              @click="handleReset"
            >
              重置设置
            </button>
            <button 
              class="action-button secondary"
              @click="handleExport"
            >
              导出设置
            </button>
            <button 
              class="action-button secondary"
              @click="handleImport"
            >
              导入设置
            </button>
          </div>
          <div class="primary-actions">
            <button 
              class="action-button ghost"
              @click="handleCancel"
            >
              取消
            </button>
            <button 
              class="action-button primary"
              @click="handleSave"
            >
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  initialSettings: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['close', 'save', 'reset', 'export', 'import'])

// 响应式状态
const localSettings = ref({
  // 基础设置
  practiceMode: 'guided',
  difficulty: 'medium',
  textLength: 100,
  enableTimeLimit: false,
  timeLimit: 120,
  
  // 显示设置
  showKeyHints: true,
  showFingerHints: false,
  showPinyinHints: true,
  showProgressBar: true,
  keyboardDisplay: 'auto',
  fontFamily: 'system',
  fontSize: 'medium',
  
  // 反馈设置
  enableSound: true,
  soundOnCorrect: true,
  soundOnError: true,
  soundOnComplete: true,
  highlightErrors: true,
  showKeyAnimation: true,
  showStreakEffect: true,
  enableVibration: false,
  
  // 高级设置
  enableSmartRecommendation: true,
  autoSave: true,
  enableAnalytics: true,
  errorRecordMode: 'all'
})

const isMobile = ref(false)

// 配置选项
const difficultyLevels = [
  { value: 'easy', label: '简单', icon: '🟢' },
  { value: 'medium', label: '中等', icon: '🟡' },
  { value: 'hard', label: '困难', icon: '🔴' },
  { value: 'expert', label: '专家', icon: '🟣' }
]

const textLengthRange = {
  min: 20,
  max: 500,
  step: 10
}

const fontSizes = [
  { value: 'small', label: '小' },
  { value: 'medium', label: '中' },
  { value: 'large', label: '大' },
  { value: 'xl', label: '特大' }
]

// 计算属性
const getDifficultyDescription = () => {
  const descriptions = {
    easy: '适合初学者，较慢的节奏和简单的文本',
    medium: '适合有一定基础的用户，中等难度',
    hard: '适合熟练用户，较快节奏和复杂文本',
    expert: '适合专业用户，最高难度挑战'
  }
  return descriptions[localSettings.value.difficulty] || ''
}

// 方法
const handleOverlayClick = () => {
  handleClose()
}

const handleClose = () => {
  emit('close')
}

const handleCancel = () => {
  // 恢复原始设置
  Object.assign(localSettings.value, props.initialSettings)
  handleClose()
}

const handleSave = () => {
  emit('save', { ...localSettings.value })
  handleClose()
}

const handleReset = () => {
  if (confirm('确定要重置所有设置到默认值吗？')) {
    // 重置到默认值
    localSettings.value = {
      practiceMode: 'guided',
      difficulty: 'medium',
      textLength: 100,
      enableTimeLimit: false,
      timeLimit: 120,
      showKeyHints: true,
      showFingerHints: false,
      showPinyinHints: true,
      showProgressBar: true,
      keyboardDisplay: 'auto',
      fontFamily: 'system',
      fontSize: 'medium',
      enableSound: true,
      soundOnCorrect: true,
      soundOnError: true,
      soundOnComplete: true,
      highlightErrors: true,
      showKeyAnimation: true,
      showStreakEffect: true,
      enableVibration: false,
      enableSmartRecommendation: true,
      autoSave: true,
      enableAnalytics: true,
      errorRecordMode: 'all'
    }
    emit('reset')
  }
}

const handleExport = () => {
  const settings = JSON.stringify(localSettings.value, null, 2)
  const blob = new Blob([settings], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'practice-settings.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  emit('export', localSettings.value)
}

const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          Object.assign(localSettings.value, imported)
          emit('import', imported)
          alert('设置导入成功！')
        } catch (error) {
          alert('设置文件格式错误！')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const detectMobile = () => {
  isMobile.value = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 生命周期
onMounted(() => {
  // 初始化本地设置
  Object.assign(localSettings.value, props.initialSettings)
  detectMobile()
})
</script>

<style scoped>
.settings-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply bg-black bg-opacity-50 backdrop-blur-sm;
  @apply p-4;
}

.settings-modal {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-full;
  @apply flex flex-col;
}

/* 设置头部 */
.settings-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200;
}

.settings-title {
  @apply text-2xl font-bold text-gray-900;
}

.close-button {
  @apply text-gray-400 hover:text-gray-600 text-xl;
  @apply w-8 h-8 flex items-center justify-center rounded-lg;
  @apply hover:bg-gray-100 transition-colors;
}

/* 设置主体 */
.settings-body {
  @apply flex-1 overflow-y-auto p-6;
}

.settings-sections {
  @apply space-y-8;
}

.settings-section {
  @apply space-y-4;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2;
}

.section-content {
  @apply space-y-6;
}

/* 设置项 */
.setting-item {
  @apply space-y-3;
}

.setting-label {
  @apply block text-sm font-medium text-gray-700;
}

.setting-description {
  @apply text-sm text-gray-500;
}

.setting-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

/* 难度选择 */
.difficulty-options {
  @apply flex space-x-3;
}

.difficulty-button {
  @apply flex-1 flex items-center justify-center space-x-2 p-3;
  @apply border border-gray-300 rounded-lg transition-all;
  @apply hover:border-blue-300 hover:bg-blue-50;
}

.difficulty-button.active {
  @apply border-blue-500 bg-blue-50 text-blue-700;
}

.difficulty-icon {
  @apply text-lg;
}

.difficulty-text {
  @apply font-medium;
}

/* 范围输入 */
.range-input {
  @apply space-y-2;
}

.range-slider {
  @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.range-slider::-webkit-slider-thumb {
  @apply appearance-none w-4 h-4 bg-blue-500 rounded-full cursor-pointer;
}

.range-display {
  @apply text-sm font-medium text-gray-700 text-center;
}

/* 切换开关 */
.toggle-group {
  @apply flex items-center space-x-3;
}

.toggle-switch {
  @apply relative inline-block w-11 h-6;
}

.toggle-switch input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0;
  @apply bg-gray-300 rounded-full transition-all;
}

.toggle-slider:before {
  @apply absolute content-[''] h-4 w-4 left-1 bottom-1;
  @apply bg-white rounded-full transition-all;
}

input:checked + .toggle-slider {
  @apply bg-blue-500;
}

input:checked + .toggle-slider:before {
  @apply transform translate-x-5;
}

.toggle-text {
  @apply text-sm font-medium text-gray-700;
}

/* 复选框组 */
.checkbox-group {
  @apply space-y-3;
}

.checkbox-item {
  @apply flex items-center space-x-3 cursor-pointer;
}

.checkbox-item input[type="checkbox"] {
  @apply w-4 h-4 text-blue-600 border-gray-300 rounded;
  @apply focus:ring-blue-500 focus:ring-2;
}

.checkbox-text {
  @apply text-sm font-medium text-gray-700;
}

/* 单选按钮组 */
.radio-group {
  @apply space-y-3;
}

.radio-item {
  @apply flex items-center space-x-3 cursor-pointer;
}

.radio-item input[type="radio"] {
  @apply w-4 h-4 text-blue-600 border-gray-300;
  @apply focus:ring-blue-500 focus:ring-2;
}

.radio-text {
  @apply text-sm font-medium text-gray-700;
}

/* 数字输入 */
.time-input {
  @apply flex items-center space-x-2 mt-3;
}

.number-input {
  @apply w-20 px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.input-unit {
  @apply text-sm text-gray-600;
}

/* 字体大小选择 */
.font-size-options {
  @apply flex space-x-2;
}

.font-size-button {
  @apply px-4 py-2 border border-gray-300 rounded-lg;
  @apply hover:border-blue-300 hover:bg-blue-50 transition-all;
}

.font-size-button.active {
  @apply border-blue-500 bg-blue-50 text-blue-700;
}

/* 声音选项 */
.sound-options {
  @apply mt-3 space-y-2 pl-4 border-l-2 border-gray-200;
}

/* 设置底部 */
.settings-footer {
  @apply flex items-center justify-between p-6 border-t border-gray-200;
}

.footer-actions {
  @apply flex space-x-3;
}

.primary-actions {
  @apply flex space-x-3;
}

.action-button {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.action-button.primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
  @apply focus:ring-blue-500;
}

.action-button.secondary {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  @apply focus:ring-gray-500;
}

.action-button.ghost {
  @apply text-gray-600 hover:text-gray-800 hover:bg-gray-100;
  @apply focus:ring-gray-500;
}

/* 暗色主题 */
[data-theme='dark'] .settings-modal {
  @apply bg-gray-900;
}

[data-theme='dark'] .settings-header {
  @apply border-gray-700;
}

[data-theme='dark'] .settings-title {
  @apply text-gray-100;
}

[data-theme='dark'] .close-button {
  @apply text-gray-500 hover:text-gray-300 hover:bg-gray-800;
}

[data-theme='dark'] .section-title {
  @apply text-gray-200 border-gray-700;
}

[data-theme='dark'] .setting-label {
  @apply text-gray-300;
}

[data-theme='dark'] .setting-description {
  @apply text-gray-500;
}

[data-theme='dark'] .setting-select {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

[data-theme='dark'] .difficulty-button {
  @apply border-gray-600 hover:border-blue-500 hover:bg-blue-900;
}

[data-theme='dark'] .difficulty-button.active {
  @apply border-blue-500 bg-blue-900 text-blue-300;
}

[data-theme='dark'] .toggle-slider {
  @apply bg-gray-600;
}

[data-theme='dark'] .toggle-text,
[data-theme='dark'] .checkbox-text,
[data-theme='dark'] .radio-text {
  @apply text-gray-300;
}

[data-theme='dark'] .number-input {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

[data-theme='dark'] .font-size-button {
  @apply border-gray-600 hover:border-blue-500 hover:bg-blue-900 text-gray-300;
}

[data-theme='dark'] .font-size-button.active {
  @apply border-blue-500 bg-blue-900 text-blue-300;
}

[data-theme='dark'] .sound-options {
  @apply border-gray-700;
}

[data-theme='dark'] .settings-footer {
  @apply border-gray-700;
}

[data-theme='dark'] .action-button.secondary {
  @apply bg-gray-700 text-gray-300 hover:bg-gray-600;
}

[data-theme='dark'] .action-button.ghost {
  @apply text-gray-400 hover:text-gray-200 hover:bg-gray-800;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-modal {
    @apply mx-2 my-4 max-h-screen;
  }
  
  .difficulty-options {
    @apply grid grid-cols-2 gap-2 space-x-0;
  }
  
  .font-size-options {
    @apply grid grid-cols-2 gap-2 space-x-0;
  }
  
  .settings-footer {
    @apply flex-col space-y-4;
  }
  
  .footer-actions,
  .primary-actions {
    @apply w-full justify-center;
  }
}
</style>