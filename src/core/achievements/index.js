/**
 * 成就系统
 * 管理用户成就、徽章、里程碑和奖励机制
 */

import { reactive, computed } from 'vue'
import { storageManager } from '../../utils/storage.js'

export class AchievementSystem {
  constructor() {
    this.state = reactive({
      // 用户成就状态
      unlockedAchievements: [],
      achievementProgress: {},
      
      // 成就通知队列
      pendingNotifications: [],
      
      // 统计数据
      totalPoints: 0,
      level: 1,
      experiencePoints: 0,
      nextLevelXP: 100,
      
      // 成就历史
      achievementHistory: []
    })

    // 定义所有成就
    this.achievements = this.defineAchievements()
    
    this.loadData()
    this.calculateLevel()
  }

  /**
   * 定义所有成就
   */
  defineAchievements() {
    return {
      // 速度相关成就
      speed_10: {
        id: 'speed_10',
        category: 'speed',
        title: '起步者',
        description: '达到10字/分钟的打字速度',
        icon: '🚀',
        points: 10,
        xp: 50,
        condition: { type: 'speed', value: 10 },
        rarity: 'common'
      },
      speed_20: {
        id: 'speed_20',
        category: 'speed',
        title: '进步中',
        description: '达到20字/分钟的打字速度',
        icon: '⚡',
        points: 20,
        xp: 100,
        condition: { type: 'speed', value: 20 },
        rarity: 'common'
      },
      speed_40: {
        id: 'speed_40',
        category: 'speed',
        title: '熟练者',
        description: '达到40字/分钟的打字速度',
        icon: '🌟',
        points: 50,
        xp: 200,
        condition: { type: 'speed', value: 40 },
        rarity: 'rare'
      },
      speed_60: {
        id: 'speed_60',
        category: 'speed',
        title: '专家级',
        description: '达到60字/分钟的打字速度',
        icon: '👑',
        points: 100,
        xp: 500,
        condition: { type: 'speed', value: 60 },
        rarity: 'epic'
      },
      speed_80: {
        id: 'speed_80',
        category: 'speed',
        title: '大师级',
        description: '达到80字/分钟的打字速度',
        icon: '🏆',
        points: 200,
        xp: 1000,
        condition: { type: 'speed', value: 80 },
        rarity: 'legendary'
      },

      // 准确率相关成就
      accuracy_90: {
        id: 'accuracy_90',
        category: 'accuracy',
        title: '精准射手',
        description: '达到90%的准确率',
        icon: '🎯',
        points: 30,
        xp: 150,
        condition: { type: 'accuracy', value: 90 },
        rarity: 'common'
      },
      accuracy_95: {
        id: 'accuracy_95',
        category: 'accuracy',
        title: '神枪手',
        description: '达到95%的准确率',
        icon: '🏹',
        points: 60,
        xp: 300,
        condition: { type: 'accuracy', value: 95 },
        rarity: 'rare'
      },
      accuracy_99: {
        id: 'accuracy_99',
        category: 'accuracy',
        title: '完美主义者',
        description: '达到99%的准确率',
        icon: '💎',
        points: 150,
        xp: 750,
        condition: { type: 'accuracy', value: 99 },
        rarity: 'epic'
      },

      // 练习时长相关成就
      time_1h: {
        id: 'time_1h',
        category: 'time',
        title: '入门练习者',
        description: '累计练习1小时',
        icon: '⏰',
        points: 15,
        xp: 75,
        condition: { type: 'total_time', value: 3600 }, // 秒
        rarity: 'common'
      },
      time_10h: {
        id: 'time_10h',
        category: 'time',
        title: '坚持不懈',
        description: '累计练习10小时',
        icon: '⌚',
        points: 50,
        xp: 250,
        condition: { type: 'total_time', value: 36000 },
        rarity: 'rare'
      },
      time_50h: {
        id: 'time_50h',
        category: 'time',
        title: '持久战士',
        description: '累计练习50小时',
        icon: '🕰️',
        points: 150,
        xp: 750,
        condition: { type: 'total_time', value: 180000 },
        rarity: 'epic'
      },
      time_100h: {
        id: 'time_100h',
        category: 'time',
        title: '练习大师',
        description: '累计练习100小时',
        icon: '⏳',
        points: 300,
        xp: 1500,
        condition: { type: 'total_time', value: 360000 },
        rarity: 'legendary'
      },

      // 连续练习相关成就
      streak_3: {
        id: 'streak_3',
        category: 'streak',
        title: '三日之约',
        description: '连续练习3天',
        icon: '🔥',
        points: 25,
        xp: 125,
        condition: { type: 'streak', value: 3 },
        rarity: 'common'
      },
      streak_7: {
        id: 'streak_7',
        category: 'streak',
        title: '一周坚持',
        description: '连续练习7天',
        icon: '🌟',
        points: 75,
        xp: 375,
        condition: { type: 'streak', value: 7 },
        rarity: 'rare'
      },
      streak_30: {
        id: 'streak_30',
        category: 'streak',
        title: '月度冠军',
        description: '连续练习30天',
        icon: '🏅',
        points: 200,
        xp: 1000,
        condition: { type: 'streak', value: 30 },
        rarity: 'epic'
      },

      // 特殊成就
      perfect_session: {
        id: 'perfect_session',
        category: 'special',
        title: '完美无瑕',
        description: '单次练习100%准确率',
        icon: '✨',
        points: 50,
        xp: 250,
        condition: { type: 'session_accuracy', value: 100 },
        rarity: 'rare'
      },
      speed_demon: {
        id: 'speed_demon',
        category: 'special',
        title: '速度恶魔',
        description: '单次练习超过100字/分钟',
        icon: '👹',
        points: 100,
        xp: 500,
        condition: { type: 'session_speed', value: 100 },
        rarity: 'epic'
      },
      night_owl: {
        id: 'night_owl',
        category: 'special',
        title: '夜猫子',
        description: '在午夜12点后练习',
        icon: '🦉',
        points: 30,
        xp: 150,
        condition: { type: 'late_night_practice', value: 1 },
        rarity: 'common'
      },
      early_bird: {
        id: 'early_bird',
        category: 'special',
        title: '早起鸟儿',
        description: '在早上6点前练习',
        icon: '🐦',
        points: 30,
        xp: 150,
        condition: { type: 'early_morning_practice', value: 1 },
        rarity: 'common'
      },
      marathon_session: {
        id: 'marathon_session',
        category: 'special',
        title: '马拉松选手',
        description: '单次练习超过30分钟',
        icon: '🏃',
        points: 75,
        xp: 375,
        condition: { type: 'session_duration', value: 1800 }, // 30分钟
        rarity: 'rare'
      },

      // 字符数相关成就
      chars_1k: {
        id: 'chars_1k',
        category: 'characters',
        title: '千字文',
        description: '累计输入1000个字符',
        icon: '📝',
        points: 20,
        xp: 100,
        condition: { type: 'total_characters', value: 1000 },
        rarity: 'common'
      },
      chars_10k: {
        id: 'chars_10k',
        category: 'characters',
        title: '万字长文',
        description: '累计输入10000个字符',
        icon: '📚',
        points: 100,
        xp: 500,
        condition: { type: 'total_characters', value: 10000 },
        rarity: 'rare'
      },
      chars_100k: {
        id: 'chars_100k',
        category: 'characters',
        title: '十万字豪',
        description: '累计输入100000个字符',
        icon: '📖',
        points: 500,
        xp: 2500,
        condition: { type: 'total_characters', value: 100000 },
        rarity: 'legendary'
      }
    }
  }

  /**
   * 检查并解锁成就
   * @param {Object} sessionData - 练习会话数据
   * @param {Object} userStats - 用户总体统计
   */
  checkAchievements(sessionData, userStats) {
    const newAchievements = []

    Object.values(this.achievements).forEach(achievement => {
      if (this.isAchievementUnlocked(achievement.id)) {
        return // 已解锁的成就跳过
      }

      if (this.checkAchievementCondition(achievement, sessionData, userStats)) {
        this.unlockAchievement(achievement.id)
        newAchievements.push(achievement)
      } else {
        // 更新进度
        this.updateAchievementProgress(achievement, sessionData, userStats)
      }
    })

    if (newAchievements.length > 0) {
      this.processNewAchievements(newAchievements)
    }

    this.saveData()
    return newAchievements
  }

  /**
   * 检查成就条件是否满足
   */
  checkAchievementCondition(achievement, sessionData, userStats) {
    const { condition } = achievement

    switch (condition.type) {
      case 'speed':
        return userStats.averageSpeed >= condition.value

      case 'accuracy':
        return userStats.averageAccuracy >= condition.value

      case 'total_time':
        return userStats.totalTime >= condition.value

      case 'total_characters':
        return userStats.totalCharacters >= condition.value

      case 'streak':
        return userStats.currentStreak >= condition.value

      case 'session_speed':
        return sessionData.speed >= condition.value

      case 'session_accuracy':
        return sessionData.accuracy >= condition.value

      case 'session_duration':
        return sessionData.duration >= condition.value

      case 'late_night_practice':
        const hour = new Date(sessionData.timestamp).getHours()
        return hour >= 0 && hour < 6

      case 'early_morning_practice':
        const morningHour = new Date(sessionData.timestamp).getHours()
        return morningHour >= 5 && morningHour < 8

      default:
        return false
    }
  }

  /**
   * 更新成就进度
   */
  updateAchievementProgress(achievement, sessionData, userStats) {
    const { condition } = achievement
    let currentValue = 0

    switch (condition.type) {
      case 'speed':
        currentValue = userStats.averageSpeed
        break
      case 'accuracy':
        currentValue = userStats.averageAccuracy
        break
      case 'total_time':
        currentValue = userStats.totalTime
        break
      case 'total_characters':
        currentValue = userStats.totalCharacters
        break
      case 'streak':
        currentValue = userStats.currentStreak
        break
      default:
        return
    }

    this.state.achievementProgress[achievement.id] = {
      current: currentValue,
      target: condition.value,
      percentage: Math.min(100, Math.round((currentValue / condition.value) * 100))
    }
  }

  /**
   * 解锁成就
   */
  unlockAchievement(achievementId) {
    if (this.isAchievementUnlocked(achievementId)) {
      return false
    }

    const achievement = this.achievements[achievementId]
    if (!achievement) {
      return false
    }

    // 添加到已解锁列表
    this.state.unlockedAchievements.push(achievementId)

    // 增加积分和经验
    this.state.totalPoints += achievement.points
    this.addExperience(achievement.xp)

    // 记录解锁历史
    this.state.achievementHistory.push({
      achievementId,
      unlockedAt: Date.now(),
      points: achievement.points,
      xp: achievement.xp
    })

    // 添加到通知队列
    this.state.pendingNotifications.push({
      id: Date.now(),
      achievement,
      timestamp: Date.now()
    })

    return true
  }

  /**
   * 检查成就是否已解锁
   */
  isAchievementUnlocked(achievementId) {
    return this.state.unlockedAchievements.includes(achievementId)
  }

  /**
   * 增加经验值
   */
  addExperience(xp) {
    this.state.experiencePoints += xp

    // 检查是否升级
    while (this.state.experiencePoints >= this.state.nextLevelXP) {
      this.levelUp()
    }
  }

  /**
   * 升级
   */
  levelUp() {
    this.state.experiencePoints -= this.state.nextLevelXP
    this.state.level++
    this.state.nextLevelXP = this.calculateNextLevelXP(this.state.level)

    // 添加升级通知
    this.state.pendingNotifications.push({
      id: Date.now(),
      type: 'level_up',
      level: this.state.level,
      timestamp: Date.now()
    })
  }

  /**
   * 计算下一级所需经验
   */
  calculateNextLevelXP(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  }

  /**
   * 重新计算用户等级（用于数据修复）
   */
  calculateLevel() {
    let totalXP = 0
    this.state.achievementHistory.forEach(record => {
      totalXP += record.xp
    })

    let level = 1
    let requiredXP = 100

    while (totalXP >= requiredXP) {
      totalXP -= requiredXP
      level++
      requiredXP = this.calculateNextLevelXP(level)
    }

    this.state.level = level
    this.state.experiencePoints = totalXP
    this.state.nextLevelXP = requiredXP
  }

  /**
   * 处理新解锁的成就
   */
  processNewAchievements(achievements) {
    // 按稀有度排序，稀有的成就优先显示
    const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }
    achievements.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])

    // 可以在这里添加特殊效果或奖励逻辑
    achievements.forEach(achievement => {
      if (achievement.rarity === 'legendary') {
        // 传说级成就的特殊处理
        this.triggerSpecialEffect(achievement)
      }
    })
  }

  /**
   * 触发特殊效果
   */
  triggerSpecialEffect(achievement) {
    // 可以实现特殊的视觉效果、音效等
    console.log(`🎉 传说级成就解锁！${achievement.title}`)
  }

  /**
   * 获取待显示的通知
   */
  getPendingNotifications() {
    return [...this.state.pendingNotifications]
  }

  /**
   * 清除通知
   */
  clearNotification(notificationId) {
    const index = this.state.pendingNotifications.findIndex(n => n.id === notificationId)
    if (index > -1) {
      this.state.pendingNotifications.splice(index, 1)
      this.saveData()
    }
  }

  /**
   * 清除所有通知
   */
  clearAllNotifications() {
    this.state.pendingNotifications = []
    this.saveData()
  }

  /**
   * 获取成就统计
   */
  getAchievementStats() {
    const categories = {}
    const totalAchievements = Object.keys(this.achievements).length
    const unlockedCount = this.state.unlockedAchievements.length

    // 按类别统计
    Object.values(this.achievements).forEach(achievement => {
      const category = achievement.category
      if (!categories[category]) {
        categories[category] = { total: 0, unlocked: 0 }
      }
      categories[category].total++
      
      if (this.isAchievementUnlocked(achievement.id)) {
        categories[category].unlocked++
      }
    })

    return {
      total: totalAchievements,
      unlocked: unlockedCount,
      progress: Math.round((unlockedCount / totalAchievements) * 100),
      categories,
      totalPoints: this.state.totalPoints,
      level: this.state.level,
      experiencePoints: this.state.experiencePoints,
      nextLevelXP: this.state.nextLevelXP
    }
  }

  /**
   * 获取分类成就列表
   */
  getAchievementsByCategory(category = null) {
    const achievements = Object.values(this.achievements)
    
    if (category) {
      return achievements.filter(a => a.category === category)
    }

    // 按类别分组
    const grouped = {}
    achievements.forEach(achievement => {
      const cat = achievement.category
      if (!grouped[cat]) {
        grouped[cat] = []
      }
      grouped[cat].push({
        ...achievement,
        unlocked: this.isAchievementUnlocked(achievement.id),
        progress: this.state.achievementProgress[achievement.id]
      })
    })

    return grouped
  }

  /**
   * 获取推荐成就
   */
  getRecommendedAchievements(userStats) {
    const recommendations = []

    Object.values(this.achievements).forEach(achievement => {
      if (this.isAchievementUnlocked(achievement.id)) {
        return
      }

      const progress = this.state.achievementProgress[achievement.id]
      if (progress && progress.percentage >= 50) {
        recommendations.push({
          ...achievement,
          progress,
          priority: this.calculateAchievementPriority(achievement, progress)
        })
      }
    })

    // 按优先级排序
    recommendations.sort((a, b) => b.priority - a.priority)
    return recommendations.slice(0, 5) // 返回前5个推荐
  }

  /**
   * 计算成就优先级
   */
  calculateAchievementPriority(achievement, progress) {
    let priority = progress.percentage

    // 根据稀有度调整优先级
    const rarityBonus = {
      common: 1,
      rare: 1.2,
      epic: 1.5,
      legendary: 2
    }

    priority *= rarityBonus[achievement.rarity] || 1

    // 即将完成的成就优先级更高
    if (progress.percentage >= 90) {
      priority *= 1.5
    }

    return priority
  }

  /**
   * 获取最近解锁的成就
   */
  getRecentAchievements(days = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
    
    return this.state.achievementHistory
      .filter(record => record.unlockedAt > cutoff)
      .map(record => ({
        ...this.achievements[record.achievementId],
        unlockedAt: record.unlockedAt
      }))
      .sort((a, b) => b.unlockedAt - a.unlockedAt)
  }

  /**
   * 获取用户徽章
   */
  getUserBadges() {
    const badges = []

    // 基于等级的徽章
    if (this.state.level >= 10) {
      badges.push({ type: 'level', name: '十级学者', icon: '🎓' })
    }
    if (this.state.level >= 25) {
      badges.push({ type: 'level', name: '二十五级专家', icon: '🏅' })
    }
    if (this.state.level >= 50) {
      badges.push({ type: 'level', name: '五十级大师', icon: '👑' })
    }

    // 基于成就的徽章
    const legendaryCount = this.state.unlockedAchievements.filter(id => 
      this.achievements[id]?.rarity === 'legendary'
    ).length

    if (legendaryCount >= 1) {
      badges.push({ type: 'achievement', name: '传说收集者', icon: '💎' })
    }
    if (legendaryCount >= 3) {
      badges.push({ type: 'achievement', name: '传说大师', icon: '🌟' })
    }

    return badges
  }

  /**
   * 保存数据
   */
  saveData() {
    storageManager.setData('achievements', {
      unlockedAchievements: this.state.unlockedAchievements,
      achievementProgress: this.state.achievementProgress,
      pendingNotifications: this.state.pendingNotifications,
      totalPoints: this.state.totalPoints,
      level: this.state.level,
      experiencePoints: this.state.experiencePoints,
      nextLevelXP: this.state.nextLevelXP,
      achievementHistory: this.state.achievementHistory
    })
  }

  /**
   * 加载数据
   */
  loadData() {
    const data = storageManager.getData('achievements', {})
    
    if (data.unlockedAchievements) {
      Object.assign(this.state, data)
    }
  }

  /**
   * 重置所有成就（谨慎使用）
   */
  resetAchievements() {
    Object.assign(this.state, {
      unlockedAchievements: [],
      achievementProgress: {},
      pendingNotifications: [],
      totalPoints: 0,
      level: 1,
      experiencePoints: 0,
      nextLevelXP: 100,
      achievementHistory: []
    })
    this.saveData()
  }

  /**
   * 导出成就数据
   */
  exportAchievements() {
    return {
      achievements: this.state.unlockedAchievements.map(id => ({
        id,
        achievement: this.achievements[id],
        unlockedAt: this.state.achievementHistory.find(h => h.achievementId === id)?.unlockedAt
      })),
      stats: this.getAchievementStats(),
      badges: this.getUserBadges(),
      exportedAt: new Date().toISOString()
    }
  }
}

// 创建全局成就系统实例
export const globalAchievementSystem = new AchievementSystem()