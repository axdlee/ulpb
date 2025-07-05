/**
 * 智能学习系统
 * 基于用户表现动态调整学习内容和难度
 */

import { reactive, computed } from 'vue'
import { storageManager } from '../../utils/storage.js'

export class LearningSystem {
  constructor() {
    this.state = reactive({
      // 用户能力模型
      userProfile: {
        level: 'beginner', // 'beginner' | 'intermediate' | 'advanced' | 'expert'
        strongKeys: [], // 掌握良好的键位
        weakKeys: [], // 需要加强的键位
        learningSpeed: 'normal', // 'slow' | 'normal' | 'fast'
        preferredDifficulty: 'adaptive',
        lastAssessment: null
      },

      // 学习进度
      progress: {
        totalSessions: 0,
        totalTime: 0, // 分钟
        totalCharacters: 0,
        averageSpeed: 0,
        averageAccuracy: 0,
        streak: 0, // 连续学习天数
        lastSessionDate: null
      },

      // 当前学习目标
      currentGoals: [],
      
      // 复习计划
      reviewSchedule: [],
      
      // 学习建议
      suggestions: []
    })

    this.loadUserData()
  }

  /**
   * 分析用户表现并更新能力模型
   * @param {Object} sessionData - 练习会话数据
   */
  analyzePerformance(sessionData) {
    this.updateProgress(sessionData)
    this.updateUserProfile(sessionData)
    this.generateLearningGoals()
    this.scheduleReview()
    this.generateSuggestions()
    this.saveUserData()

    return {
      levelUpdate: this.checkLevelProgression(),
      newGoals: this.state.currentGoals,
      suggestions: this.state.suggestions
    }
  }

  /**
   * 更新学习进度
   */
  updateProgress(sessionData) {
    const progress = this.state.progress
    
    progress.totalSessions++
    progress.totalTime += sessionData.duration / 60 // 转换为分钟
    progress.totalCharacters += sessionData.totalCharacters
    
    // 更新平均值
    progress.averageSpeed = this.calculateWeightedAverage(
      progress.averageSpeed,
      sessionData.speed,
      progress.totalSessions
    )
    
    progress.averageAccuracy = this.calculateWeightedAverage(
      progress.averageAccuracy,
      sessionData.accuracy,
      progress.totalSessions
    )

    // 更新学习连续天数
    this.updateStreak(sessionData.timestamp)
    
    progress.lastSessionDate = sessionData.timestamp
  }

  /**
   * 更新用户能力模型
   */
  updateUserProfile(sessionData) {
    // 分析键位表现
    this.analyzeKeyPerformance(sessionData)
    
    // 评估学习速度
    this.assessLearningSpeed(sessionData)
    
    // 更新技能等级
    this.updateSkillLevel()
  }

  /**
   * 分析键位表现
   */
  analyzeKeyPerformance(sessionData) {
    const { errors, keystrokes } = sessionData
    const keyStats = {}

    // 统计每个键的表现
    keystrokes.forEach(keystroke => {
      const key = keystroke.key
      if (!keyStats[key]) {
        keyStats[key] = { total: 0, errors: 0 }
      }
      keyStats[key].total++
    })

    errors.forEach(error => {
      const key = error.actual
      if (keyStats[key]) {
        keyStats[key].errors++
      }
    })

    // 更新强弱键位
    Object.entries(keyStats).forEach(([key, stats]) => {
      const accuracy = stats.total > 0 ? (stats.total - stats.errors) / stats.total : 0
      
      if (accuracy >= 0.95 && stats.total >= 5) {
        this.addToStrongKeys(key)
      } else if (accuracy < 0.8 && stats.total >= 3) {
        this.addToWeakKeys(key)
      }
    })
  }

  /**
   * 添加到强键位
   */
  addToStrongKeys(key) {
    const strongKeys = this.state.userProfile.strongKeys
    if (!strongKeys.includes(key)) {
      strongKeys.push(key)
    }
    // 从弱键位中移除
    const weakIndex = this.state.userProfile.weakKeys.indexOf(key)
    if (weakIndex > -1) {
      this.state.userProfile.weakKeys.splice(weakIndex, 1)
    }
  }

  /**
   * 添加到弱键位
   */
  addToWeakKeys(key) {
    const weakKeys = this.state.userProfile.weakKeys
    if (!weakKeys.includes(key) && !this.state.userProfile.strongKeys.includes(key)) {
      weakKeys.push(key)
    }
  }

  /**
   * 评估学习速度
   */
  assessLearningSpeed(sessionData) {
    const recentSessions = this.getRecentSessions(5)
    if (recentSessions.length < 3) return

    const improvements = recentSessions.map((session, index) => {
      if (index === 0) return 0
      return session.speed - recentSessions[index - 1].speed
    }).filter(imp => imp !== 0)

    const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length

    if (avgImprovement > 5) {
      this.state.userProfile.learningSpeed = 'fast'
    } else if (avgImprovement < 1) {
      this.state.userProfile.learningSpeed = 'slow'
    } else {
      this.state.userProfile.learningSpeed = 'normal'
    }
  }

  /**
   * 更新技能等级
   */
  updateSkillLevel() {
    const { averageSpeed, averageAccuracy } = this.state.progress
    const strongKeysCount = this.state.userProfile.strongKeys.length

    let newLevel = 'beginner'

    if (averageSpeed >= 60 && averageAccuracy >= 95 && strongKeysCount >= 20) {
      newLevel = 'expert'
    } else if (averageSpeed >= 40 && averageAccuracy >= 90 && strongKeysCount >= 15) {
      newLevel = 'advanced'
    } else if (averageSpeed >= 25 && averageAccuracy >= 85 && strongKeysCount >= 10) {
      newLevel = 'intermediate'
    }

    if (newLevel !== this.state.userProfile.level) {
      this.state.userProfile.level = newLevel
      return { levelUp: true, newLevel }
    }

    return { levelUp: false }
  }

  /**
   * 生成学习目标
   */
  generateLearningGoals() {
    const goals = []
    const profile = this.state.userProfile
    const progress = this.state.progress

    // 速度目标
    if (progress.averageSpeed < this.getSpeedTarget(profile.level)) {
      goals.push({
        type: 'speed',
        target: this.getSpeedTarget(profile.level),
        current: progress.averageSpeed,
        priority: 'high',
        description: `提升打字速度至 ${this.getSpeedTarget(profile.level)} 字/分钟`
      })
    }

    // 准确率目标
    if (progress.averageAccuracy < this.getAccuracyTarget(profile.level)) {
      goals.push({
        type: 'accuracy',
        target: this.getAccuracyTarget(profile.level),
        current: progress.averageAccuracy,
        priority: 'high',
        description: `提升准确率至 ${this.getAccuracyTarget(profile.level)}%`
      })
    }

    // 弱键位改进目标
    if (profile.weakKeys.length > 0) {
      goals.push({
        type: 'weak_keys',
        target: Math.max(0, profile.weakKeys.length - 3),
        current: profile.weakKeys.length,
        priority: 'medium',
        description: `改进弱键位：${profile.weakKeys.slice(0, 3).join(', ')}`
      })
    }

    // 连续学习目标
    if (progress.streak < 7) {
      goals.push({
        type: 'streak',
        target: 7,
        current: progress.streak,
        priority: 'low',
        description: '保持7天连续学习'
      })
    }

    this.state.currentGoals = goals
  }

  /**
   * 安排复习计划
   */
  scheduleReview() {
    const schedule = []
    const weakKeys = this.state.userProfile.weakKeys
    const now = Date.now()

    // 为弱键位安排复习
    weakKeys.forEach(key => {
      const lastReview = this.getLastReviewTime(key)
      const interval = this.calculateReviewInterval(key)
      const nextReview = lastReview + interval

      if (nextReview <= now + 24 * 60 * 60 * 1000) { // 24小时内
        schedule.push({
          type: 'key_review',
          key,
          scheduledTime: nextReview,
          priority: this.getReviewPriority(key)
        })
      }
    })

    // 排序复习计划
    schedule.sort((a, b) => a.scheduledTime - b.scheduledTime)
    this.state.reviewSchedule = schedule
  }

  /**
   * 生成学习建议
   */
  generateSuggestions() {
    const suggestions = []
    const profile = this.state.userProfile
    const progress = this.state.progress

    // 基于弱键位的建议
    if (profile.weakKeys.length > 0) {
      suggestions.push({
        type: 'practice',
        priority: 'high',
        title: '针对性练习',
        description: `重点练习 ${profile.weakKeys.slice(0, 3).join(', ')} 这些键位`,
        action: 'practice_weak_keys'
      })
    }

    // 基于学习速度的建议
    if (profile.learningSpeed === 'slow') {
      suggestions.push({
        type: 'adjustment',
        priority: 'medium',
        title: '调整学习节奏',
        description: '建议降低练习难度，专注于准确性而非速度',
        action: 'adjust_difficulty'
      })
    }

    // 基于连续学习的建议
    if (progress.streak === 0) {
      suggestions.push({
        type: 'motivation',
        priority: 'low',
        title: '保持学习习惯',
        description: '每天练习15分钟，养成良好的学习习惯',
        action: 'daily_practice'
      })
    }

    // 基于准确率的建议
    if (progress.averageAccuracy < 85) {
      suggestions.push({
        type: 'technique',
        priority: 'high',
        title: '改善打字技巧',
        description: '建议降低速度，专注于正确的手指位置',
        action: 'improve_technique'
      })
    }

    this.state.suggestions = suggestions
  }

  /**
   * 推荐下一次练习内容
   */
  recommendNextPractice() {
    const profile = this.state.userProfile
    const goals = this.state.currentGoals

    // 如果有高优先级目标，优先推荐相关练习
    const highPriorityGoal = goals.find(goal => goal.priority === 'high')
    
    if (highPriorityGoal) {
      return this.generatePracticeForGoal(highPriorityGoal)
    }

    // 如果有待复习内容，推荐复习
    const dueReview = this.state.reviewSchedule.find(
      review => review.scheduledTime <= Date.now()
    )
    
    if (dueReview) {
      return this.generateReviewPractice(dueReview)
    }

    // 默认推荐：基于用户等级的常规练习
    return this.generateRegularPractice()
  }

  /**
   * 为特定目标生成练习
   */
  generatePracticeForGoal(goal) {
    switch (goal.type) {
      case 'speed':
        return {
          type: 'speed_training',
          difficulty: 'normal',
          focusKeys: this.state.userProfile.strongKeys,
          duration: 10,
          description: '速度训练：使用熟练键位提升打字速度'
        }
      
      case 'accuracy':
        return {
          type: 'accuracy_training',
          difficulty: 'easy',
          focusKeys: this.state.userProfile.weakKeys.slice(0, 5),
          duration: 15,
          description: '准确性训练：专注正确输入'
        }
      
      case 'weak_keys':
        return {
          type: 'targeted_practice',
          difficulty: 'adaptive',
          focusKeys: this.state.userProfile.weakKeys.slice(0, 3),
          duration: 12,
          description: '针对性练习：改善弱键位表现'
        }
      
      default:
        return this.generateRegularPractice()
    }
  }

  /**
   * 生成复习练习
   */
  generateReviewPractice(review) {
    return {
      type: 'review',
      difficulty: 'easy',
      focusKeys: [review.key],
      duration: 8,
      description: `复习练习：强化 ${review.key} 键位记忆`
    }
  }

  /**
   * 生成常规练习
   */
  generateRegularPractice() {
    const level = this.state.userProfile.level
    
    return {
      type: 'regular',
      difficulty: this.getDifficultyForLevel(level),
      focusKeys: this.getKeysForLevel(level),
      duration: this.getDurationForLevel(level),
      description: `${level}级练习：全面提升打字技能`
    }
  }

  // 辅助方法
  calculateWeightedAverage(currentAvg, newValue, totalCount) {
    if (totalCount === 1) return newValue
    const weight = Math.min(0.3, 10 / totalCount) // 新值权重，最多30%
    return Math.round(currentAvg * (1 - weight) + newValue * weight)
  }

  updateStreak(timestamp) {
    const today = new Date(timestamp).toDateString()
    const lastSession = this.state.progress.lastSessionDate
    
    if (!lastSession) {
      this.state.progress.streak = 1
      return
    }

    const lastSessionDate = new Date(lastSession).toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    if (today === lastSessionDate) {
      // 今天已经练习过，不增加连续天数
      return
    } else if (lastSessionDate === yesterday) {
      // 昨天练习过，连续天数+1
      this.state.progress.streak++
    } else {
      // 中断了，重新开始
      this.state.progress.streak = 1
    }
  }

  getSpeedTarget(level) {
    const targets = {
      beginner: 20,
      intermediate: 35,
      advanced: 50,
      expert: 70
    }
    return targets[level] || 20
  }

  getAccuracyTarget(level) {
    const targets = {
      beginner: 80,
      intermediate: 90,
      advanced: 95,
      expert: 98
    }
    return targets[level] || 80
  }

  getDifficultyForLevel(level) {
    const difficulties = {
      beginner: 'easy',
      intermediate: 'normal',
      advanced: 'hard',
      expert: 'adaptive'
    }
    return difficulties[level] || 'easy'
  }

  getKeysForLevel(level) {
    // 根据等级返回适合的键位集合
    const basicKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l']
    const intermediateKeys = [...basicKeys, 'g', 'h', 'q', 'w', 'e', 'r', 'u', 'i', 'o', 'p']
    const advancedKeys = [...intermediateKeys, 'z', 'x', 'c', 'v', 'b', 'n', 'm']
    
    switch (level) {
      case 'beginner': return basicKeys
      case 'intermediate': return intermediateKeys
      case 'advanced':
      case 'expert': return advancedKeys
      default: return basicKeys
    }
  }

  getDurationForLevel(level) {
    const durations = {
      beginner: 8,
      intermediate: 12,
      advanced: 15,
      expert: 20
    }
    return durations[level] || 8
  }

  checkLevelProgression() {
    // 检查是否达到升级条件
    const currentLevel = this.state.userProfile.level
    const progress = this.state.progress
    
    // 实现级别晋升逻辑
    return this.updateSkillLevel()
  }

  getRecentSessions(count = 10) {
    // 从存储中获取最近的会话数据
    return storageManager.getData('recentSessions', []).slice(-count)
  }

  getLastReviewTime(key) {
    const reviews = storageManager.getData('keyReviews', {})
    return reviews[key] || 0
  }

  calculateReviewInterval(key) {
    // 基于遗忘曲线计算复习间隔
    const baseInterval = 24 * 60 * 60 * 1000 // 24小时
    const reviews = storageManager.getData('keyReviewCounts', {})
    const reviewCount = reviews[key] || 0
    
    // 间隔随复习次数递增：1天、3天、7天、14天、30天
    const multipliers = [1, 3, 7, 14, 30]
    const multiplier = multipliers[Math.min(reviewCount, multipliers.length - 1)]
    
    return baseInterval * multiplier
  }

  getReviewPriority(key) {
    const weakKeys = this.state.userProfile.weakKeys
    const index = weakKeys.indexOf(key)
    
    if (index === -1) return 'low'
    if (index < 3) return 'high'
    if (index < 6) return 'medium'
    return 'low'
  }

  saveUserData() {
    storageManager.setData('learningSystem', this.state)
  }

  loadUserData() {
    const savedData = storageManager.getData('learningSystem', {})
    if (savedData.userProfile) {
      Object.assign(this.state, savedData)
    }
  }

  // 导出当前状态
  exportState() {
    return {
      userProfile: { ...this.state.userProfile },
      progress: { ...this.state.progress },
      currentGoals: [...this.state.currentGoals],
      reviewSchedule: [...this.state.reviewSchedule],
      suggestions: [...this.state.suggestions]
    }
  }
}

// 创建全局学习系统实例
export const globalLearningSystem = new LearningSystem()