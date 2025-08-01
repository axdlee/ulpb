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

export const usePracticeStore = defineStore('practice', () => {
  // 练习状态
  const state = reactive({
    // 当前练习
    currentSession: null,
    isActive: false,
    isPaused: false,
    isCompleted: false,

    // 练习内容
    currentLesson: null,
    practiceText: [],
    currentIndex: 0,
    totalChars: 0,

    // 实时输入状态
    currentCharacter: '',
    currentPinyin: '',
    inputState: 'waiting', // 'waiting' | 'correct' | 'error' | 'pending'
    targetKeys: [],
    pressedKeys: [],
    errorKeys: [],

    // 实时统计
    startTime: null,
    elapsedTime: 0,
    currentSpeed: 0,
    currentAccuracy: 0,
    currentErrors: 0,

    // 输入反馈
    inputFeedback: {
      type: 'info',
      message: '准备开始练习',
      hint: ''
    },

    // 练习历史
    sessionHistory: [],
    recentSessions: [],
    sessionResults: null,

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

  const currentStats = computed(() => ({
    speed: state.currentSpeed,
    accuracy: state.currentAccuracy,
    duration: state.elapsedTime,
    progress: state.totalChars > 0 ? Math.round((state.currentIndex / state.totalChars) * 100) : 0,
    errors: state.currentErrors,
    charactersTyped: state.currentIndex
  }))

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
    const avgSpeed = Math.round(
      todaySessions.reduce((sum, s) => sum + s.speed, 0) / todaySessions.length
    )
    const avgAccuracy = Math.round(
      todaySessions.reduce((sum, s) => sum + s.accuracy, 0) / todaySessions.length
    )
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
    const avgAccuracy = Math.round(
      sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    )
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
        lessonTitle: `第${session.lessonId}课`,
        type: session.lessonId <= 5 ? 'initial' : session.lessonId <= 10 ? 'final' : 'word',
        time: session.timestamp,
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
        unlockedAt: achievement.earnedAt,
        isNew: Date.now() - achievement.earnedAt < 24 * 60 * 60 * 1000 // 24小时内为新成就
      }))
  })

  const upcomingAchievements = computed(() => {
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
      state.practiceText = Array.isArray(practiceText) ? practiceText : practiceText.split('')
      state.currentIndex = 0
      state.totalChars = state.practiceText.length

      // 重置状态
      state.isCompleted = false
      state.sessionResults = null
      state.currentErrors = 0
      state.currentSpeed = 0
      state.currentAccuracy = 100
      state.elapsedTime = 0

      // 初始化输入状态
      state.inputState = 'waiting'
      state.targetKeys = []
      state.pressedKeys = []
      state.errorKeys = []

      // 设置第一个字符
      updateCurrentCharacter()

      // 启动打字引擎
      const result = globalTypingEngine.start(state.practiceText)
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
        practiceText: state.practiceText
      }

      // 更新输入反馈
      state.inputFeedback = {
        type: 'info',
        message: '开始练习',
        hint: `请输入: ${state.currentCharacter}`
      }

      // 开始统计更新
      startStatsUpdate()

      return result
    } catch (error) {
      console.error('开始练习失败:', error)
      return { success: false, error }
    }
  }

  const pausePractice = () => {
    if (!state.isActive || state.isPaused) return

    globalTypingEngine.pause()
    state.isPaused = true
    stopStatsUpdate()
  }

  const resumePractice = () => {
    if (!state.isActive || !state.isPaused) return

    globalTypingEngine.resume()
    state.isPaused = false
    startStatsUpdate()
  }

  const stopPractice = async () => {
    if (!state.isActive) return

    try {
      // 停止引擎并获取结果
      const sessionResult = globalTypingEngine.stop()

      // 更新状态
      state.isActive = false
      state.isPaused = false
      state.isCompleted = true

      // 保存会话结果
      state.sessionResults = sessionResult

      // 停止统计更新
      stopStatsUpdate()

      // 保存到历史记录
      await savePracticeSession(sessionResult)
    } catch (error) {
      console.error('停止练习失败:', error)
    }
  }

  const restartPractice = async () => {
    if (!state.currentLesson) return

    try {
      // 停止当前练习
      if (state.isActive) {
        await stopPractice()
      }

      // 重置状态
      state.currentIndex = 0
      state.elapsedTime = 0
      state.currentSpeed = 0
      state.currentAccuracy = 0
      state.currentErrors = 0
      state.isCompleted = false
      state.sessionResults = null

      // 重新开始
      await startPractice(state.currentLessonId, state.practiceText)
    } catch (error) {
      console.error('重新开始练习失败:', error)
    }
  }

  const exitPractice = async () => {
    try {
      if (state.isActive) {
        await stopPractice()
      }

      // 重置状态
      state.currentSession = null
      state.isActive = false
      state.isPaused = false
      state.isCompleted = false
      state.currentLesson = null
      state.practiceText = []
      state.currentIndex = 0
      state.sessionResults = null

      // 更新输入反馈
      state.inputFeedback = {
        type: 'info',
        message: '练习已退出',
        hint: ''
      }
    } catch (error) {
      console.error('退出练习失败:', error)
    }
  }

  const processKeyInput = key => {
    if (!state.isActive || state.isPaused) return

    try {
      // 更新按键状态
      state.pressedKeys = [key]

      // 获取当前字符
      const currentChar = state.practiceText[state.currentIndex]
      if (!currentChar) return

      // 检查输入是否正确
      const isCorrect = key === currentChar

      if (isCorrect) {
        // 正确输入
        state.inputState = 'correct'
        state.currentIndex++
        state.errorKeys = []

        // 更新当前字符
        updateCurrentCharacter()

        // 更新反馈
        state.inputFeedback = {
          type: 'success',
          message: '正确！',
          hint: ''
        }
      } else {
        // 错误输入
        state.inputState = 'error'
        state.currentErrors++
        state.errorKeys = [key]

        // 更新反馈
        state.inputFeedback = {
          type: 'error',
          message: `应该输入 "${currentChar}"`,
          hint: `您输入了 "${key}"`
        }
      }

      // 检查是否完成
      if (state.currentIndex >= state.practiceText.length) {
        setTimeout(() => {
          stopPractice()
        }, 500)
      }

      // 更新统计
      updateStats()
    } catch (error) {
      console.error('处理键盘输入失败:', error)
    }
  }

  const updateCurrentCharacter = () => {
    if (state.currentIndex < state.practiceText.length) {
      state.currentCharacter = state.practiceText[state.currentIndex]
      state.currentPinyin = getPinyinForCharacter(state.currentCharacter)
      updateTargetKeys()
    }
  }

  const getPinyinForCharacter = char => {
    return char // 临时返回字符本身
  }

  const updateTargetKeys = () => {
    state.targetKeys = [state.currentCharacter]
  }

  const updateStats = () => {
    if (!state.startTime) return

    const now = Date.now()
    state.elapsedTime = now - state.startTime

    if (state.currentIndex > 0) {
      const minutes = state.elapsedTime / (1000 * 60)
      state.currentSpeed = Math.round(state.currentIndex / minutes)

      const totalAttempts = state.currentIndex + state.currentErrors
      state.currentAccuracy = Math.round((state.currentIndex / totalAttempts) * 100)
    }
  }

  const savePracticeSession = async sessionResult => {
    try {
      const session = {
        id: Date.now(),
        timestamp: Date.now(),
        lessonId: state.currentLessonId,
        duration: sessionResult.duration || state.elapsedTime,
        speed: sessionResult.speed || state.currentSpeed,
        accuracy: sessionResult.accuracy || state.currentAccuracy,
        errors: sessionResult.errors || state.currentErrors,
        totalCharacters: state.practiceText.length,
        score: calculateScore(sessionResult)
      }

      state.sessionHistory.push(session)
      state.recentSessions.unshift(session)

      if (state.recentSessions.length > 20) {
        state.recentSessions = state.recentSessions.slice(0, 20)
      }

      storageManager.setData('sessionHistory', state.sessionHistory)
      storageManager.setData('recentSessions', state.recentSessions)
    } catch (error) {
      console.error('保存练习会话失败:', error)
    }
  }

  const calculateScore = sessionResult => {
    const speed = sessionResult.speed || state.currentSpeed
    const accuracy = sessionResult.accuracy || state.currentAccuracy
    return Math.round((speed * accuracy) / 100)
  }

  const handleKeyPress = key => {
    if (!state.isActive || state.isPaused) return

    try {
      const result = globalTypingEngine.handleKeyPress(key)

      if (result.completed) {
        state.currentIndex++
      }

      if (state.practiceSettings.enableSound) {
        playKeySound(result.isCorrect)
      }

      return result
    } catch (error) {
      console.error('处理按键失败:', error)
      return { success: false, error }
    }
  }

  const updatePracticeSettings = newSettings => {
    Object.assign(state.practiceSettings, newSettings)
    savePracticeData()
  }

  const setCurrentLesson = lesson => {
    state.currentLesson = lesson
    state.currentLessonId = lesson?.id
  }

  const updateLessonProgress = (lessonId, progress) => {
    state.lessonProgress[lessonId] = progress

    if (progress >= 100 && !state.completedLessons.includes(lessonId)) {
      state.completedLessons.push(lessonId)
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
    state.currentErrors = stats.errors?.length || 0
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

  const playKeySound = isCorrect => {
    if (!state.practiceSettings.enableSound) return

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
      sessionHistory: state.sessionHistory.slice(0, 100),
      recentSessions: state.recentSessions.slice(0, 20),
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

  // Stats页面需要的方法
  const getTotalTime = timeRange => {
    const sessions = getSessionsForTimeRange(timeRange)
    return sessions.reduce((total, session) => total + session.duration, 0)
  }

  const getAverageSpeed = timeRange => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return 0
    const totalSpeed = sessions.reduce((total, session) => total + session.speed, 0)
    return Math.round(totalSpeed / sessions.length)
  }

  const getAverageAccuracy = timeRange => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return 0
    const totalAccuracy = sessions.reduce((total, session) => total + session.accuracy, 0)
    return Math.round(totalAccuracy / sessions.length)
  }

  const getSessionCount = timeRange => {
    return getSessionsForTimeRange(timeRange).length
  }

  const getCompletedLessons = timeRange => {
    const sessions = getSessionsForTimeRange(timeRange)
    const completedLessons = new Set()

    sessions.forEach(session => {
      if (session.accuracy >= 80) {
        completedLessons.add(session.lessonId)
      }
    })

    return completedLessons.size
  }

  const getTimeTrend = timeRange => {
    const currentSessions = getSessionsForTimeRange(timeRange)
    const previousSessions = getSessionsForPreviousPeriod(timeRange)

    const currentTotal = currentSessions.reduce((total, session) => total + session.duration, 0)
    const previousTotal = previousSessions.reduce((total, session) => total + session.duration, 0)

    return currentTotal - previousTotal
  }

  const getSpeedTrend = timeRange => {
    const currentAvg = getAverageSpeed(timeRange)
    const previousAvg = getAverageSpeedForPreviousPeriod(timeRange)
    return currentAvg - previousAvg
  }

  const getAccuracyTrend = timeRange => {
    const currentAvg = getAverageAccuracy(timeRange)
    const previousAvg = getAverageAccuracyForPreviousPeriod(timeRange)
    return currentAvg - previousAvg
  }

  const getSessionTrend = timeRange => {
    const currentCount = getSessionCount(timeRange)
    const previousCount = getSessionCountForPreviousPeriod(timeRange)
    return currentCount - previousCount
  }

  // 辅助方法
  const getSessionsForTimeRange = timeRange => {
    const now = new Date()
    let startDate

    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        return state.sessionHistory
    }

    return state.sessionHistory.filter(session =>
      new Date(session.timestamp) >= startDate
    )
  }

  const getSessionsForPreviousPeriod = timeRange => {
    const now = new Date()
    let startDate, endDate

    switch (timeRange) {
      case 'day':
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        endDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        endDate = new Date(now.getFullYear(), now.getMonth(), 1)
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1)
        break
      default:
        return []
    }

    return state.sessionHistory.filter(session => {
      const sessionDate = new Date(session.timestamp)
      return sessionDate >= startDate && sessionDate < endDate
    })
  }

  const getAverageSpeedForPreviousPeriod = timeRange => {
    const sessions = getSessionsForPreviousPeriod(timeRange)
    if (sessions.length === 0) return 0
    const totalSpeed = sessions.reduce((total, session) => total + session.speed, 0)
    return Math.round(totalSpeed / sessions.length)
  }

  const getAverageAccuracyForPreviousPeriod = timeRange => {
    const sessions = getSessionsForPreviousPeriod(timeRange)
    if (sessions.length === 0) return 0
    const totalAccuracy = sessions.reduce((total, session) => total + session.accuracy, 0)
    return Math.round(totalAccuracy / sessions.length)
  }

  const getSessionCountForPreviousPeriod = timeRange => {
    return getSessionsForPreviousPeriod(timeRange).length
  }

  // Dashboard 需要的方法
  const loadTodayStats = async () => {
    return todayStats.value
  }

  const loadRecentData = async () => {
    return {
      recentPractices: recentPractices.value,
      recentAchievements: recentAchievements.value
    }
  }

  const loadRecommendations = async () => {
    return practiceRecommendation.value
  }

  const refreshRecommendations = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return practiceRecommendation.value
  }

  const loadStatsForPeriod = async period => {
    return {
      totalTime: getTotalTime(period),
      averageSpeed: getAverageSpeed(period),
      averageAccuracy: getAverageAccuracy(period),
      sessionCount: getSessionCount(period)
    }
  }

  // 课程相关方法
  const getAllLessons = () => {
    const lessons = []
    for (let i = 1; i <= 15; i++) {
      lessons.push({
        id: i,
        title: `第${i}课`,
        description: `双拼学习第${i}课`,
        difficulty: Math.ceil(i / 3),
        type: i <= 5 ? 'initial' : i <= 10 ? 'final' : 'word'
      })
    }
    return lessons
  }

  const getLessonById = lessonId => {
    return getAllLessons().find(lesson => lesson.id === lessonId)
  }

  const getLessonProgress = lessonId => {
    return state.lessonProgress[lessonId] || 0
  }

  const getLessonStats = lessonId => {
    const lessonSessions = state.sessionHistory.filter(session => session.lessonId === lessonId)

    if (lessonSessions.length === 0) {
      return {
        progress: 0,
        timeSpent: 0,
        attempts: 0,
        bestSpeed: 0,
        bestAccuracy: 0
      }
    }

    return {
      progress: getLessonProgress(lessonId),
      timeSpent: Math.round(lessonSessions.reduce((sum, s) => sum + s.duration, 0) / 60000),
      attempts: lessonSessions.length,
      bestSpeed: Math.max(...lessonSessions.map(s => s.speed)),
      bestAccuracy: Math.max(...lessonSessions.map(s => s.accuracy))
    }
  }

  const getOverallProgress = () => {
    const totalLessons = getAllLessons().length
    const completedCount = state.completedLessons.length

    return {
      completedLessons: completedCount,
      totalLessons,
      completionRate: Math.round((completedCount / totalLessons) * 100),
      currentLevel: userLevel.value,
      totalTime: state.sessionHistory.reduce((sum, s) => sum + s.duration, 0),
      totalSessions: state.sessionHistory.length
    }
  }

  const loadLessons = async () => {
    return getAllLessons()
  }

  // 初始化方法
  const init = async () => {
    try {
      loadPracticeData()

      globalTypingEngine.init()
      globalLearningSystem.init()
      globalAnalyticsEngine.init()
      globalAchievementSystem.init()

      return true
    } catch (error) {
      console.error('Practice store initialization failed:', error)
      return false
    }
  }

  return {
    // 状态
    state,

    // 计算属性
    currentSessionStats,
    currentStats,
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

    // 核心方法
    startPractice,
    pausePractice,
    resumePractice,
    stopPractice,
    restartPractice,
    exitPractice,
    processKeyInput,
    handleKeyPress,

    // 设置方法
    updatePracticeSettings,
    setCurrentLesson,
    updateLessonProgress,

    // 统计方法
    getTotalTime,
    getAverageSpeed,
    getAverageAccuracy,
    getSessionCount,
    getCompletedLessons,
    getTimeTrend,
    getSpeedTrend,
    getAccuracyTrend,
    getSessionTrend,

    // Dashboard 方法
    loadTodayStats,
    loadRecentData,
    loadRecommendations,
    refreshRecommendations,
    loadStatsForPeriod,

    // 课程方法
    getAllLessons,
    getLessonById,
    getLessonProgress,
    getLessonStats,
    getOverallProgress,
    loadLessons,

    // 初始化
    init
  }
})