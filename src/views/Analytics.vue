<!-- Analytics 数据分析 - 专业级数据分析和洞察 -->
<template>
  <div class="analytics">
    <!-- 分析头部 -->
    <div class="analytics-header">
      <div class="container">
        <div class="header-content">
          <div class="header-info">
            <h1 class="analytics-title">数据分析</h1>
            <p class="analytics-description">深度分析您的学习数据，获得专业级洞察</p>
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
            <div class="analysis-actions">
              <Button
                variant="outline"
                @click="refreshAnalysis"
                :loading="isRefreshing"
              >
                🔄 刷新
              </Button>
              <Button
                variant="outline"
                @click="exportReport"
              >
                📊 导出报告
              </Button>
              <Button
                variant="ghost"
                @click="toggleSettings"
              >
                ⚙️ 设置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要分析区域 -->
    <div class="analytics-main">
      <div class="container">
        <div class="analytics-content">
          <!-- 智能洞察面板 -->
          <div class="insights-panel">
            <Card class="insights-card">
              <template #header>
                <div class="insights-header">
                  <h2 class="insights-title">🧠 智能洞察</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    @click="generateInsights"
                    :loading="isGeneratingInsights"
                  >
                    ✨ 重新分析
                  </Button>
                </div>
              </template>
              
              <div class="insights-content">
                <div class="insights-grid">
                  <div
                    v-for="insight in intelligentInsights"
                    :key="insight.id"
                    class="insight-item"
                    :class="`insight-item--${insight.type}`"
                  >
                    <div class="insight-icon">{{ insight.icon }}</div>
                    <div class="insight-details">
                      <h3 class="insight-title">{{ insight.title }}</h3>
                      <p class="insight-description">{{ insight.description }}</p>
                      <div class="insight-metrics" v-if="insight.metrics">
                        <span 
                          v-for="metric in insight.metrics"
                          :key="metric.key"
                          class="insight-metric"
                        >
                          {{ metric.label }}: <strong>{{ metric.value }}</strong>
                        </span>
                      </div>
                    </div>
                    <Button
                      v-if="insight.action"
                      variant="outline"
                      size="sm"
                      @click="handleInsightAction(insight)"
                    >
                      {{ insight.action.label }}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- 核心指标仪表板 -->
          <div class="dashboard-section">
            <div class="dashboard-grid">
              <!-- 综合表现指数 -->
              <Card class="performance-index-card">
                <div class="performance-index">
                  <div class="index-visual">
                    <div class="circular-progress">
                      <svg class="progress-ring" width="120" height="120">
                        <circle
                          class="progress-ring-background"
                          stroke-width="8"
                          fill="transparent"
                          r="52"
                          cx="60"
                          cy="60"
                        />
                        <circle
                          class="progress-ring-fill"
                          stroke-width="8"
                          fill="transparent"
                          r="52"
                          cx="60"
                          cy="60"
                          :stroke-dasharray="circumference"
                          :stroke-dashoffset="performanceOffset"
                        />
                      </svg>
                      <div class="progress-text">
                        <div class="progress-value">{{ performanceIndex }}</div>
                        <div class="progress-label">综合指数</div>
                      </div>
                    </div>
                  </div>
                  <div class="index-details">
                    <h3 class="index-title">学习表现</h3>
                    <div class="index-components">
                      <div class="component-item">
                        <span class="component-label">速度</span>
                        <span class="component-value">{{ performanceComponents.speed }}%</span>
                      </div>
                      <div class="component-item">
                        <span class="component-label">准确率</span>
                        <span class="component-value">{{ performanceComponents.accuracy }}%</span>
                      </div>
                      <div class="component-item">
                        <span class="component-label">稳定性</span>
                        <span class="component-value">{{ performanceComponents.stability }}%</span>
                      </div>
                      <div class="component-item">
                        <span class="component-label">进步率</span>
                        <span class="component-value">{{ performanceComponents.improvement }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- 关键指标卡片 -->
              <div class="key-metrics">
                <div class="metrics-grid">
                  <Card
                    v-for="metric in keyMetrics"
                    :key="metric.key"
                    class="metric-card"
                    :class="`metric-card--${metric.trend}`"
                  >
                    <div class="metric-content">
                      <div class="metric-icon">{{ metric.icon }}</div>
                      <div class="metric-details">
                        <div class="metric-value">{{ metric.value }}</div>
                        <div class="metric-label">{{ metric.label }}</div>
                        <div class="metric-change" v-if="metric.change">
                          <span class="change-icon">{{ getChangeIcon(metric.change) }}</span>
                          <span class="change-text">{{ formatChange(metric.change) }}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <!-- 高级图表分析 -->
          <div class="charts-section">
            <div class="charts-grid">
              <!-- 多维度性能趋势 -->
              <Card class="chart-card large">
                <template #header>
                  <div class="chart-header">
                    <h3 class="chart-title">性能趋势分析</h3>
                    <div class="chart-controls">
                      <Button
                        v-for="metric in performanceMetrics"
                        :key="metric.value"
                        :variant="selectedPerformanceMetric === metric.value ? 'solid' : 'ghost'"
                        size="sm"
                        @click="selectPerformanceMetric(metric.value)"
                      >
                        {{ metric.label }}
                      </Button>
                    </div>
                  </div>
                </template>
                
                <div class="chart-container large">
                  <MultiLineChart
                    :data="performanceTrendData"
                    :options="performanceChartOptions"
                    :height="400"
                  />
                </div>
              </Card>

              <!-- 学习效率热图 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">学习效率热图</h3>
                </template>
                
                <div class="chart-container">
                  <HeatmapChart
                    :data="efficiencyHeatmapData"
                    :options="heatmapOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 错误模式分析 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">错误模式分析</h3>
                </template>
                
                <div class="chart-container">
                  <SankeyChart
                    :data="errorPatternData"
                    :options="sankeyOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 技能雷达图 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">技能分析</h3>
                </template>
                
                <div class="chart-container">
                  <RadarChart
                    :data="skillRadarData"
                    :options="radarOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 学习时间分布 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">时间分布分析</h3>
                </template>
                
                <div class="chart-container">
                  <TimelineChart
                    :data="timeDistributionData"
                    :options="timelineOptions"
                    :height="300"
                  />
                </div>
              </Card>

              <!-- 进步预测模型 -->
              <Card class="chart-card">
                <template #header>
                  <h3 class="chart-title">进步预测</h3>
                </template>
                
                <div class="chart-container">
                  <PredictionChart
                    :data="progressPredictionData"
                    :options="predictionOptions"
                    :height="300"
                  />
                </div>
              </Card>
            </div>
          </div>

          <!-- 数据钻取分析 -->
          <div class="drill-down-section">
            <Card class="drill-down-card">
              <template #header>
                <div class="drill-down-header">
                  <h3 class="drill-down-title">数据钻取分析</h3>
                  <div class="drill-down-controls">
                    <select v-model="selectedDrillDownDimension" class="dimension-select">
                      <option value="lesson">按课程分析</option>
                      <option value="time">按时间分析</option>
                      <option value="difficulty">按难度分析</option>
                      <option value="errorType">按错误类型分析</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      @click="exportDrillDownData"
                    >
                      📤 导出数据
                    </Button>
                  </div>
                </div>
              </template>
              
              <div class="drill-down-content">
                <div class="drill-down-grid">
                  <!-- 维度概览 -->
                  <div class="dimension-overview">
                    <h4 class="overview-title">{{ getDimensionTitle() }}</h4>
                    <div class="overview-stats">
                      <div
                        v-for="stat in drillDownStats"
                        :key="stat.key"
                        class="overview-stat"
                      >
                        <div class="stat-icon">{{ stat.icon }}</div>
                        <div class="stat-content">
                          <div class="stat-value">{{ stat.value }}</div>
                          <div class="stat-label">{{ stat.label }}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 详细数据表格 -->
                  <div class="drill-down-table">
                    <AdvancedTable
                      :data="drillDownTableData"
                      :columns="drillDownColumns"
                      :sortable="true"
                      :filterable="true"
                      :exportable="true"
                      @row-click="handleDrillDownRowClick"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- 智能推荐和优化建议 -->
          <div class="recommendations-section">
            <div class="recommendations-grid">
              <!-- AI 学习建议 -->
              <Card class="recommendations-card">
                <template #header>
                  <h3 class="recommendations-title">🤖 AI 学习建议</h3>
                </template>
                
                <div class="recommendations-content">
                  <div class="recommendations-list">
                    <div
                      v-for="recommendation in aiRecommendations"
                      :key="recommendation.id"
                      class="recommendation-item"
                      :class="`recommendation-item--${recommendation.priority}`"
                    >
                      <div class="recommendation-header">
                        <div class="recommendation-icon">{{ recommendation.icon }}</div>
                        <div class="recommendation-info">
                          <h4 class="recommendation-title">{{ recommendation.title }}</h4>
                          <p class="recommendation-description">{{ recommendation.description }}</p>
                        </div>
                        <div class="recommendation-priority">
                          <span class="priority-badge">{{ getPriorityLabel(recommendation.priority) }}</span>
                        </div>
                      </div>
                      <div class="recommendation-details" v-if="recommendation.details">
                        <div class="details-grid">
                          <div
                            v-for="detail in recommendation.details"
                            :key="detail.key"
                            class="detail-item"
                          >
                            <span class="detail-label">{{ detail.label }}:</span>
                            <span class="detail-value">{{ detail.value }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="recommendation-actions">
                        <Button
                          v-for="action in recommendation.actions"
                          :key="action.id"
                          :variant="action.primary ? 'solid' : 'outline'"
                          size="sm"
                          @click="handleRecommendationAction(action)"
                        >
                          {{ action.label }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <!-- 个性化目标设定 -->
              <Card class="goals-card">
                <template #header>
                  <h3 class="goals-title">🎯 个性化目标</h3>
                </template>
                
                <div class="goals-content">
                  <div class="goals-list">
                    <div
                      v-for="goal in personalizedGoals"
                      :key="goal.id"
                      class="goal-item"
                      :class="{ 'goal-item--completed': goal.completed }"
                    >
                      <div class="goal-progress">
                        <div class="progress-circle-small">
                          <svg width="40" height="40">
                            <circle
                              class="progress-background"
                              stroke-width="3"
                              fill="transparent"
                              r="16"
                              cx="20"
                              cy="20"
                            />
                            <circle
                              class="progress-foreground"
                              stroke-width="3"
                              fill="transparent"
                              r="16"
                              cx="20"
                              cy="20"
                              :stroke-dasharray="100.48"
                              :stroke-dashoffset="100.48 - (goal.progress / 100) * 100.48"
                            />
                          </svg>
                          <div class="progress-text-small">{{ goal.progress }}%</div>
                        </div>
                      </div>
                      <div class="goal-details">
                        <h4 class="goal-title">{{ goal.title }}</h4>
                        <p class="goal-description">{{ goal.description }}</p>
                        <div class="goal-deadline" v-if="goal.deadline">
                          <span class="deadline-icon">📅</span>
                          <span class="deadline-text">目标时间: {{ formatDate(goal.deadline) }}</span>
                        </div>
                      </div>
                      <div class="goal-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          @click="adjustGoal(goal)"
                        >
                          调整
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div class="goals-actions">
                    <Button
                      variant="solid"
                      @click="createNewGoal"
                    >
                      ➕ 设定新目标
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- 学习效率优化 -->
          <div class="optimization-section">
            <Card class="optimization-card">
              <template #header>
                <h3 class="optimization-title">⚡ 学习效率优化</h3>
              </template>
              
              <div class="optimization-content">
                <div class="optimization-tabs">
                  <button
                    v-for="tab in optimizationTabs"
                    :key="tab.id"
                    class="optimization-tab"
                    :class="{ 'active': selectedOptimizationTab === tab.id }"
                    @click="selectOptimizationTab(tab.id)"
                  >
                    <span class="tab-icon">{{ tab.icon }}</span>
                    <span class="tab-label">{{ tab.label }}</span>
                  </button>
                </div>
                
                <div class="optimization-panel">
                  <!-- 时间优化 -->
                  <div v-if="selectedOptimizationTab === 'time'" class="optimization-time">
                    <TimeOptimizationPanel
                      :analysis-data="timeAnalysisData"
                      :recommendations="timeRecommendations"
                      @apply-optimization="handleTimeOptimization"
                    />
                  </div>
                  
                  <!-- 方法优化 -->
                  <div v-else-if="selectedOptimizationTab === 'method'" class="optimization-method">
                    <MethodOptimizationPanel
                      :learning-patterns="learningPatterns"
                      :efficiency-metrics="efficiencyMetrics"
                      @apply-optimization="handleMethodOptimization"
                    />
                  </div>
                  
                  <!-- 内容优化 -->
                  <div v-else-if="selectedOptimizationTab === 'content'" class="optimization-content">
                    <ContentOptimizationPanel
                      :difficulty-analysis="difficultyAnalysis"
                      :content-recommendations="contentRecommendations"
                      @apply-optimization="handleContentOptimization"
                    />
                  </div>
                  
                  <!-- 环境优化 -->
                  <div v-else-if="selectedOptimizationTab === 'environment'" class="optimization-environment">
                    <EnvironmentOptimizationPanel
                      :environment-factors="environmentFactors"
                      :optimization-suggestions="environmentSuggestions"
                      @apply-optimization="handleEnvironmentOptimization"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    <!-- 分析设置面板 -->
    <AnalyticsSettings
      v-if="showSettings"
      :settings="analyticsSettings"
      @close="closeSettings"
      @save="saveSettings"
    />

    <!-- 报告导出模态框 -->
    <ReportExportModal
      v-if="showExportModal"
      :analytics-data="allAnalyticsData"
      @close="closeExportModal"
      @export="handleReportExport"
    />

    <!-- 目标设定模态框 -->
    <GoalCreationModal
      v-if="showGoalModal"
      :current-performance="performanceData"
      @close="closeGoalModal"
      @create="handleGoalCreation"
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
import MultiLineChart from '@/components/charts/MultiLineChart/index.vue'
import HeatmapChart from '@/components/charts/HeatmapChart/index.vue'
import SankeyChart from '@/components/charts/SankeyChart/index.vue'
import RadarChart from '@/components/charts/RadarChart/index.vue'
import TimelineChart from '@/components/charts/TimelineChart/index.vue'
import PredictionChart from '@/components/charts/PredictionChart/index.vue'
import AdvancedTable from '@/components/analytics/AdvancedTable/index.vue'
import TimeOptimizationPanel from '@/components/analytics/TimeOptimizationPanel/index.vue'
import MethodOptimizationPanel from '@/components/analytics/MethodOptimizationPanel/index.vue'
import ContentOptimizationPanel from '@/components/analytics/ContentOptimizationPanel/index.vue'
import EnvironmentOptimizationPanel from '@/components/analytics/EnvironmentOptimizationPanel/index.vue'
import AnalyticsSettings from '@/components/analytics/AnalyticsSettings/index.vue'
import ReportExportModal from '@/components/analytics/ReportExportModal/index.vue'
import GoalCreationModal from '@/components/analytics/GoalCreationModal/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()

// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const selectedTimeRange = ref('month')
const selectedPerformanceMetric = ref('comprehensive')
const selectedDrillDownDimension = ref('lesson')
const selectedOptimizationTab = ref('time')
const isRefreshing = ref(false)
const isGeneratingInsights = ref(false)
const showSettings = ref(false)
const showExportModal = ref(false)
const showGoalModal = ref(false)

// 配置选项
const timeRanges = ref([
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '今年' },
  { value: 'all', label: '全部' }
])

const performanceMetrics = ref([
  { value: 'comprehensive', label: '综合' },
  { value: 'speed', label: '速度' },
  { value: 'accuracy', label: '准确率' },
  { value: 'stability', label: '稳定性' },
  { value: 'efficiency', label: '效率' }
])

const optimizationTabs = ref([
  { id: 'time', label: '时间优化', icon: '⏰' },
  { id: 'method', label: '方法优化', icon: '🎯' },
  { id: 'content', label: '内容优化', icon: '📚' },
  { id: 'environment', label: '环境优化', icon: '🌍' }
])

// 分析设置
const analyticsSettings = ref({
  enablePrediction: true,
  showAdvancedMetrics: true,
  autoRefresh: false,
  refreshInterval: 300,
  enableNotifications: true,
  dataRetention: 365
})

// 计算属性
const performanceIndex = computed(() => {
  return practiceStore.getPerformanceIndex(selectedTimeRange.value)
})

const performanceComponents = computed(() => {
  return practiceStore.getPerformanceComponents(selectedTimeRange.value)
})

const circumference = computed(() => 2 * Math.PI * 52)
const performanceOffset = computed(() => {
  return circumference.value - (performanceIndex.value / 100) * circumference.value
})

const keyMetrics = computed(() => {
  return practiceStore.getKeyMetrics(selectedTimeRange.value)
})

const intelligentInsights = computed(() => {
  return practiceStore.getIntelligentInsights(selectedTimeRange.value)
})

const performanceTrendData = computed(() => {
  return practiceStore.getPerformanceTrendData(selectedTimeRange.value, selectedPerformanceMetric.value)
})

const efficiencyHeatmapData = computed(() => {
  return practiceStore.getEfficiencyHeatmapData(selectedTimeRange.value)
})

const errorPatternData = computed(() => {
  return practiceStore.getErrorPatternData(selectedTimeRange.value)
})

const skillRadarData = computed(() => {
  return practiceStore.getSkillRadarData(selectedTimeRange.value)
})

const timeDistributionData = computed(() => {
  return practiceStore.getTimeDistributionData(selectedTimeRange.value)
})

const progressPredictionData = computed(() => {
  return practiceStore.getProgressPredictionData()
})

const drillDownStats = computed(() => {
  return practiceStore.getDrillDownStats(selectedDrillDownDimension.value, selectedTimeRange.value)
})

const drillDownTableData = computed(() => {
  return practiceStore.getDrillDownTableData(selectedDrillDownDimension.value, selectedTimeRange.value)
})

const drillDownColumns = computed(() => {
  return practiceStore.getDrillDownColumns(selectedDrillDownDimension.value)
})

const aiRecommendations = computed(() => {
  return practiceStore.getAIRecommendations(selectedTimeRange.value)
})

const personalizedGoals = computed(() => {
  return practiceStore.getPersonalizedGoals()
})

const timeAnalysisData = computed(() => {
  return practiceStore.getTimeAnalysisData(selectedTimeRange.value)
})

const timeRecommendations = computed(() => {
  return practiceStore.getTimeRecommendations()
})

const learningPatterns = computed(() => {
  return practiceStore.getLearningPatterns(selectedTimeRange.value)
})

const efficiencyMetrics = computed(() => {
  return practiceStore.getEfficiencyMetrics(selectedTimeRange.value)
})

const difficultyAnalysis = computed(() => {
  return practiceStore.getDifficultyAnalysis(selectedTimeRange.value)
})

const contentRecommendations = computed(() => {
  return practiceStore.getContentRecommendations()
})

const environmentFactors = computed(() => {
  return practiceStore.getEnvironmentFactors(selectedTimeRange.value)
})

const environmentSuggestions = computed(() => {
  return practiceStore.getEnvironmentSuggestions()
})

const allAnalyticsData = computed(() => {
  return practiceStore.getAllAnalyticsData(selectedTimeRange.value)
})

const performanceData = computed(() => {
  return practiceStore.getPerformanceData(selectedTimeRange.value)
})

// 图表配置
const performanceChartOptions = computed(() => ({
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
        text: '性能指标'
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

const heatmapOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        title: (context) => {
          return `时间: ${context[0].label}`
        },
        label: (context) => {
          return `效率: ${context.parsed.v}%`
        }
      }
    }
  }
})

const sankeyOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${context.parsed.value}`
        }
      }
    }
  }
})

const radarOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100
    }
  }
})

const timelineOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom'
    }
  }
})

const predictionOptions = ref({
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
        text: '预测时间'
      }
    },
    y: {
      display: true,
      title: {
        display: true,
        text: '预测值'
      }
    }
  }
})

// 方法
const selectTimeRange = (range) => {
  selectedTimeRange.value = range
  refreshAnalysisData()
}

const selectPerformanceMetric = (metric) => {
  selectedPerformanceMetric.value = metric
}

const selectOptimizationTab = (tabId) => {
  selectedOptimizationTab.value = tabId
}

const refreshAnalysis = async () => {
  isRefreshing.value = true
  try {
    await practiceStore.refreshAnalyticsData(selectedTimeRange.value)
    appStore.addNotification({
      type: 'success',
      message: '分析数据已刷新',
      duration: 2000
    })
  } catch (error) {
    appStore.addNotification({
      type: 'error',
      message: '刷新失败，请稍后重试',
      duration: 3000
    })
  } finally {
    isRefreshing.value = false
  }
}

const refreshAnalysisData = async () => {
  await practiceStore.loadAnalyticsData(selectedTimeRange.value)
}

const generateInsights = async () => {
  isGeneratingInsights.value = true
  try {
    await practiceStore.generateIntelligentInsights(selectedTimeRange.value)
    appStore.addNotification({
      type: 'success',
      message: 'AI洞察已更新',
      duration: 2000
    })
  } finally {
    isGeneratingInsights.value = false
  }
}

const getChangeIcon = (change) => {
  if (!change) return ''
  return change > 0 ? '📈' : '📉'
}

const formatChange = (change) => {
  if (!change) return ''
  const sign = change > 0 ? '+' : ''
  return `${sign}${change}%`
}

const getDimensionTitle = () => {
  const titles = {
    lesson: '课程维度分析',
    time: '时间维度分析',
    difficulty: '难度维度分析',
    errorType: '错误类型分析'
  }
  return titles[selectedDrillDownDimension.value] || '数据分析'
}

const getPriorityLabel = (priority) => {
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return labels[priority] || ''
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const handleInsightAction = (insight) => {
  if (insight.action.type === 'practice') {
    router.push({ name: 'practice', query: { focus: insight.action.target } })
  } else if (insight.action.type === 'learn') {
    router.push({ name: 'keyboard-learning', params: { lessonId: insight.action.target } })
  } else if (insight.action.type === 'analyze') {
    selectedDrillDownDimension.value = insight.action.target
  }
}

const handleDrillDownRowClick = (row) => {
  // 处理数据钻取行点击，进一步分析
  practiceStore.drillDownAnalysis(row, selectedDrillDownDimension.value)
}

const exportDrillDownData = () => {
  practiceStore.exportDrillDownData(selectedDrillDownDimension.value, selectedTimeRange.value)
  
  appStore.addNotification({
    type: 'success',
    message: '数据导出成功',
    duration: 2000
  })
}

const handleRecommendationAction = (action) => {
  if (action.type === 'practice') {
    router.push({ name: 'practice', query: action.params })
  } else if (action.type === 'learn') {
    router.push({ name: 'keyboard-learning', params: action.params })
  } else if (action.type === 'goal') {
    showGoalModal.value = true
  }
}

const adjustGoal = (goal) => {
  practiceStore.adjustGoal(goal.id)
}

const createNewGoal = () => {
  showGoalModal.value = true
}

const handleTimeOptimization = (optimization) => {
  practiceStore.applyTimeOptimization(optimization)
  
  appStore.addNotification({
    type: 'success',
    message: '时间优化方案已应用',
    duration: 2000
  })
}

const handleMethodOptimization = (optimization) => {
  practiceStore.applyMethodOptimization(optimization)
  
  appStore.addNotification({
    type: 'success',
    message: '学习方法优化已应用',
    duration: 2000
  })
}

const handleContentOptimization = (optimization) => {
  practiceStore.applyContentOptimization(optimization)
  
  appStore.addNotification({
    type: 'success',
    message: '内容优化方案已应用',
    duration: 2000
  })
}

const handleEnvironmentOptimization = (optimization) => {
  practiceStore.applyEnvironmentOptimization(optimization)
  
  appStore.addNotification({
    type: 'success',
    message: '环境优化建议已应用',
    duration: 2000
  })
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}

const closeSettings = () => {
  showSettings.value = false
}

const saveSettings = (settings) => {
  Object.assign(analyticsSettings.value, settings)
  practiceStore.saveAnalyticsSettings(settings)
  
  appStore.addNotification({
    type: 'success',
    message: '分析设置已保存',
    duration: 2000
  })
}

const exportReport = () => {
  showExportModal.value = true
}

const closeExportModal = () => {
  showExportModal.value = false
}

const handleReportExport = (format, options) => {
  practiceStore.exportAnalyticsReport(format, options, selectedTimeRange.value)
  closeExportModal()
  
  appStore.addNotification({
    type: 'success',
    message: '分析报告导出成功',
    duration: 2000
  })
}

const closeGoalModal = () => {
  showGoalModal.value = false
}

const handleGoalCreation = (goal) => {
  practiceStore.createPersonalizedGoal(goal)
  closeGoalModal()
  
  appStore.addNotification({
    type: 'success',
    message: '个性化目标已创建',
    duration: 2000
  })
}

// 监听器
watch(selectedTimeRange, () => {
  refreshAnalysisData()
})

// 生命周期
onMounted(async () => {
  await refreshAnalysisData()
  
  if (analyticsSettings.value.autoRefresh) {
    setInterval(refreshAnalysis, analyticsSettings.value.refreshInterval * 1000)
  }
})
</script>

<style scoped>
.analytics {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 分析头部 */
.analytics-header {
  @apply bg-white border-b border-gray-200 sticky top-16 z-40;
}

.header-content {
  @apply py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between;
}

.header-info {
  @apply mb-4 lg:mb-0;
}

.analytics-title {
  @apply text-2xl lg:text-3xl font-bold text-gray-900 mb-2;
}

.analytics-description {
  @apply text-gray-600 max-w-md;
}

.header-controls {
  @apply flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0;
}

.time-range-selector {
  @apply flex space-x-2;
}

.analysis-actions {
  @apply flex space-x-2;
}

/* 主要分析区域 */
.analytics-main {
  @apply py-8;
}

.analytics-content {
  @apply space-y-8;
}

/* 智能洞察面板 */
.insights-panel {
  @apply space-y-6;
}

.insights-card {
  @apply bg-white border border-purple-200;
}

.insights-header {
  @apply flex items-center justify-between;
}

.insights-title {
  @apply text-xl font-semibold text-purple-800;
}

.insights-content {
  @apply space-y-4;
}

.insights-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.insight-item {
  @apply flex space-x-4 p-4 rounded-lg border;
  @apply transition-all duration-200 hover:shadow-md;
}

.insight-item--critical {
  @apply bg-red-50 border-red-200;
}

.insight-item--warning {
  @apply bg-yellow-50 border-yellow-200;
}

.insight-item--success {
  @apply bg-green-50 border-green-200;
}

.insight-item--info {
  @apply bg-blue-50 border-blue-200;
}

.insight-icon {
  @apply text-2xl flex-shrink-0;
}

.insight-details {
  @apply flex-1 space-y-2;
}

.insight-title {
  @apply font-semibold text-gray-900;
}

.insight-description {
  @apply text-sm text-gray-600;
}

.insight-metrics {
  @apply flex flex-wrap gap-2;
}

.insight-metric {
  @apply text-xs bg-gray-100 px-2 py-1 rounded;
}

/* 核心指标仪表板 */
.dashboard-section {
  @apply space-y-6;
}

.dashboard-grid {
  @apply grid grid-cols-1 xl:grid-cols-3 gap-6;
}

.performance-index-card {
  @apply xl:col-span-1 bg-gradient-to-br from-blue-50 to-purple-50;
}

.performance-index {
  @apply flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 p-6;
}

.index-visual {
  @apply flex-shrink-0;
}

.circular-progress {
  @apply relative;
}

.progress-ring {
  @apply transform -rotate-90;
}

.progress-ring-background {
  @apply stroke-gray-300;
}

.progress-ring-fill {
  @apply stroke-blue-500 transition-all duration-500;
}

.progress-text {
  @apply absolute inset-0 flex flex-col items-center justify-center;
}

.progress-value {
  @apply text-2xl font-bold text-gray-900;
}

.progress-label {
  @apply text-sm text-gray-600;
}

.index-details {
  @apply flex-1 space-y-4;
}

.index-title {
  @apply text-lg font-semibold text-gray-900;
}

.index-components {
  @apply space-y-3;
}

.component-item {
  @apply flex justify-between items-center;
}

.component-label {
  @apply text-sm text-gray-600;
}

.component-value {
  @apply font-semibold text-gray-900;
}

.key-metrics {
  @apply xl:col-span-2;
}

.metrics-grid {
  @apply grid grid-cols-2 lg:grid-cols-4 gap-4;
}

.metric-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.metric-card--up {
  @apply border-l-4 border-green-500;
}

.metric-card--down {
  @apply border-l-4 border-red-500;
}

.metric-card--stable {
  @apply border-l-4 border-gray-500;
}

.metric-content {
  @apply flex items-center space-x-3 p-4;
}

.metric-icon {
  @apply text-2xl;
}

.metric-details {
  @apply flex-1 space-y-1;
}

.metric-value {
  @apply text-xl font-bold text-gray-900;
}

.metric-label {
  @apply text-sm font-medium text-gray-600;
}

.metric-change {
  @apply flex items-center space-x-1 text-xs;
}

.change-icon {
  @apply text-sm;
}

.change-text {
  @apply font-medium;
}

/* 图表分析 */
.charts-section {
  @apply space-y-6;
}

.charts-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6;
}

.chart-card {
  @apply bg-white;
}

.chart-card.large {
  @apply lg:col-span-2 xl:col-span-3;
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

.chart-container.large {
  @apply min-h-96;
}

/* 数据钻取分析 */
.drill-down-section {
  @apply space-y-6;
}

.drill-down-card {
  @apply bg-white;
}

.drill-down-header {
  @apply flex items-center justify-between;
}

.drill-down-title {
  @apply text-lg font-semibold text-gray-900;
}

.drill-down-controls {
  @apply flex items-center space-x-3;
}

.dimension-select {
  @apply px-3 py-2 border border-gray-300 rounded-lg;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.drill-down-content {
  @apply space-y-6;
}

.drill-down-grid {
  @apply grid grid-cols-1 xl:grid-cols-4 gap-6;
}

.dimension-overview {
  @apply xl:col-span-1 space-y-4;
}

.overview-title {
  @apply font-semibold text-gray-900;
}

.overview-stats {
  @apply space-y-3;
}

.overview-stat {
  @apply flex items-center space-x-3 p-3 bg-gray-50 rounded-lg;
}

.stat-icon {
  @apply text-lg;
}

.stat-content {
  @apply space-y-1;
}

.stat-value {
  @apply font-semibold text-gray-900;
}

.stat-label {
  @apply text-sm text-gray-600;
}

.drill-down-table {
  @apply xl:col-span-3;
}

/* 智能推荐和优化建议 */
.recommendations-section {
  @apply space-y-6;
}

.recommendations-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}

.recommendations-card,
.goals-card {
  @apply bg-white;
}

.recommendations-title,
.goals-title {
  @apply text-lg font-semibold text-gray-900;
}

.recommendations-content,
.goals-content {
  @apply space-y-4;
}

.recommendations-list,
.goals-list {
  @apply space-y-4;
}

.recommendation-item {
  @apply border rounded-lg p-4 space-y-3;
  @apply transition-all duration-200 hover:shadow-md;
}

.recommendation-item--high {
  @apply border-red-200 bg-red-50;
}

.recommendation-item--medium {
  @apply border-yellow-200 bg-yellow-50;
}

.recommendation-item--low {
  @apply border-green-200 bg-green-50;
}

.recommendation-header {
  @apply flex items-start space-x-3;
}

.recommendation-icon {
  @apply text-xl flex-shrink-0;
}

.recommendation-info {
  @apply flex-1 space-y-1;
}

.recommendation-title {
  @apply font-semibold text-gray-900;
}

.recommendation-description {
  @apply text-sm text-gray-600;
}

.recommendation-priority {
  @apply flex-shrink-0;
}

.priority-badge {
  @apply px-2 py-1 text-xs font-medium rounded-full;
  @apply bg-blue-100 text-blue-800;
}

.recommendation-details {
  @apply space-y-2;
}

.details-grid {
  @apply grid grid-cols-2 gap-2;
}

.detail-item {
  @apply text-sm;
}

.detail-label {
  @apply text-gray-600;
}

.detail-value {
  @apply font-medium text-gray-900;
}

.recommendation-actions {
  @apply flex space-x-2;
}

.goal-item {
  @apply flex items-center space-x-4 p-4 bg-gray-50 rounded-lg;
  @apply transition-all duration-200 hover:bg-gray-100;
}

.goal-item--completed {
  @apply bg-green-50 border border-green-200;
}

.goal-progress {
  @apply flex-shrink-0;
}

.progress-circle-small {
  @apply relative;
}

.progress-background {
  @apply stroke-gray-300;
}

.progress-foreground {
  @apply stroke-blue-500 transition-all duration-500;
}

.progress-text-small {
  @apply absolute inset-0 flex items-center justify-center;
  @apply text-xs font-bold text-gray-900;
}

.goal-details {
  @apply flex-1 space-y-1;
}

.goal-title {
  @apply font-semibold text-gray-900;
}

.goal-description {
  @apply text-sm text-gray-600;
}

.goal-deadline {
  @apply flex items-center space-x-1 text-xs text-gray-500;
}

.deadline-icon {
  @apply text-sm;
}

.goal-actions {
  @apply flex-shrink-0;
}

.goals-actions {
  @apply text-center;
}

/* 学习效率优化 */
.optimization-section {
  @apply space-y-6;
}

.optimization-card {
  @apply bg-white;
}

.optimization-title {
  @apply text-lg font-semibold text-gray-900;
}

.optimization-content {
  @apply space-y-6;
}

.optimization-tabs {
  @apply flex space-x-1 bg-gray-100 rounded-lg p-1;
}

.optimization-tab {
  @apply flex items-center space-x-2 px-4 py-2 rounded-md;
  @apply text-sm font-medium transition-all;
  @apply text-gray-600 hover:text-gray-900;
}

.optimization-tab.active {
  @apply bg-white text-blue-600 shadow-sm;
}

.tab-icon {
  @apply text-base;
}

.optimization-panel {
  @apply min-h-64;
}

/* 暗色主题支持 */
[data-theme='dark'] .analytics {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .analytics-header {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .analytics-title {
  @apply text-gray-100;
}

[data-theme='dark'] .analytics-description {
  @apply text-gray-300;
}

[data-theme='dark'] .performance-index-card {
  @apply bg-gray-800;
}

[data-theme='dark'] .progress-value {
  @apply text-gray-100;
}

[data-theme='dark'] .progress-label {
  @apply text-gray-400;
}

[data-theme='dark'] .index-title {
  @apply text-gray-200;
}

[data-theme='dark'] .component-label {
  @apply text-gray-400;
}

[data-theme='dark'] .component-value {
  @apply text-gray-200;
}

[data-theme='dark'] .metric-value {
  @apply text-gray-100;
}

[data-theme='dark'] .metric-label {
  @apply text-gray-400;
}

[data-theme='dark'] .chart-title,
[data-theme='dark'] .drill-down-title,
[data-theme='dark'] .recommendations-title,
[data-theme='dark'] .goals-title,
[data-theme='dark'] .optimization-title {
  @apply text-gray-200;
}

[data-theme='dark'] .dimension-select {
  @apply bg-gray-800 border-gray-600 text-gray-200;
}

[data-theme='dark'] .overview-stat {
  @apply bg-gray-700;
}

[data-theme='dark'] .stat-value {
  @apply text-gray-200;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-400;
}

[data-theme='dark'] .recommendation-item {
  @apply border-gray-700;
}

[data-theme='dark'] .recommendation-title {
  @apply text-gray-200;
}

[data-theme='dark'] .recommendation-description {
  @apply text-gray-400;
}

[data-theme='dark'] .goal-item {
  @apply bg-gray-800;
}

[data-theme='dark'] .goal-title {
  @apply text-gray-200;
}

[data-theme='dark'] .goal-description {
  @apply text-gray-400;
}

[data-theme='dark'] .optimization-tabs {
  @apply bg-gray-800;
}

[data-theme='dark'] .optimization-tab {
  @apply text-gray-400 hover:text-gray-200;
}

[data-theme='dark'] .optimization-tab.active {
  @apply bg-gray-700 text-blue-400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-controls {
    @apply flex-col space-y-4;
  }
  
  .time-range-selector {
    @apply grid grid-cols-2 gap-2;
  }
  
  .insights-grid {
    @apply grid-cols-1;
  }
  
  .dashboard-grid {
    @apply grid-cols-1;
  }
  
  .performance-index {
    @apply flex-col space-y-6 space-x-0;
  }
  
  .metrics-grid {
    @apply grid-cols-1;
  }
  
  .charts-grid {
    @apply grid-cols-1;
  }
  
  .drill-down-grid {
    @apply grid-cols-1;
  }
  
  .recommendations-grid {
    @apply grid-cols-1;
  }
  
  .optimization-tabs {
    @apply grid grid-cols-2 gap-1;
  }
}

@media (max-width: 480px) {
  .time-range-selector {
    @apply grid-cols-1;
  }
  
  .analysis-actions {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .chart-header {
    @apply flex-col space-y-3 items-start;
  }
  
  .chart-controls {
    @apply w-full justify-center;
  }
  
  .drill-down-controls {
    @apply flex-col space-y-2 space-x-0 w-full;
  }
  
  .dimension-select {
    @apply w-full;
  }
}
</style>