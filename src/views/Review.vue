<!-- Review.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-medium text-gray-900">智能复习</h1>
        <p class="mt-2 text-gray-600">根据您的练习情况，我们为您生成了个性化的复习计划</p>
      </div>

      <!-- 复习建议 -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 声母复习 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">声母复习</h3>
          <div class="space-y-2">
            <template v-if="reviewPlan.shengmu.length > 0">
              <div
                v-for="shengmu in reviewPlan.shengmu"
                :key="shengmu"
                class="flex items-center justify-between p-2 bg-blue-50 rounded"
              >
                <span class="text-blue-900 font-medium">{{ shengmu }}</span>
                <span class="text-sm text-blue-600">
                  {{ getErrorCount(shengmu, 'shengmu') }} 次错误
                </span>
              </div>
            </template>
            <div v-else class="text-gray-500 text-sm">暂无需要复习的声母</div>
          </div>
        </div>

        <!-- 韵母复习 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">韵母复习</h3>
          <div class="space-y-2">
            <template v-if="reviewPlan.yunmu.length > 0">
              <div
                v-for="yunmu in reviewPlan.yunmu"
                :key="yunmu"
                class="flex items-center justify-between p-2 bg-green-50 rounded"
              >
                <span class="text-green-900 font-medium">{{ yunmu }}</span>
                <span class="text-sm text-green-600">
                  {{ getErrorCount(yunmu, 'yunmu') }} 次错误
                </span>
              </div>
            </template>
            <div v-else class="text-gray-500 text-sm">暂无需要复习的韵母</div>
          </div>
        </div>

        <!-- 汉字复习 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">汉字复习</h3>
          <div class="space-y-2">
            <template v-if="reviewPlan.chars.length > 0">
              <div
                v-for="char in reviewPlan.chars"
                :key="char"
                class="flex items-center justify-between p-2 bg-purple-50 rounded"
              >
                <span class="text-purple-900 font-medium">{{ char }}</span>
                <span class="text-sm text-purple-600">
                  {{ getErrorCount(char, 'char') }} 次错误
                </span>
              </div>
            </template>
            <div v-else class="text-gray-500 text-sm">暂无需要复习的汉字</div>
          </div>
        </div>
      </div>

      <!-- 建议课程 -->
      <div class="mb-8">
        <h2 class="text-xl font-medium text-gray-900 mb-6">建议复习课程</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="lesson in reviewPlan.suggestedLessons"
            :key="lesson.title"
            class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="startReviewLesson(lesson)"
          >
            <h4 class="text-base font-medium text-gray-900">{{ lesson.title }}</h4>
            <p class="mt-1 text-sm text-gray-500">{{ lesson.description }}</p>
          </div>
        </div>
      </div>

      <!-- 错误分析 -->
      <div>
        <h2 class="text-xl font-medium text-gray-900 mb-6">错误分析</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  汉字
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  声母
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  韵母
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  错误次数
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  最近错误
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  复习次数
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in reviewPlan.items" :key="item.char">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.char }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.shengmu }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.yunmu }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.errorCount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(item.lastError) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.reviewCount }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { calculateReviewItems, generateReviewPlan, getAllErrorRecords } from '../utils/review'

  const router = useRouter()
  const reviewPlan = ref({
    shengmu: [],
    yunmu: [],
    chars: [],
    suggestedLessons: [],
    items: []
  })

  // 获取错误次数
  const getErrorCount = (value, type) => {
    const items = reviewPlan.value.items
    if (type === 'shengmu') {
      return items
        .filter(item => item.shengmu === value)
        .reduce((sum, item) => sum + item.errorCount, 0)
    } else if (type === 'yunmu') {
      return items
        .filter(item => item.yunmu === value)
        .reduce((sum, item) => sum + item.errorCount, 0)
    } else {
      return items.find(item => item.char === value)?.errorCount || 0
    }
  }

  // 开始复习课程
  const startReviewLesson = lesson => {
    router.push({
      name: 'practice',
      params: {
        type: 'review',
        lesson: JSON.stringify(lesson)
      }
    })
  }

  // 格式化日期
  const formatDate = timestamp => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 1000 * 60 * 60) {
      // 一小时内
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟前`
    } else if (diff < 1000 * 60 * 60 * 24) {
      // 一天内
      const hours = Math.floor(diff / (1000 * 60 * 60))
      return `${hours}小时前`
    } else {
      // 超过一天
      return `${date.getMonth() + 1}月${date.getDate()}日`
    }
  }

  // 初始化
  onMounted(() => {
    const errorRecords = getAllErrorRecords()
    const reviewItems = calculateReviewItems(errorRecords)
    reviewPlan.value = generateReviewPlan(reviewItems)
  })
</script>
