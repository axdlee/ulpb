<!-- Achievements.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 用户等级和积分 -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-medium text-gray-900">等级 {{ userLevel }}</h2>
            <p class="mt-1 text-gray-500">
              {{ userAchievements.points }} / {{ nextLevelPoints }} 积分
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">连续打卡</p>
            <p class="text-xl font-medium text-blue-600">{{ userAchievements.stats.streak }} 天</p>
          </div>
        </div>

        <!-- 等级进度条 -->
        <div class="mt-4">
          <div class="h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-blue-600 rounded-full transition-all duration-500"
              :style="{ width: `${levelProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 成就分类 -->
      <div class="mb-8">
        <div class="flex space-x-4 overflow-x-auto pb-2">
          <button
            v-for="type in achievementTypes"
            :key="type.value"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="[
              currentType === type.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            ]"
            @click="currentType = type.value"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- 成就列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="bg-white rounded-lg shadow-sm p-4"
          :class="{
            'opacity-50': !isUnlocked(achievement.id)
          }"
        >
          <!-- 成就图标和标题 -->
          <div class="flex items-center space-x-3 mb-3">
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full text-xl"
              :class="[
                isUnlocked(achievement.id)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-400'
              ]"
            >
              {{ achievement.icon }}
            </div>
            <div>
              <h3 class="font-medium text-gray-900">{{ achievement.title }}</h3>
              <p class="text-sm text-gray-500">{{ achievement.description }}</p>
            </div>
          </div>

          <!-- 进度条 -->
          <div class="mt-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500">进度</span>
              <span class="text-gray-700">
                {{ getProgress(achievement) }} / {{ achievement.requirement }}
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="[isUnlocked(achievement.id) ? 'bg-blue-600' : 'bg-gray-300']"
                :style="{
                  width: `${Math.min(
                    (getProgress(achievement) / achievement.requirement) * 100,
                    100
                  )}%`
                }"
              ></div>
            </div>
          </div>

          <!-- 奖励信息 -->
          <div class="mt-3 pt-3 border-t border-gray-100">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">奖励</span>
              <div class="flex items-center space-x-2">
                <span class="text-yellow-600"> +{{ achievement.reward.points }} 积分 </span>
                <span class="text-purple-600">
                  {{ achievement.reward.badge }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { ACHIEVEMENT_TYPES, achievements, getAchievementsByType } from '../data/achievements'
  import { getUserAchievements, getUserLevel, getNextLevelPoints } from '../utils/achievement'

  // 用户成就数据
  const userAchievements = ref(getUserAchievements())

  // 用户等级
  const userLevel = computed(() => getUserLevel(userAchievements.value.points))

  // 下一级所需积分
  const nextLevelPoints = computed(() => getNextLevelPoints(userAchievements.value.points))

  // 等级进度
  const levelProgress = computed(() => {
    const currentPoints = userAchievements.value.points
    const nextLevel = nextLevelPoints.value
    const prevLevel = nextLevel - 500 // 每级间隔500积分
    return ((currentPoints - prevLevel) / (nextLevel - prevLevel)) * 100
  })

  // 成就类型
  const achievementTypes = [
    { value: 'all', label: '全部' },
    { value: ACHIEVEMENT_TYPES.PRACTICE_TIME, label: '练习时长' },
    { value: ACHIEVEMENT_TYPES.CHAR_COUNT, label: '练习字数' },
    { value: ACHIEVEMENT_TYPES.SPEED, label: '打字速度' },
    { value: ACHIEVEMENT_TYPES.ACCURACY, label: '正确率' },
    { value: ACHIEVEMENT_TYPES.LESSON_COMPLETE, label: '课程完成' },
    { value: ACHIEVEMENT_TYPES.STREAK, label: '连续打卡' },
    { value: ACHIEVEMENT_TYPES.REVIEW, label: '复习完成' }
  ]

  // 当前选中的类型
  const currentType = ref('all')

  // 过滤后的成就列表
  const filteredAchievements = computed(() => {
    if (currentType.value === 'all') {
      return achievements
    }
    return getAchievementsByType(currentType.value)
  })

  // 检查成就是否解锁
  const isUnlocked = id => {
    return userAchievements.value.unlockedAchievements.includes(id)
  }

  // 获取成就进度
  const getProgress = achievement => {
    const stats = userAchievements.value.stats
    switch (achievement.type) {
      case ACHIEVEMENT_TYPES.PRACTICE_TIME:
        return stats.practiceTime
      case ACHIEVEMENT_TYPES.CHAR_COUNT:
        return stats.charCount
      case ACHIEVEMENT_TYPES.SPEED:
        return stats.maxSpeed
      case ACHIEVEMENT_TYPES.ACCURACY:
        return stats.maxAccuracy
      case ACHIEVEMENT_TYPES.LESSON_COMPLETE:
        return stats.completedLessons
      case ACHIEVEMENT_TYPES.STREAK:
        return stats.streak
      case ACHIEVEMENT_TYPES.REVIEW:
        return stats.reviewCount
      default:
        return 0
    }
  }
</script>

<style>
  .achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    transform: translateX(120%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .achievement-notification.show {
    transform: translateX(0);
  }

  .achievement-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ebf5ff;
    border-radius: 8px;
    color: #2563eb;
  }

  .achievement-content h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #1f2937;
  }

  .achievement-content p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #6b7280;
  }

  .achievement-reward {
    margin-top: 8px;
    font-size: 12px;
    color: #2563eb;
  }
</style>
