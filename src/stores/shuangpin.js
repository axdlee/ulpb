import { defineStore } from 'pinia'

// 双拼方案配置
const SHUANGPIN_SCHEMES = {
  microsoft: {
    name: '微软双拼',
    description: '微软 Windows 自带的双拼方案',
    author: 'Microsoft',
    version: '1.0'
  },
  xiaohe: {
    name: '小鹤双拼',
    description: '小鹤双拼是一种形码双拼方案',
    author: '郑码',
    version: '1.0'
  },
  ziranma: {
    name: '自然码',
    description: '自然码双拼输入法方案',
    author: '自然码',
    version: '1.0'
  },
  sougou: {
    name: '搜狗双拼',
    description: '搜狗输入法的双拼方案',
    author: '搜狗',
    version: '1.0'
  },
  zhineng: {
    name: '智能ABC',
    description: '智能ABC双拼方案',
    author: '智能ABC',
    version: '1.0'
  },
  jiajia: {
    name: '加加双拼',
    description: '加加双拼输入法方案',
    author: '加加',
    version: '1.0'
  },
  pinyin: {
    name: '拼音加加',
    description: '拼音加加双拼方案',
    author: '拼音加加',
    version: '1.0'
  }
}

// 小鹤双拼方案数据
const xiaohe = {
  name: '小鹤双拼',
  shengmu: {
    b: 'b', p: 'p', m: 'm', f: 'f',
    d: 'd', t: 't', n: 'n', l: 'l',
    g: 'g', k: 'k', h: 'h',
    j: 'j', q: 'q', x: 'x',
    zh: 'v', ch: 'i', sh: 'u', r: 'r',
    z: 'z', c: 'c', s: 's', y: 'y', w: 'w'
  },
  yunmu: {
    a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
    ai: 'd', ei: 'w', ui: 'v',
    ao: 'c', ou: 'z', iu: 'q',
    ie: 'x', ue: 't',
    an: 'j', en: 'f', in: 'n', un: 'p',
    ang: 'h', eng: 'g', ing: 'k', ong: 's',
    ia: 'w', iao: 'k', ian: 'm', iang: 'l',
    iong: 's', ua: 'w', uai: 'y', uan: 'r', uang: 'l',
    uo: 'o', ve: 't'
  }
}

// 生成键盘布局数据
function generateKeyboardLayout(scheme) {
  const layout = [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',
    'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'
  ]

  return layout.map(key => {
    const data = { key }
    
    // 查找这个键位上的声母
    for (const [shengmu, k] of Object.entries(scheme.shengmu)) {
      if (k === key) {
        data.type = 'shengmu'
        data.shengmu = shengmu
        break
      }
    }

    // 查找这个键位上的韵母
    for (const [yunmu, k] of Object.entries(scheme.yunmu)) {
      if (k === key) {
        data.type = data.type === 'shengmu' ? 'both' : 'yunmu'
        data.yunmu = yunmu
      }
    }

    return data
  })
}

export const useShuangpinStore = defineStore('shuangpin', {
  state: () => ({
    // 当前选择的双拼方案
    currentScheme: xiaohe,
    // 当前主题
    currentTheme: 'default',
    // 主题设置
    themes: {
      default: {
        name: '默认主题',
        colors: {
          primary: 'blue',
          secondary: 'indigo',
          accent: 'purple',
          background: 'gray',
          text: 'gray'
        }
      },
      dark: {
        name: '暗黑主题',
        colors: {
          primary: 'blue',
          secondary: 'indigo',
          accent: 'purple',
          background: 'gray',
          text: 'white'
        }
      },
      light: {
        name: '明亮主题',
        colors: {
          primary: 'sky',
          secondary: 'cyan',
          accent: 'teal',
          background: 'white',
          text: 'gray'
        }
      },
      warm: {
        name: '暖色主题',
        colors: {
          primary: 'orange',
          secondary: 'amber',
          accent: 'yellow',
          background: 'white',
          text: 'gray'
        }
      },
      cool: {
        name: '冷色主题',
        colors: {
          primary: 'emerald',
          secondary: 'teal',
          accent: 'cyan',
          background: 'white',
          text: 'gray'
        }
      }
    },
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
    },
    lessonProgress: {},
    practiceStats: {
      totalTime: 0,
      totalChars: 0,
      accuracy: 0,
      speed: 0
    }
  }),

  getters: {
    // 获取所有可用的双拼方案
    availableSchemes() {
      return Object.entries(SHUANGPIN_SCHEMES).map(([key, scheme]) => ({
        value: key,
        ...scheme
      }))
    },
    // 获取当前方案的详细信息
    currentSchemeInfo() {
      return SHUANGPIN_SCHEMES[this.currentScheme]
    },
    // 获取当前主题配置
    currentThemeConfig() {
      return this.themes[this.currentTheme]
    },
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
    },
    getCurrentSchemeLayout: (state) => {
      return generateKeyboardLayout(state.currentScheme)
    },
    getLessonProgress: (state) => (lessonId) => {
      return state.lessonProgress[lessonId] || 0
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
      if (SHUANGPIN_SCHEMES[scheme]) {
        this.currentScheme = scheme
      }
    },

    // 切换主题
    changeTheme(theme) {
      if (this.themes[theme]) {
        this.currentTheme = theme
      }
    },

    updateLessonProgress(lessonId, progress) {
      this.lessonProgress[lessonId] = progress
    },

    updatePracticeStats(stats) {
      Object.assign(this.practiceStats, stats)
    }
  }
}) 