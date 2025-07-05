<!-- Stats 学习统计 - 现代化数据可视化和分析 -->
<template>
  <div class="stats">
    <!-- 统计头部 -->
    <div class="stats-header">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1 class="stats-title">学习统计</h1>
            <p class="stats-description">深入了解您的学习进度和表现</p>
          </div>
          <div class="header-controls">
            <div class="time-range-selector">
              <Button
                v-for="range in timeRanges"
                :key="range.value"
                :variant="selectedTimeRange === range.value ? 'solid' : 'ghost'"
                size="sm"
                @click="selectTimeRange(range.value)"
              >
                {{ range.label }}
              </Button>
            </div>
            <div class="action-buttons">
              <Button
                variant="outline"
                @click="exportStats"
              >
                📤 导出数据
              </Button>
              <Button
                variant="ghost"
                @click="refreshStats"
                :loading="isRefreshing"
              >
                🔄 刷新
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要统计区域 -->
    <div class="stats-main">
      <div class="container">
        <div class="stats-content">
          <!-- 概览卡片 -->
          <div class="overview-section">
            <div class="overview-grid">
              <Card
                v-for="stat in overviewStats"
                :key="stat.key"
                class="overview-card"
                :class="`overview-card--${stat.color}`"
              >
                <div class="stat-content">
                  <div class="stat-icon">{{ stat.icon }}</div>
                  <div class="stat-details">
                    <div class="stat-value">{{ stat.value }}</div>
                    <div class="stat-label">{{ stat.label }}</div>
                    <div class="stat-trend" :class="getTrendClass(stat.trend)">
                      <span class="trend-icon">{{ getTrendIcon(stat.trend) }}</span>
                      <span class="trend-text">{{ stat.trendText }}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- 图表分析区域 -->
          <div class="charts-section">
            <div class="charts-grid">
              <!-- 练习进度趋势图 -->
              <Card class="chart-card">
                <template #header>
                  <div class="chart-header">
                    <h3 class="chart-title">练习进度趋势</h3>
                    <div class="chart-controls">
                      <Button
                        v-for="metric in progressMetrics"
                        :key="metric.value"
                        :variant="selectedProgressMetric === metric.value ? 'solid' : 'ghost'"
                        size="sm"
                        @click="selectProgressMetric(metric.value)"
                      >
                        {{ metric.label }}
                      </Button>
                    </div>
                  </div>
                </template>
                
                <div class="chart-container">
                  <LineChart
                    :data="progressChartData"
                    :options="progressChartOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 速度准确率分布 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">速度与准确率分布</h3>
                </template>
                
                <div class="chart-container">
                  <ScatterChart
                    :data="speedAccuracyData"
                    :options="scatterChartOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 键位错误分析 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">键位错误分析</h3>
                </template>
                
                <div class="chart-container">
                  <BarChart
                    :data="keyErrorData"
                    :options="barChartOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 练习时间分布 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">练习时间分布</h3>
                </template>
                
                <div class="chart-container">
                  <DoughnutChart
                    :data="timeDistributionData"
                    :options="doughnutChartOptions"
                    :height="300"
                  />
                </div>
              </Card>
            </div>
          </div>

          <!-- 详细统计表格 -->
          <div class="detailed-stats-section">
            <Card class="stats-table-card">
              <template #header>
                <div class="table-header">
                  <h3 class="table-title">练习记录详情</h3>
                  <div class="table-controls">
                    <div class="search-box">
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="搜索练习记录..."
                        class="search-input"
                      >
                    </div>
                    <div class="filter-buttons">
                      <Button
                        v-for="filter in recordFilters"
                        :key="filter.value"
                        :variant="selectedFilter === filter.value ? 'solid' : 'ghost'"
                        size="sm"
                        @click="selectFilter(filter.value)"
                      >
                        {{ filter.label }}
                      </Button>
                    </div>
                  </div>
                </div>
              </template>

              <div class="stats-table-container">
                <StatsTable
                  :data="filteredRecords"
                  :columns="tableColumns"
                  :loading="isLoadingRecords"
                  :sort-by="sortBy"
                  :sort-order="sortOrder"
                  @sort="handleSort"
                  @row-click="handleRowClick"
                />
              </div>

              <div class="table-pagination" v-if="totalPages > 1">
                <Pagination
                  :current-page="currentPage"
                  :total-pages="totalPages"
                  :total-items="totalRecords"
                  @page-change="handlePageChange"
                />
              </div>
            </Card>
          </div>

          <!-- 成就和里程碑 -->
          <div class="achievements-section">
            <Card class="achievements-card">
              <template #header>
                <h3 class="achievements-title">学习成就</h3>
              </template>
              
              <div class="achievements-content">
                <div class="achievements-grid">
                  <div
                    v-for="achievement in recentAchievements"
                    :key="achievement.id"
                    class="achievement-item"
                    :class="{ 'achievement-item--unlocked': achievement.unlocked }"
                  >
                    <div class="achievement-icon">{{ achievement.icon }}</div>
                    <div class="achievement-info">
                      <div class="achievement-name">{{ achievement.name }}</div>
                      <div class="achievement-description">{{ achievement.description }}</div>
                      <div class="achievement-progress" v-if="!achievement.unlocked">
                        <div class="progress-bar">
                          <div 
                            class="progress-fill"
                            :style="{ width: `${achievement.progress}%` }"
                          ></div>
                        </div>
                        <span class="progress-text">{{ achievement.progress }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- 学习洞察 -->
          <div class="insights-section">
            <Card class="insights-card">
              <template #header>
                <h3 class="insights-title">学习洞察</h3>
              </template>
              
              <div class="insights-content">
                <div class="insights-list">
                  <div
                    v-for="insight in learningInsights"
                    :key="insight.id"
                    class="insight-item"
                    :class="`insight-item--${insight.type}`"
                  >
                    <div class="insight-icon">{{ insight.icon }}</div>
                    <div class="insight-content">
                      <div class="insight-title">{{ insight.title }}</div>
                      <div class="insight-description">{{ insight.description }}</div>
                      <div class="insight-action" v-if="insight.action">
                        <Button
                          variant="outline"
                          size="sm"
                          @click="handleInsightAction(insight)"
                        >
                          {{ insight.action.label }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- 比较分析 -->
          <div class="comparison-section" v-if="showComparison">
            <Card class="comparison-card">
              <template #header>
                <div class="comparison-header">
                  <h3 class="comparison-title">对比分析</h3>
                  <div class="comparison-controls">
                    <select v-model="comparisonType" class="comparison-select">
                      <option value="period">时间段对比</option>
                      <option value="lesson">课程对比</option>
                      <option value="scheme">方案对比</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="closeComparison"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </template>
              
              <div class="comparison-content">
                <ComparisonChart
                  :type="comparisonType"
                  :data="comparisonData"
                  :options="comparisonOptions"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据导出模态框 -->
    <ExportModal
      v-if="showExportModal"
      :stats-data="allStatsData"
      @close="closeExportModal"
      @export="handleExport"
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
import LineChart from '@/components/charts/LineChart/index.vue'
import BarChart from '@/components/charts/BarChart/index.vue'
import ScatterChart from '@/components/charts/ScatterChart/index.vue'
import DoughnutChart from '@/components/charts/DoughnutChart/index.vue'
import StatsTable from '@/components/stats/StatsTable/index.vue'
import Pagination from '@/components/base/Pagination/index.vue'
import ComparisonChart from '@/components/charts/ComparisonChart/index.vue'
import ExportModal from '@/components/stats/ExportModal/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()

// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const selectedTimeRange = ref('week')
const selectedProgressMetric = ref('speed')
const selectedFilter = ref('all')
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const isRefreshing = ref(false)
const isLoadingRecords = ref(false)
const showComparison = ref(false)
const comparisonType = ref('period')
const showExportModal = ref(false)

// 配置选项
const timeRanges = ref([
  { value: 'day', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '今年' },
  { value: 'all', label: '全部' }
])

const progressMetrics = ref([
  { value: 'speed', label: '速度' },
  { value: 'accuracy', label: '准确率' },
  { value: 'time', label: '练习时长' },
  { value: 'chars', label: '字符数' }
])

const recordFilters = ref([
  { value: 'all', label: '全部' },
  { value: 'completed', label: '已完成' },
  { value: 'excellent', label: '优秀' },
  { value: 'recent', label: '最近' }
])

const tableColumns = ref([
  { key: 'date', label: '日期', sortable: true },
  { key: 'lesson', label: '课程', sortable: true },
  { key: 'duration', label: '时长', sortable: true },
  { key: 'speed', label: '速度', sortable: true },
  { key: 'accuracy', label: '准确率', sortable: true },
  { key: 'chars', label: '字符数', sortable: true },
  { key: 'score', label: '评分', sortable: true }
])

// 计算属性
const overviewStats = computed(() => [
  {
    key: 'total-time',
    icon: '⏱️',
    value: formatTime(practiceStore.getTotalTime(selectedTimeRange.value)),
    label: '总练习时长',
    color: 'blue',
    trend: practiceStore.getTimeTrend(selectedTimeRange.value),
    trendText: getTrendText(practiceStore.getTimeTrend(selectedTimeRange.value), 'time')
  },
  {
    key: 'avg-speed',
    icon: '⚡',
    value: `${practiceStore.getAverageSpeed(selectedTimeRange.value)} 字/分`,
    label: '平均速度',
    color: 'green',
    trend: practiceStore.getSpeedTrend(selectedTimeRange.value),
    trendText: getTrendText(practiceStore.getSpeedTrend(selectedTimeRange.value), 'speed')
  },
  {
    key: 'accuracy',
    icon: '🎯',
    value: `${practiceStore.getAverageAccuracy(selectedTimeRange.value)}%`,
    label: '平均准确率',
    color: 'yellow',
    trend: practiceStore.getAccuracyTrend(selectedTimeRange.value),
    trendText: getTrendText(practiceStore.getAccuracyTrend(selectedTimeRange.value), 'accuracy')
  },
  {
    key: 'sessions',
    icon: '📊',
    value: practiceStore.getSessionCount(selectedTimeRange.value),
    label: '练习次数',
    color: 'purple',
    trend: practiceStore.getSessionTrend(selectedTimeRange.value),
    trendText: getTrendText(practiceStore.getSessionTrend(selectedTimeRange.value), 'sessions')
  }
])

const progressChartData = computed(() => {
  return practiceStore.getProgressChartData(selectedTimeRange.value, selectedProgressMetric.value)
})

const speedAccuracyData = computed(() => {
  return practiceStore.getSpeedAccuracyData(selectedTimeRange.value)
})

const keyErrorData = computed(() => {
  return practiceStore.getKeyErrorData(selectedTimeRange.value)
})

const timeDistributionData = computed(() => {
  return practiceStore.getTimeDistributionData(selectedTimeRange.value)
})

const filteredRecords = computed(() => {
  let records = practiceStore.getPracticeRecords(selectedTimeRange.value)
  
  // 应用搜索过滤
  if (searchQuery.value) {
    records = records.filter(record => 
      record.lesson.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      record.date.includes(searchQuery.value)
    )
  }
  
  // 应用类型过滤
  if (selectedFilter.value !== 'all') {
    records = practiceStore.filterRecords(records, selectedFilter.value)
  }
  
  // 应用排序
  records = practiceStore.sortRecords(records, sortBy.value, sortOrder.value)
  
  // 分页
  const startIndex = (currentPage.value - 1) * 10
  return records.slice(startIndex, startIndex + 10)
})

const totalRecords = computed(() => {
  return practiceStore.getTotalRecords(selectedTimeRange.value, selectedFilter.value, searchQuery.value)
})

const totalPages = computed(() => {
  return Math.ceil(totalRecords.value / 10)
})

const recentAchievements = computed(() => {
  return practiceStore.getRecentAchievements()
})

const learningInsights = computed(() => {
  return practiceStore.getLearningInsights(selectedTimeRange.value)
})

const comparisonData = computed(() => {
  return practiceStore.getComparisonData(comparisonType.value)
})

const allStatsData = computed(() => {
  return practiceStore.getAllStatsData()
})

// 图表配置
const progressChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: '时间'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: getMetricLabel(selectedProgressMetric.value)
      }
    }
  }
}))

const scatterChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return `速度: ${context.parsed.x} 字/分, 准确率: ${context.parsed.y}%`
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: '速度 (字/分)'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: '准确率 (%)'
      }
    }
  }
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: '键位'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: '错误次数'
      }
    }
  }
})

const doughnutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    }
  }
})

const comparisonOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  }
}))

// 方法
const selectTimeRange = (range) => {
  selectedTimeRange.value = range
  refreshData()
}

const selectProgressMetric = (metric) => {
  selectedProgressMetric.value = metric
}

const selectFilter = (filter) => {
  selectedFilter.value = filter
  currentPage.value = 1
}

const handleSort = (column, order) => {
  sortBy.value = column
  sortOrder.value = order
}

const handleRowClick = (record) => {
  router.push({
    name: 'practice-detail',
    params: { recordId: record.id }
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleInsightAction = (insight) => {
  if (insight.action.type === 'practice') {
    router.push({ name: 'practice', query: { focus: insight.action.target } })
  } else if (insight.action.type === 'compare') {
    showComparison.value = true
    comparisonType.value = insight.action.target
  }
}

const refreshStats = async () => {
  isRefreshing.value = true
  try {
    await practiceStore.refreshStats()
    appStore.showNotification({
      type: 'success',
      message: '统计数据已刷新',
      duration: 2000
    })
  } catch (error) {
    appStore.showNotification({
      type: 'error',
      message: '刷新失败，请稍后重试',
      duration: 3000
    })
  } finally {
    isRefreshing.value = false
  }
}

const refreshData = async () => {
  isLoadingRecords.value = true
  try {
    await practiceStore.loadStatsData(selectedTimeRange.value)
  } finally {
    isLoadingRecords.value = false
  }
}

const exportStats = () => {
  showExportModal.value = true
}

const closeExportModal = () => {
  showExportModal.value = false
}

const handleExport = (format, options) => {
  practiceStore.exportStats(format, options)
  closeExportModal()
  
  appStore.showNotification({
    type: 'success',
    message: '数据导出成功',
    duration: 2000
  })
}

const closeComparison = () => {
  showComparison.value = false
}

// 工具函数
const formatTime = (seconds) => {
  if (!seconds) return '0小时'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

const getTrendClass = (trend) => {
  if (!trend) return ''
  return {
    'trend--up': trend > 0,
    'trend--down': trend < 0,
    'trend--stable': trend === 0
  }
}

const getTrendIcon = (trend) => {
  if (!trend) return ''
  if (trend > 0) return '📈'
  if (trend < 0) return '📉'
  return '➡️'
}

const getTrendText = (trend, type) => {
  if (!trend) return '无变化'
  
  const isGood = (type === 'time' && trend < 0) || (type !== 'time' && trend > 0)
  const direction = trend > 0 ? '增加' : '减少'
  const abs = Math.abs(trend)
  
  let unit = ''
  if (type === 'time') unit = '分钟'
  else if (type === 'speed') unit = '字/分'
  else if (type === 'accuracy') unit = '%'
  else unit = '次'
  
  return `较上期${direction} ${abs}${unit}`
}

const getMetricLabel = (metric) => {
  const labels = {
    speed: '速度 (字/分)',
    accuracy: '准确率 (%)',
    time: '时长 (分钟)',
    chars: '字符数'
  }
  return labels[metric] || ''
}

// 监听器
watch(searchQuery, () => {
  currentPage.value = 1
})

// 生命周期
onMounted(async () => {
  await refreshData()
})
</script>

<style scoped>
.stats {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 统计头部 */
.stats-header {
  @apply bg-white border-b border-gray-200 sticky top-16 z-40;
}

.header-content {
  @apply py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between;
}

.header-info {
  @apply mb-4 lg:mb-0;
}

.stats-title {
  @apply text-2xl lg:text-3xl font-bold text-gray-900 mb-2;
}

.stats-description {
  @apply text-gray-600 max-w-md;
}

.header-controls {
  @apply flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0;
}

.time-range-selector {
  @apply flex space-x-2;
}

.action-buttons {
  @apply flex space-x-2;
}

/* 主要统计区域 */
.stats-main {
  @apply py-8;
}

.stats-content {
  @apply space-y-8;
}

/* 概览卡片 */
.overview-section {
  @apply space-y-6;
}

.overview-grid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6;
}

.overview-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.overview-card--blue {
  @apply border-l-4 border-blue-500;
}

.overview-card--green {
  @apply border-l-4 border-green-500;
}

.overview-card--yellow {
  @apply border-l-4 border-yellow-500;
}

.overview-card--purple {
  @apply border-l-4 border-purple-500;
}

.stat-content {
  @apply flex items-center space-x-4;
}

.stat-icon {
  @apply text-3xl;
}

.stat-details {
  @apply flex-1 space-y-1;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm font-medium text-gray-600;
}

.stat-trend {
  @apply flex items-center space-x-1 text-xs;
}

.trend--up {
  @apply text-green-600;
}

.trend--down {
  @apply text-red-600;
}

.trend--stable {
  @apply text-gray-600;
}

.trend-icon {
  @apply text-sm;
}

/* 图表区域 */
.charts-section {
  @apply space-y-6;
}

.charts-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.chart-card {
  @apply bg-white;
}

.chart-header {
  @apply flex items-center justify-between;
}

.chart-title {
  @apply text-lg font-semibold text-gray-900;
}

.chart-controls {
  @apply flex space-x-2;
}

.chart-container {
  @apply relative;
}

/* 详细统计表格 */
.detailed-stats-section {
  @apply space-y-6;
}

.stats-table-card {
  @apply bg-white;
}

.table-header {
  @apply flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0;
}

.table-title {
  @apply text-lg font-semibold text-gray-900;
}

.table-controls {
  @apply flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0;
}

.search-box {
  @apply relative;
}

.search-input {
  @apply w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.filter-buttons {
  @apply flex space-x-2;
}

.stats-table-container {
  @apply overflow-x-auto;
}

.table-pagination {
  @apply mt-6 flex justify-center;
}

/* 成就区域 */
.achievements-section {
  @apply space-y-6;
}

.achievements-card {
  @apply bg-white;
}

.achievements-title {
  @apply text-lg font-semibold text-gray-900;
}

.achievements-content {
  @apply space-y-4;
}

.achievements-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.achievement-item {
  @apply flex items-center space-x-4 p-4 rounded-lg border border-gray-200;
  @apply transition-all duration-200;
}

.achievement-item--unlocked {
  @apply bg-yellow-50 border-yellow-200;
}

.achievement-icon {
  @apply text-2xl;
}

.achievement-info {
  @apply flex-1 space-y-2;
}

.achievement-name {
  @apply font-semibold text-gray-900;
}

.achievement-description {
  @apply text-sm text-gray-600;
}

.achievement-progress {
  @apply flex items-center space-x-2;
}

.progress-bar {
  @apply flex-1 h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-blue-500 rounded-full transition-all duration-500;
}

.progress-text {
  @apply text-xs text-gray-600;
}

/* 学习洞察 */
.insights-section {
  @apply space-y-6;
}

.insights-card {
  @apply bg-white;
}

.insights-title {
  @apply text-lg font-semibold text-gray-900;
}

.insights-content {
  @apply space-y-4;
}

.insights-list {
  @apply space-y-4;
}

.insight-item {
  @apply flex items-start space-x-4 p-4 rounded-lg;
}

.insight-item--positive {
  @apply bg-green-50 border border-green-200;
}

.insight-item--warning {
  @apply bg-yellow-50 border border-yellow-200;
}

.insight-item--info {
  @apply bg-blue-50 border border-blue-200;
}

.insight-icon {
  @apply text-2xl mt-1;
}

.insight-content {
  @apply flex-1 space-y-2;
}

.insight-title {
  @apply font-semibold text-gray-900;
}

.insight-description {
  @apply text-sm text-gray-600;
}

.insight-action {
  @apply mt-3;
}

/* 比较分析 */
.comparison-section {
  @apply space-y-6;
}

.comparison-card {
  @apply bg-white;
}

.comparison-header {
  @apply flex items-center justify-between;
}

.comparison-title {
  @apply text-lg font-semibold text-gray-900;
}

.comparison-controls {
  @apply flex items-center space-x-3;
}

.comparison-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.comparison-content {
  @apply mt-6;
}

/* 暗色主题支持 */
[data-theme='dark'] .stats {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .stats-header {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .stats-title {
  @apply text-gray-100;
}

[data-theme='dark'] .stats-description {
  @apply text-gray-300;
}

[data-theme='dark'] .stat-value {
  @apply text-gray-100;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-400;
}

[data-theme='dark'] .chart-title,
[data-theme='dark'] .table-title,
[data-theme='dark'] .achievements-title,
[data-theme='dark'] .insights-title,
[data-theme='dark'] .comparison-title {
  @apply text-gray-200;
}

[data-theme='dark'] .search-input {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

[data-theme='dark'] .achievement-item {
  @apply border-gray-700;
}

[data-theme='dark'] .achievement-name {
  @apply text-gray-200;
}

[data-theme='dark'] .achievement-description {
  @apply text-gray-400;
}

[data-theme='dark'] .insight-title {
  @apply text-gray-200;
}

[data-theme='dark'] .insight-description {
  @apply text-gray-400;
}

[data-theme='dark'] .comparison-select {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-controls {
    @apply flex-col space-y-4;
  }
  
  .time-range-selector {
    @apply grid grid-cols-3 gap-2;
  }
  
  .charts-grid {
    @apply grid-cols-1;
  }
  
  .achievements-grid {
    @apply grid-cols-1;
  }
  
  .table-controls {
    @apply flex-col space-y-4;
  }
  
  .search-input {
    @apply w-full;
  }
}
</style>