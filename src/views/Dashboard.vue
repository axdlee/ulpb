<!-- Dashboard 仪表板 - 现代化学习概览 -->
<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <section class="welcome-section">
      <div class="container">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">
              欢迎回来！
              <span class="wave">👋</span>
            </h1>
            <p class="welcome-subtitle">
              继续您的双拼学习之旅，今天也要加油哦～
            </p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card streak-card">
              <div class="stat-icon">🔥</div>
              <div class="stat-content">
                <div class="stat-value">{{ learningStreak }}</div>
                <div class="stat-label">连续天数</div>
              </div>
            </div>
            <div class="stat-card level-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-content">
                <div class="stat-value">{{ userLevel }}</div>
                <div class="stat-label">当前等级</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 今日学习进度 -->
    <section class="progress-section">
      <div class="container">
        <Card class="progress-card">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">今日学习进度</h2>
              <span class="progress-percentage">{{ todayProgress }}%</span>
            </div>
          </template>
          
          <div class="progress-content">
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div 
                  class="progress-fill"
                  :style="{ width: `${todayProgress}%` }"
                ></div>
              </div>
              <div class="progress-markers">
                <div 
                  v-for="marker in progressMarkers"
                  :key="marker.value"
                  class="progress-marker"
                  :class="{ 'completed': todayProgress >= marker.value }"
                  :style="{ left: `${marker.value}%` }"
                >
                  <div class="marker-dot"></div>
                  <div class="marker-label">{{ marker.label }}</div>
                </div>
              </div>
            </div>

            <div class="today-stats-grid">
              <div class="today-stat">
                <div class="stat-icon-small">⏱️</div>
                <div class="stat-details">
                  <div class="stat-value-small">{{ formatTime(todayStats.practiceTime) }}</div>
                  <div class="stat-label-small">练习时长</div>
                </div>
              </div>
              <div class="today-stat">
                <div class="stat-icon-small">✍️</div>
                <div class="stat-details">
                  <div class="stat-value-small">{{ todayStats.charCount }}</div>
                  <div class="stat-label-small">练习字数</div>
                </div>
              </div>
              <div class="today-stat">
                <div class="stat-icon-small">🎯</div>
                <div class="stat-details">
                  <div class="stat-value-small">{{ todayStats.accuracy }}%</div>
                  <div class="stat-label-small">平均准确率</div>
                </div>
              </div>
              <div class="today-stat">
                <div class="stat-icon-small">⚡</div>
                <div class="stat-details">
                  <div class="stat-value-small">{{ todayStats.speed }}</div>
                  <div class="stat-label-small">字/分钟</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- 快速入口 -->
    <section class="quick-actions-section">
      <div class="container">
        <h2 class="section-title">快速开始</h2>
        <div class="quick-actions-grid">
          <div 
            v-for="action in quickActions"
            :key="action.id"
            class="quick-action-card"
            :class="`quick-action-card--${action.color}`"
            @click="handleQuickAction(action)"
          >
            <div class="action-icon">{{ action.icon }}</div>
            <div class="action-content">
              <h3 class="action-title">{{ action.title }}</h3>
              <p class="action-description">{{ action.description }}</p>
              <div class="action-progress" v-if="action.progress !== undefined">
                <div class="action-progress-bar">
                  <div 
                    class="action-progress-fill"
                    :style="{ width: `${action.progress}%` }"
                  ></div>
                </div>
                <span class="action-progress-text">{{ action.progress }}% 完成</span>
              </div>
            </div>
            <div class="action-arrow">→</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习路径推荐 -->
    <section class="recommendations-section">
      <div class="container">
        <Card class="recommendations-card">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">智能推荐</h2>
              <Button 
                variant="ghost" 
                size="sm"
                @click="refreshRecommendations"
                :loading="isRefreshingRecommendations"
              >
                🔄 刷新
              </Button>
            </div>
          </template>

          <div class="recommendations-content">
            <div 
              v-for="recommendation in recommendations"
              :key="recommendation.id"
              class="recommendation-item"
              @click="handleRecommendation(recommendation)"
            >
              <div class="recommendation-icon">{{ recommendation.icon }}</div>
              <div class="recommendation-content">
                <h4 class="recommendation-title">{{ recommendation.title }}</h4>
                <p class="recommendation-description">{{ recommendation.description }}</p>
                <div class="recommendation-tags">
                  <span 
                    v-for="tag in recommendation.tags"
                    :key="tag"
                    class="recommendation-tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="recommendation-priority" :class="`priority-${recommendation.priority}`">
                {{ recommendation.priorityText }}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

    <!-- 最近练习与成就 -->
    <section class="recent-section">
      <div class="container">
        <div class="recent-grid">
          <!-- 最近练习记录 -->
          <Card class="recent-practice-card">
            <template #header>
              <div class="section-header">
                <h2 class="section-title">最近练习</h2>
                <router-link to="/stats" class="view-all-link">查看全部 →</router-link>
              </div>
            </template>

            <div class="recent-practice-list">
              <div 
                v-for="record in recentPractices"
                :key="record.id"
                class="practice-record"
              >
                <div class="record-icon">
                  <span class="lesson-type-icon">{{ getLessonTypeIcon(record.type) }}</span>
                </div>
                <div class="record-content">
                  <div class="record-title">{{ record.lessonTitle }}</div>
                  <div class="record-stats">
                    <span class="record-speed">{{ record.speed }} 字/分</span>
                    <span class="record-accuracy">{{ record.accuracy }}% 准确率</span>
                  </div>
                </div>
                <div class="record-time">{{ formatRelativeTime(record.time) }}</div>
              </div>
            </div>
          </Card>

          <!-- 最新成就 -->
          <Card class="recent-achievements-card">
            <template #header>
              <div class="section-header">
                <h2 class="section-title">最新成就</h2>
                <router-link to="/achievements" class="view-all-link">查看全部 →</router-link>
              </div>
            </template>

            <div class="recent-achievements-list">
              <div 
                v-for="achievement in recentAchievements"
                :key="achievement.id"
                class="achievement-item"
                :class="{ 'newly-unlocked': achievement.isNew }"
              >
                <div class="achievement-icon">{{ achievement.icon }}</div>
                <div class="achievement-content">
                  <div class="achievement-title">{{ achievement.title }}</div>
                  <div class="achievement-description">{{ achievement.description }}</div>
                </div>
                <div class="achievement-time">{{ formatRelativeTime(achievement.unlockedAt) }}</div>
              </div>

              <div class="achievement-progress-preview">
                <h4 class="progress-title">即将解锁</h4>
                <div 
                  v-for="upcoming in upcomingAchievements"
                  :key="upcoming.id"
                  class="upcoming-achievement"
                >
                  <div class="upcoming-icon">{{ upcoming.icon }}</div>
                  <div class="upcoming-content">
                    <div class="upcoming-title">{{ upcoming.title }}</div>
                    <div class="upcoming-progress-bar">
                      <div 
                        class="upcoming-progress-fill"
                        :style="{ width: `${upcoming.progress}%` }"
                      ></div>
                    </div>
                    <div class="upcoming-progress-text">{{ upcoming.progress }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- 学习统计概览 -->
    <section class="stats-overview-section">
      <div class="container">
        <Card class="stats-overview-card">
          <template #header>
            <div class="section-header">
              <h2 class="section-title">学习统计概览</h2>
              <div class="stats-period-selector">
                <Button
                  v-for="period in statsPeriods"
                  :key="period.value"
                  :variant="selectedStatsPeriod === period.value ? 'solid' : 'ghost'"
                  size="sm"
                  @click="selectedStatsPeriod = period.value"
                >
                  {{ period.label }}
                </Button>
              </div>
            </div>
          </template>

          <div class="stats-overview-content">
            <div class="stats-cards-grid">
              <div 
                v-for="stat in overviewStats"
                :key="stat.key"
                class="overview-stat-card"
                :class="`stat-card--${stat.color}`"
              >
                <div class="stat-card-icon">{{ stat.icon }}</div>
                <div class="stat-card-content">
                  <div class="stat-card-value">{{ stat.value }}</div>
                  <div class="stat-card-label">{{ stat.label }}</div>
                  <div class="stat-card-trend" :class="stat.trend.direction">
                    <span class="trend-icon">{{ stat.trend.icon }}</span>
                    <span class="trend-text">{{ stat.trend.text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="quick-insights">
              <h4 class="insights-title">学习洞察</h4>
              <div class="insights-list">
                <div 
                  v-for="insight in learningInsights"
                  :key="insight.id"
                  class="insight-item"
                  :class="`insight-${insight.type}`"
                >
                  <div class="insight-icon">{{ insight.icon }}</div>
                  <div class="insight-text">{{ insight.message }}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useShuangpinStore } from '@/stores/shuangpin'  
import { usePracticeStore } from '@/stores/practice'
import Card from '@/components/base/Card/index.vue'
import Button from '@/components/base/Button/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()
const router = useRouter()

// 响应式状态
const selectedStatsPeriod = ref('week')
const isRefreshingRecommendations = ref(false)

// 计算属性
const learningStreak = computed(() => practiceStore.learningStreak || 0)
const userLevel = computed(() => practiceStore.userLevel || 1)

const todayProgress = computed(() => {
  const target = 60 // 今日目标：60分钟
  const actual = todayStats.value.practiceTime
  return Math.min(Math.round((actual / target) * 100), 100)
})

const todayStats = computed(() => ({
  practiceTime: practiceStore.todayStats.practiceTime || 0,
  charCount: practiceStore.todayStats.charCount || 0,
  accuracy: practiceStore.todayStats.accuracy || 0,
  speed: practiceStore.todayStats.speed || 0
}))

const progressMarkers = computed(() => [
  { value: 25, label: '起步' },
  { value: 50, label: '进步' },
  { value: 75, label: '优秀' },
  { value: 100, label: '完美' }
])

const quickActions = computed(() => [
  {
    id: 'continue-learning',
    title: '继续学习',
    description: '从上次中断的地方继续',
    icon: '📚',
    color: 'blue',
    progress: practiceStore.currentLessonProgress,
    route: { name: 'learning', params: { lessonId: practiceStore.currentLessonId } }
  },
  {
    id: 'daily-practice',
    title: '每日练习',
    description: '完成今日练习任务',
    icon: '✍️',
    color: 'green',
    progress: practiceStore.dailyPracticeProgress,
    route: { name: 'practice' }
  },
  {
    id: 'speed-test',
    title: '速度测试',
    description: '测试您的打字速度',
    icon: '⚡',
    color: 'yellow',
    route: { name: 'practice', query: { mode: 'speed-test' } }
  },
  {
    id: 'fun-game',
    title: '趣味游戏',
    description: '在游戏中提升技能',
    icon: '🎮',
    color: 'purple',
    route: { name: 'game' }
  }
])

const recommendations = computed(() => [
  {
    id: 'weak-keys',
    title: '薄弱键位练习',
    description: '针对您的薄弱键位进行专项练习',
    icon: '🎯',
    priority: 'high',
    priorityText: '推荐',
    tags: ['个性化', '提升'],
    action: () => router.push({ name: 'practice', query: { mode: 'weak-keys' } })
  },
  {
    id: 'speed-improvement',
    title: '速度提升训练',
    description: '通过特定练习提高您的打字速度',
    icon: '🚀',
    priority: 'medium',
    priorityText: '建议',
    tags: ['速度', '进阶'],
    action: () => router.push({ name: 'practice', query: { mode: 'speed' } })
  },
  {
    id: 'review-errors',
    title: '错误回顾',
    description: '回顾和练习之前的错误输入',
    icon: '🔄',
    priority: 'low',
    priorityText: '可选',
    tags: ['复习', '巩固'],
    action: () => router.push({ name: 'review' })
  }
])

const recentPractices = computed(() => practiceStore.recentPractices?.slice(0, 5) || [])
const recentAchievements = computed(() => practiceStore.recentAchievements?.slice(0, 3) || [])
const upcomingAchievements = computed(() => practiceStore.upcomingAchievements?.slice(0, 2) || [])

const statsPeriods = [
  { value: 'day', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' }
]

const overviewStats = computed(() => [
  {
    key: 'total-time',
    icon: '⏱️',
    value: formatTime(practiceStore.getTotalTime(selectedStatsPeriod.value)),
    label: '练习时长',
    color: 'blue',
    trend: {
      direction: 'up',
      icon: '↗️',
      text: '+12% 较上周'
    }
  },
  {
    key: 'avg-speed',
    icon: '⚡',
    value: `${practiceStore.getAverageSpeed(selectedStatsPeriod.value)} 字/分`,
    label: '平均速度',
    color: 'green',
    trend: {
      direction: 'up',
      icon: '↗️',
      text: '+5 较上周'
    }
  },
  {
    key: 'accuracy',
    icon: '🎯',
    value: `${practiceStore.getAverageAccuracy(selectedStatsPeriod.value)}%`,
    label: '平均准确率',
    color: 'yellow',
    trend: {
      direction: 'stable',
      icon: '→',
      text: '保持稳定'
    }
  },
  {
    key: 'lessons',
    icon: '📖',
    value: practiceStore.getCompletedLessons(selectedStatsPeriod.value),
    label: '完成课程',
    color: 'purple',
    trend: {
      direction: 'up',
      icon: '↗️',
      text: '+3 较上周'
    }
  }
])

const learningInsights = computed(() => [
  {
    id: 'progress',
    type: 'positive',
    icon: '🎉',
    message: '您的打字速度比上周提升了15%！'
  },
  {
    id: 'suggestion',
    type: 'suggestion',
    icon: '💡',
    message: '建议每日练习30分钟以保持稳定进步'
  },
  {
    id: 'challenge',
    type: 'challenge',
    icon: '🏆',
    message: '距离下一个成就"速度达人"还差5字/分钟'
  }
])

// 方法
const formatTime = (seconds) => {
  if (!seconds) return '0分钟'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return ''
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

const getLessonTypeIcon = (type) => {
  const icons = {
    'initial': '🎵', // 声母
    'final': '🎶',   // 韵母
    'word': '📝',    // 词汇
    'sentence': '📄', // 句子
    'article': '📰'  // 文章
  }
  return icons[type] || '📚'
}

const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route)
  }
}

const handleRecommendation = (recommendation) => {
  if (recommendation.action) {
    recommendation.action()
  }
}

const refreshRecommendations = async () => {
  isRefreshingRecommendations.value = true
  try {
    await practiceStore.refreshRecommendations()
    appStore.showNotification({
      type: 'success',
      message: '推荐已刷新！',
      duration: 2000
    })
  } catch (error) {
    appStore.showNotification({
      type: 'error',
      message: '刷新失败，请稍后重试',
      duration: 3000
    })
  } finally {
    isRefreshingRecommendations.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 加载仪表板数据
  await Promise.all([
    practiceStore.loadTodayStats(),
    practiceStore.loadRecentData(),
    practiceStore.loadRecommendations()
  ])
})

// 监听周期变化
watch(selectedStatsPeriod, () => {
  practiceStore.loadStatsForPeriod(selectedStatsPeriod.value)
})
</script>

<style scoped>
.dashboard {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 欢迎区域 */
.welcome-section {
  @apply py-8 lg:py-12;
}

.welcome-content {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between;
}

.welcome-title {
  @apply text-3xl lg:text-4xl font-bold text-gray-900 mb-2;
}

.wave {
  @apply inline-block animate-bounce;
}

.welcome-subtitle {
  @apply text-lg text-gray-600 mb-6 lg:mb-0;
}

.welcome-stats {
  @apply flex space-x-4;
}

.stat-card {
  @apply flex items-center space-x-3 bg-white rounded-xl p-4 shadow-sm;
}

.streak-card {
  @apply ring-2 ring-orange-200 bg-gradient-to-r from-orange-50 to-red-50;
}

.level-card {
  @apply ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50;
}

.stat-icon {
  @apply text-2xl;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

/* 进度区域 */
.progress-section {
  @apply pb-8;
}

.progress-card {
  @apply bg-white;
}

.section-header {
  @apply flex items-center justify-between;
}

.section-title {
  @apply text-xl font-semibold text-gray-900;
}

.progress-percentage {
  @apply text-2xl font-bold text-blue-600;
}

.progress-content {
  @apply space-y-6;
}

.progress-bar-container {
  @apply relative;
}

.progress-bar {
  @apply w-full h-3 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000;
}

.progress-markers {
  @apply absolute top-6 left-0 right-0;
}

.progress-marker {
  @apply absolute transform -translate-x-1/2;
}

.progress-marker.completed .marker-dot {
  @apply bg-blue-500;
}

.marker-dot {
  @apply w-3 h-3 bg-gray-300 rounded-full mb-2;
}

.marker-label {
  @apply text-xs text-gray-600 text-center;
}

.today-stats-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4;
}

.today-stat {
  @apply flex items-center space-x-3 p-3 bg-gray-50 rounded-lg;
}

.stat-icon-small {
  @apply text-lg;
}

.stat-value-small {
  @apply font-semibold text-gray-900;
}

.stat-label-small {
  @apply text-sm text-gray-600;
}

/* 快速入口 */
.quick-actions-section {
  @apply pb-8;
}

.quick-actions-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6;
}

.quick-action-card {
  @apply bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer;
  @apply hover:scale-105 hover:-translate-y-1;
}

.quick-action-card--blue {
  @apply hover:ring-2 hover:ring-blue-200;
}

.quick-action-card--green {
  @apply hover:ring-2 hover:ring-green-200;
}

.quick-action-card--yellow {
  @apply hover:ring-2 hover:ring-yellow-200;
}

.quick-action-card--purple {
  @apply hover:ring-2 hover:ring-purple-200;
}

.action-icon {
  @apply text-3xl mb-4;
}

.action-title {
  @apply text-lg font-semibold text-gray-900 mb-2;
}

.action-description {
  @apply text-sm text-gray-600 mb-4;
}

.action-progress {
  @apply space-y-2;
}

.action-progress-bar {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.action-progress-fill {
  @apply h-full bg-blue-500 rounded-full transition-all duration-500;
}

.action-progress-text {
  @apply text-xs text-gray-600;
}

.action-arrow {
  @apply text-gray-400 font-bold mt-4;
}

/* 推荐区域 */
.recommendations-section {
  @apply pb-8;
}

.recommendations-content {
  @apply space-y-4;
}

.recommendation-item {
  @apply flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer;
}

.recommendation-icon {
  @apply text-2xl;
}

.recommendation-content {
  @apply flex-1;
}

.recommendation-title {
  @apply font-semibold text-gray-900 mb-1;
}

.recommendation-description {
  @apply text-sm text-gray-600 mb-2;
}

.recommendation-tags {
  @apply flex space-x-2;
}

.recommendation-tag {
  @apply px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full;
}

.recommendation-priority {
  @apply px-3 py-1 text-xs font-medium rounded-full;
}

.priority-high {
  @apply bg-red-100 text-red-700;
}

.priority-medium {
  @apply bg-yellow-100 text-yellow-700;
}

.priority-low {
  @apply bg-green-100 text-green-700;
}

/* 最近活动 */
.recent-section {
  @apply pb-8;
}

.recent-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-8;
}

.view-all-link {
  @apply text-sm text-blue-600 hover:text-blue-700 font-medium;
}

.recent-practice-list {
  @apply space-y-3;
}

.practice-record {
  @apply flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors;
}

.record-icon {
  @apply flex-shrink-0;
}

.lesson-type-icon {
  @apply text-lg;
}

.record-content {
  @apply flex-1;
}

.record-title {
  @apply font-medium text-gray-900;
}

.record-stats {
  @apply text-sm text-gray-600 space-x-4;
}

.record-time {
  @apply text-xs text-gray-500;
}

.recent-achievements-list {
  @apply space-y-4;
}

.achievement-item {
  @apply flex items-center space-x-3 p-3 rounded-lg;
}

.achievement-item.newly-unlocked {
  @apply bg-yellow-50 ring-2 ring-yellow-200;
}

.achievement-icon {
  @apply text-xl;
}

.achievement-title {
  @apply font-medium text-gray-900;
}

.achievement-description {
  @apply text-sm text-gray-600;
}

.achievement-time {
  @apply text-xs text-gray-500;
}

.achievement-progress-preview {
  @apply mt-6 pt-4 border-t border-gray-200;
}

.progress-title {
  @apply font-medium text-gray-900 mb-3;
}

.upcoming-achievement {
  @apply flex items-center space-x-3 p-2;
}

.upcoming-icon {
  @apply text-lg opacity-60;
}

.upcoming-content {
  @apply flex-1;
}

.upcoming-title {
  @apply text-sm font-medium text-gray-700;
}

.upcoming-progress-bar {
  @apply w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1;
}

.upcoming-progress-fill {
  @apply h-full bg-blue-500 rounded-full;
}

.upcoming-progress-text {
  @apply text-xs text-gray-600;
}

/* 统计概览 */
.stats-overview-section {
  @apply pb-8;
}

.stats-period-selector {
  @apply flex space-x-2;
}

.stats-overview-content {
  @apply space-y-6;
}

.stats-cards-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4;
}

.overview-stat-card {
  @apply flex items-center space-x-4 p-4 rounded-lg;
}

.stat-card--blue {
  @apply bg-blue-50 border border-blue-200;
}

.stat-card--green {
  @apply bg-green-50 border border-green-200;
}

.stat-card--yellow {
  @apply bg-yellow-50 border border-yellow-200;
}

.stat-card--purple {
  @apply bg-purple-50 border border-purple-200;
}

.stat-card-icon {
  @apply text-2xl;
}

.stat-card-value {
  @apply text-xl font-bold text-gray-900;
}

.stat-card-label {
  @apply text-sm text-gray-600;
}

.stat-card-trend {
  @apply flex items-center space-x-1 text-xs;
}

.stat-card-trend.up {
  @apply text-green-600;
}

.stat-card-trend.down {
  @apply text-red-600;
}

.stat-card-trend.stable {
  @apply text-gray-600;
}

.quick-insights {
  @apply bg-gray-50 rounded-lg p-4;
}

.insights-title {
  @apply font-medium text-gray-900 mb-3;
}

.insights-list {
  @apply space-y-2;
}

.insight-item {
  @apply flex items-center space-x-3 p-2 rounded;
}

.insight-positive {
  @apply bg-green-100 text-green-800;
}

.insight-suggestion {
  @apply bg-blue-100 text-blue-800;
}

.insight-challenge {
  @apply bg-purple-100 text-purple-800;
}

.insight-icon {
  @apply text-sm;
}

.insight-text {
  @apply text-sm font-medium;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .welcome-stats {
    @apply flex-col space-y-4 space-x-0;
  }
  
  .stats-cards-grid {
    @apply grid-cols-1;
  }
  
  .recent-grid {
    @apply grid-cols-1;
  }
}

/* 暗色主题支持 */
[data-theme='dark'] .dashboard {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .welcome-title {
  @apply text-gray-100;
}

[data-theme='dark'] .welcome-subtitle {
  @apply text-gray-300;
}

[data-theme='dark'] .section-title {
  @apply text-gray-100;
}

[data-theme='dark'] .quick-action-card {
  @apply bg-gray-800 text-gray-100;
}

[data-theme='dark'] .recommendation-item {
  @apply bg-gray-800 hover:bg-gray-700;
}

[data-theme='dark'] .practice-record:hover {
  @apply bg-gray-800;
}
</style>