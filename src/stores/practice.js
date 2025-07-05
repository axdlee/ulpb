/**
 * 练习状态管理
 * 管理打字练习的状态、进度、结果等
 */

import { defineStore } from 'pinia'
import { reactive, computed, ref } from 'vue'
import { globalTypingEngine } from '../core/typing-engine/index.js'
import { globalLearningSystem } from '../core/learning-system/index.js'
import { globalAnalyticsEngine } from '../core/analytics/index.js'
import { globalAchievementSystem } from '../core/achievements/index.js'
import { storageManager } from '../utils/storage.js'
import { useAppStore } from './app.js'

export const usePracticeStore = defineStore('practice', () => {
  const appStore = useAppStore()
  
  // 练习状态
  const state = reactive({
    // 当前练习
    currentSession: null,
    isActive: false,
    isPaused: false,
    
    // 练习内容
    currentLesson: null,
    practiceText: [],
    currentIndex: 0,
    
    // 实时统计
    startTime: null,
    elapsedTime: 0,
    currentSpeed: 0,
    currentAccuracy: 0,
    currentErrors: 0,
    
    // 练习历史
    sessionHistory: [],
    recentSessions: [],
    
    // 课程进度
    lessonProgress: {},
    completedLessons: [],
    currentLessonId: null,
    
    // 练习设置
    practiceSettings: {
      mode: 'guided', // 'guided' | 'free' | 'test' | 'game'
      difficulty: 'adaptive',
      showRealTimeStats: true,
      showFingerHint: true,
      enableSound: true,
      autoNext: false,
      practiceTime: 0, // 0 = unlimited
      targetSpeed: 0, // 0 = no target
      targetAccuracy: 95
    },
    
    // 错误分析
    errorPatterns: {},
    weakKeys: [],
    strongKeys: [],
    
    // 成就和里程碑
    newAchievements: [],
    milestones: []
  })

  // 定时器引用
  const updateTimer = ref(null)
  
  // 计算属性
  const currentSessionStats = computed(() => {
    if (!state.currentSession) return null
    
    return globalTypingEngine.getCurrentState()
  })

  const todayStats = computed(() => {
    const today = new Date().toDateString()
    const todaySessions = state.sessionHistory.filter(session => {
      return new Date(session.timestamp).toDateString() === today
    })
    
    if (todaySessions.length === 0) {
      return {
        sessions: 0,
        totalTime: 0,
        totalChars: 0,
        avgSpeed: 0,
        avgAccuracy: 0,
        bestSpeed: 0,
        bestAccuracy: 0
      }
    }
    
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0)
    const totalChars = todaySessions.reduce((sum, s) => sum + s.totalCharacters, 0)
    const avgSpeed = Math.round(todaySessions.reduce((sum, s) => sum + s.speed, 0) / todaySessions.length)
    const avgAccuracy = Math.round(todaySessions.reduce((sum, s) => sum + s.accuracy, 0) / todaySessions.length)
    const bestSpeed = Math.max(...todaySessions.map(s => s.speed))
    const bestAccuracy = Math.max(...todaySessions.map(s => s.accuracy))
    
    return {
      sessions: todaySessions.length,
      totalTime,
      totalChars,
      avgSpeed,
      avgAccuracy,
      bestSpeed,
      bestAccuracy
    }
  })

  const overallStats = computed(() => {
    if (state.sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        totalCharacters: 0,
        averageSpeed: 0,
        averageAccuracy: 0,
        bestSpeed: 0,
        bestAccuracy: 0,
        currentStreak: 0
      }
    }
    
    const sessions = state.sessionHistory
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0)
    const totalChars = sessions.reduce((sum, s) => sum + s.totalCharacters, 0)
    const avgSpeed = Math.round(sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length)
    const avgAccuracy = Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
    const bestSpeed = Math.max(...sessions.map(s => s.speed))
    const bestAccuracy = Math.max(...sessions.map(s => s.accuracy))
    
    return {
      totalSessions: sessions.length,
      totalTime,
      totalCharacters: totalChars,
      averageSpeed: avgSpeed,
      averageAccuracy: avgAccuracy,
      bestSpeed,
      bestAccuracy,
      currentStreak: calculateCurrentStreak()
    }
  })

  const practiceRecommendation = computed(() => {
    return globalLearningSystem.recommendNextPractice()
  })

  // Dashboard相关计算属性
  const learningStreak = computed(() => {
    if (state.sessionHistory.length === 0) return 0
    
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toDateString()
      
      const hasSessionOnDate = state.sessionHistory.some(session => {
        return new Date(session.timestamp).toDateString() === dateStr
      })
      
      if (hasSessionOnDate) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  })

  const userLevel = computed(() => {
    const totalTime = state.sessionHistory.reduce((sum, s) => sum + s.duration, 0)
    const hours = totalTime / (1000 * 60 * 60)
    
    if (hours < 2) return 1
    if (hours < 5) return 2
    if (hours < 10) return 3
    if (hours < 20) return 4
    if (hours < 40) return 5
    return Math.min(10, Math.floor(hours / 10) + 1)
  })

  const recentPractices = computed(() => {
    return state.sessionHistory
      .slice(-10)
      .reverse()
      .map(session => ({
        id: session.id,
        lessonId: session.lessonId,
        date: new Date(session.timestamp),
        duration: session.duration,
        speed: session.speed,
        accuracy: session.accuracy,
        score: session.score
      }))
  })

  const recentAchievements = computed(() => {
    return state.newAchievements
      .slice(-5)
      .reverse()
      .map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        earnedAt: new Date(achievement.timestamp)
      }))
  })

  const upcomingAchievements = computed(() => {
    // 模拟即将获得的成就
    const upcoming = []
    const currentSpeed = overallStats.value.averageSpeed
    const currentAccuracy = overallStats.value.averageAccuracy
    
    if (currentSpeed > 0 && currentSpeed < 30) {
      upcoming.push({
        id: 'speed-30',
        title: '速度达人',
        description: '平均速度达到30字/分钟',
        icon: '🚀',
        progress: Math.round((currentSpeed / 30) * 100)
      })
    }
    
    if (currentAccuracy > 0 && currentAccuracy < 95) {
      upcoming.push({
        id: 'accuracy-95',
        title: '精准射手',
        description: '准确率达到95%',
        icon: '🎯',
        progress: Math.round((currentAccuracy / 95) * 100)
      })
    }
    
    return upcoming
  })

  const currentLessonProgress = computed(() => {
    if (!state.currentLessonId) return 0
    return state.lessonProgress[state.currentLessonId] || 0
  })

  const dailyPracticeProgress = computed(() => {
    const todayTime = todayStats.value.totalTime / (1000 * 60) // 转换为分钟
    const dailyGoal = 30 // 30分钟目标
    return Math.min(Math.round((todayTime / dailyGoal) * 100), 100)
  })

  // 动作方法
  const startPractice = async (lessonId, practiceText) => {
    try {
      if (state.isActive) {
        stopPractice()
      }
      
      // 设置当前课程
      state.currentLessonId = lessonId
      state.practiceText = practiceText
      state.currentIndex = 0
      
      // 启动打字引擎
      const result = globalTypingEngine.start(practiceText)
      if (!result.success) {
        throw new Error(result.message)
      }
      
      // 更新状态
      state.isActive = true
      state.isPaused = false
      state.startTime = Date.now()
      state.currentSession = {
        id: Date.now(),
        lessonId,
        startTime: state.startTime,
        practiceText
      }
      
      // 开始统计更新
      startStatsUpdate()
      
      appStore.addNotification({
        type: 'info',
        title: '练习开始',
        message: '开始新的练习会话',
        duration: 2000
      })
      
      return result
    } catch (error) {
      appStore.addError(error)
      return { success: false, error }
    }
  }

  const pausePractice = () => {
    if (!state.isActive || state.isPaused) return
    
    globalTypingEngine.pause()
    state.isPaused = true
    stopStatsUpdate()
    
    appStore.addNotification({
      type: 'info',
      title: '练习暂停',
      message: '点击继续按钮恢复练习'
    })
  }

  const resumePractice = () => {
    if (!state.isActive || !state.isPaused) return
    
    globalTypingEngine.resume()
    state.isPaused = false
    startStatsUpdate()
    
    appStore.addNotification({
      type: 'info',
      title: '练习继续',
      message: '练习已恢复'
    })
  }

  const stopPractice = async () => {
    if (!state.isActive) return
    
    try {
      // 停止引擎并获取结果
      const sessionResult = globalTypingEngine.stop()
      
      // 更新状态
      state.isActive = false
      state.isPaused = false
      stopStatsUpdate()
      
      // 处理练习结果
      await processPracticeResult(sessionResult)
      
      // 清理当前会话
      state.currentSession = null
      
      appStore.addNotification({
        type: 'success',
        title: '练习完成',
        message: `本次练习用时 ${Math.round(sessionResult.duration)}秒`
      })
      
      return sessionResult
    } catch (error) {
      appStore.addError(error)
      return null
    }
  }

  const handleKeyPress = (key) => {
    if (!state.isActive || state.isPaused) return
    
    try {
      const result = globalTypingEngine.handleKeyPress(key)
      
      // 更新当前位置
      if (result.completed) {
        state.currentIndex++
      }
      
      // 播放声音反馈
      if (state.practiceSettings.enableSound) {
        playKeySound(result.isCorrect)
      }
      
      return result
    } catch (error) {
      appStore.addError(error)
      return { success: false, error }
    }
  }

  const updatePracticeSettings = (newSettings) => {
    Object.assign(state.practiceSettings, newSettings)
    savePracticeData()
  }

  const setCurrentLesson = (lesson) => {
    state.currentLesson = lesson
    state.currentLessonId = lesson?.id
  }

  const updateLessonProgress = (lessonId, progress) => {
    state.lessonProgress[lessonId] = progress
    
    if (progress >= 100 && !state.completedLessons.includes(lessonId)) {
      state.completedLessons.push(lessonId)
      
      appStore.addNotification({
        type: 'success',
        title: '课程完成',
        message: `恭喜！您已完成课程 ${lessonId}`,
        duration: 4000
      })
    }
    
    savePracticeData()
  }

  // 内部方法
  const startStatsUpdate = () => {
    updateTimer.value = setInterval(() => {
      updateRealTimeStats()
    }, 1000)
  }

  const stopStatsUpdate = () => {
    if (updateTimer.value) {
      clearInterval(updateTimer.value)
      updateTimer.value = null
    }
  }

  const updateRealTimeStats = () => {
    if (!state.isActive || state.isPaused) return
    
    const stats = globalTypingEngine.getCurrentState()
    
    state.elapsedTime = Math.round((Date.now() - state.startTime) / 1000)
    state.currentSpeed = stats.currentSpeed
    state.currentAccuracy = stats.currentAccuracy
    state.currentErrors = stats.errors.length
  }

  const processPracticeResult = async (sessionResult) => {
    // 添加时间戳和会话ID
    const processedResult = {
      ...sessionResult,
      id: state.currentSession.id,
      timestamp: Date.now(),
      lessonId: state.currentLessonId,
      practiceMode: state.practiceSettings.mode
    }
    
    // 添加到历史记录
    state.sessionHistory.unshift(processedResult)
    state.recentSessions.unshift(processedResult)
    
    // 限制历史记录数量
    if (state.sessionHistory.length > 1000) {
      state.sessionHistory = state.sessionHistory.slice(0, 1000)
    }
    if (state.recentSessions.length > 50) {
      state.recentSessions = state.recentSessions.slice(0, 50)
    }
    
    // 更新分析引擎
    globalAnalyticsEngine.addSession(processedResult)
    
    // 更新学习系统
    const userStats = overallStats.value
    const learningResult = globalLearningSystem.analyzePerformance(processedResult, userStats)
    
    // 检查成就
    const newAchievements = globalAchievementSystem.checkAchievements(processedResult, userStats)
    if (newAchievements.length > 0) {
      state.newAchievements.push(...newAchievements)
    }
    
    // 更新错误模式分析
    updateErrorAnalysis(sessionResult.errors)
    
    // 更新课程进度
    if (state.currentLessonId) {
      updateLessonProgress(state.currentLessonId, calculateLessonProgress(sessionResult))
    }
    
    // 保存数据
    savePracticeData()
  }

  const updateErrorAnalysis = (errors) => {
    errors.forEach(error => {
      const pattern = `${error.expected}->${error.actual}`
      state.errorPatterns[pattern] = (state.errorPatterns[pattern] || 0) + 1
    })
    
    // 分析弱键位
    const keyErrors = {}
    errors.forEach(error => {
      keyErrors[error.expected] = (keyErrors[error.expected] || 0) + 1
    })
    
    // 更新弱键位列表
    state.weakKeys = Object.entries(keyErrors)
      .filter(([, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([key]) => key)
  }

  const calculateLessonProgress = (sessionResult) => {
    // 基于准确率和完成度计算进度
    const accuracy = sessionResult.accuracy
    const completion = sessionResult.completed ? 100 : (sessionResult.correctCharacters / sessionResult.totalCharacters) * 100
    
    return Math.round((accuracy * 0.6 + completion * 0.4))
  }

  const calculateCurrentStreak = () => {
    const sessions = state.sessionHistory
    if (sessions.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].timestamp)
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const playKeySound = (isCorrect) => {
    if (!state.practiceSettings.enableSound) return
    
    // 创建音频上下文播放按键声音
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(isCorrect ? 800 : 400, audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      // 忽略音频播放错误
    }
  }

  const savePracticeData = () => {
    const dataToSave = {
      sessionHistory: state.sessionHistory.slice(0, 100), // 只保存最近100次
      recentSessions: state.recentSessions.slice(0, 20), // 只保存最近20次
      lessonProgress: state.lessonProgress,
      completedLessons: state.completedLessons,
      practiceSettings: state.practiceSettings,
      errorPatterns: state.errorPatterns,
      weakKeys: state.weakKeys,
      strongKeys: state.strongKeys
    }
    
    storageManager.setData('practiceData', dataToSave)
  }

  const loadPracticeData = () => {
    const savedData = storageManager.getData('practiceData', {})
    
    if (savedData.sessionHistory) {
      state.sessionHistory = savedData.sessionHistory
    }
    if (savedData.recentSessions) {
      state.recentSessions = savedData.recentSessions
    }
    if (savedData.lessonProgress) {
      state.lessonProgress = savedData.lessonProgress
    }
    if (savedData.completedLessons) {
      state.completedLessons = savedData.completedLessons
    }
    if (savedData.practiceSettings) {
      Object.assign(state.practiceSettings, savedData.practiceSettings)
    }
    if (savedData.errorPatterns) {
      state.errorPatterns = savedData.errorPatterns
    }
    if (savedData.weakKeys) {
      state.weakKeys = savedData.weakKeys
    }
    if (savedData.strongKeys) {
      state.strongKeys = savedData.strongKeys
    }
  }

  const exportPracticeData = () => {
    return {
      sessionHistory: state.sessionHistory,
      lessonProgress: state.lessonProgress,
      completedLessons: state.completedLessons,
      practiceSettings: state.practiceSettings,
      stats: overallStats.value,
      exportTime: Date.now()
    }
  }

  const importPracticeData = (data) => {
    try {
      if (data.sessionHistory) {
        state.sessionHistory = data.sessionHistory
      }
      if (data.lessonProgress) {
        state.lessonProgress = data.lessonProgress
      }
      if (data.completedLessons) {
        state.completedLessons = data.completedLessons
      }
      if (data.practiceSettings) {
        Object.assign(state.practiceSettings, data.practiceSettings)
      }
      
      savePracticeData()
      
      appStore.addNotification({
        type: 'success',
        title: '导入成功',
        message: '练习数据已成功导入'
      })
      
      return true
    } catch (error) {
      appStore.addError(error)
      return false
    }
  }

  const resetPracticeData = () => {
    state.sessionHistory = []
    state.recentSessions = []
    state.lessonProgress = {}
    state.completedLessons = []
    state.errorPatterns = {}
    state.weakKeys = []
    state.strongKeys = []
    state.newAchievements = []
    
    savePracticeData()
    
    appStore.addNotification({
      type: 'info',
      title: '数据重置',
      message: '练习数据已重置'
    })
  }

  // 初始化
  const init = () => {
    loadPracticeData()
  }

  return {
    // 状态
    state,
    
    // 计算属性
    currentSessionStats,
    todayStats,
    overallStats,
    practiceRecommendation,
    learningStreak,
    userLevel,
    recentPractices,
    recentAchievements,
    upcomingAchievements,
    currentLessonProgress,
    dailyPracticeProgress,
    
    // 方法
    startPractice,
    pausePractice,
    resumePractice,
    stopPractice,
    handleKeyPress,
    updatePracticeSettings,
    setCurrentLesson,
    updateLessonProgress,
    savePracticeData,
    loadPracticeData,
    exportPracticeData,
    importPracticeData,
    resetPracticeData,
    init
  }
})