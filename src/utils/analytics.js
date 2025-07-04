// 获取练习记录
export function getPracticeRecords() {
  const records = localStorage.getItem('practiceRecords')
  return records ? JSON.parse(records) : []
}

// 保存练习记录
export function savePracticeRecord(record) {
  const records = getPracticeRecords()
  records.push({
    ...record,
    timestamp: Date.now()
  })
  localStorage.setItem('practiceRecords', JSON.stringify(records))
}

// 计算速度趋势
export function calculateSpeedTrend(days = 7) {
  const records = getPracticeRecords()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  // 按天分组数据
  const dailyData = {}
  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * dayMs).toDateString()
    dailyData[date] = []
  }
  
  // 收集数据
  records.forEach(record => {
    const date = new Date(record.timestamp).toDateString()
    if (dailyData[date]) {
      dailyData[date].push(record.speed)
    }
  })
  
  // 计算每天的平均速度
  return Object.entries(dailyData).map(([date, speeds]) => ({
    date,
    speed: speeds.length > 0 
      ? Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length)
      : 0
  })).reverse()
}

// 计算正确率趋势
export function calculateAccuracyTrend(days = 7) {
  const records = getPracticeRecords()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  // 按天分组数据
  const dailyData = {}
  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * dayMs).toDateString()
    dailyData[date] = []
  }
  
  // 收集数据
  records.forEach(record => {
    const date = new Date(record.timestamp).toDateString()
    if (dailyData[date]) {
      dailyData[date].push(record.accuracy)
    }
  })
  
  // 计算每天的平均正确率
  return Object.entries(dailyData).map(([date, accuracies]) => ({
    date,
    accuracy: accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : 0
  })).reverse()
}

// 计算练习时长趋势
export function calculatePracticeTimeTrend(days = 7) {
  const records = getPracticeRecords()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  // 按天分组数据
  const dailyData = {}
  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * dayMs).toDateString()
    dailyData[date] = 0
  }
  
  // 收集数据
  records.forEach(record => {
    const date = new Date(record.timestamp).toDateString()
    if (dailyData[date] !== undefined) {
      dailyData[date] += record.time
    }
  })
  
  // 转换为分钟
  return Object.entries(dailyData).map(([date, seconds]) => ({
    date,
    minutes: Math.round(seconds / 60)
  })).reverse()
}

// 计算错误分析
export function calculateErrorAnalysis() {
  const records = getPracticeRecords()
  const errorStats = {}
  
  // 收集错误数据
  records.forEach(record => {
    if (record.errors) {
      record.errors.forEach(error => {
        const key = `${error.char}(${error.shengmu}${error.yunmu})`
        if (!errorStats[key]) {
          errorStats[key] = {
            char: error.char,
            shengmu: error.shengmu,
            yunmu: error.yunmu,
            count: 0
          }
        }
        errorStats[key].count++
      })
    }
  })
  
  // 转换为数组并排序
  return Object.values(errorStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // 只返回前10个最常见错误
}

// 生成学习报告
export function generateLearningReport() {
  const records = getPracticeRecords()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  // 计算总体统计
  const totalStats = records.reduce((stats, record) => ({
    totalTime: stats.totalTime + record.time,
    totalChars: stats.totalChars + record.charCount,
    practices: stats.practices + 1,
    avgSpeed: stats.avgSpeed + record.speed,
    avgAccuracy: stats.avgAccuracy + record.accuracy
  }), {
    totalTime: 0,
    totalChars: 0,
    practices: 0,
    avgSpeed: 0,
    avgAccuracy: 0
  })
  
  // 计算平均值
  if (totalStats.practices > 0) {
    totalStats.avgSpeed = Math.round(totalStats.avgSpeed / totalStats.practices)
    totalStats.avgAccuracy = Math.round(totalStats.avgAccuracy / totalStats.practices)
  }
  
  // 计算最近7天的进步
  const recentRecords = records.filter(r => now - r.timestamp < 7 * dayMs)
  const recentStats = recentRecords.reduce((stats, record) => ({
    avgSpeed: stats.avgSpeed + record.speed,
    avgAccuracy: stats.avgAccuracy + record.accuracy,
    practices: stats.practices + 1
  }), {
    avgSpeed: 0,
    avgAccuracy: 0,
    practices: 0
  })
  
  if (recentStats.practices > 0) {
    recentStats.avgSpeed = Math.round(recentStats.avgSpeed / recentStats.practices)
    recentStats.avgAccuracy = Math.round(recentStats.avgAccuracy / recentStats.practices)
  }
  
  // 生成学习建议
  const suggestions = []
  
  // 练习频率建议
  if (recentStats.practices < 7) {
    suggestions.push({
      type: 'frequency',
      title: '保持练习频率',
      description: '建议每天进行练习，保持学习热度'
    })
  }
  
  // 速度提升建议
  if (recentStats.avgSpeed < 30) {
    suggestions.push({
      type: 'speed',
      title: '提高打字速度',
      description: '可以尝试速度挑战模式，循序渐进地提升打字速度'
    })
  }
  
  // 正确率提升建议
  if (recentStats.avgAccuracy < 95) {
    suggestions.push({
      type: 'accuracy',
      title: '提高正确率',
      description: '建议放慢速度，注意正确的指法和键位'
    })
  }
  
  return {
    totalStats,
    recentStats,
    suggestions
  }
}

// 导出练习数据
export function exportPracticeData(format = 'json') {
  const records = getPracticeRecords()
  const data = {
    exportDate: new Date().toISOString(),
    totalRecords: records.length,
    records
  }
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2)
  } else if (format === 'csv') {
    const csvHeaders = ['timestamp', 'speed', 'accuracy', 'time', 'charCount', 'lessonId']
    const rows = records.map(record => [
      record.timestamp,
      record.speed,
      record.accuracy,
      record.time,
      record.charCount,
      record.lessonId || ''
    ])
    return [csvHeaders, ...rows].map(row => row.join(',')).join('\n')
  }
  
  return data
}

// 导入练习数据
export function importPracticeData(data, format = 'json') {
  try {
    let records = []
    
    if (format === 'json') {
      const parsed = JSON.parse(data)
      records = parsed.records || []
    } else if (format === 'csv') {
      const lines = data.split('\n')
      records = lines.slice(1).map(line => {
        const values = line.split(',')
        return {
          timestamp: parseInt(values[0]),
          speed: parseFloat(values[1]),
          accuracy: parseFloat(values[2]),
          time: parseInt(values[3]),
          charCount: parseInt(values[4]),
          lessonId: values[5] || null
        }
      }).filter(record => record.timestamp)
    }
    
    const existingRecords = getPracticeRecords()
    const mergedRecords = [...existingRecords, ...records]
    localStorage.setItem('practiceRecords', JSON.stringify(mergedRecords))
    return { success: true, imported: records.length }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 计算学习效率
export function calculateLearningEfficiency(days = 30) {
  const records = getPracticeRecords()
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  
  // 最近N天的数据
  const recentRecords = records.filter(r => now - r.timestamp < days * dayMs)
  
  if (recentRecords.length === 0) return { efficiency: 0, trend: 'stable' }
  
  // 按周分组
  const weeklyData = {}
  recentRecords.forEach(record => {
    const weekKey = Math.floor((now - record.timestamp) / (7 * dayMs))
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { speed: [], accuracy: [], time: 0 }
    }
    weeklyData[weekKey].speed.push(record.speed)
    weeklyData[weekKey].accuracy.push(record.accuracy)
    weeklyData[weekKey].time += record.time
  })
  
  // 计算每周平均值
  const weeklyAverages = Object.values(weeklyData).map(week => ({
    avgSpeed: week.speed.reduce((a, b) => a + b, 0) / week.speed.length,
    avgAccuracy: week.accuracy.reduce((a, b) => a + b, 0) / week.accuracy.length,
    totalTime: week.time
  }))
  
  // 计算学习效率 (速度 * 正确率 / 时间)
  const efficiency = weeklyAverages.map(week => 
    (week.avgSpeed * week.avgAccuracy / 100) / (week.totalTime / 3600)
  )
  
  // 分析趋势
  let trend = 'stable'
  if (efficiency.length > 1) {
    const recent = efficiency.slice(-2)
    const change = recent[1] - recent[0]
    trend = change > 0.1 ? 'improving' : change < -0.1 ? 'declining' : 'stable'
  }
  
  return {
    efficiency: efficiency.length > 0 ? efficiency[efficiency.length - 1] : 0,
    trend,
    weeklyData: weeklyAverages
  }
}

// 生成学习目标建议
export function generateLearningGoals() {
  const records = getPracticeRecords()
  const report = generateLearningReport()
  
  if (records.length === 0) {
    return {
      speed: { current: 0, target: 20, timeframe: '2周' },
      accuracy: { current: 0, target: 90, timeframe: '1周' },
      practice: { current: 0, target: 7, timeframe: '1周' }
    }
  }
  
  const { totalStats, recentStats } = report
  
  // 速度目标
  const speedGoal = {
    current: recentStats.avgSpeed || totalStats.avgSpeed,
    target: Math.max((recentStats.avgSpeed || totalStats.avgSpeed) + 5, 30),
    timeframe: '2周'
  }
  
  // 正确率目标
  const accuracyGoal = {
    current: recentStats.avgAccuracy || totalStats.avgAccuracy,
    target: Math.min((recentStats.avgAccuracy || totalStats.avgAccuracy) + 2, 98),
    timeframe: '1周'
  }
  
  // 练习频率目标
  const practiceGoal = {
    current: recentStats.practices,
    target: Math.max(recentStats.practices + 1, 7),
    timeframe: '1周'
  }
  
  return {
    speed: speedGoal,
    accuracy: accuracyGoal,
    practice: practiceGoal
  }
}

// 计算成就进度
export function calculateAchievementProgress() {
  const records = getPracticeRecords()
  const achievements = {
    speedMaster: {
      name: '速度之王',
      description: '达到50字/分钟',
      progress: Math.min((Math.max(...records.map(r => r.speed)) || 0) / 50 * 100, 100)
    },
    accuracyExpert: {
      name: '精准射手',
      description: '正确率达到98%',
      progress: Math.min((Math.max(...records.map(r => r.accuracy)) || 0) / 98 * 100, 100)
    },
    practiceStreak: {
      name: '坚持不懈',
      description: '连续练习30天',
      progress: Math.min(calculateLearningStreak() / 30 * 100, 100)
    },
    totalPractice: {
      name: '练习达人',
      description: '累计练习100次',
      progress: Math.min(records.length / 100 * 100, 100)
    }
  }
  
  return achievements
}

// 计算连续练习天数
export function calculateLearningStreak() {
  const records = getPracticeRecords()
  if (records.length === 0) return 0
  
  const today = new Date().toDateString()
  const practiceDate = new Date(records[records.length - 1].timestamp).toDateString()
  
  if (practiceDate !== today) {
    const diffDays = Math.floor((Date.now() - records[records.length - 1].timestamp) / (1000 * 60 * 60 * 24))
    if (diffDays > 1) return 0
  }
  
  let streak = 1
  const dayMs = 24 * 60 * 60 * 1000
  
  for (let i = records.length - 2; i >= 0; i--) {
    const currentDate = new Date(records[i + 1].timestamp).toDateString()
    const prevDate = new Date(records[i].timestamp).toDateString()
    
    const diffDays = Math.floor((records[i + 1].timestamp - records[i].timestamp) / dayMs)
    
    if (diffDays <= 1) {
      if (currentDate !== prevDate) streak++
    } else {
      break
    }
  }
  
  return streak
}

// 计算学习进度
export function calculateLearningProgress() {
  const records = getPracticeRecords()
  const lessons = new Set()
  let totalChars = 0
  let totalTime = 0
  
  records.forEach(record => {
    if (record.lessonId) {
      lessons.add(record.lessonId)
    }
    totalChars += record.charCount
    totalTime += record.time
  })
  
  return {
    completedLessons: lessons.size,
    totalChars,
    totalTime,
    estimatedProgress: Math.min(Math.round((lessons.size / 15) * 100), 100)
  }
} 