<template>
  <div class="stats-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">学习统计</h1>
          <p class="text-gray-600">查看您的学习进度和统计数据</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- 统计卡片 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="text-3xl mr-4">⏱️</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ formatTime(totalTime) }}</div>
                <div class="text-sm text-gray-600">总练习时长</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="text-3xl mr-4">⚡</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ averageSpeed }}</div>
                <div class="text-sm text-gray-600">平均速度 (字/分)</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="text-3xl mr-4">🎯</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ averageAccuracy }}%</div>
                <div class="text-sm text-gray-600">平均准确率</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center">
              <div class="text-3xl mr-4">📚</div>
              <div>
                <div class="text-2xl font-bold text-gray-900">{{ completedLessons }}</div>
                <div class="text-sm text-gray-600">完成课程</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">📊</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">详细统计功能开发中</h2>
            <p class="text-gray-600 mb-6">我们正在为您准备更详细的数据分析</p>
            
            <div class="space-y-4">
              <div class="p-4 bg-green-50 rounded-lg">
                <h3 class="font-medium text-green-900">即将推出的功能：</h3>
                <ul class="mt-2 text-sm text-green-700 space-y-1">
                  <li>• 学习进度图表</li>
                  <li>• 速度和准确率趋势</li>
                  <li>• 错误分析报告</li>
                  <li>• 学习时间分布</li>
                  <li>• 成绩对比分析</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePracticeStore } from '@/stores/practice'

const practiceStore = usePracticeStore()

// 计算属性
const totalTime = computed(() => {
  return practiceStore.overallStats.totalTime || 0
})

const averageSpeed = computed(() => {
  return practiceStore.overallStats.averageSpeed || 0
})

const averageAccuracy = computed(() => {
  return practiceStore.overallStats.averageAccuracy || 0
})

const completedLessons = computed(() => {
  return practiceStore.state.completedLessons.length || 0
})

// 方法
const formatTime = (milliseconds) => {
  if (!milliseconds) return '0分钟'
  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`
  }
  return `${minutes}分钟`
}

onMounted(async () => {
  // 初始化统计数据
  await practiceStore.init()
})
</script>

<style scoped>
.stats-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto;
}

/* 暗色主题 */
[data-theme='dark'] .stats-view {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .bg-white {
  @apply bg-gray-800;
}

[data-theme='dark'] h1 {
  @apply text-gray-100;
}

[data-theme='dark'] h2 {
  @apply text-gray-100;
}

[data-theme='dark'] p {
  @apply text-gray-300;
}

[data-theme='dark'] .text-gray-900 {
  @apply text-gray-100;
}

[data-theme='dark'] .text-gray-600 {
  @apply text-gray-300;
}
</style>