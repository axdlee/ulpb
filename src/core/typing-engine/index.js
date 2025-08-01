/**
 * 打字引擎核心模块
 * 处理打字逻辑、统计和反馈
 */

class TypingEngine {
  constructor() {
    this.isActive = false
    this.isPaused = false
    this.startTime = null
    this.currentText = []
    this.currentIndex = 0
    this.errors = []
    this.keyPresses = []
    this.stats = {
      currentSpeed: 0,
      currentAccuracy: 100,
      totalCharacters: 0,
      correctCharacters: 0,
      errorCount: 0
    }
  }

  init() {
    console.log('Typing engine initialized')
    return { success: true }
  }

  start(text) {
    try {
      this.currentText = Array.isArray(text) ? text : text.split('')
      this.currentIndex = 0
      this.errors = []
      this.keyPresses = []
      this.startTime = Date.now()
      this.isActive = true
      this.isPaused = false
      
      this.stats = {
        currentSpeed: 0,
        currentAccuracy: 100,
        totalCharacters: this.currentText.length,
        correctCharacters: 0,
        errorCount: 0
      }

      return { success: true, message: 'Typing engine started' }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  pause() {
    this.isPaused = true
    return { success: true }
  }

  resume() {
    this.isPaused = false
    return { success: true }
  }

  stop() {
    this.isActive = false
    this.isPaused = false
    
    const duration = Date.now() - this.startTime
    const minutes = duration / (1000 * 60)
    const speed = minutes > 0 ? Math.round(this.stats.correctCharacters / minutes) : 0
    
    return {
      success: true,
      duration,
      speed,
      accuracy: this.stats.currentAccuracy,
      errors: this.errors,
      correctCharacters: this.stats.correctCharacters,
      totalCharacters: this.stats.totalCharacters,
      completed: this.currentIndex >= this.currentText.length
    }
  }

  handleKeyPress(key) {
    if (!this.isActive || this.isPaused) {
      return { success: false, message: 'Engine not active' }
    }

    const expectedChar = this.currentText[this.currentIndex]
    const isCorrect = key === expectedChar

    this.keyPresses.push({
      key,
      expected: expectedChar,
      correct: isCorrect,
      timestamp: Date.now()
    })

    if (isCorrect) {
      this.stats.correctCharacters++
      this.currentIndex++
    } else {
      this.stats.errorCount++
      this.errors.push({
        expected: expectedChar,
        actual: key,
        position: this.currentIndex,
        timestamp: Date.now()
      })
    }

    // 更新统计
    this.updateStats()

    return {
      success: true,
      isCorrect,
      completed: this.currentIndex >= this.currentText.length,
      currentIndex: this.currentIndex,
      expectedChar,
      actualChar: key
    }
  }

  getCurrentState() {
    return {
      ...this.stats,
      currentIndex: this.currentIndex,
      isActive: this.isActive,
      isPaused: this.isPaused,
      progress: this.stats.totalCharacters > 0 ? 
        Math.round((this.currentIndex / this.stats.totalCharacters) * 100) : 0
    }
  }

  updateStats() {
    if (!this.startTime) return

    const duration = Date.now() - this.startTime
    const minutes = duration / (1000 * 60)
    
    if (minutes > 0) {
      this.stats.currentSpeed = Math.round(this.stats.correctCharacters / minutes)
    }

    const totalAttempts = this.stats.correctCharacters + this.stats.errorCount
    if (totalAttempts > 0) {
      this.stats.currentAccuracy = Math.round((this.stats.correctCharacters / totalAttempts) * 100)
    }
  }

  reset() {
    this.isActive = false
    this.isPaused = false
    this.startTime = null
    this.currentText = []
    this.currentIndex = 0
    this.errors = []
    this.keyPresses = []
    this.stats = {
      currentSpeed: 0,
      currentAccuracy: 100,
      totalCharacters: 0,
      correctCharacters: 0,
      errorCount: 0
    }
  }
}

// 全局实例
export const globalTypingEngine = new TypingEngine()