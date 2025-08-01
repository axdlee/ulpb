/**
 * 成就系统核心模块
 * 管理用户成就和里程碑
 */

class AchievementSystem {
  constructor() {
    this.achievements = this.initializeAchievements()
    this.userAchievements = []
    this.milestones = []
  }

  init() {
    console.log('Achievement system initialized')
    this.loadUserAchievements()
    return { success: true }
  }

  initializeAchievements() {
    return [
      // 速度成就
      {
        id: 'speed_10',
        title: '起步者',
        description: '打字速度达到10字/分钟',
        icon: '🚀',
        category: 'speed',
        condition: { type: 'speed', value: 10 },
        points: 10
      },
      {
        id: 'speed_20',
        title: '进步者',
        description: '打字速度达到20字/分钟',
        icon: '⚡',
        category: 'speed',
        condition: { type: 'speed', value: 20 },
        points: 20
      },
      {
        id: 'speed_30',
        title: '速度达人',
        description: '打字速度达到30字/分钟',
        icon: '🏃',
        category: 'speed',
        condition: { type: 'speed', value: 30 },
        points: 30
      },
      {
        id: 'speed_50',
        title: '飞指如飞',
        description: '打字速度达到50字/分钟',
        icon: '🦅',
        category: 'speed',
        condition: { type: 'speed', value: 50 },
        points: 50
      },

      // 准确率成就
      {
        id: 'accuracy_90',
        title: '精准射手',
        description: '准确率达到90%',
        icon: '🎯',
        category: 'accuracy',
        condition: { type: 'accuracy', value: 90 },
        points: 15
      },
      {
        id: 'accuracy_95',
        title: '神枪手',
        description: '准确率达到95%',
        icon: '🏹',
        category: 'accuracy',
        condition: { type: 'accuracy', value: 95 },
        points: 25
      },
      {
        id: 'accuracy_99',
        title: '完美主义者',
        description: '准确率达到99%',
        icon: '💎',
        category: 'accuracy',
        condition: { type: 'accuracy', value: 99 },
        points: 50
      },

      // 练习时长成就
      {
        id: 'time_1h',
        title: '初学者',
        description: '累计练习1小时',
        icon: '⏰',
        category: 'time',
        condition: { type: 'totalTime', value: 3600000 }, // 1小时毫秒数
        points: 10
      },
      {
        id: 'time_10h',
        title: '勤奋者',
        description: '累计练习10小时',
        icon: '📚',
        category: 'time',
        condition: { type: 'totalTime', value: 36000000 }, // 10小时毫秒数
        points: 30
      },
      {
        id: 'time_50h',
        title: '专家',
        description: '累计练习50小时',
        icon: '🎓',
        category: 'time',
        condition: { type: 'totalTime', value: 180000000 }, // 50小时毫秒数
        points: 100
      },

      // 连续练习成就
      {
        id: 'streak_3',
        title: '坚持者',
        description: '连续练习3天',
        icon: '🔥',
        category: 'streak',
        condition: { type: 'streak', value: 3 },
        points: 15
      },
      {
        id: 'streak_7',
        title: '一周达人',
        description: '连续练习7天',
        icon: '📅',
        category: 'streak',
        condition: { type: 'streak', value: 7 },
        points: 30
      },
      {
        id: 'streak_30',
        title: '月度冠军',
        description: '连续练习30天',
        icon: '👑',
        category: 'streak',
        condition: { type: 'streak', value: 30 },
        points: 100
      },

      // 课程完成成就
      {
        id: 'lessons_5',
        title: '学习新手',
        description: '完成5个课程',
        icon: '📖',
        category: 'lessons',
        condition: { type: 'completedLessons', value: 5 },
        points: 20
      },
      {
        id: 'lessons_10',
        title: '课程达人',
        description: '完成10个课程',
        icon: '🎒',
        category: 'lessons',
        condition: { type: 'completedLessons', value: 10 },
        points: 40
      },
      {
        id: 'lessons_all',
        title: '全能学者',
        description: '完成所有课程',
        icon: '🏆',
        category: 'lessons',
        condition: { type: 'completedLessons', value: 15 },
        points: 100
      },

      // 特殊成就
      {
        id: 'perfect_session',
        title: '完美表现',
        description: '单次练习100%准确率',
        icon: '⭐',
        category: 'special',
        condition: { type: 'perfectSession', value: 100 },
        points: 25
      },
      {
        id: 'speed_burst',
        title: '速度爆发',
        description: '单次练习速度超过个人平均20%',
        icon: '💨',
        category: 'special',
        condition: { type: 'speedBurst', value: 1.2 },
        points: 20
      },
      {
        id: 'night_owl',
        title: '夜猫子',
        description: '在深夜(22:00-6:00)完成10次练习',
        icon: '🦉',
        category: 'special',
        condition: { type: 'nightSessions', value: 10 },
        points: 15
      },
      {
        id: 'early_bird',
        title: '早起鸟',
        description: '在早晨(6:00-9:00)完成10次练习',
        icon: '🐦',
        category: 'special',
        condition: { type: 'morningSessions', value: 10 },
        points: 15
      }
    ]
  }

  checkAchievements(sessionResult, userStats) {
    const newAchievements = []

    this.achievements.forEach(achievement => {
      // 跳过已获得的成就
      if (this.userAchievements.some(ua => ua.id === achievement.id)) {
        return
      }

      if (this.checkAchievementCondition(achievement, sessionResult, userStats)) {
        const earnedAchievement = {
          ...achievement,
          earnedAt: Date.now(),
          sessionId: sessionResult.id
        }

        this.userAchievements.push(earnedAchievement)
        newAchievements.push(earnedAchievement)
      }
    })

    if (newAchievements.length > 0) {
      this.saveUserAchievements()
    }

    return newAchievements
  }

  checkAchievementCondition(achievement, sessionResult, userStats) {
    const condition = achievement.condition

    switch (condition.type) {
      case 'speed':
        return sessionResult.speed >= condition.value

      case 'accuracy':
        return sessionResult.accuracy >= condition.value

      case 'totalTime':
        return userStats.totalTime >= condition.value

      case 'streak':
        return userStats.currentStreak >= condition.value

      case 'completedLessons':
        return (userStats.completedLessons || 0) >= condition.value

      case 'perfectSession':
        return sessionResult.accuracy === 100

      case 'speedBurst':
        return sessionResult.speed >= userStats.averageSpeed * condition.value

      case 'nightSessions':
        return this.countNightSessions() >= condition.value

      case 'morningSessions':
        return this.countMorningSessions() >= condition.value

      default:
        return false
    }
  }

  countNightSessions() {
    // 这里需要访问会话历史，暂时返回0
    return 0
  }

  countMorningSessions() {
    // 这里需要访问会话历史，暂时返回0
    return 0
  }

  getUserAchievements() {
    return this.userAchievements
  }

  getAchievementsByCategory(category) {
    return this.achievements.filter(a => a.category === category)
  }

  getUnlockedAchievements() {
    return this.userAchievements
  }

  getLockedAchievements() {
    const unlockedIds = this.userAchievements.map(ua => ua.id)
    return this.achievements.filter(a => !unlockedIds.includes(a.id))
  }

  getAchievementProgress(achievementId, userStats) {
    const achievement = this.achievements.find(a => a.id === achievementId)
    if (!achievement) return 0

    const condition = achievement.condition

    switch (condition.type) {
      case 'speed':
        return Math.min((userStats.averageSpeed / condition.value) * 100, 100)

      case 'accuracy':
        return Math.min((userStats.averageAccuracy / condition.value) * 100, 100)

      case 'totalTime':
        return Math.min((userStats.totalTime / condition.value) * 100, 100)

      case 'streak':
        return Math.min((userStats.currentStreak / condition.value) * 100, 100)

      case 'completedLessons':
        return Math.min(((userStats.completedLessons || 0) / condition.value) * 100, 100)

      default:
        return 0
    }
  }

  getTotalPoints() {
    return this.userAchievements.reduce((total, achievement) => total + achievement.points, 0)
  }

  getUserLevel() {
    const totalPoints = this.getTotalPoints()
    
    if (totalPoints < 50) return 1
    if (totalPoints < 150) return 2
    if (totalPoints < 300) return 3
    if (totalPoints < 500) return 4
    if (totalPoints < 800) return 5
    
    return Math.min(10, Math.floor(totalPoints / 200) + 1)
  }

  getNextLevelProgress() {
    const currentLevel = this.getUserLevel()
    const currentPoints = this.getTotalPoints()
    
    const levelThresholds = [0, 50, 150, 300, 500, 800, 1200, 1700, 2300, 3000]
    
    if (currentLevel >= 10) {
      return { current: currentPoints, required: currentPoints, progress: 100 }
    }
    
    const currentThreshold = levelThresholds[currentLevel - 1]
    const nextThreshold = levelThresholds[currentLevel]
    const progress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    
    return {
      current: currentPoints - currentThreshold,
      required: nextThreshold - currentThreshold,
      progress: Math.round(progress)
    }
  }

  getRecentAchievements(limit = 5) {
    return this.userAchievements
      .sort((a, b) => b.earnedAt - a.earnedAt)
      .slice(0, limit)
  }

  getAchievementStats() {
    const total = this.achievements.length
    const unlocked = this.userAchievements.length
    const categories = {}

    this.achievements.forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = { total: 0, unlocked: 0 }
      }
      categories[achievement.category].total++
    })

    this.userAchievements.forEach(achievement => {
      if (categories[achievement.category]) {
        categories[achievement.category].unlocked++
      }
    })

    return {
      total,
      unlocked,
      completionRate: Math.round((unlocked / total) * 100),
      categories,
      totalPoints: this.getTotalPoints(),
      level: this.getUserLevel()
    }
  }

  loadUserAchievements() {
    try {
      const saved = localStorage.getItem('userAchievements')
      if (saved) {
        this.userAchievements = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load user achievements:', error)
    }
  }

  saveUserAchievements() {
    try {
      localStorage.setItem('userAchievements', JSON.stringify(this.userAchievements))
    } catch (error) {
      console.error('Failed to save user achievements:', error)
    }
  }

  exportAchievements() {
    return {
      userAchievements: this.userAchievements,
      stats: this.getAchievementStats(),
      exportTime: Date.now()
    }
  }

  importAchievements(data) {
    try {
      if (data.userAchievements) {
        this.userAchievements = data.userAchievements
        this.saveUserAchievements()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import achievements:', error)
      return false
    }
  }

  resetAchievements() {
    this.userAchievements = []
    this.saveUserAchievements()
  }

  // 添加自定义成就
  addCustomAchievement(achievement) {
    const customAchievement = {
      ...achievement,
      id: `custom_${Date.now()}`,
      category: 'custom',
      isCustom: true
    }

    this.achievements.push(customAchievement)
    return customAchievement
  }

  // 移除自定义成就
  removeCustomAchievement(achievementId) {
    const index = this.achievements.findIndex(a => a.id === achievementId && a.isCustom)
    if (index > -1) {
      this.achievements.splice(index, 1)
      
      // 同时移除用户已获得的该成就
      const userIndex = this.userAchievements.findIndex(ua => ua.id === achievementId)
      if (userIndex > -1) {
        this.userAchievements.splice(userIndex, 1)
        this.saveUserAchievements()
      }
      
      return true
    }
    return false
  }
}

// 全局实例
export const globalAchievementSystem = new AchievementSystem()