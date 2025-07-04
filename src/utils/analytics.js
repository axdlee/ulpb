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