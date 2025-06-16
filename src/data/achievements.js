// 成就类型
export const ACHIEVEMENT_TYPES = {
  PRACTICE_TIME: 'practice_time',    // 练习时长
  CHAR_COUNT: 'char_count',          // 练习字数
  SPEED: 'speed',                    // 打字速度
  ACCURACY: 'accuracy',              // 正确率
  LESSON_COMPLETE: 'lesson_complete',// 完成课程数
  STREAK: 'streak',                  // 连续打卡
  REVIEW: 'review'                   // 复习完成
}

// 成就列表
export const achievements = [
  // 练习时长成就
  {
    id: 'practice_time_1',
    type: ACHIEVEMENT_TYPES.PRACTICE_TIME,
    title: '初学乍练',
    description: '累计练习时长达到1小时',
    icon: '⏱️',
    requirement: 3600, // 秒
    reward: {
      points: 100,
      badge: '时间管理者 I'
    }
  },
  {
    id: 'practice_time_2',
    type: ACHIEVEMENT_TYPES.PRACTICE_TIME,
    title: '勤学苦练',
    description: '累计练习时长达到5小时',
    icon: '⏱️',
    requirement: 18000,
    reward: {
      points: 300,
      badge: '时间管理者 II'
    }
  },
  {
    id: 'practice_time_3',
    type: ACHIEVEMENT_TYPES.PRACTICE_TIME,
    title: '持之以恒',
    description: '累计练习时长达到10小时',
    icon: '⏱️',
    requirement: 36000,
    reward: {
      points: 500,
      badge: '时间管理者 III'
    }
  },

  // 练习字数成就
  {
    id: 'char_count_1',
    type: ACHIEVEMENT_TYPES.CHAR_COUNT,
    title: '初窥门径',
    description: '累计练习1000个汉字',
    icon: '📝',
    requirement: 1000,
    reward: {
      points: 100,
      badge: '文字大师 I'
    }
  },
  {
    id: 'char_count_2',
    type: ACHIEVEMENT_TYPES.CHAR_COUNT,
    title: '渐入佳境',
    description: '累计练习5000个汉字',
    icon: '📝',
    requirement: 5000,
    reward: {
      points: 300,
      badge: '文字大师 II'
    }
  },
  {
    id: 'char_count_3',
    type: ACHIEVEMENT_TYPES.CHAR_COUNT,
    title: '炉火纯青',
    description: '累计练习10000个汉字',
    icon: '📝',
    requirement: 10000,
    reward: {
      points: 500,
      badge: '文字大师 III'
    }
  },

  // 打字速度成就
  {
    id: 'speed_1',
    type: ACHIEVEMENT_TYPES.SPEED,
    title: '初露锋芒',
    description: '达到30字/分钟的速度',
    icon: '🚀',
    requirement: 30,
    reward: {
      points: 100,
      badge: '速度之星 I'
    }
  },
  {
    id: 'speed_2',
    type: ACHIEVEMENT_TYPES.SPEED,
    title: '快速如风',
    description: '达到60字/分钟的速度',
    icon: '🚀',
    requirement: 60,
    reward: {
      points: 300,
      badge: '速度之星 II'
    }
  },
  {
    id: 'speed_3',
    type: ACHIEVEMENT_TYPES.SPEED,
    title: '神速如电',
    description: '达到100字/分钟的速度',
    icon: '🚀',
    requirement: 100,
    reward: {
      points: 500,
      badge: '速度之星 III'
    }
  },

  // 正确率成就
  {
    id: 'accuracy_1',
    type: ACHIEVEMENT_TYPES.ACCURACY,
    title: '稳扎稳打',
    description: '达到95%的正确率',
    icon: '🎯',
    requirement: 95,
    reward: {
      points: 100,
      badge: '精准大师 I'
    }
  },
  {
    id: 'accuracy_2',
    type: ACHIEVEMENT_TYPES.ACCURACY,
    title: '精益求精',
    description: '达到98%的正确率',
    icon: '🎯',
    requirement: 98,
    reward: {
      points: 300,
      badge: '精准大师 II'
    }
  },
  {
    id: 'accuracy_3',
    type: ACHIEVEMENT_TYPES.ACCURACY,
    title: '完美无缺',
    description: '达到100%的正确率',
    icon: '🎯',
    requirement: 100,
    reward: {
      points: 500,
      badge: '精准大师 III'
    }
  },

  // 课程完成成就
  {
    id: 'lesson_complete_1',
    type: ACHIEVEMENT_TYPES.LESSON_COMPLETE,
    title: '初窥门径',
    description: '完成5节课程',
    icon: '📚',
    requirement: 5,
    reward: {
      points: 100,
      badge: '学习达人 I'
    }
  },
  {
    id: 'lesson_complete_2',
    type: ACHIEVEMENT_TYPES.LESSON_COMPLETE,
    title: '循序渐进',
    description: '完成10节课程',
    icon: '📚',
    requirement: 10,
    reward: {
      points: 300,
      badge: '学习达人 II'
    }
  },
  {
    id: 'lesson_complete_3',
    type: ACHIEVEMENT_TYPES.LESSON_COMPLETE,
    title: '学贯中西',
    description: '完成所有课程',
    icon: '📚',
    requirement: 15,
    reward: {
      points: 500,
      badge: '学习达人 III'
    }
  },

  // 连续打卡成就
  {
    id: 'streak_1',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: '坚持不懈',
    description: '连续练习3天',
    icon: '🔥',
    requirement: 3,
    reward: {
      points: 100,
      badge: '坚持达人 I'
    }
  },
  {
    id: 'streak_2',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: '持之以恒',
    description: '连续练习7天',
    icon: '🔥',
    requirement: 7,
    reward: {
      points: 300,
      badge: '坚持达人 II'
    }
  },
  {
    id: 'streak_3',
    type: ACHIEVEMENT_TYPES.STREAK,
    title: '永不言弃',
    description: '连续练习30天',
    icon: '🔥',
    requirement: 30,
    reward: {
      points: 500,
      badge: '坚持达人 III'
    }
  },

  // 复习成就
  {
    id: 'review_1',
    type: ACHIEVEMENT_TYPES.REVIEW,
    title: '温故知新',
    description: '完成5次复习',
    icon: '📖',
    requirement: 5,
    reward: {
      points: 100,
      badge: '复习达人 I'
    }
  },
  {
    id: 'review_2',
    type: ACHIEVEMENT_TYPES.REVIEW,
    title: '融会贯通',
    description: '完成15次复习',
    icon: '📖',
    requirement: 15,
    reward: {
      points: 300,
      badge: '复习达人 II'
    }
  },
  {
    id: 'review_3',
    type: ACHIEVEMENT_TYPES.REVIEW,
    title: '学而不厌',
    description: '完成30次复习',
    icon: '📖',
    requirement: 30,
    reward: {
      points: 500,
      badge: '复习达人 III'
    }
  }
]

// 获取某个类型的所有成就
export function getAchievementsByType(type) {
  return achievements.filter(achievement => achievement.type === type)
}

// 获取某个成就
export function getAchievementById(id) {
  return achievements.find(achievement => achievement.id === id)
}

// 检查是否达成成就
export function checkAchievement(type, value) {
  return achievements
    .filter(achievement => achievement.type === type)
    .filter(achievement => value >= achievement.requirement)
} 