<!-- KeyboardLearning 键位学习 - 交互式学习界面 -->
<template>
  <div class="keyboard-learning">
    <!-- 学习进度条 -->
    <div class="progress-header">
      <div class="container">
        <div class="progress-content">
          <div class="progress-info">
            <div class="lesson-breadcrumb">
              <router-link to="/learning" class="breadcrumb-link">学习中心</router-link>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">第{{ currentLessonId }}课</span>
            </div>
            <h1 class="lesson-title">{{ currentLesson?.title || '键位学习' }}</h1>
            <p class="lesson-description">{{ currentLesson?.description || '掌握双拼键位布局' }}</p>
          </div>
          <div class="progress-stats">
            <div class="progress-circle">
              <svg class="progress-ring" width="80" height="80">
                <circle
                  class="progress-ring-circle"
                  stroke-width="4"
                  fill="transparent"
                  r="36"
                  cx="40"
                  cy="40"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                />
              </svg>
              <div class="progress-text">{{ Math.round(lessonProgress) }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要学习区域 -->
    <div class="learning-main">
      <div class="container">
        <div class="learning-content">
          <!-- 学习模式选择 -->
          <Card class="mode-selector" v-if="showModeSelector">
            <template #header>
              <h2 class="card-title">选择学习模式</h2>
            </template>
            
            <div class="learning-modes">
              <div
                v-for="mode in learningModes"
                :key="mode.id"
                class="mode-card"
                :class="{ 'mode-card--selected': selectedMode === mode.id }"
                @click="selectLearningMode(mode.id)"
              >
                <div class="mode-icon">{{ mode.icon }}</div>
                <div class="mode-content">
                  <h3 class="mode-title">{{ mode.title }}</h3>
                  <p class="mode-description">{{ mode.description }}</p>
                </div>
              </div>
            </div>

            <div class="mode-actions">
              <Button
                variant="solid"
                size="lg"
                @click="startLearningMode"
                :disabled="!selectedMode"
              >
                开始学习
              </Button>
            </div>
          </Card>

          <!-- 学习进行中界面 -->
          <div class="learning-active" v-else>
            <!-- 当前学习步骤 -->
            <Card class="current-step-card">
              <div class="step-content">
                <div class="step-header">
                  <div class="step-info">
                    <span class="step-number">步骤 {{ currentStep + 1 }}/{{ totalSteps }}</span>
                    <h3 class="step-title">{{ getCurrentStepTitle() }}</h3>
                  </div>
                  <div class="step-controls">
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="toggleHints"
                      :class="{ 'active': showHints }"
                    >
                      💡 提示
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="toggleSettings"
                    >
                      ⚙️ 设置
                    </Button>
                  </div>
                </div>

                <!-- 步骤进度 -->
                <div class="step-progress">
                  <div class="step-dots">
                    <div
                      v-for="(step, index) in learningSteps"
                      :key="index"
                      class="step-dot"
                      :class="getStepDotClass(index)"
                      @click="goToStep(index)"
                    >
                      <span class="step-dot-icon">{{ step.icon }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <!-- 主要学习区域 -->
            <div class="learning-area">
              <!-- 键位展示组件 -->
              <KeyboardDisplay
                v-if="selectedMode === 'overview'"
                :scheme="shuangpinStore.currentScheme"
                :highlighted-keys="highlightedKeys"
                :current-lesson="currentLesson"
                :show-labels="showLabels"
                :interactive="true"
                @key-click="handleKeyClick"
              />

              <!-- 分步学习组件 -->
              <StepByStepLearning
                v-else-if="selectedMode === 'stepwise'"
                :current-step="currentStep"
                :lesson="currentLesson"
                :scheme="shuangpinStore.currentScheme"
                @step-complete="handleStepComplete"
                @next-step="nextStep"
                @prev-step="prevStep"
              />

              <!-- 互动练习组件 -->
              <InteractivePractice
                v-else-if="selectedMode === 'interactive'"
                :lesson="currentLesson"
                :scheme="shuangpinStore.currentScheme"
                @practice-complete="handlePracticeComplete"
              />

              <!-- 指法学习组件 -->
              <FingerPositioning
                v-else-if="selectedMode === 'finger'"
                :lesson="currentLesson"
                :scheme="shuangpinStore.currentScheme"
                @positioning-complete="handlePositioningComplete"
              />
            </div>

            <!-- 学习提示面板 -->
            <LearningHints
              v-if="showHints"
              :current-lesson="currentLesson"
              :current-step="currentStep"
              :learning-mode="selectedMode"
              :highlighted-keys="highlightedKeys"
            />

            <!-- 控制按钮 -->
            <div class="learning-controls">
              <div class="control-left">
                <Button
                  variant="outline"
                  @click="previousLesson"
                  :disabled="currentLessonId <= 1"
                >
                  <span class="button-icon">⬅️</span>
                  上一课
                </Button>
              </div>

              <div class="control-center">
                <Button
                  variant="ghost"
                  @click="restartLesson"
                >
                  🔄 重新学习
                </Button>
                <Button
                  variant="solid"
                  @click="startPractice"
                  v-if="canStartPractice"
                >
                  🚀 开始练习
                </Button>
              </div>

              <div class="control-right">
                <Button
                  variant="outline"
                  @click="nextLesson"
                  :disabled="!canGoToNext"
                >
                  下一课
                  <span class="button-icon">➡️</span>
                </Button>
              </div>
            </div>
          </div>

          <!-- 课程概览侧边栏 -->
          <transition name="sidebar">
            <div class="lesson-sidebar" v-if="showSidebar">
              <div class="sidebar-content">
                <div class="sidebar-header">
                  <h3 class="sidebar-title">课程概览</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="closeSidebar"
                  >
                    ✕
                  </Button>
                </div>

                <div class="sidebar-body">
                  <div class="lesson-list">
                    <div
                      v-for="lesson in availableLessons"
                      :key="lesson.id"
                      class="lesson-item"
                      :class="{ 
                        'lesson-item--current': lesson.id === currentLessonId,
                        'lesson-item--completed': lesson.completed,
                        'lesson-item--locked': lesson.locked
                      }"
                      @click="selectLesson(lesson)"
                    >
                      <div class="lesson-icon">{{ getLessonIcon(lesson) }}</div>
                      <div class="lesson-info">
                        <div class="lesson-name">{{ lesson.title }}</div>
                        <div class="lesson-progress">{{ lesson.progress }}% 完成</div>
                      </div>
                      <div class="lesson-status">{{ getLessonStatus(lesson) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- 学习统计面板 -->
          <LearningStats
            v-if="showStats"
            :lesson-stats="lessonStats"
            :overall-progress="overallProgress"
            @close="closeStats"
          />
        </div>
      </div>
    </div>

    <!-- 学习设置面板 -->
    <LearningSettings
      v-if="showSettings"
      :settings="learningSettings"
      @close="closeSettings"
      @save="saveLearningSettings"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useShuangpinStore } from '@/stores/shuangpin'
import { usePracticeStore } from '@/stores/practice'

// 组件导入
import Card from '@/components/base/Card/index.vue'
import Button from '@/components/base/Button/index.vue'
import KeyboardDisplay from '@/components/learning/KeyboardDisplay/index.vue'
import StepByStepLearning from '@/components/learning/StepByStepLearning/index.vue'
import InteractivePractice from '@/components/learning/InteractivePractice/index.vue'
import FingerPositioning from '@/components/learning/FingerPositioning/index.vue'
import LearningHints from '@/components/learning/LearningHints/index.vue'
import LearningStats from '@/components/learning/LearningStats/index.vue'
import LearningSettings from '@/components/learning/LearningSettings/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()

// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const currentLessonId = ref(1)
const selectedMode = ref('')
const showModeSelector = ref(true)
const currentStep = ref(0)
const showHints = ref(true)
const showLabels = ref(true)
const showSidebar = ref(false)
const showStats = ref(false)
const showSettings = ref(false)
const highlightedKeys = ref([])

// 学习模式配置
const learningModes = ref([
  {
    id: 'overview',
    title: '键位概览',
    description: '了解双拼键盘布局和键位分布',
    icon: '🗺️'
  },
  {
    id: 'stepwise',
    title: '分步学习',
    description: '逐步学习每个键位的位置和用法',
    icon: '👣'
  },
  {
    id: 'interactive',
    title: '互动练习',
    description: '通过互动练习巩固键位记忆',
    icon: '🎯'
  },
  {
    id: 'finger',
    title: '指法训练',
    description: '学习正确的手指位置和打字姿势',
    icon: '👆'
  }
])

// 学习步骤
const learningSteps = ref([
  { icon: '👀', title: '观察键位' },
  { icon: '🧠', title: '理解布局' },
  { icon: '👆', title: '练习指法' },
  { icon: '💭', title: '记忆巩固' },
  { icon: '✅', title: '完成学习' }
])

// 学习设置
const learningSettings = ref({
  showAnimations: true,
  highlightSpeed: 'medium',
  autoAdvance: false,
  soundEnabled: true,
  showProgress: true
})

// 计算属性
const currentLesson = computed(() => {
  return practiceStore.getLessonById(currentLessonId.value)
})

const lessonProgress = computed(() => {
  return practiceStore.getLessonProgress(currentLessonId.value) || 0
})

const totalSteps = computed(() => learningSteps.value.length)

const canStartPractice = computed(() => {
  return lessonProgress.value >= 80 // 学习进度达到80%才能练习
})

const canGoToNext = computed(() => {
  return lessonProgress.value >= 60 && currentLessonId.value < availableLessons.value.length
})

const availableLessons = computed(() => {
  return practiceStore.getAllLessons().map(lesson => ({
    ...lesson,
    progress: practiceStore.getLessonProgress(lesson.id) || 0,
    completed: (practiceStore.getLessonProgress(lesson.id) || 0) >= 100,
    locked: lesson.id > 1 && (practiceStore.getLessonProgress(lesson.id - 1) || 0) < 60
  }))
})

const lessonStats = computed(() => {
  return practiceStore.getLessonStats(currentLessonId.value)
})

const overallProgress = computed(() => {
  return practiceStore.getOverallProgress()
})

// 进度圆环计算
const circumference = computed(() => 2 * Math.PI * 36)
const progressOffset = computed(() => {
  return circumference.value - (lessonProgress.value / 100) * circumference.value
})

// 方法
const selectLearningMode = (modeId) => {
  selectedMode.value = modeId
}

const startLearningMode = () => {
  showModeSelector.value = false
  currentStep.value = 0
  
  // 根据模式设置高亮键位
  updateHighlightedKeys()
  
  appStore.addNotification({
    type: 'success',
    message: `开始${learningModes.value.find(m => m.id === selectedMode.value)?.title}`,
    duration: 2000
  })
}

const updateHighlightedKeys = () => {
  if (!currentLesson.value) return
  
  const lesson = currentLesson.value
  const keys = []
  
  // 根据当前课程和学习模式决定高亮的键位
  if (lesson.initials) {
    keys.push(...lesson.initials)
  }
  if (lesson.finals) {
    keys.push(...lesson.finals)
  }
  
  highlightedKeys.value = keys
}

const getCurrentStepTitle = () => {
  if (currentStep.value < learningSteps.value.length) {
    return learningSteps.value[currentStep.value].title
  }
  return '学习完成'
}

const getStepDotClass = (index) => {
  return {
    'step-dot--completed': index < currentStep.value,
    'step-dot--current': index === currentStep.value,
    'step-dot--upcoming': index > currentStep.value
  }
}

const goToStep = (stepIndex) => {
  if (stepIndex <= currentStep.value) {
    currentStep.value = stepIndex
  }
}

const nextStep = () => {
  if (currentStep.value < totalSteps.value - 1) {
    currentStep.value++
    updateProgress()
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const updateProgress = () => {
  const progress = ((currentStep.value + 1) / totalSteps.value) * 100
  practiceStore.updateLessonProgress(currentLessonId.value, progress)
}

const handleStepComplete = () => {
  nextStep()
}

const handlePracticeComplete = () => {
  practiceStore.updateLessonProgress(currentLessonId.value, 100)
  
  appStore.addNotification({
    type: 'success',
    message: '课程学习完成！',
    duration: 3000
  })
}

const handlePositioningComplete = () => {
  handlePracticeComplete()
}

const handleKeyClick = (key) => {
  // 处理键位点击，显示相关信息
  const keyInfo = shuangpinStore.getKeyInfo(key)
  if (keyInfo) {
    appStore.addNotification({
      type: 'info',
      message: `${key.toUpperCase()}: ${keyInfo.description}`,
      duration: 2000
    })
  }
}

const toggleHints = () => {
  showHints.value = !showHints.value
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const restartLesson = () => {
  currentStep.value = 0
  showModeSelector.value = true
  selectedMode.value = ''
  
  appStore.addNotification({
    type: 'info',
    message: '课程已重置',
    duration: 2000
  })
}

const startPractice = () => {
  router.push({
    name: 'practice',
    params: { lessonId: currentLessonId.value },
    query: { from: 'learning' }
  })
}

const previousLesson = () => {
  if (currentLessonId.value > 1) {
    currentLessonId.value--
    resetLessonState()
  }
}

const nextLesson = () => {
  if (canGoToNext.value) {
    currentLessonId.value++
    resetLessonState()
  }
}

const selectLesson = (lesson) => {
  if (!lesson.locked) {
    currentLessonId.value = lesson.id
    resetLessonState()
    closeSidebar()
  }
}

const resetLessonState = () => {
  currentStep.value = 0
  showModeSelector.value = true
  selectedMode.value = ''
  updateHighlightedKeys()
}

const getLessonIcon = (lesson) => {
  if (lesson.completed) return '✅'
  if (lesson.locked) return '🔒'
  if (lesson.id === currentLessonId.value) return '📖'
  return '📝'
}

const getLessonStatus = (lesson) => {
  if (lesson.completed) return '已完成'
  if (lesson.locked) return '未解锁'
  if (lesson.progress > 0) return '进行中'
  return '未开始'
}

const openSidebar = () => {
  showSidebar.value = true
}

const closeSidebar = () => {
  showSidebar.value = false
}

const openStats = () => {
  showStats.value = true
}

const closeStats = () => {
  showStats.value = false
}

const closeSettings = () => {
  showSettings.value = false
}

const saveLearningSettings = (settings) => {
  Object.assign(learningSettings.value, settings)
  
  appStore.addNotification({
    type: 'success',
    message: '学习设置已保存',
    duration: 2000
  })
}

// 监听器
watch(() => route.params.lessonId, (newLessonId) => {
  if (newLessonId) {
    currentLessonId.value = parseInt(newLessonId)
    resetLessonState()
  }
}, { immediate: true })

watch(currentLessonId, () => {
  updateHighlightedKeys()
})

// 生命周期
onMounted(async () => {
  // 初始化课程数据
  await practiceStore.loadLessons()
  
  // 如果有路由参数，设置当前课程
  const lessonId = route.params.lessonId
  if (lessonId) {
    currentLessonId.value = parseInt(lessonId)
  }
  
  updateHighlightedKeys()
})
</script>

<style scoped>
.keyboard-learning {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 进度头部 */
.progress-header {
  @apply bg-white border-b border-gray-200 sticky top-16 z-40;
}

.progress-content {
  @apply py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between;
}

.progress-info {
  @apply mb-4 lg:mb-0;
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

.lesson-title {
  @apply text-2xl lg:text-3xl font-bold text-gray-900 mb-2;
}

.lesson-description {
  @apply text-gray-600 max-w-md;
}

.progress-stats {
  @apply flex items-center;
}

.progress-circle {
  @apply relative;
}

.progress-ring {
  @apply transform -rotate-90;
}

.progress-ring-circle {
  @apply stroke-blue-500 transition-all duration-500;
}

.progress-text {
  @apply absolute inset-0 flex items-center justify-center;
  @apply text-lg font-bold text-gray-900;
}

/* 主要学习区域 */
.learning-main {
  @apply py-8;
}

.learning-content {
  @apply space-y-8;
}

/* 模式选择 */
.mode-selector {
  @apply bg-white;
}

.card-title {
  @apply text-xl font-semibold text-gray-900;
}

.learning-modes {
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
  @apply text-gray-600;
}

.mode-actions {
  @apply text-center;
}

/* 学习进行中 */
.learning-active {
  @apply space-y-6;
}

.current-step-card {
  @apply bg-white;
}

.step-content {
  @apply space-y-4;
}

.step-header {
  @apply flex items-center justify-between;
}

.step-info {
  @apply space-y-1;
}

.step-number {
  @apply text-sm font-medium text-blue-600;
}

.step-title {
  @apply text-lg font-semibold text-gray-900;
}

.step-controls {
  @apply flex space-x-2;
}

.step-progress {
  @apply py-4;
}

.step-dots {
  @apply flex items-center justify-center space-x-4;
}

.step-dot {
  @apply w-12 h-12 rounded-full flex items-center justify-center cursor-pointer;
  @apply transition-all duration-300;
  @apply bg-gray-200 text-gray-400;
}

.step-dot--completed {
  @apply bg-green-100 text-green-600;
}

.step-dot--current {
  @apply bg-blue-100 text-blue-600 scale-110 ring-4 ring-blue-200;
}

.step-dot--upcoming {
  @apply bg-gray-100 text-gray-400;
}

.step-dot-icon {
  @apply text-lg;
}

.learning-area {
  @apply bg-white rounded-lg shadow-sm p-8;
}

/* 控制按钮 */
.learning-controls {
  @apply flex items-center justify-between bg-white rounded-lg p-6;
}

.control-left,
.control-center,
.control-right {
  @apply flex items-center space-x-3;
}

.control-center {
  @apply flex-1 justify-center;
}

.button-icon {
  @apply text-lg;
}

/* 侧边栏 */
.lesson-sidebar {
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
  @apply flex-1 overflow-y-auto p-4;
}

.lesson-list {
  @apply space-y-3;
}

.lesson-item {
  @apply flex items-center space-x-3 p-3 rounded-lg cursor-pointer;
  @apply hover:bg-gray-50 transition-colors;
}

.lesson-item--current {
  @apply bg-blue-50 border border-blue-200;
}

.lesson-item--completed {
  @apply bg-green-50 border border-green-200;
}

.lesson-item--locked {
  @apply opacity-50 cursor-not-allowed;
}

.lesson-icon {
  @apply text-lg;
}

.lesson-info {
  @apply flex-1;
}

.lesson-name {
  @apply font-medium text-gray-900;
}

.lesson-progress {
  @apply text-sm text-gray-600;
}

.lesson-status {
  @apply text-xs text-gray-500;
}

/* 动画 */
.sidebar-enter-active,
.sidebar-leave-active {
  @apply transition-transform duration-300;
}

.sidebar-enter-from,
.sidebar-leave-to {
  @apply translate-x-full;
}

/* 暗色主题支持 */
[data-theme='dark'] .keyboard-learning {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .progress-header {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .lesson-title {
  @apply text-gray-100;
}

[data-theme='dark'] .lesson-description {
  @apply text-gray-300;
}

[data-theme='dark'] .progress-text {
  @apply text-gray-100;
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

[data-theme='dark'] .current-step-card {
  @apply bg-gray-800;
}

[data-theme='dark'] .step-title {
  @apply text-gray-100;
}

[data-theme='dark'] .learning-area {
  @apply bg-gray-800;
}

[data-theme='dark'] .learning-controls {
  @apply bg-gray-800;
}

[data-theme='dark'] .lesson-sidebar {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .sidebar-title {
  @apply text-gray-100;
}

[data-theme='dark'] .lesson-item {
  @apply hover:bg-gray-800;
}

[data-theme='dark'] .lesson-item--current {
  @apply bg-blue-900 border-blue-700;
}

[data-theme='dark'] .lesson-item--completed {
  @apply bg-green-900 border-green-700;
}

[data-theme='dark'] .lesson-name {
  @apply text-gray-100;
}

[data-theme='dark'] .lesson-progress {
  @apply text-gray-300;
}

[data-theme='dark'] .lesson-status {
  @apply text-gray-400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .learning-controls {
    @apply flex-col space-y-4;
  }
  
  .control-left,
  .control-center,
  .control-right {
    @apply w-full justify-center;
  }
  
  .lesson-sidebar {
    @apply w-full;
  }
  
  .learning-modes {
    @apply grid-cols-1;
  }
  
  .step-dots {
    @apply space-x-2;
  }
  
  .step-dot {
    @apply w-10 h-10;
  }
}
</style>