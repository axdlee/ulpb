import { defineStore } from 'pinia'

export const useShuangpinStore = defineStore('shuangpin', {
  state: () => ({
    // 当前选择的双拼方案
    currentScheme: 'microsoft',
    // 学习进度
    learningProgress: {
      completedKeys: [],
      masteredKeys: []
    },
    // 练习统计
    statistics: {
      totalChars: 0,
      correctChars: 0,
      totalTime: 0,
      practiceHistory: []
    },
    // 游戏分数
    gameScores: []
  }),

  getters: {
    accuracy: (state) => {
      if (state.statistics.totalChars === 0) return 0
      return (state.statistics.correctChars / state.statistics.totalChars * 100).toFixed(2)
    },
    averageSpeed: (state) => {
      if (state.statistics.totalTime === 0) return 0
      return ((state.statistics.correctChars / state.statistics.totalTime) * 60).toFixed(2)
    }
  },

  actions: {
    // 更新学习进度
    updateLearningProgress(key, mastered = false) {
      if (!this.learningProgress.completedKeys.includes(key)) {
        this.learningProgress.completedKeys.push(key)
      }
      if (mastered && !this.learningProgress.masteredKeys.includes(key)) {
        this.learningProgress.masteredKeys.push(key)
      }
    },

    // 记录练习结果
    recordPractice(chars, correct, time) {
      this.statistics.totalChars += chars
      this.statistics.correctChars += correct
      this.statistics.totalTime += time
      this.statistics.practiceHistory.push({
        timestamp: new Date().toISOString(),
        chars,
        correct,
        time
      })
    },

    // 记录游戏分数
    recordGameScore(score) {
      this.gameScores.push({
        score,
        timestamp: new Date().toISOString()
      })
    },

    // 切换双拼方案
    changeScheme(scheme) {
      this.currentScheme = scheme
    }
  }
}) 