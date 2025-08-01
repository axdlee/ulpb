/**
 * 分析引擎核心模块
 * 提供数据分析和洞察功能
 */

class AnalyticsEngine {
  constructor() {
    this.sessions = []
    this.insights = []
    this.trends = {}
  }

  init() {
    console.log('Analytics engine initialized')
    this.loadData()
    return { success: true }
  }

  addSession(sessionData) {
    this.sessions.push({
      ...sessionData,
      analyzedAt: Date.now()
    })

    // 限制存储的会话数量
    if (this.sessions.length > 1000) {
      this.sessions = this.sessions.slice(-1000)
    }

    // 更新分析
    this.updateAnalysis()
    this.saveData()
  }

  updateAnalysis() {
    this.generateInsights()
    this.calculateTrends()
  }

  generateInsights() {
    if (this.sessions.length === 0) return

    const insights = []
    const recentSessions = this.sessions.slice(-10)
    
    // 速度趋势分析
    const speedTrend = this.calculateSpeedTrend(recentSessions)
    if (speedTrend.direction === 'up') {
      insights.push({
        type: 'positive',
        category: 'speed',
        message: `您的打字速度在提升！最近平均速度比之前提高了 ${speedTrend.change} 字/分钟`,
        confidence: speedTrend.confidence
      })
    } else if (speedTrend.direction === 'down') {
      insights.push({
        type: 'warning',
        category: 'speed',
        message: `打字速度有所下降，建议多做速度练习`,
        confidence: speedTrend.confidence
      })
    }

    // 准确率分析
    const accuracyTrend = this.calculateAccuracyTrend(recentSessions)
    if (accuracyTrend.direction === 'up') {
      insights.push({
        type: 'positive',
        category: 'accuracy',
        message: `准确率在稳步提升！当前准确率比之前提高了 ${accuracyTrend.change}%`,
        confidence: accuracyTrend.confidence
      })
    }

    // 练习频率分析
    const frequencyInsight = this.analyzeFrequency()
    if (frequencyInsight) {
      insights.push(frequencyInsight)
    }

    // 最佳练习时间分析
    const timeInsight = this.analyzeBestPracticeTime()
    if (timeInsight) {
      insights.push(timeInsight)
    }

    this.insights = insights
  }

  calculateSpeedTrend(sessions) {
    if (sessions.length < 5) {
      return { direction: 'stable', change: 0, confidence: 'low' }
    }

    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2))
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2))

    const firstAvg = firstHalf.reduce((sum, s) => sum + s.speed, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.speed, 0) / secondHalf.length

    const change = Math.round(secondAvg - firstAvg)
    const direction = change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
    const confidence = sessions.length >= 10 ? 'high' : 'medium'

    return { direction, change: Math.abs(change), confidence }
  }

  calculateAccuracyTrend(sessions) {
    if (sessions.length < 5) {
      return { direction: 'stable', change: 0, confidence: 'low' }
    }

    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2))
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2))

    const firstAvg = firstHalf.reduce((sum, s) => sum + s.accuracy, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.accuracy, 0) / secondHalf.length

    const change = Math.round(secondAvg - firstAvg)
    const direction = change > 1 ? 'up' : change < -1 ? 'down' : 'stable'
    const confidence = sessions.length >= 10 ? 'high' : 'medium'

    return { direction, change: Math.abs(change), confidence }
  }

  analyzeFrequency() {
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const recentSessions = this.sessions.filter(s => now - s.timestamp < oneWeek)

    if (recentSessions.length === 0) {
      return {
        type: 'suggestion',
        category: 'frequency',
        message: '建议每天至少练习15分钟以保持进步',
        confidence: 'high'
      }
    }

    const dailyAverage = recentSessions.length / 7
    if (dailyAverage < 0.5) {
      return {
        type: 'suggestion',
        category: 'frequency',
        message: '增加练习频率可以帮助您更快进步',
        confidence: 'medium'
      }
    }

    return null
  }

  analyzeBestPracticeTime() {
    if (this.sessions.length < 10) return null

    const timeSlots = {}
    this.sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours()
      const slot = Math.floor(hour / 4) // 0-5: 0, 6-9: 1, 10-13: 2, 14-17: 3, 18-21: 4, 22-23: 5
      
      if (!timeSlots[slot]) {
        timeSlots[slot] = { sessions: [], totalSpeed: 0, totalAccuracy: 0 }
      }
      
      timeSlots[slot].sessions.push(session)
      timeSlots[slot].totalSpeed += session.speed
      timeSlots[slot].totalAccuracy += session.accuracy
    })

    let bestSlot = null
    let bestScore = 0

    Object.entries(timeSlots).forEach(([slot, data]) => {
      if (data.sessions.length >= 3) {
        const avgSpeed = data.totalSpeed / data.sessions.length
        const avgAccuracy = data.totalAccuracy / data.sessions.length
        const score = avgSpeed * (avgAccuracy / 100)
        
        if (score > bestScore) {
          bestScore = score
          bestSlot = parseInt(slot)
        }
      }
    })

    if (bestSlot !== null) {
      const timeRanges = [
        '深夜 (0-5点)',
        '早晨 (6-9点)',
        '上午 (10-13点)',
        '下午 (14-17点)',
        '晚上 (18-21点)',
        '夜晚 (22-23点)'
      ]

      return {
        type: 'info',
        category: 'timing',
        message: `您在${timeRanges[bestSlot]}的练习效果最好`,
        confidence: 'medium'
      }
    }

    return null
  }

  calculateTrends() {
    if (this.sessions.length < 10) return

    const last30Days = this.sessions.filter(s => 
      Date.now() - s.timestamp < 30 * 24 * 60 * 60 * 1000
    )

    this.trends = {
      speed: this.calculateMetricTrend(last30Days, 'speed'),
      accuracy: this.calculateMetricTrend(last30Days, 'accuracy'),
      consistency: this.calculateConsistencyTrend(last30Days),
      improvement: this.calculateImprovementRate(last30Days)
    }
  }

  calculateMetricTrend(sessions, metric) {
    if (sessions.length < 5) return { trend: 'stable', rate: 0 }

    const values = sessions.map(s => s[metric])
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))

    const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length

    const rate = ((secondAvg - firstAvg) / firstAvg) * 100
    const trend = rate > 5 ? 'up' : rate < -5 ? 'down' : 'stable'

    return { trend, rate: Math.round(rate) }
  }

  calculateConsistencyTrend(sessions) {
    if (sessions.length < 5) return { trend: 'stable', variance: 0 }

    const speeds = sessions.map(s => s.speed)
    const mean = speeds.reduce((sum, s) => sum + s, 0) / speeds.length
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length

    return { trend: 'stable', variance: Math.round(variance) }
  }

  calculateImprovementRate(sessions) {
    if (sessions.length < 10) return 0

    const first = sessions.slice(0, 5)
    const last = sessions.slice(-5)

    const firstScore = first.reduce((sum, s) => sum + (s.speed * s.accuracy / 100), 0) / first.length
    const lastScore = last.reduce((sum, s) => sum + (s.speed * s.accuracy / 100), 0) / last.length

    return Math.round(((lastScore - firstScore) / firstScore) * 100)
  }

  getInsights() {
    return this.insights
  }

  getTrends() {
    return this.trends
  }

  getDetailedAnalysis(timeRange = '30d') {
    const sessions = this.getSessionsForTimeRange(timeRange)
    
    return {
      summary: this.generateSummary(sessions),
      patterns: this.identifyPatterns(sessions),
      recommendations: this.generateRecommendations(sessions),
      predictions: this.generatePredictions(sessions)
    }
  }

  getSessionsForTimeRange(timeRange) {
    const now = Date.now()
    let cutoff

    switch (timeRange) {
      case '7d':
        cutoff = now - 7 * 24 * 60 * 60 * 1000
        break
      case '30d':
        cutoff = now - 30 * 24 * 60 * 60 * 1000
        break
      case '90d':
        cutoff = now - 90 * 24 * 60 * 60 * 1000
        break
      default:
        return this.sessions
    }

    return this.sessions.filter(s => s.timestamp >= cutoff)
  }

  generateSummary(sessions) {
    if (sessions.length === 0) return null

    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
    const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    const bestSpeed = Math.max(...sessions.map(s => s.speed))
    const bestAccuracy = Math.max(...sessions.map(s => s.accuracy))

    return {
      sessionCount: sessions.length,
      totalTime: Math.round(totalTime / 60000), // 转换为分钟
      averageSpeed: Math.round(avgSpeed),
      averageAccuracy: Math.round(avgAccuracy),
      bestSpeed,
      bestAccuracy,
      improvementRate: this.calculateImprovementRate(sessions)
    }
  }

  identifyPatterns(sessions) {
    return {
      peakPerformanceTime: this.findPeakPerformanceTime(sessions),
      consistencyPattern: this.analyzeConsistencyPattern(sessions),
      difficultyPreference: this.analyzeDifficultyPreference(sessions)
    }
  }

  findPeakPerformanceTime(sessions) {
    const hourlyPerformance = {}
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours()
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = { sessions: [], totalScore: 0 }
      }
      
      const score = session.speed * (session.accuracy / 100)
      hourlyPerformance[hour].sessions.push(session)
      hourlyPerformance[hour].totalScore += score
    })

    let bestHour = null
    let bestScore = 0

    Object.entries(hourlyPerformance).forEach(([hour, data]) => {
      if (data.sessions.length >= 2) {
        const avgScore = data.totalScore / data.sessions.length
        if (avgScore > bestScore) {
          bestScore = avgScore
          bestHour = parseInt(hour)
        }
      }
    })

    return bestHour
  }

  analyzeConsistencyPattern(sessions) {
    if (sessions.length < 5) return 'insufficient_data'

    const speeds = sessions.map(s => s.speed)
    const mean = speeds.reduce((sum, s) => sum + s, 0) / speeds.length
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length
    const stdDev = Math.sqrt(variance)
    const coefficient = stdDev / mean

    if (coefficient < 0.1) return 'very_consistent'
    if (coefficient < 0.2) return 'consistent'
    if (coefficient < 0.3) return 'moderate'
    return 'inconsistent'
  }

  analyzeDifficultyPreference(sessions) {
    // 这里可以根据课程难度分析用户偏好
    return 'adaptive' // 临时返回
  }

  generateRecommendations(sessions) {
    const recommendations = []
    const summary = this.generateSummary(sessions)

    if (summary.averageSpeed < 30) {
      recommendations.push({
        type: 'speed',
        priority: 'high',
        message: '建议增加速度练习，目标是达到30字/分钟'
      })
    }

    if (summary.averageAccuracy < 90) {
      recommendations.push({
        type: 'accuracy',
        priority: 'high',
        message: '建议放慢速度，专注于提高准确率'
      })
    }

    if (sessions.length < 10) {
      recommendations.push({
        type: 'frequency',
        priority: 'medium',
        message: '建议增加练习频率，每天至少练习15分钟'
      })
    }

    return recommendations
  }

  generatePredictions(sessions) {
    if (sessions.length < 10) return null

    const trend = this.calculateMetricTrend(sessions, 'speed')
    const currentSpeed = sessions[sessions.length - 1].speed

    let predictedSpeed = currentSpeed
    if (trend.trend === 'up') {
      predictedSpeed = currentSpeed + (trend.rate / 100) * currentSpeed
    } else if (trend.trend === 'down') {
      predictedSpeed = currentSpeed - (trend.rate / 100) * currentSpeed
    }

    return {
      speedIn30Days: Math.round(predictedSpeed),
      confidenceLevel: sessions.length >= 20 ? 'high' : 'medium'
    }
  }

  loadData() {
    try {
      const saved = localStorage.getItem('analyticsData')
      if (saved) {
        const data = JSON.parse(saved)
        this.sessions = data.sessions || []
        this.insights = data.insights || []
        this.trends = data.trends || {}
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }

  saveData() {
    try {
      const data = {
        sessions: this.sessions.slice(-1000), // 只保存最近1000个会话
        insights: this.insights,
        trends: this.trends
      }
      localStorage.setItem('analyticsData', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save analytics data:', error)
    }
  }

  exportData() {
    return {
      sessions: this.sessions,
      insights: this.insights,
      trends: this.trends,
      exportTime: Date.now()
    }
  }

  importData(data) {
    try {
      if (data.sessions) {
        this.sessions = data.sessions
      }
      if (data.insights) {
        this.insights = data.insights
      }
      if (data.trends) {
        this.trends = data.trends
      }
      
      this.saveData()
      return true
    } catch (error) {
      console.error('Failed to import analytics data:', error)
      return false
    }
  }

  reset() {
    this.sessions = []
    this.insights = []
    this.trends = {}
    this.saveData()
  }
}

// 全局实例
export const globalAnalyticsEngine = new AnalyticsEngine()