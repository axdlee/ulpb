<!-- Practice 打字练习 - 现代化练习界面 -->
<template>
  <div class="practice">
    <!-- 练习头部信息 -->
    <div class="practice-header">
      <div class="container">
        <div class="header-content">
          <!-- 练习信息 -->
          <div class="practice-info">
            <div class="lesson-breadcrumb">
              <router-link to="/practice" class="breadcrumb-link">练习中心</router-link>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">{{ currentLesson?.title || '自由练习' }}</span>
            </div>
            <h1 class="practice-title">{{ getPracticeTitle() }}</h1>
            <p class="practice-description">{{ getPracticeDescription() }}</p>
          </div>

          <!-- 实时统计 -->
          <div class="stats-panel">
            <div class="stat-item">
              <div class="stat-icon">⚡</div>
              <div class="stat-content">
                <div class="stat-value">{{ practiceStore.currentStats.speed || 0 }}</div>
                <div class="stat-label">字/分钟</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <div class="stat-value">{{ practiceStore.currentStats.accuracy || 100 }}%</div>
                <div class="stat-label">准确率</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <div class="stat-value">{{ formatTime(practiceStore.currentStats.duration || 0) }}</div>
                <div class="stat-label">用时</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">{{ practiceStore.currentStats.progress || 0 }}%</div>
                <div class="stat-label">完成度</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主练习区域 -->
    <div class="practice-main">
      <div class="container">
        <div class="practice-content">
          <!-- 练习模式选择 -->
          <Card class="mode-selector-card" v-if="!practiceStore.isActive">
            <template #header>
              <h2 class="card-title">选择练习模式</h2>
            </template>
            
            <div class="mode-grid">
              <div 
                v-for="mode in practiceMode" 
                :key="mode.id"
                class="mode-card"
                :class="{ 'mode-card--selected': selectedMode === mode.id }"
                @click="selectMode(mode.id)"
              >
                <div class="mode-icon">{{ mode.icon }}</div>
                <div class="mode-content">
                  <h3 class="mode-title">{{ mode.title }}</h3>
                  <p class="mode-description">{{ mode.description }}</p>
                  <div class="mode-features">
                    <span 
                      v-for="feature in mode.features"
                      :key="feature"
                      class="mode-feature"
                    >
                      {{ feature }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mode-actions">
              <Button
                variant="solid"
                size="lg"
                @click="startPractice"
                :disabled="!selectedMode"
                class="start-button"
              >
                <span class="start-icon">🚀</span>
                开始练习
              </Button>
            </div>
          </Card>

          <!-- 练习进行中界面 -->
          <div class="practice-active" v-else>
            <!-- 当前练习进度 -->
            <Card class="progress-card">
              <div class="progress-content">
                <div class="progress-info">
                  <div class="progress-text">
                    <span class="progress-current">{{ practiceStore.currentIndex + 1 }}</span>
                    <span class="progress-separator">/</span>
                    <span class="progress-total">{{ practiceStore.totalChars }}</span>
                  </div>
                  <div class="progress-percentage">{{ practiceStore.currentStats.progress }}%</div>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: `${practiceStore.currentStats.progress}%` }"
                  ></div>
                </div>
              </div>
            </Card>

            <!-- 主要练习区域 -->
            <div class="typing-area">
              <!-- 当前字符显示 -->
              <CharacterDisplay 
                :character="practiceStore.currentCharacter"
                :pinyin="practiceStore.currentPinyin"
                :state="practiceStore.inputState"
              />

              <!-- 虚拟键盘 -->
              <VirtualKeyboard 
                :scheme="shuangpinStore.currentScheme"
                :highlighted-keys="practiceStore.targetKeys"
                :pressed-keys="practiceStore.pressedKeys"
                :error-keys="practiceStore.errorKeys"
                @key-press="handleVirtualKeyPress"
              />

              <!-- 输入提示 -->
              <InputFeedback 
                :feedback="practiceStore.inputFeedback"
                :show-hints="showHints"
              />
            </div>

            <!-- 练习控制 -->
            <div class="practice-controls">
              <div class="control-left">
                <Button
                  variant="ghost"
                  @click="toggleHints"
                  :class="{ 'active': showHints }"
                >
                  💡 提示
                </Button>
                <Button
                  variant="ghost"
                  @click="pausePractice"
                  v-if="!practiceStore.isPaused"
                >
                  ⏸️ 暂停
                </Button>
                <Button
                  variant="ghost"
                  @click="resumePractice"
                  v-else
                >
                  ▶️ 继续
                </Button>
              </div>

              <div class="control-right">
                <Button
                  variant="outline"
                  @click="restartPractice"
                >
                  🔄 重新开始
                </Button>
                <Button
                  variant="ghost"
                  @click="exitPractice"
                >
                  ❌ 退出练习
                </Button>
              </div>
            </div>
          </div>

          <!-- 练习完成界面 -->
          <transition name="completion">
            <CompletionModal 
              v-if="practiceStore.isCompleted"
              :results="practiceStore.sessionResults"
              @restart="restartPractice"
              @exit="exitPractice"
              @continue="continueToNext"
            />
          </transition>
        </div>
      </div>
    </div>

    <!-- 练习历史侧边栏 -->
    <transition name="sidebar">
      <div class="practice-sidebar" v-if="showSidebar">
        <div class="sidebar-content">
          <div class="sidebar-header">
            <h3 class="sidebar-title">练习历史</h3>
            <Button
              variant="ghost"
              size="sm"
              @click="closeSidebar"
            >
              ✕
            </Button>
          </div>

          <div class="sidebar-body">
            <div 
              v-for="record in practiceStore.recentSessions"
              :key="record.id"
              class="history-item"
            >
              <div class="history-info">
                <div class="history-title">{{ record.lessonTitle }}</div>
                <div class="history-stats">
                  <span class="history-speed">{{ record.speed }} 字/分</span>
                  <span class="history-accuracy">{{ record.accuracy }}%</span>
                </div>
              </div>
              <div class="history-time">{{ formatRelativeTime(record.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 设置面板 -->
    <PracticeSettings 
      v-if="showSettings"
      @close="closeSettings"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useShuangpinStore } from '@/stores/shuangpin'
import { usePracticeStore } from '@/stores/practice'

// 组件导入
import Card from '@/components/base/Card/index.vue'
import Button from '@/components/base/Button/index.vue'
import CharacterDisplay from '@/components/practice/CharacterDisplay/index.vue'
import VirtualKeyboard from '@/components/practice/VirtualKeyboard/index.vue'
import InputFeedback from '@/components/practice/InputFeedback/index.vue'
import CompletionModal from '@/components/practice/CompletionModal/index.vue'
import PracticeSettings from '@/components/practice/PracticeSettings/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()

// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const selectedMode = ref('guided')
const showHints = ref(true)
const showSidebar = ref(false)
const showSettings = ref(false)
const currentLesson = ref(null)

// 练习模式配置
const practiceMode = ref([
  {
    id: 'guided',
    title: '引导练习',
    description: '系统引导，逐步练习双拼键位',
    icon: '🎯',
    features: ['实时提示', '错误纠正', '进度跟踪']
  },
  {
    id: 'speed',
    title: '速度测试',
    description: '测试打字速度和准确率',
    icon: '⚡',
    features: ['时间限制', '速度统计', '排行榜']
  },
  {
    id: 'custom',
    title: '自定义练习',
    description: '自定义练习内容和难度',
    icon: '⚙️',
    features: ['自选文本', '难度调节', '个性化']
  },
  {
    id: 'game',
    title: '趣味模式',
    description: '游戏化练习，寓教于乐',
    icon: '🎮',
    features: ['游戏机制', '成就系统', '趣味挑战']
  }
])

// 计算属性
const practiceTitle = computed(() => {
  const modeMap = {
    guided: '引导练习',
    speed: '速度测试', 
    custom: '自定义练习',
    game: '趣味模式'
  }
  return modeMap[selectedMode.value] || '打字练习'
})

// 方法
const getPracticeTitle = () => {
  if (currentLesson.value) {
    return currentLesson.value.title
  }
  return practiceTitle.value
}

const getPracticeDescription = () => {
  if (currentLesson.value) {
    return currentLesson.value.description
  }
  
  const modeDescriptions = {
    guided: '跟随系统指导，逐步掌握双拼输入法',
    speed: '测试您的打字速度和准确率表现',
    custom: '使用自定义内容进行针对性练习',
    game: '在游戏中提升双拼输入技能'
  }
  return modeDescriptions[selectedMode.value] || '提升您的双拼输入技能'
}

const selectMode = (modeId) => {
  selectedMode.value = modeId
}

const startPractice = async () => {
  try {
    appStore.setLoading(true, '正在准备练习...')
    
    const practiceConfig = {
      mode: selectedMode.value,
      lesson: currentLesson.value,
      scheme: shuangpinStore.currentScheme,
      settings: {
        showHints: showHints.value,
        enableSound: appStore.settings.enableSound,
        difficulty: appStore.settings.difficulty
      }
    }

    await practiceStore.startPractice(practiceConfig)
    
    appStore.addNotification({
      type: 'success',
      message: '练习已开始，加油！',
      duration: 2000
    })
  } catch (error) {
    appStore.addNotification({
      type: 'error',
      message: '练习启动失败，请重试',
      duration: 3000
    })
  } finally {
    appStore.setLoading(false)
  }
}

const pausePractice = () => {
  practiceStore.pausePractice()
  appStore.addNotification({
    type: 'info',
    message: '练习已暂停',
    duration: 2000
  })
}

const resumePractice = () => {
  practiceStore.resumePractice()
  appStore.addNotification({
    type: 'success',
    message: '练习已恢复',
    duration: 2000
  })
}

const restartPractice = () => {
  practiceStore.restartPractice()
  appStore.addNotification({
    type: 'info',
    message: '练习已重新开始',
    duration: 2000
  })
}

const exitPractice = () => {
  practiceStore.exitPractice()
  
  // 根据来源决定返回页面
  if (route.query.from === 'dashboard') {
    router.push('/')
  } else if (route.query.from === 'learning') {
    router.push('/learning')
  } else {
    router.push('/practice')
  }
}

const continueToNext = () => {
  // 继续下一个课程或推荐练习
  if (currentLesson.value?.nextLessonId) {
    router.push(`/practice/${currentLesson.value.nextLessonId}`)
  } else {
    // 显示推荐练习
    router.push('/practice')
  }
}

const toggleHints = () => {
  showHints.value = !showHints.value
  practiceStore.updateSettings({ showHints: showHints.value })
}

const openSidebar = () => {
  showSidebar.value = true
}

const closeSidebar = () => {
  showSidebar.value = false
}

const openSettings = () => {
  showSettings.value = true
}

const closeSettings = () => {
  showSettings.value = false
}

const handleVirtualKeyPress = (key) => {
  practiceStore.processKeyInput(key)
}

const handleKeydown = (event) => {
  // 全局键盘事件处理
  if (!practiceStore.isActive) return
  
  // 防止默认行为
  event.preventDefault()
  
  // 处理特殊键
  if (event.key === 'Escape') {
    if (practiceStore.isPaused) {
      resumePractice()
    } else {
      pausePractice()
    }
    return
  }
  
  // 处理普通输入
  const key = event.key.toLowerCase()
  practiceStore.processKeyInput(key)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatRelativeTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

// 监听器
watch(() => route.params.lessonId, async (newLessonId) => {
  if (newLessonId) {
    currentLesson.value = await practiceStore.getLesson(parseInt(newLessonId))
  }
}, { immediate: true })

// 生命周期
onMounted(async () => {
  // 检查路由参数
  const { lessonId, mode } = route.params
  const { from } = route.query
  
  if (lessonId) {
    currentLesson.value = await practiceStore.getLesson(parseInt(lessonId))
  }
  
  if (mode) {
    selectedMode.value = mode
  }
  
  // 添加键盘监听
  document.addEventListener('keydown', handleKeydown)
  
  // 加载练习历史
  await practiceStore.loadRecentSessions()
})

onUnmounted(() => {
  // 清理资源
  document.removeEventListener('keydown', handleKeydown)
  
  // 确保练习状态正确清理
  if (practiceStore.isActive) {
    practiceStore.exitPractice()
  }
})
</script>

<style scoped>
.practice {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 练习头部 */
.practice-header {
  @apply bg-white border-b border-gray-200 sticky top-16 z-40;
}

.header-content {
  @apply py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between;
}

.practice-info {
  @apply mb-6 lg:mb-0;
}

.lesson-breadcrumb {
  @apply flex items-center text-sm text-gray-500 mb-2;
}

.breadcrumb-link {
  @apply hover:text-gray-700 transition-colors;
}

.breadcrumb-separator {
  @apply mx-2;
}

.breadcrumb-current {
  @apply text-gray-900 font-medium;
}

.practice-title {
  @apply text-2xl lg:text-3xl font-bold text-gray-900 mb-2;
}

.practice-description {
  @apply text-gray-600 max-w-md;
}

.stats-panel {
  @apply flex space-x-6;
}

.stat-item {
  @apply flex items-center space-x-3 bg-gray-50 rounded-lg p-3;
}

.stat-icon {
  @apply text-2xl;
}

.stat-value {
  @apply text-lg font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

/* 主练习区域 */
.practice-main {
  @apply py-8;
}

.practice-content {
  @apply space-y-8;
}

/* 模式选择 */
.mode-selector-card {
  @apply bg-white;
}

.card-title {
  @apply text-xl font-semibold text-gray-900;
}

.mode-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 mb-8;
}

.mode-card {
  @apply p-6 border-2 border-gray-200 rounded-lg cursor-pointer transition-all;
  @apply hover:border-blue-300 hover:shadow-md;
}

.mode-card--selected {
  @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
}

.mode-icon {
  @apply text-3xl mb-4;
}

.mode-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.mode-description {
  @apply text-gray-600 mb-4;
}

.mode-features {
  @apply flex flex-wrap gap-2;
}

.mode-feature {
  @apply px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full;
}

.mode-actions {
  @apply text-center;
}

.start-button {
  @apply min-w-48;
}

.start-icon {
  @apply mr-2;
}

/* 练习进行中 */
.practice-active {
  @apply space-y-6;
}

.progress-card {
  @apply bg-white;
}

.progress-content {
  @apply space-y-4;
}

.progress-info {
  @apply flex items-center justify-between;
}

.progress-text {
  @apply text-lg font-medium text-gray-900;
}

.progress-current {
  @apply text-blue-600;
}

.progress-separator {
  @apply mx-2 text-gray-400;
}

.progress-total {
  @apply text-gray-600;
}

.progress-percentage {
  @apply text-2xl font-bold text-blue-600;
}

.progress-bar {
  @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500;
}

.typing-area {
  @apply bg-white rounded-lg shadow-sm p-8 space-y-8;
}

.practice-controls {
  @apply flex items-center justify-between bg-white rounded-lg p-4;
}

.control-left,
.control-right {
  @apply flex items-center space-x-3;
}

/* 侧边栏 */
.practice-sidebar {
  @apply fixed right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 z-30;
  @apply transform transition-transform;
}

.sidebar-content {
  @apply h-full flex flex-col;
}

.sidebar-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-900;
}

.sidebar-body {
  @apply flex-1 overflow-y-auto p-4 space-y-3;
}

.history-item {
  @apply flex items-center justify-between p-3 bg-gray-50 rounded-lg;
}

.history-title {
  @apply font-medium text-gray-900;
}

.history-stats {
  @apply text-sm text-gray-600 space-x-2;
}

.history-time {
  @apply text-xs text-gray-500;
}

/* 动画 */
.completion-enter-active,
.completion-leave-active {
  @apply transition-all duration-300;
}

.completion-enter-from,
.completion-leave-to {
  @apply opacity-0 scale-95;
}

.sidebar-enter-active,
.sidebar-leave-active {
  @apply transition-transform duration-300;
}

.sidebar-enter-from,
.sidebar-leave-to {
  @apply translate-x-full;
}

/* 暗色主题支持 */
[data-theme='dark'] .practice {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .practice-header {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .practice-title {
  @apply text-gray-100;
}

[data-theme='dark'] .practice-description {
  @apply text-gray-300;
}

[data-theme='dark'] .stat-item {
  @apply bg-gray-800;
}

[data-theme='dark'] .stat-value {
  @apply text-gray-100;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-300;
}

[data-theme='dark'] .mode-card {
  @apply border-gray-700 bg-gray-800;
}

[data-theme='dark'] .mode-card:hover {
  @apply border-blue-600 bg-gray-700;
}

[data-theme='dark'] .mode-title {
  @apply text-gray-100;
}

[data-theme='dark'] .mode-description {
  @apply text-gray-300;
}

[data-theme='dark'] .typing-area {
  @apply bg-gray-800;
}

[data-theme='dark'] .practice-controls {
  @apply bg-gray-800;
}

[data-theme='dark'] .practice-sidebar {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .sidebar-title {
  @apply text-gray-100;
}

[data-theme='dark'] .history-item {
  @apply bg-gray-800;
}

[data-theme='dark'] .history-title {
  @apply text-gray-100;
}

[data-theme='dark'] .history-stats {
  @apply text-gray-300;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-panel {
    @apply grid grid-cols-2 gap-4 space-x-0;
  }
  
  .practice-controls {
    @apply flex-col space-y-4;
  }
  
  .control-left,
  .control-right {
    @apply w-full justify-center;
  }
  
  .practice-sidebar {
    @apply w-full;
  }
}
</style>