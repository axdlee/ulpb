<!-- CompletionModal 练习完成模态框 - 显示练习结果和后续操作 -->
<template>
  <teleport to="body">
    <div class="completion-modal-overlay" @click="handleOverlayClick">
      <div class="completion-modal" @click.stop>
        <!-- 模态框头部 -->
        <div class="modal-header">
          <div class="completion-celebration">
            <div class="celebration-icon">🎉</div>
            <h2 class="completion-title">练习完成！</h2>
            <p class="completion-subtitle">恭喜您完成了这次练习</p>
          </div>
        </div>

        <!-- 结果统计 -->
        <div class="modal-body">
          <div class="results-section">
            <!-- 主要统计 -->
            <div class="main-stats">
              <div class="stat-card primary-stat">
                <div class="stat-icon">⚡</div>
                <div class="stat-content">
                  <div class="stat-value">{{ results?.speed || 0 }}</div>
                  <div class="stat-label">字/分钟</div>
                  <div class="stat-change" :class="getChangeClass(results?.speedChange)">
                    {{ formatChange(results?.speedChange) }}
                  </div>
                </div>
              </div>

              <div class="stat-card primary-stat">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                  <div class="stat-value">{{ results?.accuracy || 100 }}%</div>
                  <div class="stat-label">准确率</div>
                  <div class="stat-change" :class="getChangeClass(results?.accuracyChange)">
                    {{ formatChange(results?.accuracyChange) }}
                  </div>
                </div>
              </div>

              <div class="stat-card primary-stat">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                  <div class="stat-value">{{ formatTime(results?.duration || 0) }}</div>
                  <div class="stat-label">用时</div>
                  <div class="stat-change" :class="getChangeClass(results?.timeChange, true)">
                    {{ formatChange(results?.timeChange, true) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 详细统计 -->
            <div class="detailed-stats">
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">总字符数</span>
                  <span class="stat-value">{{ results?.totalChars || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">正确字符</span>
                  <span class="stat-value text-green-600">{{ results?.correctChars || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">错误字符</span>
                  <span class="stat-value text-red-600">{{ results?.errorChars || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">修正次数</span>
                  <span class="stat-value">{{ results?.corrections || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">连续正确</span>
                  <span class="stat-value">{{ results?.maxStreak || 0 }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">平均响应</span>
                  <span class="stat-value">{{ results?.avgResponseTime || 0 }}ms</span>
                </div>
              </div>
            </div>

            <!-- 成绩评级 -->
            <div class="grade-section">
              <div class="grade-container">
                <div class="grade-icon">{{ getGradeIcon() }}</div>
                <div class="grade-info">
                  <div class="grade-text">{{ getGradeText() }}</div>
                  <div class="grade-description">{{ getGradeDescription() }}</div>
                </div>
                <div class="grade-score">{{ getGradeScore() }}</div>
              </div>
            </div>

            <!-- 进步分析 -->
            <div class="progress-analysis" v-if="hasProgressData">
              <h3 class="analysis-title">进步分析</h3>
              <div class="analysis-content">
                <div class="progress-chart">
                  <!-- 简化的进度图表 -->
                  <div class="chart-container">
                    <div class="chart-bars">
                      <div 
                        v-for="(data, index) in progressData" 
                        :key="index"
                        class="chart-bar"
                        :style="{ height: `${data.percentage}%` }"
                        :title="`第${index + 1}次: ${data.value}`"
                      ></div>
                    </div>
                    <div class="chart-labels">
                      <span>历史记录</span>
                      <span>本次练习</span>
                    </div>
                  </div>
                </div>
                <div class="progress-insights">
                  <div 
                    v-for="insight in progressInsights"
                    :key="insight.id"
                    class="insight-item"
                  >
                    <span class="insight-icon">{{ insight.icon }}</span>
                    <span class="insight-text">{{ insight.text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 错误分析 -->
            <div class="error-analysis" v-if="hasErrors">
              <h3 class="analysis-title">错误分析</h3>
              <div class="error-content">
                <div class="error-summary">
                  <div class="error-types">
                    <div 
                      v-for="errorType in errorTypes"
                      :key="errorType.type"
                      class="error-type-item"
                    >
                      <div class="error-type-icon">{{ errorType.icon }}</div>
                      <div class="error-type-info">
                        <div class="error-type-name">{{ errorType.name }}</div>
                        <div class="error-type-count">{{ errorType.count }} 次</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="weak-keys" v-if="weakKeys?.length">
                  <div class="weak-keys-title">薄弱键位</div>
                  <div class="weak-keys-list">
                    <span 
                      v-for="key in weakKeys"
                      :key="key.key"
                      class="weak-key"
                      :title="`错误率: ${key.errorRate}%`"
                    >
                      {{ key.key.toUpperCase() }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 新解锁内容 -->
            <div class="achievements-section" v-if="newAchievements?.length">
              <h3 class="achievements-title">🏆 新成就解锁</h3>
              <div class="achievements-list">
                <div 
                  v-for="achievement in newAchievements"
                  :key="achievement.id"
                  class="achievement-item"
                >
                  <div class="achievement-icon">{{ achievement.icon }}</div>
                  <div class="achievement-info">
                    <div class="achievement-name">{{ achievement.name }}</div>
                    <div class="achievement-description">{{ achievement.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="modal-footer">
          <div class="action-buttons">
            <!-- 主要操作 -->
            <div class="primary-actions">
              <button 
                class="action-button primary"
                @click="handleContinue"
                v-if="hasNextLesson"
              >
                <span class="button-icon">➡️</span>
                <span class="button-text">继续下一课</span>
              </button>
              
              <button 
                class="action-button primary"
                @click="handleRestart"
              >
                <span class="button-icon">🔄</span>
                <span class="button-text">重新练习</span>
              </button>
            </div>

            <!-- 次要操作 -->
            <div class="secondary-actions">
              <button 
                class="action-button secondary"
                @click="handleReview"
                v-if="hasErrors"
              >
                <span class="button-icon">📝</span>
                <span class="button-text">错误回顾</span>
              </button>

              <button 
                class="action-button secondary"
                @click="handleShare"
              >
                <span class="button-icon">📤</span>
                <span class="button-text">分享成绩</span>
              </button>

              <button 
                class="action-button ghost"
                @click="handleExit"
              >
                <span class="button-icon">🏠</span>
                <span class="button-text">返回首页</span>
              </button>
            </div>
          </div>

          <!-- 快速推荐 -->
          <div class="quick-recommendations" v-if="recommendations?.length">
            <div class="recommendations-title">推荐练习</div>
            <div class="recommendations-list">
              <button
                v-for="rec in recommendations"
                :key="rec.id"
                class="recommendation-item"
                @click="handleRecommendationClick(rec)"
              >
                <span class="rec-icon">{{ rec.icon }}</span>
                <span class="rec-title">{{ rec.title }}</span>
                <span class="rec-description">{{ rec.description }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  results: {
    type: Object,
    required: true
  },
  hasNextLesson: {
    type: Boolean,
    default: false
  },
  allowOutsideClick: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['restart', 'continue', 'exit', 'review', 'share', 'recommendationClick'])

// 计算属性
const hasProgressData = computed(() => props.results?.progressData?.length > 0)
const hasErrors = computed(() => props.results?.errorChars > 0)
const newAchievements = computed(() => props.results?.achievements || [])
const weakKeys = computed(() => props.results?.weakKeys || [])
const errorTypes = computed(() => props.results?.errorTypes || [])
const recommendations = computed(() => props.results?.recommendations || [])
const progressData = computed(() => props.results?.progressData || [])
const progressInsights = computed(() => props.results?.insights || [])

// 方法
const getChangeClass = (change, isTime = false) => {
  if (!change) return ''
  
  if (isTime) {
    // 对于时间，减少是好的
    return change > 0 ? 'stat-change--negative' : 'stat-change--positive'
  } else {
    // 对于速度和准确率，增加是好的
    return change > 0 ? 'stat-change--positive' : 'stat-change--negative'
  }
}

const formatChange = (change, isTime = false) => {
  if (!change) return ''
  
  const sign = change > 0 ? '+' : ''
  const icon = getChangeIcon(change, isTime)
  
  return `${icon} ${sign}${change}${isTime ? 's' : ''}`
}

const getChangeIcon = (change, isTime = false) => {
  if (!change) return ''
  
  if (isTime) {
    return change > 0 ? '📈' : '📉'
  } else {
    return change > 0 ? '📈' : '📉'
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${seconds}s`
}

const getGradeIcon = () => {
  const accuracy = props.results?.accuracy || 0
  
  if (accuracy >= 98) return '🏆'
  if (accuracy >= 95) return '🥇'
  if (accuracy >= 90) return '🥈'
  if (accuracy >= 80) return '🥉'
  if (accuracy >= 70) return '⭐'
  return '📚'
}

const getGradeText = () => {
  const accuracy = props.results?.accuracy || 0
  
  if (accuracy >= 98) return '完美'
  if (accuracy >= 95) return '优秀'
  if (accuracy >= 90) return '良好'
  if (accuracy >= 80) return '合格'
  if (accuracy >= 70) return '及格'
  return '需要改进'
}

const getGradeDescription = () => {
  const accuracy = props.results?.accuracy || 0
  
  if (accuracy >= 98) return '打字技能已达到专业水平'
  if (accuracy >= 95) return '表现出色，继续保持'
  if (accuracy >= 90) return '掌握良好，稍加练习即可精通'
  if (accuracy >= 80) return '基本掌握，需要进一步提高'
  if (accuracy >= 70) return '有待提高，建议多加练习'
  return '需要从基础开始练习'
}

const getGradeScore = () => {
  const accuracy = props.results?.accuracy || 0
  const speed = props.results?.speed || 0
  
  // 简化的评分算法
  const score = Math.round((accuracy * 0.6 + Math.min(speed / 60, 1) * 40))
  return `${score}分`
}

const handleOverlayClick = () => {
  if (props.allowOutsideClick) {
    handleExit()
  }
}

const handleRestart = () => {
  emit('restart')
}

const handleContinue = () => {
  emit('continue')
}

const handleExit = () => {
  emit('exit')
}

const handleReview = () => {
  emit('review')
}

const handleShare = () => {
  emit('share')
}

const handleRecommendationClick = (recommendation) => {
  emit('recommendationClick', recommendation)
}
</script>

<style scoped>
.completion-modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply bg-black bg-opacity-50 backdrop-blur-sm;
  @apply p-4;
}

.completion-modal {
  @apply bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-full overflow-y-auto;
  @apply relative;
}

/* 模态框头部 */
.modal-header {
  @apply p-6 pb-4 text-center;
}

.completion-celebration {
  @apply space-y-3;
}

.celebration-icon {
  @apply text-6xl animate-bounce;
}

.completion-title {
  @apply text-3xl font-bold text-gray-900;
}

.completion-subtitle {
  @apply text-lg text-gray-600;
}

/* 模态框主体 */
.modal-body {
  @apply px-6 pb-4;
}

.results-section {
  @apply space-y-8;
}

/* 主要统计 */
.main-stats {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.stat-card {
  @apply bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6;
  @apply border border-blue-200;
}

.primary-stat {
  @apply flex items-center space-x-4;
}

.stat-icon {
  @apply text-3xl;
}

.stat-content {
  @apply flex-1 space-y-1;
}

.stat-value {
  @apply text-3xl font-bold text-gray-900;
}

.stat-label {
  @apply text-sm font-medium text-gray-600;
}

.stat-change {
  @apply text-xs font-medium;
}

.stat-change--positive {
  @apply text-green-600;
}

.stat-change--negative {
  @apply text-red-600;
}

/* 详细统计 */
.detailed-stats {
  @apply bg-gray-50 rounded-lg p-6;
}

.stats-grid {
  @apply grid grid-cols-2 md:grid-cols-3 gap-4;
}

.stat-item {
  @apply flex justify-between items-center;
}

.stat-item .stat-label {
  @apply text-sm text-gray-600;
}

.stat-item .stat-value {
  @apply font-semibold text-gray-900;
}

/* 成绩评级 */
.grade-section {
  @apply bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6;
}

.grade-container {
  @apply flex items-center space-x-4;
}

.grade-icon {
  @apply text-4xl;
}

.grade-info {
  @apply flex-1 space-y-1;
}

.grade-text {
  @apply text-2xl font-bold text-orange-800;
}

.grade-description {
  @apply text-sm text-orange-700;
}

.grade-score {
  @apply text-2xl font-bold text-orange-800;
}

/* 进步分析 */
.progress-analysis,
.error-analysis,
.achievements-section {
  @apply space-y-4;
}

.analysis-title,
.achievements-title {
  @apply text-lg font-semibold text-gray-900;
}

.analysis-content {
  @apply bg-gray-50 rounded-lg p-4 space-y-4;
}

.chart-container {
  @apply space-y-2;
}

.chart-bars {
  @apply flex items-end space-x-2 h-24;
}

.chart-bar {
  @apply flex-1 bg-blue-500 rounded-t min-h-2;
  @apply transition-all duration-500;
}

.chart-labels {
  @apply flex justify-between text-xs text-gray-600;
}

.progress-insights {
  @apply space-y-2;
}

.insight-item {
  @apply flex items-center space-x-2 text-sm text-gray-700;
}

.insight-icon {
  @apply text-base;
}

/* 错误分析 */
.error-content {
  @apply space-y-4;
}

.error-types {
  @apply space-y-3;
}

.error-type-item {
  @apply flex items-center space-x-3;
}

.error-type-icon {
  @apply text-lg;
}

.error-type-info {
  @apply space-y-1;
}

.error-type-name {
  @apply font-medium text-gray-900;
}

.error-type-count {
  @apply text-sm text-gray-600;
}

.weak-keys {
  @apply space-y-2;
}

.weak-keys-title {
  @apply font-medium text-gray-900;
}

.weak-keys-list {
  @apply flex flex-wrap gap-2;
}

.weak-key {
  @apply px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-mono;
}

/* 成就列表 */
.achievements-list {
  @apply space-y-3;
}

.achievement-item {
  @apply flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg;
}

.achievement-icon {
  @apply text-2xl;
}

.achievement-info {
  @apply space-y-1;
}

.achievement-name {
  @apply font-semibold text-yellow-800;
}

.achievement-description {
  @apply text-sm text-yellow-700;
}

/* 模态框底部 */
.modal-footer {
  @apply p-6 space-y-6 border-t border-gray-200;
}

.action-buttons {
  @apply space-y-4;
}

.primary-actions,
.secondary-actions {
  @apply flex flex-wrap gap-3 justify-center;
}

.action-button {
  @apply flex items-center space-x-2 px-6 py-3 rounded-lg;
  @apply font-medium transition-all duration-200;
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

.button-icon {
  @apply text-lg;
}

/* 推荐练习 */
.quick-recommendations {
  @apply space-y-3;
}

.recommendations-title {
  @apply text-lg font-semibold text-gray-900 text-center;
}

.recommendations-list {
  @apply grid grid-cols-1 md:grid-cols-2 gap-3;
}

.recommendation-item {
  @apply flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100;
  @apply rounded-lg transition-colors;
}

.rec-icon {
  @apply text-lg;
}

.rec-title {
  @apply font-medium text-gray-900;
}

.rec-description {
  @apply text-sm text-gray-600;
}

/* 暗色主题 */
[data-theme='dark'] .completion-modal {
  @apply bg-gray-900;
}

[data-theme='dark'] .completion-title {
  @apply text-gray-100;
}

[data-theme='dark'] .completion-subtitle {
  @apply text-gray-400;
}

[data-theme='dark'] .stat-card {
  @apply bg-gray-800 border-gray-700;
}

[data-theme='dark'] .stat-value {
  @apply text-gray-100;
}

[data-theme='dark'] .stat-label {
  @apply text-gray-400;
}

[data-theme='dark'] .detailed-stats {
  @apply bg-gray-800;
}

[data-theme='dark'] .stat-item .stat-label {
  @apply text-gray-400;
}

[data-theme='dark'] .stat-item .stat-value {
  @apply text-gray-200;
}

[data-theme='dark'] .grade-section {
  @apply bg-gray-800;
}

[data-theme='dark'] .grade-text {
  @apply text-yellow-400;
}

[data-theme='dark'] .grade-description {
  @apply text-yellow-300;
}

[data-theme='dark'] .grade-score {
  @apply text-yellow-400;
}

[data-theme='dark'] .analysis-title,
[data-theme='dark'] .achievements-title {
  @apply text-gray-200;
}

[data-theme='dark'] .analysis-content {
  @apply bg-gray-800;
}

[data-theme='dark'] .modal-footer {
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
  .completion-modal {
    @apply mx-2 my-4 max-h-screen;
  }
  
  .main-stats {
    @apply grid-cols-1;
  }
  
  .stats-grid {
    @apply grid-cols-1;
  }
  
  .primary-actions,
  .secondary-actions {
    @apply flex-col;
  }
  
  .action-button {
    @apply w-full justify-center;
  }
  
  .recommendations-list {
    @apply grid-cols-1;
  }
}
</style>