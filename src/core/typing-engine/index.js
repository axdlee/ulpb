/**
 * 核心打字引擎
 * 提供智能化的打字练习、错误分析、速度计算等功能
 */

import { reactive, ref, computed } from 'vue'
import { getShuangpinCode, validateShuangpinInput } from '../../utils/pinyin.js'

export class TypingEngine {
  constructor(options = {}) {
    this.options = {
      mode: 'shuangpin', // 'shuangpin' | 'fullpinyin' | 'mixed'
      difficulty: 'normal', // 'easy' | 'normal' | 'hard' | 'adaptive'
      enablePrediction: true,
      enableRealTimeAnalysis: true,
      ...options
    }

    // 当前状态
    this.state = reactive({
      isActive: false,
      isPaused: false,
      startTime: null,
      endTime: null,
      
      // 练习内容
      currentText: [],
      currentIndex: 0,
      currentCharacter: null,
      
      // 输入状态
      userInput: '',
      currentStage: 'shengmu', // 'shengmu' | 'yunmu' | 'complete'
      expectedInput: '',
      
      // 统计数据
      totalCharacters: 0,
      correctCharacters: 0,
      errors: [],
      keystrokes: [],
      
      // 实时指标
      currentSpeed: 0,
      currentAccuracy: 0,
      sessionTime: 0
    })

    // 定时器
    this.updateTimer = null
    this.analysisTimer = null
  }

  /**
   * 开始打字练习
   * @param {Array} text - 练习文本数组
   */
  start(text) {
    this.state.currentText = this.prepareText(text)
    this.state.currentIndex = 0
    this.state.currentCharacter = this.state.currentText[0]
    this.state.startTime = Date.now()
    this.state.isActive = true
    this.state.isPaused = false
    
    this.updateCurrentExpectedInput()
    this.startTimers()
    
    return {
      success: true,
      message: '开始练习',
      currentCharacter: this.state.currentCharacter
    }
  }

  /**
   * 暂停/继续练习
   */
  toggle() {
    if (this.state.isPaused) {
      this.resume()
    } else {
      this.pause()
    }
  }

  pause() {
    this.state.isPaused = true
    this.stopTimers()
  }

  resume() {
    this.state.isPaused = false
    this.startTimers()
  }

  /**
   * 停止练习
   */
  stop() {
    this.state.isActive = false
    this.state.isPaused = false
    this.state.endTime = Date.now()
    this.stopTimers()
    
    return this.getSessionResults()
  }

  /**
   * 处理用户按键输入
   * @param {string} key - 按下的键
   */
  handleKeyPress(key) {
    if (!this.state.isActive || this.state.isPaused) {
      return { success: false, message: '练习未激活' }
    }

    const timestamp = Date.now()
    const character = this.state.currentCharacter

    // 记录按键
    this.recordKeystroke(key, timestamp)

    // 验证输入
    const validation = this.validateInput(key, character)
    
    if (validation.isCorrect) {
      return this.handleCorrectInput(key, timestamp)
    } else {
      return this.handleIncorrectInput(key, timestamp, validation)
    }
  }

  /**
   * 验证输入是否正确
   */
  validateInput(key, character) {
    if (!character) return { isCorrect: false, reason: 'no_character' }

    const { shengmu, yunmu } = character
    const currentStage = this.state.currentStage

    let isCorrect = false
    let nextStage = currentStage

    if (currentStage === 'shengmu') {
      isCorrect = key === shengmu
      if (isCorrect) {
        nextStage = 'yunmu'
      }
    } else if (currentStage === 'yunmu') {
      isCorrect = key === yunmu
      if (isCorrect) {
        nextStage = 'complete'
      }
    }

    return {
      isCorrect,
      currentStage,
      nextStage,
      expected: currentStage === 'shengmu' ? shengmu : yunmu,
      actual: key
    }
  }

  /**
   * 处理正确输入
   */
  handleCorrectInput(key, timestamp) {
    const validation = this.validateInput(key, this.state.currentCharacter)
    
    this.state.currentStage = validation.nextStage
    this.state.correctCharacters++

    if (validation.nextStage === 'complete') {
      // 完成当前字符，移动到下一个
      this.moveToNextCharacter()
    }

    this.updateRealTimeStats()
    
    return {
      success: true,
      isCorrect: true,
      stage: this.state.currentStage,
      completed: validation.nextStage === 'complete',
      character: this.state.currentCharacter,
      nextCharacter: this.getNextCharacter()
    }
  }

  /**
   * 处理错误输入
   */
  handleIncorrectInput(key, timestamp, validation) {
    const error = {
      id: Date.now(),
      timestamp,
      character: this.state.currentCharacter.char,
      expected: validation.expected,
      actual: key,
      stage: validation.currentStage,
      position: this.state.currentIndex
    }

    this.state.errors.push(error)
    this.updateRealTimeStats()

    return {
      success: true,
      isCorrect: false,
      error,
      expected: validation.expected,
      stage: this.state.currentStage
    }
  }

  /**
   * 移动到下一个字符
   */
  moveToNextCharacter() {
    this.state.currentIndex++
    
    if (this.state.currentIndex >= this.state.currentText.length) {
      // 练习完成
      return this.stop()
    }

    this.state.currentCharacter = this.state.currentText[this.state.currentIndex]
    this.state.currentStage = 'shengmu'
    this.updateCurrentExpectedInput()
  }

  /**
   * 获取下一个字符
   */
  getNextCharacter() {
    const nextIndex = this.state.currentIndex + 1
    return nextIndex < this.state.currentText.length ? 
           this.state.currentText[nextIndex] : null
  }

  /**
   * 更新当前期望输入
   */
  updateCurrentExpectedInput() {
    if (!this.state.currentCharacter) return

    const { shengmu, yunmu } = this.state.currentCharacter
    this.state.expectedInput = this.state.currentStage === 'shengmu' ? shengmu : yunmu
  }

  /**
   * 准备练习文本
   */
  prepareText(text) {
    return text.map(item => {
      if (typeof item === 'string') {
        const code = getShuangpinCode(item)
        return {
          char: item,
          shengmu: code.shengmu,
          yunmu: code.yunmu,
          pinyin: code.pinyin
        }
      }
      return item
    })
  }

  /**
   * 记录按键
   */
  recordKeystroke(key, timestamp) {
    this.state.keystrokes.push({
      key,
      timestamp,
      character: this.state.currentCharacter?.char,
      stage: this.state.currentStage,
      index: this.state.currentIndex
    })
  }

  /**
   * 更新实时统计
   */
  updateRealTimeStats() {
    const now = Date.now()
    const timeElapsed = (now - this.state.startTime) / 1000 / 60 // 分钟

    if (timeElapsed > 0) {
      // 计算速度 (字符/分钟)
      this.state.currentSpeed = Math.round(this.state.correctCharacters / timeElapsed)
      
      // 计算准确率
      const totalInputs = this.state.correctCharacters + this.state.errors.length
      this.state.currentAccuracy = totalInputs > 0 ? 
        Math.round((this.state.correctCharacters / totalInputs) * 100) : 100
      
      // 更新会话时间
      this.state.sessionTime = Math.round(timeElapsed * 60) // 秒
    }
  }

  /**
   * 启动定时器
   */
  startTimers() {
    // 实时统计更新定时器
    this.updateTimer = setInterval(() => {
      this.updateRealTimeStats()
    }, 1000)

    // 分析定时器
    if (this.options.enableRealTimeAnalysis) {
      this.analysisTimer = setInterval(() => {
        this.performRealTimeAnalysis()
      }, 5000)
    }
  }

  /**
   * 停止定时器
   */
  stopTimers() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer)
      this.updateTimer = null
    }
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer)
      this.analysisTimer = null
    }
  }

  /**
   * 执行实时分析
   */
  performRealTimeAnalysis() {
    // 分析最近的错误模式
    const recentErrors = this.state.errors.slice(-10)
    const errorPatterns = this.analyzeErrorPatterns(recentErrors)
    
    // 如果检测到特定错误模式，触发事件
    if (errorPatterns.length > 0) {
      this.onAnalysisUpdate?.(errorPatterns)
    }
  }

  /**
   * 分析错误模式
   */
  analyzeErrorPatterns(errors) {
    const patterns = {}
    
    errors.forEach(error => {
      const pattern = `${error.expected}->${error.actual}`
      patterns[pattern] = (patterns[pattern] || 0) + 1
    })

    return Object.entries(patterns)
      .filter(([, count]) => count >= 2)
      .map(([pattern, count]) => ({ pattern, count }))
  }

  /**
   * 获取会话结果
   */
  getSessionResults() {
    const totalTime = (this.state.endTime - this.state.startTime) / 1000 / 60
    const totalChars = this.state.currentIndex
    const errorCount = this.state.errors.length
    
    return {
      duration: totalTime * 60, // 秒
      totalCharacters: totalChars,
      correctCharacters: this.state.correctCharacters,
      errors: this.state.errors,
      keystrokes: this.state.keystrokes,
      speed: totalTime > 0 ? Math.round(totalChars / totalTime) : 0,
      accuracy: totalChars > 0 ? Math.round((this.state.correctCharacters / (this.state.correctCharacters + errorCount)) * 100) : 100,
      errorPatterns: this.analyzeErrorPatterns(this.state.errors),
      wpm: totalTime > 0 ? Math.round((totalChars - errorCount) / totalTime) : 0,
      completed: this.state.currentIndex >= this.state.currentText.length
    }
  }

  /**
   * 获取当前状态
   */
  getCurrentState() {
    return {
      ...this.state,
      progress: this.state.currentText.length > 0 ? 
        (this.state.currentIndex / this.state.currentText.length) * 100 : 0,
      remainingCharacters: this.state.currentText.length - this.state.currentIndex,
      estimatedTimeRemaining: this.calculateEstimatedTimeRemaining()
    }
  }

  /**
   * 计算预计剩余时间
   */
  calculateEstimatedTimeRemaining() {
    if (this.state.currentSpeed === 0) return null
    
    const remaining = this.state.currentText.length - this.state.currentIndex
    return Math.round((remaining / this.state.currentSpeed) * 60) // 秒
  }

  /**
   * 重置引擎状态
   */
  reset() {
    this.stopTimers()
    
    Object.assign(this.state, {
      isActive: false,
      isPaused: false,
      startTime: null,
      endTime: null,
      currentText: [],
      currentIndex: 0,
      currentCharacter: null,
      userInput: '',
      currentStage: 'shengmu',
      expectedInput: '',
      totalCharacters: 0,
      correctCharacters: 0,
      errors: [],
      keystrokes: [],
      currentSpeed: 0,
      currentAccuracy: 0,
      sessionTime: 0
    })
  }
}

// 创建全局打字引擎实例
export const globalTypingEngine = new TypingEngine()

// 导出工具函数
export { getShuangpinCode, validateShuangpinInput }