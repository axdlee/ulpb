/**
 * 数据分析引擎
 * 提供全面的学习数据分析、统计计算和可视化数据生成
 */

import { reactive, computed } from 'vue'
import { storageManager } from '../../utils/storage.js'

export class AnalyticsEngine {
  constructor() {
    this.state = reactive({
      // 原始数据
      sessions: [],
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {},
      
      // 分析结果
      insights: [],
      trends: {},
      predictions: {},
      
      // 缓存
      cache: {},
      lastUpdate: null
    })

    this.loadData()
  }

  /**
   * 添加新的练习会话数据
   */
  addSession(sessionData) {
    const session = {
      id: Date.now(),
      timestamp: sessionData.timestamp || Date.now(),
      duration: sessionData.duration,
      speed: sessionData.speed,
      accuracy: sessionData.accuracy,
      characters: sessionData.totalCharacters,
      errors: sessionData.errors || [],
      keystrokes: sessionData.keystrokes || [],
      lessonType: sessionData.lessonType || 'general',
      difficulty: sessionData.difficulty || 'normal'
    }

    this.state.sessions.push(session)
    this.updateAggregatedStats(session)
    this.generateInsights()
    this.saveData()

    return session.id
  }

  /**
   * 更新聚合统计数据
   */
  updateAggregatedStats(session) {
    const date = new Date(session.timestamp)
    const dateKey = this.getDateKey(date)
    const weekKey = this.getWeekKey(date)
    const monthKey = this.getMonthKey(date)

    // 更新日统计
    this.updateDayStat(dateKey, session)
    
    // 更新周统计
    this.updateWeekStat(weekKey, session)
    
    // 更新月统计
    this.updateMonthStat(monthKey, session)
  }

  /**
   * 更新日统计
   */
  updateDayStat(dateKey, session) {
    if (!this.state.dailyStats[dateKey]) {
      this.state.dailyStats[dateKey] = {
        date: dateKey,
        sessions: 0,
        totalTime: 0,
        totalCharacters: 0,
        totalErrors: 0,
        avgSpeed: 0,
        avgAccuracy: 0,
        bestSpeed: 0,
        bestAccuracy: 0
      }
    }

    const dayStat = this.state.dailyStats[dateKey]
    dayStat.sessions++
    dayStat.totalTime += session.duration
    dayStat.totalCharacters += session.characters
    dayStat.totalErrors += session.errors.length

    // 更新平均值
    dayStat.avgSpeed = this.calculateAverage(dayStat, 'speed', session.speed)
    dayStat.avgAccuracy = this.calculateAverage(dayStat, 'accuracy', session.accuracy)

    // 更新最佳成绩
    dayStat.bestSpeed = Math.max(dayStat.bestSpeed, session.speed)
    dayStat.bestAccuracy = Math.max(dayStat.bestAccuracy, session.accuracy)
  }

  /**
   * 更新周统计
   */
  updateWeekStat(weekKey, session) {
    if (!this.state.weeklyStats[weekKey]) {
      this.state.weeklyStats[weekKey] = {
        week: weekKey,
        sessions: 0,
        totalTime: 0,
        totalCharacters: 0,
        avgSpeed: 0,
        avgAccuracy: 0,
        improvement: 0
      }
    }

    const weekStat = this.state.weeklyStats[weekKey]
    weekStat.sessions++
    weekStat.totalTime += session.duration
    weekStat.totalCharacters += session.characters
    weekStat.avgSpeed = this.calculateAverage(weekStat, 'speed', session.speed)
    weekStat.avgAccuracy = this.calculateAverage(weekStat, 'accuracy', session.accuracy)
  }

  /**
   * 更新月统计
   */
  updateMonthStat(monthKey, session) {
    if (!this.state.monthlyStats[monthKey]) {
      this.state.monthlyStats[monthKey] = {
        month: monthKey,
        sessions: 0,
        totalTime: 0,
        totalCharacters: 0,
        avgSpeed: 0,
        avgAccuracy: 0
      }
    }

    const monthStat = this.state.monthlyStats[monthKey]
    monthStat.sessions++
    monthStat.totalTime += session.duration
    monthStat.totalCharacters += session.characters
    monthStat.avgSpeed = this.calculateAverage(monthStat, 'speed', session.speed)
    monthStat.avgAccuracy = this.calculateAverage(monthStat, 'accuracy', session.accuracy)
  }

  /**
   * 生成学习洞察
   */
  generateInsights() {
    const insights = []

    // 学习趋势分析
    const speedTrend = this.analyzeSpeedTrend()
    if (speedTrend.significant) {
      insights.push({
        type: 'trend',
        category: 'speed',
        title: speedTrend.improving ? '打字速度稳步提升' : '打字速度需要关注',
        description: `最近${speedTrend.period}天速度${speedTrend.improving ? '提升' : '下降'}了${Math.abs(speedTrend.change)}字/分钟`,
        level: speedTrend.improving ? 'positive' : 'warning',
        recommendation: speedTrend.improving ? '继续保持！' : '建议增加练习时间或调整练习方法'
      })
    }

    // 准确率分析
    const accuracyTrend = this.analyzeAccuracyTrend()
    if (accuracyTrend.significant) {
      insights.push({
        type: 'trend',
        category: 'accuracy',
        title: accuracyTrend.improving ? '准确率持续改善' : '准确率波动较大',
        description: `最近${accuracyTrend.period}天准确率${accuracyTrend.improving ? '提升' : '下降'}了${Math.abs(accuracyTrend.change)}%`,
        level: accuracyTrend.improving ? 'positive' : 'warning',
        recommendation: accuracyTrend.improving ? '很好的进步！' : '建议放慢速度，专注准确性'
      })
    }

    // 学习习惯分析
    const habitInsight = this.analyzeStudyHabits()
    if (habitInsight) {
      insights.push(habitInsight)
    }

    // 错误模式分析
    const errorInsight = this.analyzeErrorPatterns()
    if (errorInsight) {
      insights.push(errorInsight)
    }

    // 最佳练习时间分析
    const timeInsight = this.analyzeBestPracticeTime()
    if (timeInsight) {
      insights.push(timeInsight)
    }

    this.state.insights = insights
  }

  /**
   * 分析速度趋势
   */
  analyzeSpeedTrend() {
    const recentSessions = this.getRecentSessions(14) // 最近14天
    if (recentSessions.length < 5) return { significant: false }

    const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2))
    const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2))

    const firstAvg = this.calculateSessionsAverage(firstHalf, 'speed')
    const secondAvg = this.calculateSessionsAverage(secondHalf, 'speed')

    const change = secondAvg - firstAvg
    const significant = Math.abs(change) > 3 // 变化超过3字/分钟认为显著

    return {
      significant,
      improving: change > 0,
      change: Math.round(change * 10) / 10,
      period: 14
    }
  }

  /**
   * 分析准确率趋势
   */
  analyzeAccuracyTrend() {
    const recentSessions = this.getRecentSessions(14)
    if (recentSessions.length < 5) return { significant: false }

    const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2))
    const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2))

    const firstAvg = this.calculateSessionsAverage(firstHalf, 'accuracy')
    const secondAvg = this.calculateSessionsAverage(secondHalf, 'accuracy')

    const change = secondAvg - firstAvg
    const significant = Math.abs(change) > 2 // 变化超过2%认为显著

    return {
      significant,
      improving: change > 0,
      change: Math.round(change * 10) / 10,
      period: 14
    }
  }

  /**
   * 分析学习习惯
   */
  analyzeStudyHabits() {
    const recentDays = this.getRecentDailyStats(30)
    if (recentDays.length < 7) return null

    const activeDays = recentDays.filter(day => day.sessions > 0).length
    const consistency = activeDays / recentDays.length

    if (consistency >= 0.8) {
      return {
        type: 'habit',
        category: 'consistency',
        title: '学习习惯优秀',
        description: `最近30天中有${activeDays}天进行了练习，保持率${Math.round(consistency * 100)}%`,
        level: 'positive',
        recommendation: '继续保持规律的练习习惯！'
      }
    } else if (consistency < 0.3) {
      return {
        type: 'habit',
        category: 'consistency',
        title: '需要建立学习习惯',
        description: `最近30天中只有${activeDays}天进行了练习，保持率仅${Math.round(consistency * 100)}%`,
        level: 'warning',
        recommendation: '建议设定每日练习目标，逐步建立学习习惯'
      }
    }

    return null
  }

  /**
   * 分析错误模式
   */
  analyzeErrorPatterns() {
    const recentSessions = this.getRecentSessions(10)
    const errorCounts = {}

    recentSessions.forEach(session => {
      session.errors.forEach(error => {
        const pattern = `${error.expected}->${error.actual}`
        errorCounts[pattern] = (errorCounts[pattern] || 0) + 1
      })
    })

    const commonErrors = Object.entries(errorCounts)
      .filter(([, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)

    if (commonErrors.length > 0) {
      const topError = commonErrors[0]
      return {
        type: 'pattern',
        category: 'errors',
        title: '发现常见错误模式',
        description: `最常见的错误是将"${topError[0].split('->')[0]}"误按成"${topError[0].split('->')[1]}"，出现${topError[1]}次`,
        level: 'info',
        recommendation: '建议针对这些键位进行专项练习'
      }
    }

    return null
  }

  /**
   * 分析最佳练习时间
   */
  analyzeBestPracticeTime() {
    const sessionsByHour = {}
    
    this.state.sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours()
      if (!sessionsByHour[hour]) {
        sessionsByHour[hour] = { sessions: [], avgSpeed: 0, avgAccuracy: 0 }
      }
      sessionsByHour[hour].sessions.push(session)
    })

    // 计算每小时的平均表现
    Object.keys(sessionsByHour).forEach(hour => {
      const sessions = sessionsByHour[hour].sessions
      sessionsByHour[hour].avgSpeed = this.calculateSessionsAverage(sessions, 'speed')
      sessionsByHour[hour].avgAccuracy = this.calculateSessionsAverage(sessions, 'accuracy')
    })

    // 找出表现最好的时间段
    const bestHour = Object.entries(sessionsByHour)
      .filter(([, data]) => data.sessions.length >= 3) // 至少3次练习
      .sort(([, a], [, b]) => (b.avgSpeed + b.avgAccuracy) - (a.avgSpeed + a.avgAccuracy))[0]

    if (bestHour) {
      const hour = parseInt(bestHour[0])
      const timeRange = `${hour}:00-${hour + 1}:00`
      return {
        type: 'timing',
        category: 'performance',
        title: '发现最佳练习时间',
        description: `在${timeRange}时段练习效果最好，平均速度${Math.round(bestHour[1].avgSpeed)}字/分钟，准确率${Math.round(bestHour[1].avgAccuracy)}%`,
        level: 'info',
        recommendation: `建议在${timeRange}安排重要的练习内容`
      }
    }

    return null
  }

  /**
   * 获取统计报告
   */
  getStatisticsReport(period = 'week') {
    const now = new Date()
    let data, title, comparison

    switch (period) {
      case 'day':
        data = this.getDailyReport(now)
        title = '今日练习报告'
        comparison = this.compareToPrevious('day', now)
        break
      case 'week':
        data = this.getWeeklyReport(now)
        title = '本周练习报告'
        comparison = this.compareToPrevious('week', now)
        break
      case 'month':
        data = this.getMonthlyReport(now)
        title = '本月练习报告'
        comparison = this.compareToPrevious('month', now)
        break
      default:
        data = this.getOverallReport()
        title = '总体练习报告'
        comparison = null
    }

    return {
      title,
      period,
      data,
      comparison,
      insights: this.state.insights,
      generatedAt: now.toISOString()
    }
  }

  /**
   * 获取图表数据
   */
  getChartData(type, period = 'week') {
    switch (type) {
      case 'speed_trend':
        return this.getSpeedTrendData(period)
      case 'accuracy_trend':
        return this.getAccuracyTrendData(period)
      case 'progress_overview':
        return this.getProgressOverviewData(period)
      case 'error_distribution':
        return this.getErrorDistributionData(period)
      case 'key_heatmap':
        return this.getKeyHeatmapData(period)
      case 'time_distribution':
        return this.getTimeDistributionData(period)
      default:
        return null
    }
  }

  /**
   * 获取速度趋势图表数据
   */
  getSpeedTrendData(period) {
    const data = this.getDataByPeriod(period)
    
    return {
      type: 'line',
      labels: data.map(item => this.formatDateLabel(item.date || item.week || item.month)),
      datasets: [{
        label: '打字速度 (字/分钟)',
        data: data.map(item => item.avgSpeed),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    }
  }

  /**
   * 获取准确率趋势图表数据
   */
  getAccuracyTrendData(period) {
    const data = this.getDataByPeriod(period)
    
    return {
      type: 'line',
      labels: data.map(item => this.formatDateLabel(item.date || item.week || item.month)),
      datasets: [{
        label: '准确率 (%)',
        data: data.map(item => item.avgAccuracy),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    }
  }

  /**
   * 获取错误分布数据
   */
  getErrorDistributionData(period) {
    const recentSessions = this.getRecentSessions(period === 'day' ? 1 : period === 'week' ? 7 : 30)
    const errorCounts = {}

    recentSessions.forEach(session => {
      session.errors.forEach(error => {
        const key = error.expected
        errorCounts[key] = (errorCounts[key] || 0) + 1
      })
    })

    const sortedErrors = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)

    return {
      type: 'bar',
      labels: sortedErrors.map(([key]) => key.toUpperCase()),
      datasets: [{
        label: '错误次数',
        data: sortedErrors.map(([, count]) => count),
        backgroundColor: 'rgba(239, 68, 68, 0.8)'
      }]
    }
  }

  /**
   * 获取键位热力图数据
   */
  getKeyHeatmapData(period) {
    const recentSessions = this.getRecentSessions(period === 'day' ? 1 : period === 'week' ? 7 : 30)
    const keyUsage = {}

    recentSessions.forEach(session => {
      session.keystrokes.forEach(keystroke => {
        const key = keystroke.key
        keyUsage[key] = (keyUsage[key] || 0) + 1
      })
    })

    // 转换为热力图格式
    const heatmapData = []
    const keyboard = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]

    keyboard.forEach((row, rowIndex) => {
      row.forEach((key, colIndex) => {
        heatmapData.push({
          x: colIndex,
          y: rowIndex,
          key: key,
          value: keyUsage[key] || 0
        })
      })
    })

    return {
      type: 'heatmap',
      data: heatmapData,
      maxValue: Math.max(...Object.values(keyUsage))
    }
  }

  // 辅助方法
  getDateKey(date) {
    return date.toISOString().split('T')[0]
  }

  getWeekKey(date) {
    const year = date.getFullYear()
    const week = this.getWeekNumber(date)
    return `${year}-W${week.toString().padStart(2, '0')}`
  }

  getMonthKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
  }

  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  calculateAverage(stat, field, newValue) {
    const currentCount = stat.sessions
    const currentAvg = stat[`avg${field.charAt(0).toUpperCase() + field.slice(1)}`] || 0
    return Math.round(((currentAvg * (currentCount - 1)) + newValue) / currentCount)
  }

  calculateSessionsAverage(sessions, field) {
    if (sessions.length === 0) return 0
    const sum = sessions.reduce((total, session) => total + session[field], 0)
    return sum / sessions.length
  }

  getRecentSessions(days) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
    return this.state.sessions
      .filter(session => session.timestamp > cutoff)
      .sort((a, b) => a.timestamp - b.timestamp)
  }

  getRecentDailyStats(days) {
    const result = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000))
      const dateKey = this.getDateKey(date)
      result.push(this.state.dailyStats[dateKey] || {
        date: dateKey,
        sessions: 0,
        totalTime: 0,
        avgSpeed: 0,
        avgAccuracy: 0
      })
    }
    return result
  }

  getDataByPeriod(period) {
    switch (period) {
      case 'day':
        return this.getRecentDailyStats(7)
      case 'week':
        return Object.values(this.state.weeklyStats)
          .sort((a, b) => a.week.localeCompare(b.week))
          .slice(-8)
      case 'month':
        return Object.values(this.state.monthlyStats)
          .sort((a, b) => a.month.localeCompare(b.month))
          .slice(-12)
      default:
        return this.getRecentDailyStats(30)
    }
  }

  formatDateLabel(dateStr) {
    if (dateStr.includes('W')) {
      // 周格式
      return `第${dateStr.split('W')[1]}周`
    } else if (dateStr.length === 7) {
      // 月格式
      return `${dateStr.split('-')[1]}月`
    } else {
      // 日格式
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }
  }

  getDailyReport(date) {
    const dateKey = this.getDateKey(date)
    return this.state.dailyStats[dateKey] || {
      sessions: 0,
      totalTime: 0,
      avgSpeed: 0,
      avgAccuracy: 0
    }
  }

  getWeeklyReport(date) {
    const weekKey = this.getWeekKey(date)
    return this.state.weeklyStats[weekKey] || {
      sessions: 0,
      totalTime: 0,
      avgSpeed: 0,
      avgAccuracy: 0
    }
  }

  getMonthlyReport(date) {
    const monthKey = this.getMonthKey(date)
    return this.state.monthlyStats[monthKey] || {
      sessions: 0,
      totalTime: 0,
      avgSpeed: 0,
      avgAccuracy: 0
    }
  }

  getOverallReport() {
    const sessions = this.state.sessions
    if (sessions.length === 0) {
      return {
        sessions: 0,
        totalTime: 0,
        totalCharacters: 0,
        avgSpeed: 0,
        avgAccuracy: 0,
        bestSpeed: 0,
        bestAccuracy: 0
      }
    }

    return {
      sessions: sessions.length,
      totalTime: sessions.reduce((sum, s) => sum + s.duration, 0),
      totalCharacters: sessions.reduce((sum, s) => sum + s.characters, 0),
      avgSpeed: Math.round(sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length),
      avgAccuracy: Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length),
      bestSpeed: Math.max(...sessions.map(s => s.speed)),
      bestAccuracy: Math.max(...sessions.map(s => s.accuracy))
    }
  }

  compareToPrevious(period, date) {
    // 实现与上期的对比逻辑
    const current = this.getDataForPeriod(period, date)
    const previous = this.getDataForPreviousPeriod(period, date)

    if (!current || !previous) return null

    return {
      speed: {
        current: current.avgSpeed,
        previous: previous.avgSpeed,
        change: current.avgSpeed - previous.avgSpeed,
        percentage: previous.avgSpeed > 0 ? 
          Math.round(((current.avgSpeed - previous.avgSpeed) / previous.avgSpeed) * 100) : 0
      },
      accuracy: {
        current: current.avgAccuracy,
        previous: previous.avgAccuracy,
        change: current.avgAccuracy - previous.avgAccuracy,
        percentage: previous.avgAccuracy > 0 ? 
          Math.round(((current.avgAccuracy - previous.avgAccuracy) / previous.avgAccuracy) * 100) : 0
      }
    }
  }

  getDataForPeriod(period, date) {
    switch (period) {
      case 'day':
        return this.getDailyReport(date)
      case 'week':
        return this.getWeeklyReport(date)
      case 'month':
        return this.getMonthlyReport(date)
      default:
        return null
    }
  }

  getDataForPreviousPeriod(period, date) {
    let previousDate
    switch (period) {
      case 'day':
        previousDate = new Date(date.getTime() - 24 * 60 * 60 * 1000)
        return this.getDailyReport(previousDate)
      case 'week':
        previousDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
        return this.getWeeklyReport(previousDate)
      case 'month':
        previousDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
        return this.getMonthlyReport(previousDate)
      default:
        return null
    }
  }

  saveData() {
    storageManager.setData('analytics', {
      sessions: this.state.sessions,
      dailyStats: this.state.dailyStats,
      weeklyStats: this.state.weeklyStats,
      monthlyStats: this.state.monthlyStats
    })
  }

  loadData() {
    const data = storageManager.getData('analytics', {})
    if (data.sessions) {
      this.state.sessions = data.sessions
      this.state.dailyStats = data.dailyStats || {}
      this.state.weeklyStats = data.weeklyStats || {}
      this.state.monthlyStats = data.monthlyStats || {}
      
      // 重新生成洞察
      this.generateInsights()
    }
  }

  // 导出数据
  exportAnalytics() {
    return {
      sessions: this.state.sessions,
      insights: this.state.insights,
      summary: this.getOverallReport(),
      exportedAt: new Date().toISOString()
    }
  }
}

// 创建全局分析引擎实例
export const globalAnalyticsEngine = new AnalyticsEngine()