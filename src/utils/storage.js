// 数据存储管理器
export class StorageManager {
  constructor() {
    this.storageKey = 'shuangpin-app'
    this.version = '1.0.0'
    this.init()
  }

  // 初始化存储
  init() {
    this.migrate()
    this.setupAutoBackup()
  }

  // 数据迁移
  migrate() {
    const data = this.getAllData()
    if (!data.version || data.version !== this.version) {
      this.performMigration(data)
    }
  }

  // 执行数据迁移
  performMigration(oldData) {
    try {
      // 根据版本进行数据迁移
      let migratedData = { ...oldData }

      // 添加版本信息
      migratedData.version = this.version
      migratedData.migratedAt = Date.now()

      // 保存迁移后的数据
      this.saveAllData(migratedData)
      console.log('数据迁移完成')
    } catch (error) {
      console.error('数据迁移失败:', error)
    }
  }

  // 获取所有数据
  getAllData() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('读取数据失败:', error)
      return {}
    }
  }

  // 保存所有数据
  saveAllData(data) {
    try {
      data.lastSaved = Date.now()
      localStorage.setItem(this.storageKey, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('保存数据失败:', error)
      return false
    }
  }

  // 获取指定数据
  getData(key, defaultValue = null) {
    const allData = this.getAllData()
    return allData[key] !== undefined ? allData[key] : defaultValue
  }

  // 保存指定数据
  setData(key, value) {
    const allData = this.getAllData()
    allData[key] = value
    return this.saveAllData(allData)
  }

  // 删除指定数据
  removeData(key) {
    const allData = this.getAllData()
    delete allData[key]
    return this.saveAllData(allData)
  }

  // 清空所有数据
  clearData() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('清空数据失败:', error)
      return false
    }
  }

  // 数据备份
  backup() {
    const data = this.getAllData()
    const backup = {
      ...data,
      backupDate: new Date().toISOString(),
      appVersion: this.version
    }
    return JSON.stringify(backup, null, 2)
  }

  // 数据恢复
  restore(backupData) {
    try {
      const data = JSON.parse(backupData)

      // 验证备份数据
      if (!this.validateBackupData(data)) {
        throw new Error('备份数据格式不正确')
      }

      // 创建当前数据备份
      const currentBackup = this.backup()
      this.setData('lastBackup', currentBackup)

      // 恢复数据
      this.saveAllData(data)

      return { success: true, message: '数据恢复成功' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 验证备份数据
  validateBackupData(data) {
    return typeof data === 'object' && data !== null
  }

  // 自动备份设置
  setupAutoBackup() {
    const autoBackupInterval = this.getData('autoBackupInterval', 24 * 60 * 60 * 1000) // 默认24小时
    const lastBackup = this.getData('lastAutoBackup', 0)

    if (Date.now() - lastBackup > autoBackupInterval) {
      this.performAutoBackup()
    }

    // 设置定时器
    setInterval(() => {
      this.performAutoBackup()
    }, autoBackupInterval)
  }

  // 执行自动备份
  performAutoBackup() {
    try {
      const backup = this.backup()
      this.setData('autoBackup', backup)
      this.setData('lastAutoBackup', Date.now())
      console.log('自动备份完成')
    } catch (error) {
      console.error('自动备份失败:', error)
    }
  }

  // 获取存储使用情况
  getStorageUsage() {
    try {
      const data = JSON.stringify(this.getAllData())
      const used = new Blob([data]).size
      const available = 5 * 1024 * 1024 // 假设localStorage限制为5MB

      return {
        used,
        available,
        percentage: Math.round((used / available) * 100),
        usedFormatted: this.formatBytes(used),
        availableFormatted: this.formatBytes(available)
      }
    } catch (error) {
      console.error('获取存储使用情况失败:', error)
      return null
    }
  }

  // 格式化字节数
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 压缩数据
  compressData() {
    const data = this.getAllData()

    // 删除过期数据
    this.cleanupExpiredData(data)

    // 压缩练习记录（只保留最近的记录）
    if (data.practiceRecords && data.practiceRecords.length > 1000) {
      data.practiceRecords = data.practiceRecords.slice(-1000)
    }

    // 压缩游戏分数（只保留最高分）
    if (data.gameScores && data.gameScores.length > 100) {
      data.gameScores = data.gameScores.sort((a, b) => b.score - a.score).slice(0, 100)
    }

    this.saveAllData(data)
    return this.getStorageUsage()
  }

  // 清理过期数据
  cleanupExpiredData(data) {
    const now = Date.now()
    const expireDays = 90 // 保留90天的数据
    const expireTime = expireDays * 24 * 60 * 60 * 1000

    // 清理过期的练习记录
    if (data.practiceRecords) {
      data.practiceRecords = data.practiceRecords.filter(
        record => now - record.timestamp < expireTime
      )
    }

    // 清理过期的游戏分数
    if (data.gameScores) {
      data.gameScores = data.gameScores.filter(
        score => now - new Date(score.timestamp).getTime() < expireTime
      )
    }
  }

  // 导出所有数据
  exportData(format = 'json') {
    const data = this.getAllData()
    const exportData = {
      ...data,
      exportDate: new Date().toISOString(),
      appVersion: this.version
    }

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2)
    } else if (format === 'csv') {
      return this.convertToCSV(exportData)
    }

    return exportData
  }

  // 转换为CSV格式
  convertToCSV(data) {
    if (!data.practiceRecords) return ''

    const headers = ['timestamp', 'speed', 'accuracy', 'time', 'charCount', 'lessonId']
    const rows = data.practiceRecords.map(record => [
      record.timestamp,
      record.speed,
      record.accuracy,
      record.time,
      record.charCount,
      record.lessonId || ''
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // 获取数据统计
  getDataStats() {
    const data = this.getAllData()

    return {
      practiceRecords: data.practiceRecords ? data.practiceRecords.length : 0,
      gameScores: data.gameScores ? data.gameScores.length : 0,
      achievements: data.achievements ? Object.keys(data.achievements).length : 0,
      customThemes: data.themes ? Object.values(data.themes).filter(t => t.isCustom).length : 0,
      totalSize: this.formatBytes(new Blob([JSON.stringify(data)]).size),
      lastSaved: data.lastSaved ? new Date(data.lastSaved).toLocaleString() : '未知'
    }
  }
}

// 创建存储管理器实例
export const storageManager = new StorageManager()

// 练习记录管理
export class PracticeRecordManager {
  constructor() {
    this.storageKey = 'practiceRecords'
  }

  // 获取所有练习记录
  getRecords() {
    return storageManager.getData(this.storageKey, [])
  }

  // 添加练习记录
  addRecord(record) {
    const records = this.getRecords()
    const newRecord = {
      id: Date.now(),
      timestamp: Date.now(),
      ...record
    }
    records.push(newRecord)
    return storageManager.setData(this.storageKey, records)
  }

  // 删除练习记录
  deleteRecord(id) {
    const records = this.getRecords()
    const filteredRecords = records.filter(record => record.id !== id)
    return storageManager.setData(this.storageKey, filteredRecords)
  }

  // 更新练习记录
  updateRecord(id, updates) {
    const records = this.getRecords()
    const index = records.findIndex(record => record.id === id)
    if (index !== -1) {
      records[index] = { ...records[index], ...updates }
      return storageManager.setData(this.storageKey, records)
    }
    return false
  }

  // 批量删除记录
  batchDelete(ids) {
    const records = this.getRecords()
    const filteredRecords = records.filter(record => !ids.includes(record.id))
    return storageManager.setData(this.storageKey, filteredRecords)
  }

  // 清空所有记录
  clearRecords() {
    return storageManager.setData(this.storageKey, [])
  }

  // 获取统计信息
  getStats() {
    const records = this.getRecords()
    if (records.length === 0) {
      return {
        total: 0,
        avgSpeed: 0,
        avgAccuracy: 0,
        totalTime: 0,
        bestSpeed: 0,
        bestAccuracy: 0
      }
    }

    const totalSpeed = records.reduce((sum, record) => sum + record.speed, 0)
    const totalAccuracy = records.reduce((sum, record) => sum + record.accuracy, 0)
    const totalTime = records.reduce((sum, record) => sum + record.time, 0)
    const bestSpeed = Math.max(...records.map(record => record.speed))
    const bestAccuracy = Math.max(...records.map(record => record.accuracy))

    return {
      total: records.length,
      avgSpeed: Math.round(totalSpeed / records.length),
      avgAccuracy: Math.round(totalAccuracy / records.length),
      totalTime,
      bestSpeed,
      bestAccuracy
    }
  }
}

// 创建练习记录管理器实例
export const practiceRecordManager = new PracticeRecordManager()

// 设置管理
export class SettingsManager {
  constructor() {
    this.storageKey = 'settings'
    this.defaultSettings = {
      soundEnabled: true,
      showPinyin: true,
      showHint: true,
      difficulty: 'normal',
      autoSave: true,
      theme: 'default',
      language: 'zh-CN'
    }
  }

  // 获取设置
  getSettings() {
    return {
      ...this.defaultSettings,
      ...storageManager.getData(this.storageKey, {})
    }
  }

  // 更新设置
  updateSettings(newSettings) {
    const currentSettings = this.getSettings()
    const updatedSettings = { ...currentSettings, ...newSettings }
    return storageManager.setData(this.storageKey, updatedSettings)
  }

  // 重置设置
  resetSettings() {
    return storageManager.setData(this.storageKey, this.defaultSettings)
  }

  // 获取单个设置
  getSetting(key) {
    const settings = this.getSettings()
    return settings[key]
  }

  // 设置单个配置
  setSetting(key, value) {
    const settings = this.getSettings()
    settings[key] = value
    return storageManager.setData(this.storageKey, settings)
  }
}

// 创建设置管理器实例
export const settingsManager = new SettingsManager()
