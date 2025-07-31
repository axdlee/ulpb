// 错误记录结构
// {
//   char: '字',
//   shengmu: 'b',
//   yunmu: 'a',
//   errorCount: 2,
//   lastError: timestamp,
//   reviewCount: 1,
//   lastReview: timestamp
// }

// 计算需要复习的内容
export function calculateReviewItems(errorRecords, practiceRecords) {
  const now = Date.now()
  const reviewItems = []

  // 遍历错误记录
  for (const record of errorRecords) {
    const { char, errorCount, lastError, reviewCount, lastReview } = record

    // 计算复习优先级
    const priority = calculatePriority(errorCount, lastError, reviewCount, lastReview)

    // 如果优先级高于阈值，加入复习列表
    if (priority > 0.6) {
      reviewItems.push({
        ...record,
        priority
      })
    }
  }

  // 按优先级排序
  return reviewItems.sort((a, b) => b.priority - a.priority)
}

// 计算复习优先级
function calculatePriority(errorCount, lastError, reviewCount, lastReview) {
  const now = Date.now()

  // 错误次数权重
  const errorWeight = Math.min(errorCount / 5, 1) * 0.4

  // 上次错误时间权重（越近权重越高）
  const lastErrorDays = (now - lastError) / (1000 * 60 * 60 * 24)
  const errorTimeWeight = Math.max(1 - lastErrorDays / 7, 0) * 0.3

  // 复习次数权重（复习次数越少权重越高）
  const reviewWeight = Math.max(1 - reviewCount / 5, 0) * 0.2

  // 上次复习时间权重（越久没复习权重越高）
  const lastReviewDays = (now - lastReview) / (1000 * 60 * 60 * 24)
  const reviewTimeWeight = Math.min(lastReviewDays / 7, 1) * 0.1

  return errorWeight + errorTimeWeight + reviewWeight + reviewTimeWeight
}

// 生成复习计划
export function generateReviewPlan(reviewItems) {
  // 按照不同类型分组
  const groups = {
    shengmu: new Set(),
    yunmu: new Set(),
    chars: new Set()
  }

  // 遍历需要复习的项目
  for (const item of reviewItems) {
    const { char, shengmu, yunmu } = item

    // 收集声母
    if (shengmu) {
      groups.shengmu.add(shengmu)
    }

    // 收集韵母
    if (yunmu) {
      groups.yunmu.add(yunmu)
    }

    // 收集汉字
    groups.chars.add(char)
  }

  // 生成复习建议
  return {
    // 需要重点复习的声母
    shengmu: Array.from(groups.shengmu),
    // 需要重点复习的韵母
    yunmu: Array.from(groups.yunmu),
    // 需要重点复习的汉字
    chars: Array.from(groups.chars),
    // 建议复习的课程
    suggestedLessons: generateSuggestedLessons(groups),
    // 复习项目列表
    items: reviewItems
  }
}

// 生成建议复习的课程
function generateSuggestedLessons(groups) {
  const lessons = []

  // 如果有需要复习的声母，添加对应的声母课程
  if (groups.shengmu.size > 0) {
    lessons.push({
      type: 'initial',
      title: '声母复习',
      initials: Array.from(groups.shengmu),
      description: `重点复习以下声母：${Array.from(groups.shengmu).join('、')}`
    })
  }

  // 如果有需要复习的韵母，添加对应的韵母课程
  if (groups.yunmu.size > 0) {
    lessons.push({
      type: 'final',
      title: '韵母复习',
      finals: Array.from(groups.yunmu),
      description: `重点复习以下韵母：${Array.from(groups.yunmu).join('、')}`
    })
  }

  // 如果有需要复习的汉字，添加汉字练习课程
  if (groups.chars.size > 0) {
    lessons.push({
      type: 'char',
      title: '重点汉字练习',
      chars: Array.from(groups.chars),
      description: `重点练习以下汉字：${Array.from(groups.chars).join('、')}`
    })
  }

  return lessons
}

// 更新错误记录
export function updateErrorRecord(char, shengmu, yunmu, isError) {
  const now = Date.now()
  const key = `error_${char}`

  // 获取现有记录
  let record = JSON.parse(localStorage.getItem(key) || 'null')

  if (isError) {
    // 如果是错误，更新错误记录
    if (record) {
      record.errorCount++
      record.lastError = now
    } else {
      record = {
        char,
        shengmu,
        yunmu,
        errorCount: 1,
        lastError: now,
        reviewCount: 0,
        lastReview: 0
      }
    }
  } else {
    // 如果是复习正确，更新复习记录
    if (record) {
      record.reviewCount++
      record.lastReview = now
    }
  }

  // 保存记录
  if (record) {
    localStorage.setItem(key, JSON.stringify(record))
  }
}

// 获取所有错误记录
export function getAllErrorRecords() {
  const records = []

  // 遍历 localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('error_')) {
      const record = JSON.parse(localStorage.getItem(key))
      if (record) {
        records.push(record)
      }
    }
  }

  return records
}

// 清除错误记录
export function clearErrorRecords() {
  // 遍历 localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('error_')) {
      localStorage.removeItem(key)
    }
  }
}
