import { ACHIEVEMENT_TYPES, checkAchievement } from '../data/achievements'

// 获取用户成就记录
export function getUserAchievements() {
  const achievements = localStorage.getItem('achievements')
  return achievements
    ? JSON.parse(achievements)
    : {
        unlockedAchievements: new Set(),
        points: 0,
        stats: {
          practiceTime: 0,
          charCount: 0,
          maxSpeed: 0,
          maxAccuracy: 0,
          completedLessons: 0,
          streak: 0,
          reviewCount: 0
        }
      }
}

// 保存用户成就记录
export function saveUserAchievements(achievements) {
  localStorage.setItem(
    'achievements',
    JSON.stringify({
      ...achievements,
      unlockedAchievements: Array.from(achievements.unlockedAchievements)
    })
  )
}

// 更新用户统计数据
export function updateUserStats(stats) {
  const achievements = getUserAchievements()
  const newAchievements = {
    ...achievements,
    stats: {
      ...achievements.stats,
      ...stats
    }
  }

  // 检查是否有新的成就
  const newUnlocked = checkNewAchievements(newAchievements.stats)
  if (newUnlocked.length > 0) {
    // 更新已解锁成就和积分
    newAchievements.unlockedAchievements = new Set([
      ...Array.from(achievements.unlockedAchievements),
      ...newUnlocked.map(a => a.id)
    ])
    newAchievements.points += newUnlocked.reduce((sum, a) => sum + a.reward.points, 0)

    // 显示成就通知
    showAchievementNotifications(newUnlocked)
  }

  saveUserAchievements(newAchievements)
  return newUnlocked
}

// 检查新解锁的成就
function checkNewAchievements(stats) {
  const achievements = getUserAchievements()
  const unlockedIds = achievements.unlockedAchievements

  const newAchievements = []

  // 检查练习时长成就
  checkAchievement(ACHIEVEMENT_TYPES.PRACTICE_TIME, stats.practiceTime)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查练习字数成就
  checkAchievement(ACHIEVEMENT_TYPES.CHAR_COUNT, stats.charCount)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查速度成就
  checkAchievement(ACHIEVEMENT_TYPES.SPEED, stats.maxSpeed)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查正确率成就
  checkAchievement(ACHIEVEMENT_TYPES.ACCURACY, stats.maxAccuracy)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查课程完成成就
  checkAchievement(ACHIEVEMENT_TYPES.LESSON_COMPLETE, stats.completedLessons)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查连续打卡成就
  checkAchievement(ACHIEVEMENT_TYPES.STREAK, stats.streak)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  // 检查复习成就
  checkAchievement(ACHIEVEMENT_TYPES.REVIEW, stats.reviewCount)
    .filter(a => !unlockedIds.has(a.id))
    .forEach(a => newAchievements.push(a))

  return newAchievements
}

// 显示成就通知
function showAchievementNotifications(achievements) {
  achievements.forEach(achievement => {
    // 创建通知元素
    const notification = document.createElement('div')
    notification.className = 'achievement-notification'
    notification.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-content">
        <h3>${achievement.title}</h3>
        <p>${achievement.description}</p>
        <p class="achievement-reward">
          +${achievement.reward.points} 积分
          获得徽章：${achievement.reward.badge}
        </p>
      </div>
    `

    // 添加到页面
    document.body.appendChild(notification)

    // 添加动画类
    setTimeout(() => {
      notification.classList.add('show')
    }, 100)

    // 3秒后移除
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  })
}

// 更新连续打卡记录
export function updateStreak() {
  const achievements = getUserAchievements()
  const lastPractice = localStorage.getItem('lastPractice')
  const today = new Date().toDateString()

  if (lastPractice === today) {
    return achievements.stats.streak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toDateString()

  let newStreak
  if (lastPractice === yesterdayString) {
    // 连续打卡
    newStreak = achievements.stats.streak + 1
  } else {
    // 打卡中断
    newStreak = 1
  }

  // 更新记录
  localStorage.setItem('lastPractice', today)
  updateUserStats({ streak: newStreak })

  return newStreak
}

// 获取用户等级
export function getUserLevel(points) {
  const levels = [
    { level: 1, points: 0 },
    { level: 2, points: 500 },
    { level: 3, points: 1000 },
    { level: 4, points: 2000 },
    { level: 5, points: 3500 },
    { level: 6, points: 5000 },
    { level: 7, points: 7000 },
    { level: 8, points: 9000 },
    { level: 9, points: 11000 },
    { level: 10, points: 13000 }
  ]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].points) {
      return levels[i].level
    }
  }
  return 1
}

// 获取下一个等级所需积分
export function getNextLevelPoints(points) {
  const levels = [
    { level: 1, points: 0 },
    { level: 2, points: 500 },
    { level: 3, points: 1000 },
    { level: 4, points: 2000 },
    { level: 5, points: 3500 },
    { level: 6, points: 5000 },
    { level: 7, points: 7000 },
    { level: 8, points: 9000 },
    { level: 9, points: 11000 },
    { level: 10, points: 13000 }
  ]

  for (let i = 0; i < levels.length; i++) {
    if (points < levels[i].points) {
      return levels[i].points
    }
  }
  return levels[levels.length - 1].points
}
