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
      state.isCompleted = true
      
      // 保存会话结果
      state.sessionResults = sessionResult
      
      // 停止统计更新
      stopStatsUpdate()
      
      // 保存到历史记录
      await savePracticeSession(sessionResult)
      
      // 显示完成通知
      appStore.addNotification({
        type: 'success',
        title: '练习完成',
        message: `速度: ${sessionResult.speed} 字/分, 准确率: ${sessionResult.accuracy}%`
      })
      
    } catch (error) {
      console.error('停止练习失败:', error)
      appStore.addError(error)
    }
  }

  // 重新开始练习
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
      appStore.addError(error)
    }
  }

  // 退出练习
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
      appStore.addError(error)
    }
  }

  // 处理键盘输入
  const processKeyInput = (key) => {
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
      appStore.addError(error)
    }
  }

  // 更新当前字符
  const updateCurrentCharacter = () => {
    if (state.currentIndex < state.practiceText.length) {
      state.currentCharacter = state.practiceText[state.currentIndex]
      // 这里可以添加获取拼音的逻辑
      state.currentPinyin = getPinyinForCharacter(state.currentCharacter)
      
      // 更新目标键位
      updateTargetKeys()
    }
  }

  // 获取字符拼音
  const getPinyinForCharacter = (char) => {
    // 这里可以集成拼音库或使用简单映射
    return char // 临时返回字符本身
  }

  // 更新目标键位
  const updateTargetKeys = () => {
    // 根据当前字符计算需要的键位
    state.targetKeys = [state.currentCharacter]
  }

  // 更新统计数据
  const updateStats = () => {
    if (!state.startTime) return
    
    const now = Date.now()
    state.elapsedTime = now - state.startTime
    
    if (state.currentIndex > 0) {
      // 计算速度 (字符/分钟)
      const minutes = state.elapsedTime / (1000 * 60)
      state.currentSpeed = Math.round(state.currentIndex / minutes)
      
      // 计算准确率
      const totalAttempts = state.currentIndex + state.currentErrors
      state.currentAccuracy = Math.round((state.currentIndex / totalAttempts) * 100)
    }
  }

  // 获取课程数据
  const getLesson = async (lessonId) => {
    try {
      // 这里应该从课程数据中获取
      // 临时返回示例数据
      return {
        id: lessonId,
        title: `第${lessonId}课`,
        description: '练习课程',
        content: '示例练习文本',
        difficulty: 1,
        nextLessonId: lessonId + 1
      }
    } catch (error) {
      console.error('获取课程失败:', error)
      appStore.addError(error)
      return null
    }
  }

  // 加载最近练习记录
  const loadRecentSessions = async () => {
    try {
      const saved = storageManager.getData('recentSessions', [])
      state.recentSessions = saved
    } catch (error) {
      console.error('加载最近练习记录失败:', error)
      appStore.addError(error)
    }
  }

  // 保存练习会话
  const savePracticeSession = async (sessionResult) => {
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
      
      // 添加到历史记录
      state.sessionHistory.push(session)
      state.recentSessions.unshift(session)
      
      // 只保留最近20个记录
      if (state.recentSessions.length > 20) {
        state.recentSessions = state.recentSessions.slice(0, 20)
      }
      
      // 保存到存储
      storageManager.setData('sessionHistory', state.sessionHistory)
      storageManager.setData('recentSessions', state.recentSessions)
      
    } catch (error) {
      console.error('保存练习会话失败:', error)
      appStore.addError(error)
    }
  }

  // 计算分数
  const calculateScore = (sessionResult) => {
    const speed = sessionResult.speed || state.currentSpeed
    const accuracy = sessionResult.accuracy || state.currentAccuracy
    
    // 简单的分数计算公式
    return Math.round((speed * accuracy) / 100)
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

  // Stats页面需要的方法
  const getTotalTime = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    return sessions.reduce((total, session) => total + session.duration, 0)
  }

  const getAverageSpeed = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return 0
    const totalSpeed = sessions.reduce((total, session) => total + session.speed, 0)
    return Math.round(totalSpeed / sessions.length)
  }

  const getAverageAccuracy = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return 0
    const totalAccuracy = sessions.reduce((total, session) => total + session.accuracy, 0)
    return Math.round(totalAccuracy / sessions.length)
  }

  const getSessionCount = (timeRange) => {
    return getSessionsForTimeRange(timeRange).length
  }

  const getTimeTrend = (timeRange) => {
    // 计算时间趋势 (与上一期对比)
    const currentSessions = getSessionsForTimeRange(timeRange)
    const previousSessions = getSessionsForPreviousPeriod(timeRange)
    
    const currentTotal = currentSessions.reduce((total, session) => total + session.duration, 0)
    const previousTotal = previousSessions.reduce((total, session) => total + session.duration, 0)
    
    return currentTotal - previousTotal
  }

  const getSpeedTrend = (timeRange) => {
    const currentAvg = getAverageSpeed(timeRange)
    const previousAvg = getAverageSpeedForPreviousPeriod(timeRange)
    return currentAvg - previousAvg
  }

  const getAccuracyTrend = (timeRange) => {
    const currentAvg = getAverageAccuracy(timeRange)
    const previousAvg = getAverageAccuracyForPreviousPeriod(timeRange)
    return currentAvg - previousAvg
  }

  const getSessionTrend = (timeRange) => {
    const currentCount = getSessionCount(timeRange)
    const previousCount = getSessionCountForPreviousPeriod(timeRange)
    return currentCount - previousCount
  }

  const getProgressChartData = (timeRange, metric) => {
    const sessions = getSessionsForTimeRange(timeRange)
    
    // 按日期分组
    const groupedData = groupSessionsByDate(sessions)
    
    return {
      labels: Object.keys(groupedData),
      datasets: [{
        label: getMetricLabel(metric),
        data: Object.values(groupedData).map(daySessions => {
          if (metric === 'speed') {
            return daySessions.reduce((sum, s) => sum + s.speed, 0) / daySessions.length
          } else if (metric === 'accuracy') {
            return daySessions.reduce((sum, s) => sum + s.accuracy, 0) / daySessions.length
          } else if (metric === 'time') {
            return daySessions.reduce((sum, s) => sum + s.duration, 0) / 60000 // 转换为分钟
          } else if (metric === 'chars') {
            return daySessions.reduce((sum, s) => sum + s.totalCharacters, 0)
          }
          return 0
        }),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    }
  }

  const getSpeedAccuracyData = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    
    return {
      datasets: [{
        label: '练习记录',
        data: sessions.map(session => ({
          x: session.speed,
          y: session.accuracy
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: '#3B82F6'
      }]
    }
  }

  const getKeyErrorData = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const errorCounts = {}
    
    sessions.forEach(session => {
      Object.entries(state.errorPatterns).forEach(([pattern, count]) => {
        const key = pattern.split('->')[0]
        errorCounts[key] = (errorCounts[key] || 0) + count
      })
    })
    
    const topErrors = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
    
    return {
      labels: topErrors.map(([key]) => key),
      datasets: [{
        label: '错误次数',
        data: topErrors.map(([, count]) => count),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: '#EF4444'
      }]
    }
  }

  const getTimeDistributionData = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const timeSlots = {
      '早晨(6-12)': 0,
      '下午(12-18)': 0,
      '晚上(18-24)': 0,
      '深夜(0-6)': 0
    }
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours()
      if (hour >= 6 && hour < 12) timeSlots['早晨(6-12)'] += session.duration
      else if (hour >= 12 && hour < 18) timeSlots['下午(12-18)'] += session.duration
      else if (hour >= 18 && hour < 24) timeSlots['晚上(18-24)'] += session.duration
      else timeSlots['深夜(0-6)'] += session.duration
    })
    
    return {
      labels: Object.keys(timeSlots),
      datasets: [{
        data: Object.values(timeSlots).map(time => time / 60000), // 转换为分钟
        backgroundColor: [
          '#F59E0B',
          '#3B82F6',
          '#8B5CF6',
          '#1F2937'
        ]
      }]
    }
  }

  const getPracticeRecords = (timeRange) => {
    return getSessionsForTimeRange(timeRange).map(session => ({
      id: session.id,
      date: new Date(session.timestamp).toLocaleDateString(),
      lesson: `第${session.lessonId}课` || '练习',
      duration: formatDuration(session.duration),
      speed: session.speed,
      accuracy: session.accuracy,
      chars: session.totalCharacters,
      score: session.score || Math.round(session.speed * session.accuracy / 100)
    }))
  }

  const filterRecords = (records, filter) => {
    switch (filter) {
      case 'completed':
        return records.filter(record => record.accuracy >= 90)
      case 'excellent':
        return records.filter(record => record.accuracy >= 95 && record.speed >= 30)
      case 'recent':
        return records.slice(0, 20)
      default:
        return records
    }
  }

  const sortRecords = (records, sortBy, sortOrder) => {
    return [...records].sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'date') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }

  const getTotalRecords = (timeRange, filter, searchQuery) => {
    let records = getSessionsForTimeRange(timeRange)
    
    if (searchQuery) {
      records = records.filter(session => 
        session.lessonId?.toString().includes(searchQuery)
      )
    }
    
    if (filter !== 'all') {
      records = filterRecords(records.map(session => ({
        accuracy: session.accuracy,
        speed: session.speed
      })), filter)
    }
    
    return records.length
  }

  const getRecentAchievements = () => {
    return state.newAchievements.slice(-5).map(achievement => ({
      id: achievement.id,
      name: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlocked: true,
      progress: 100
    }))
  }

  const getLearningInsights = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const insights = []
    
    if (sessions.length > 0) {
      const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
      const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
      
      if (avgSpeed > 25) {
        insights.push({
          id: 'speed-good',
          type: 'positive',
          icon: '🚀',
          title: '速度优秀',
          description: `您的平均速度达到 ${Math.round(avgSpeed)} 字/分钟，表现出色！`
        })
      }
      
      if (avgAccuracy > 90) {
        insights.push({
          id: 'accuracy-good',
          type: 'positive',
          icon: '🎯',
          title: '准确率优秀',
          description: `您的平均准确率达到 ${Math.round(avgAccuracy)}%，非常精准！`
        })
      }
      
      if (sessions.length < 3) {
        insights.push({
          id: 'practice-more',
          type: 'warning',
          icon: '💪',
          title: '建议增加练习',
          description: '建议每天至少练习3次，以保持稳定进步',
          action: {
            label: '开始练习',
            type: 'practice',
            target: 'daily'
          }
        })
      }
    }
    
    return insights
  }

  const getComparisonData = (type) => {
    // 返回对比分析数据
    return {
      labels: ['本周', '上周'],
      datasets: [{
        label: '速度对比',
        data: [getAverageSpeed('week'), getAverageSpeedForPreviousPeriod('week')],
        backgroundColor: ['#3B82F6', '#93C5FD']
      }]
    }
  }

  const getAllStatsData = () => {
    return {
      sessionHistory: state.sessionHistory,
      overallStats: overallStats.value,
      todayStats: todayStats.value,
      exportTime: Date.now()
    }
  }

  const refreshStats = async () => {
    // 重新计算统计数据
    await loadPracticeData()
  }

  const loadStatsData = async (timeRange) => {
    // 加载指定时间范围的统计数据
    return Promise.resolve()
  }

  const exportStats = (format, options) => {
    const data = getAllStatsData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `practice-stats-${new Date().toISOString().split('T')[0]}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 辅助函数
  const getSessionsForTimeRange = (timeRange) => {
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case 'day':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        return state.sessionHistory
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    return state.sessionHistory.filter(session => 
      new Date(session.timestamp) >= startDate
    )
  }

  const getSessionsForPreviousPeriod = (timeRange) => {
    const now = new Date()
    let startDate = new Date()
    let endDate = new Date()
    
    switch (timeRange) {
      case 'day':
        endDate.setDate(now.getDate() - 1)
        endDate.setHours(23, 59, 59, 999)
        startDate.setDate(now.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        endDate.setDate(now.getDate() - 7)
        startDate.setDate(now.getDate() - 14)
        break
      case 'month':
        endDate.setMonth(now.getMonth() - 1)
        startDate.setMonth(now.getMonth() - 2)
        break
      default:
        endDate.setDate(now.getDate() - 7)
        startDate.setDate(now.getDate() - 14)
    }
    
    return state.sessionHistory.filter(session => {
      const sessionDate = new Date(session.timestamp)
      return sessionDate >= startDate && sessionDate <= endDate
    })
  }

  const getAverageSpeedForPreviousPeriod = (timeRange) => {
    const sessions = getSessionsForPreviousPeriod(timeRange)
    if (sessions.length === 0) return 0
    return Math.round(sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length)
  }

  const getAverageAccuracyForPreviousPeriod = (timeRange) => {
    const sessions = getSessionsForPreviousPeriod(timeRange)
    if (sessions.length === 0) return 0
    return Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
  }

  const getSessionCountForPreviousPeriod = (timeRange) => {
    return getSessionsForPreviousPeriod(timeRange).length
  }

  const groupSessionsByDate = (sessions) => {
    const grouped = {}
    sessions.forEach(session => {
      const date = new Date(session.timestamp).toLocaleDateString()
      if (!grouped[date]) {
        grouped[date] = []
      }
      grouped[date].push(session)
    })
    return grouped
  }

  const getMetricLabel = (metric) => {
    const labels = {
      speed: '速度 (字/分)',
      accuracy: '准确率 (%)',
      time: '时长 (分钟)',
      chars: '字符数'
    }
    return labels[metric] || ''
  }

  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000)
    const seconds = Math.floor((milliseconds % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Dashboard页面需要的方法
  const loadTodayStats = async () => {
    // 加载今日统计数据
    return Promise.resolve()
  }

  const loadRecentData = async () => {
    // 加载最近数据
    return Promise.resolve()
  }

  const loadRecommendations = async () => {
    // 加载推荐数据
    return Promise.resolve()
  }

  const getCompletedLessons = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const completedLessons = new Set()
    sessions.forEach(session => {
      if (session.lessonId && session.accuracy >= 90) {
        completedLessons.add(session.lessonId)
      }
    })
    return completedLessons.size
  }

  const refreshRecommendations = async () => {
    // 刷新推荐
    return Promise.resolve()
  }

  const loadStatsForPeriod = async (period) => {
    // 加载指定时期的统计数据
    return Promise.resolve()
  }

  // Analytics页面需要的高级分析方法
  const getPerformanceIndex = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return 0
    
    const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    const speedScore = Math.min(avgSpeed / 60 * 100, 100) // 60字/分为100分
    const accuracyScore = avgAccuracy
    
    return Math.round((speedScore + accuracyScore) / 2)
  }

  const getPerformanceComponents = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return { speed: 0, accuracy: 0, stability: 0, improvement: 0 }
    
    const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    
    // 计算稳定性（速度和准确率的标准差）
    const speedVariance = sessions.reduce((sum, s) => Math.pow(s.speed - avgSpeed, 2), 0) / sessions.length
    const accuracyVariance = sessions.reduce((sum, s) => Math.pow(s.accuracy - avgAccuracy, 2), 0) / sessions.length
    const stability = Math.max(0, 100 - Math.sqrt(speedVariance + accuracyVariance))
    
    // 计算进步率（最近与最早的对比）
    const improvement = sessions.length > 1 ? 
      ((sessions[sessions.length - 1].speed - sessions[0].speed) / sessions[0].speed * 100) : 0
    
    return {
      speed: Math.round(Math.min(avgSpeed / 60 * 100, 100)),
      accuracy: Math.round(avgAccuracy),
      stability: Math.round(stability),
      improvement: Math.round(Math.max(0, improvement))
    }
  }

  const getKeyMetrics = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const previousSessions = getSessionsForPreviousPeriod(timeRange)
    
    return [
      {
        key: 'sessions',
        icon: '📝',
        value: sessions.length,
        label: '练习次数',
        trend: sessions.length > previousSessions.length ? 'up' : 'down',
        change: sessions.length - previousSessions.length
      },
      {
        key: 'time',
        icon: '⏱️',
        value: formatTime(sessions.reduce((sum, s) => sum + s.duration, 0)),
        label: '练习时长',
        trend: 'stable',
        change: 0
      },
      {
        key: 'speed',
        icon: '⚡',
        value: `${getAverageSpeed(timeRange)} 字/分`,
        label: '平均速度',
        trend: 'up',
        change: 5
      },
      {
        key: 'accuracy',
        icon: '🎯',
        value: `${getAverageAccuracy(timeRange)}%`,
        label: '平均准确率',
        trend: 'stable',
        change: 0
      }
    ]
  }

  const getIntelligentInsights = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const insights = []
    
    if (sessions.length > 0) {
      const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
      const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
      
      // 速度分析
      if (avgSpeed > 40) {
        insights.push({
          id: 'speed-excellent',
          type: 'success',
          icon: '🚀',
          title: '速度表现优异',
          description: `您的平均打字速度已达到 ${Math.round(avgSpeed)} 字/分钟，超越了大部分用户！`,
          metrics: [
            { key: 'current', label: '当前速度', value: `${Math.round(avgSpeed)} 字/分` },
            { key: 'rank', label: '排名', value: '前10%' }
          ],
          action: { label: '挑战更高难度', type: 'practice', target: 'advanced' }
        })
      }
      
      // 准确率分析
      if (avgAccuracy > 95) {
        insights.push({
          id: 'accuracy-perfect',
          type: 'success',
          icon: '🎯',
          title: '准确率接近完美',
          description: `您的平均准确率达到 ${Math.round(avgAccuracy)}%，打字非常精准！`,
          metrics: [
            { key: 'current', label: '当前准确率', value: `${Math.round(avgAccuracy)}%` },
            { key: 'improvement', label: '提升空间', value: '微调即可' }
          ]
        })
      }
      
      // 练习频率分析
      if (sessions.length < 5) {
        insights.push({
          id: 'frequency-low',
          type: 'warning',
          icon: '📈',
          title: '建议增加练习频率',
          description: '定期练习有助于保持和提升您的打字技能',
          metrics: [
            { key: 'current', label: '本期练习', value: `${sessions.length} 次` },
            { key: 'recommended', label: '建议频率', value: '每天1-2次' }
          ],
          action: { label: '制定练习计划', type: 'goal', target: 'daily-practice' }
        })
      }
    }
    
    return insights
  }

  const getPerformanceTrendData = (timeRange, metric) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const groupedData = groupSessionsByDate(sessions)
    
    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: '速度',
          data: Object.values(groupedData).map(daySessions => 
            daySessions.reduce((sum, s) => sum + s.speed, 0) / daySessions.length
          ),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: '准确率',
          data: Object.values(groupedData).map(daySessions => 
            daySessions.reduce((sum, s) => sum + s.accuracy, 0) / daySessions.length
          ),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        }
      ]
    }
  }

  const getEfficiencyHeatmapData = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    const heatmapData = []
    
    // 按小时和星期几生成热力图数据
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const sessionsInSlot = sessions.filter(session => {
          const date = new Date(session.timestamp)
          return date.getDay() === day && date.getHours() === hour
        })
        
        const efficiency = sessionsInSlot.length > 0 ? 
          sessionsInSlot.reduce((sum, s) => sum + s.speed * s.accuracy / 100, 0) / sessionsInSlot.length : 0
        
        heatmapData.push({
          x: hour,
          y: day,
          v: Math.round(efficiency)
        })
      }
    }
    
    return {
      datasets: [{
        label: '学习效率',
        data: heatmapData,
        backgroundColor: (ctx) => {
          const value = ctx.parsed.v
          const alpha = Math.min(value / 100, 1)
          return `rgba(59, 130, 246, ${alpha})`
        }
      }]
    }
  }

  const getErrorPatternData = (timeRange) => {
    // 简化的桑基图数据
    return {
      datasets: [{
        data: [
          { from: '声母错误', to: 'zh-z', value: 15 },
          { from: '声母错误', to: 'ch-c', value: 12 },
          { from: '韵母错误', to: 'ing-in', value: 20 },
          { from: '韵母错误', to: 'ang-an', value: 18 }
        ]
      }]
    }
  }

  const getSkillRadarData = (timeRange) => {
    const sessions = getSessionsForTimeRange(timeRange)
    if (sessions.length === 0) return { datasets: [] }
    
    const avgSpeed = sessions.reduce((sum, s) => sum + s.speed, 0) / sessions.length
    const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length
    
    return {
      labels: ['声母熟练度', '韵母熟练度', '词汇掌握', '句子流畅度', '整体节奏', '错误率控制'],
      datasets: [{
        label: '技能水平',
        data: [
          Math.min(avgSpeed / 60 * 100, 100), // 声母
          Math.min(avgSpeed / 50 * 100, 100), // 韵母  
          Math.min(avgSpeed / 40 * 100, 100), // 词汇
          Math.min(avgSpeed / 30 * 100, 100), // 句子
          avgAccuracy, // 节奏
          Math.max(0, 100 - (100 - avgAccuracy) * 2) // 错误控制
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#3B82F6'
      }]
    }
  }

  const getProgressPredictionData = () => {
    // 简化的预测数据
    const futureData = []
    const currentSpeed = getAverageSpeed('month')
    
    for (let i = 1; i <= 12; i++) {
      futureData.push({
        x: `+${i}月`,
        y: currentSpeed + i * 2 // 假设每月提升2字/分
      })
    }
    
    return {
      labels: futureData.map(d => d.x),
      datasets: [{
        label: '速度预测',
        data: futureData.map(d => d.y),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderDash: [5, 5]
      }]
    }
  }

  const getDrillDownStats = (dimension, timeRange) => {
    return [
      { key: 'total', icon: '📊', value: '28', label: '总数据点' },
      { key: 'avg', icon: '📈', value: '85%', label: '平均表现' },
      { key: 'best', icon: '⭐', value: '98%', label: '最佳表现' },
      { key: 'trend', icon: '📉', value: '+5%', label: '趋势变化' }
    ]
  }

  const getDrillDownTableData = (dimension, timeRange) => {
    // 模拟钻取表格数据
    return [
      { id: 1, name: '第1课', value: 85, change: '+5%', status: '优秀' },
      { id: 2, name: '第2课', value: 78, change: '+2%', status: '良好' },
      { id: 3, name: '第3课', value: 92, change: '+8%', status: '优秀' }
    ]
  }

  const getDrillDownColumns = (dimension) => {
    return [
      { key: 'name', label: '名称', sortable: true },
      { key: 'value', label: '数值', sortable: true },
      { key: 'change', label: '变化', sortable: true },
      { key: 'status', label: '状态', sortable: false }
    ]
  }

  const getAIRecommendations = (timeRange) => {
    return [
      {
        id: 'speed-focus',
        title: '专注速度提升',
        description: '基于您的练习数据，建议重点提升打字速度',
        priority: 'high',
        details: [
          { key: 'current', label: '当前速度', value: '25 字/分' },
          { key: 'target', label: '目标速度', value: '35 字/分' },
          { key: 'timeline', label: '预计时间', value: '2-3周' }
        ],
        actions: [
          { id: 'practice', label: '开始练习', type: 'practice', primary: true },
          { id: 'schedule', label: '制定计划', type: 'goal', primary: false }
        ]
      }
    ]
  }

  const getPersonalizedGoals = () => {
    return [
      {
        id: 'speed-goal',
        title: '速度提升目标',
        description: '在一个月内将打字速度提升到40字/分钟',
        progress: 65,
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000,
        completed: false
      },
      {
        id: 'accuracy-goal', 
        title: '准确率目标',
        description: '保持95%以上的准确率',
        progress: 88,
        deadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
        completed: false
      }
    ]
  }

  // 其他Analytics方法的简化实现
  const getTimeAnalysisData = (timeRange) => ({ timeSlots: [], efficiency: [] })
  const getTimeRecommendations = () => ([])
  const getLearningPatterns = (timeRange) => ({ patterns: [] })
  const getEfficiencyMetrics = (timeRange) => ({ metrics: [] })
  const getDifficultyAnalysis = (timeRange) => ({ analysis: [] })
  const getContentRecommendations = () => ([])
  const getEnvironmentFactors = (timeRange) => ({ factors: [] })
  const getEnvironmentSuggestions = () => ([])
  const getAllAnalyticsData = (timeRange) => ({ data: {} })
  const getPerformanceData = (timeRange) => ({ performance: {} })

  // Analytics操作方法
  const refreshAnalyticsData = async (timeRange) => Promise.resolve()
  const loadAnalyticsData = async (timeRange) => Promise.resolve()
  const generateIntelligentInsights = async (timeRange) => Promise.resolve()
  const drillDownAnalysis = (row, dimension) => {}
  const exportDrillDownData = (dimension, timeRange) => {}
  const adjustGoal = (goalId) => {}
  const applyTimeOptimization = (optimization) => {}
  const applyMethodOptimization = (optimization) => {}
  const applyContentOptimization = (optimization) => {}
  const applyEnvironmentOptimization = (optimization) => {}
  const saveAnalyticsSettings = (settings) => {}
  const exportAnalyticsReport = (format, options, timeRange) => {}
  const createPersonalizedGoal = (goal) => {}

  // 初始化
  const init = () => {
    loadPracticeData()
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
    
    // 方法
    startPractice,
    pausePractice,
    resumePractice,
    stopPractice,
    restartPractice,
    exitPractice,
    processKeyInput,
    getLesson,
    loadRecentSessions,
    handleKeyPress,
    updatePracticeSettings,
    setCurrentLesson,
    updateLessonProgress,
    savePracticeData,
    loadPracticeData,
    exportPracticeData,
    importPracticeData,
    resetPracticeData,
    
    // Stats页面需要的方法
    getTotalTime,
    getAverageSpeed,
    getAverageAccuracy,
    getSessionCount,
    getTimeTrend,
    getSpeedTrend,
    getAccuracyTrend,
    getSessionTrend,
    getProgressChartData,
    getSpeedAccuracyData,
    getKeyErrorData,
    getTimeDistributionData,
    getPracticeRecords,
    filterRecords,
    sortRecords,
    getTotalRecords,
    getRecentAchievements,
    getLearningInsights,
    getComparisonData,
    getAllStatsData,
    refreshStats,
    loadStatsData,
    exportStats,
    
    // Dashboard页面需要的方法
    loadTodayStats,
    loadRecentData,
    loadRecommendations,
    getCompletedLessons,
    refreshRecommendations,
    loadStatsForPeriod,
    
    // Analytics页面需要的高级分析方法
    getPerformanceIndex,
    getPerformanceComponents,
    getKeyMetrics,
    getIntelligentInsights,
    getPerformanceTrendData,
    getEfficiencyHeatmapData,
    getErrorPatternData,
    getSkillRadarData,
    getProgressPredictionData,
    getDrillDownStats,
    getDrillDownTableData,
    getDrillDownColumns,
    getAIRecommendations,
    getPersonalizedGoals,
    getTimeAnalysisData,
    getTimeRecommendations,
    getLearningPatterns,
    getEfficiencyMetrics,
    getDifficultyAnalysis,
    getContentRecommendations,
    getEnvironmentFactors,
    getEnvironmentSuggestions,
    getAllAnalyticsData,
    getPerformanceData,
    refreshAnalyticsData,
    loadAnalyticsData,
    generateIntelligentInsights,
    drillDownAnalysis,
    exportDrillDownData,
    adjustGoal,
    applyTimeOptimization,
    applyMethodOptimization,
    applyContentOptimization,
    applyEnvironmentOptimization,
    saveAnalyticsSettings,
    exportAnalyticsReport,
    createPersonalizedGoal,
    
    init
  }
})