/**
 * 学习系统核心模块
 * 提供个性化学习建议和进度分析
 */

class LearningSystem {
  constructor() {
    this.userProfile = {
      level: 1,
      strengths: [],
      weaknesses: [],
      learningStyle: 'adaptive',
      goals: {
        targetSpeed: 30,
        targetAccuracy: 95
      }
    }
    this.recommendations = []
  }

  init() {
    console.log('Learning system initialized')
    this.loadUserProfile()
    return { success: true }
  }

  analyzePerformance(sessionResult, userStats) {
    // 分析用户表现
    const analysis = {
      speedImprovement: this.calculateSpeedImprovement(sessionResult, userStats),
      accuracyTrend: this.calculateAccuracyTrend(sessionResult, userStats),
      weakAreas: this.identifyWeakAreas(sessionResult),
      strongAreas: this.identifyStrongAreas(sessionResult),
      recommendations: this.generateRecommendations(sessionResult, userStats)
    }

    // 更新用户档案
    this.updateUserProfile(analysis)

    return analysis
  }

  recommendNextPractice() {
    const recommendations = [
      {
        id: 'basic-keys',
        type: 'lesson',
        title: '基础键位练习',
        description: '练习基本的声母和韵母键位',
        priority: 'high',
        estimatedTime: 15,
        difficulty: 1
      },
      {
        id: 'speed-building',
        type: 'exercise',
        title: '速度提升训练',
        description: '通过重复练习提高打字速度',
        priority: 'medium',
        estimatedTime: 20,
        difficulty: 2
      },
      {
        id: 'accuracy-focus',
        type: 'drill',
        title: '准确率专项训练',
        description: '专注于提高输入准确率',
        priority: 'medium',
        estimatedTime: 10,
        difficulty: 1
      }
    ]

    return recommendations
  }

  calculateSpeedImprovement(sessionResult, userStats) {
    const currentSpeed = sessionResult.speed
    const averageSpeed = userStats.averageSpeed
    
    if (averageSpeed === 0) return 0
    
    return Math.round(((currentSpeed - averageSpeed) / averageSpeed) * 100)
  }

  calculateAccuracyTrend(sessionResult, userStats) {
    const currentAccuracy = sessionResult.accuracy
    const averageAccuracy = userStats.averageAccuracy
    
    if (averageAccuracy === 0) return 0
    
    return Math.round(currentAccuracy - averageAccuracy)
  }

  identifyWeakAreas(sessionResult) {
    const weakAreas = []
    
    if (sessionResult.accuracy < 90) {
      weakAreas.push('accuracy')
    }
    
    if (sessionResult.speed < 20) {
      weakAreas.push('speed')
    }
    
    if (sessionResult.errors && sessionResult.errors.length > 5) {
      weakAreas.push('consistency')
    }
    
    return weakAreas
  }

  identifyStrongAreas(sessionResult) {
    const strongAreas = []
    
    if (sessionResult.accuracy >= 95) {
      strongAreas.push('accuracy')
    }
    
    if (sessionResult.speed >= 30) {
      strongAreas.push('speed')
    }
    
    if (sessionResult.errors && sessionResult.errors.length <= 2) {
      strongAreas.push('consistency')
    }
    
    return strongAreas
  }

  generateRecommendations(sessionResult, userStats) {
    const recommendations = []
    
    if (sessionResult.accuracy < 90) {
      recommendations.push({
        type: 'accuracy',
        message: '建议放慢速度，专注于准确性',
        action: 'practice-accuracy'
      })
    }
    
    if (sessionResult.speed < userStats.averageSpeed * 0.8) {
      recommendations.push({
        type: 'speed',
        message: '可以尝试提高打字速度',
        action: 'practice-speed'
      })
    }
    
    if (sessionResult.errors && sessionResult.errors.length > 0) {
      const commonErrors = this.analyzeCommonErrors(sessionResult.errors)
      recommendations.push({
        type: 'errors',
        message: `重点练习: ${commonErrors.join(', ')}`,
        action: 'practice-weak-keys'
      })
    }
    
    return recommendations
  }

  analyzeCommonErrors(errors) {
    const errorCounts = {}
    
    errors.forEach(error => {
      const key = error.expected
      errorCounts[key] = (errorCounts[key] || 0) + 1
    })
    
    return Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => key)
  }

  updateUserProfile(analysis) {
    // 更新用户档案
    this.userProfile.strengths = analysis.strongAreas
    this.userProfile.weaknesses = analysis.weakAreas
    
    // 保存到本地存储
    this.saveUserProfile()
  }

  loadUserProfile() {
    try {
      const saved = localStorage.getItem('learningSystemProfile')
      if (saved) {
        this.userProfile = { ...this.userProfile, ...JSON.parse(saved) }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  saveUserProfile() {
    try {
      localStorage.setItem('learningSystemProfile', JSON.stringify(this.userProfile))
    } catch (error) {
      console.error('Failed to save user profile:', error)
    }
  }

  getUserProfile() {
    return this.userProfile
  }

  updateGoals(goals) {
    this.userProfile.goals = { ...this.userProfile.goals, ...goals }
    this.saveUserProfile()
  }

  getPersonalizedLessons() {
    // 根据用户档案返回个性化课程
    const lessons = []
    
    if (this.userProfile.weaknesses.includes('accuracy')) {
      lessons.push({
        id: 'accuracy-focus',
        title: '准确率提升课程',
        description: '专门针对准确率的训练课程'
      })
    }
    
    if (this.userProfile.weaknesses.includes('speed')) {
      lessons.push({
        id: 'speed-building',
        title: '速度提升课程',
        description: '逐步提高打字速度的训练课程'
      })
    }
    
    return lessons
  }
}

// 全局实例
export const globalLearningSystem = new LearningSystem()