import { defineStore } from 'pinia'

export const useShuangpinStore = defineStore('shuangpin', {
  state: () => ({
    // 当前选择的双拼方案
    currentScheme: 'microsoft',
    // 当前练习的键位
    currentPracticeKey: null,
    // 学习进度
    learningProgress: {
      completedKeys: [],
      masteredKeys: [],
      practiceHistory: {},
      lastPracticeDate: null
    },
    // 练习统计
    statistics: {
      totalChars: 0,
      correctChars: 0,
      totalTime: 0,
      practiceHistory: [],
      errorPatterns: {}
    },
    // 游戏分数
    gameScores: [],
    // 用户设置
    settings: {
      soundEnabled: true,
      showPinyin: true,
      showHint: true,
      difficulty: 'normal'
    }
  }),

  getters: {
    accuracy: (state) => {
      if (state.statistics.totalChars === 0) return 0
      return (state.statistics.correctChars / state.statistics.totalChars * 100).toFixed(2)
    },
    averageSpeed: (state) => {
      if (state.statistics.totalTime === 0) return 0
      return ((state.statistics.correctChars / state.statistics.totalTime) * 60).toFixed(2)
    },
    learningStreak: (state) => {
      if (!state.learningProgress.lastPracticeDate) return 0
      const today = new Date()
      const lastPractice = new Date(state.learningProgress.lastPracticeDate)
      const diffDays = Math.floor((today - lastPractice) / (1000 * 60 * 60 * 24))
      return diffDays <= 1 ? state.learningProgress.streak || 1 : 0
    },
    masteryPercentage: (state) => {
      return (state.learningProgress.masteredKeys.length / 26 * 100).toFixed(1)
    },
    commonErrors: (state) => {
      return Object.entries(state.statistics.errorPatterns)
        .sort(([, a], [, b]) => b.count - a.count)
        .slice(0, 5)
        .map(([key, value]) => ({
          pattern: key,
          count: value.count,
          examples: value.examples.slice(0, 3)
        }))
    }
  },

  actions: {
    // 设置当前练习的键位
    setCurrentPracticeKey(key) {
      this.currentPracticeKey = key
    },

    // 更新学习进度
    updateLearningProgress(key, mastered = false) {
      const today = new Date().toISOString().split('T')[0]
      
      if (!this.learningProgress.completedKeys.includes(key)) {
        this.learningProgress.completedKeys.push(key)
      }
      
      if (mastered && !this.learningProgress.masteredKeys.includes(key)) {
        this.learningProgress.masteredKeys.push(key)
      }

      // 更新练习历史
      if (!this.learningProgress.practiceHistory[today]) {
        this.learningProgress.practiceHistory[today] = {
          keys: new Set(),
          totalTime: 0
        }
      }
      this.learningProgress.practiceHistory[today].keys.add(key)

      // 更新练习日期和连续练习天数
      if (this.learningProgress.lastPracticeDate !== today) {
        const lastDate = this.learningProgress.lastPracticeDate
        if (lastDate) {
          const diffDays = Math.floor(
            (new Date(today) - new Date(lastDate)) / (1000 * 60 * 60 * 24)
          )
          if (diffDays === 1) {
            this.learningProgress.streak = (this.learningProgress.streak || 0) + 1
          } else if (diffDays > 1) {
            this.learningProgress.streak = 1
          }
        } else {
          this.learningProgress.streak = 1
        }
        this.learningProgress.lastPracticeDate = today
      }
    },

    // 记录练习结果
    recordPractice(chars, correct, time, errors = []) {
      this.statistics.totalChars += chars
      this.statistics.correctChars += correct
      this.statistics.totalTime += time

      // 记录错误模式
      errors.forEach(error => {
        const pattern = `${error.expected}->${error.actual}`
        if (!this.statistics.errorPatterns[pattern]) {
          this.statistics.errorPatterns[pattern] = {
            count: 0,
            examples: []
          }
        }
        this.statistics.errorPatterns[pattern].count += error.count
        if (error.context) {
          this.statistics.errorPatterns[pattern].examples.push(error.context)
        }
      })

      this.statistics.practiceHistory.push({
        timestamp: new Date().toISOString(),
        chars,
        correct,
        time,
        speed: (correct / time * 60).toFixed(2),
        accuracy: (correct / chars * 100).toFixed(2)
      })
    },

    // 记录游戏分数
    recordGameScore(score, gameType) {
      this.gameScores.push({
        score,
        gameType,
        timestamp: new Date().toISOString()
      })
    },

    // 更新用户设置
    updateSettings(settings) {
      this.settings = {
        ...this.settings,
        ...settings
      }
    },

    // 切换双拼方案
    changeScheme(scheme) {
      this.currentScheme = scheme
    }
  }
}) 