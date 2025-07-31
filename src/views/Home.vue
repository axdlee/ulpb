<!-- Home.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部统计 -->
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h1 class="text-2xl font-medium text-gray-900">双拼学习</h1>
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <div class="text-sm text-blue-600">总练习时间</div>
            <div class="mt-2 text-2xl font-medium text-blue-900">
              {{ formatTime(practiceStats.totalTime) }}
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <div class="text-sm text-green-600">练习字数</div>
            <div class="mt-2 text-2xl font-medium text-green-900">
              {{ practiceStats.totalChars }}
            </div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <div class="text-sm text-purple-600">平均速度</div>
            <div class="mt-2 text-2xl font-medium text-purple-900">
              {{ practiceStats.speed }} 字/分
            </div>
          </div>
          <div class="bg-orange-50 rounded-lg p-4">
            <div class="text-sm text-orange-600">平均正确率</div>
            <div class="mt-2 text-2xl font-medium text-orange-900">
              {{ practiceStats.accuracy }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 学习路径 -->
      <div class="mb-12">
        <h2 class="text-xl font-medium text-gray-900 mb-6">学习路径</h2>

        <!-- 声母课程 -->
        <div class="mb-8">
          <h3 class="text-lg font-medium text-gray-900 mb-4">声母学习</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="lesson in initialLessons"
              :key="lesson.id"
              class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              :class="{
                'ring-2 ring-blue-500 ring-offset-2': isCurrentLesson(lesson.id)
              }"
              @click="startLesson(lesson.id)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-base font-medium text-gray-900">{{ lesson.title }}</h4>
                  <p class="mt-1 text-sm text-gray-500">{{ lesson.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <div
                    class="text-sm font-medium"
                    :class="{
                      'text-green-600': getLessonProgress(lesson.id) === 100,
                      'text-blue-600':
                        getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100,
                      'text-gray-400': getLessonProgress(lesson.id) === 0
                    }"
                  >
                    {{ getLessonProgress(lesson.id) }}%
                  </div>
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-500': getLessonProgress(lesson.id) === 100,
                      'bg-blue-500':
                        getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100,
                      'bg-gray-300': getLessonProgress(lesson.id) === 0
                    }"
                  ></div>
                </div>
              </div>

              <!-- 示例展示 -->
              <div class="mt-4 flex items-center space-x-4">
                <div
                  v-for="example in lesson.examples.slice(0, 4)"
                  :key="example.char"
                  class="text-center"
                >
                  <div class="text-lg font-medium text-gray-900">{{ example.char }}</div>
                  <div class="mt-1 text-xs text-gray-500">
                    {{ example.shengmu.toUpperCase() }}+{{ example.yunmu.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 韵母课程 -->
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4">韵母学习</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="lesson in finalLessons"
              :key="lesson.id"
              class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              :class="{
                'ring-2 ring-green-500 ring-offset-2': isCurrentLesson(lesson.id)
              }"
              @click="startLesson(lesson.id)"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h4 class="text-base font-medium text-gray-900">{{ lesson.title }}</h4>
                  <p class="mt-1 text-sm text-gray-500">{{ lesson.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <div
                    class="text-sm font-medium"
                    :class="{
                      'text-green-600': getLessonProgress(lesson.id) === 100,
                      'text-blue-600':
                        getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100,
                      'text-gray-400': getLessonProgress(lesson.id) === 0
                    }"
                  >
                    {{ getLessonProgress(lesson.id) }}%
                  </div>
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-500': getLessonProgress(lesson.id) === 100,
                      'bg-blue-500':
                        getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100,
                      'bg-gray-300': getLessonProgress(lesson.id) === 0
                    }"
                  ></div>
                </div>
              </div>

              <!-- 示例展示 -->
              <div class="mt-4 flex items-center space-x-4">
                <div
                  v-for="example in lesson.examples.slice(0, 4)"
                  :key="example.char"
                  class="text-center"
                >
                  <div class="text-lg font-medium text-gray-900">{{ example.char }}</div>
                  <div class="mt-1 text-xs text-gray-500">
                    {{ example.shengmu.toUpperCase() }}+{{ example.yunmu.toUpperCase() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近练习 -->
      <div>
        <h2 class="text-xl font-medium text-gray-900 mb-6">最近练习</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  课程
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  时间
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  字数
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  速度
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  正确率
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="record in recentPractices" :key="record.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.lessonTitle }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(record.time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ record.chars }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ record.speed }} 字/分
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': record.accuracy >= 95,
                      'bg-yellow-100 text-yellow-800':
                        record.accuracy >= 80 && record.accuracy < 95,
                      'bg-red-100 text-red-800': record.accuracy < 80
                    }"
                  >
                    {{ record.accuracy }}%
                  </span>
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
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useShuangpinStore } from '../stores/shuangpin'
  import { lessons, getLessonProgress } from '../data/lessons'

  const router = useRouter()
  const store = useShuangpinStore()

  // 练习统计
  const practiceStats = computed(() => store.practiceStats)

  // 课程列表
  const initialLessons = computed(() => lessons.filter(lesson => lesson.type === 'initial'))
  const finalLessons = computed(() => lessons.filter(lesson => lesson.type === 'final'))

  // 最近练习记录
  const recentPractices = computed(() => store.recentPractices || [])

  // 判断是否当前课程
  const isCurrentLesson = id => {
    return store.currentLessonId === id
  }

  // 开始课程
  const startLesson = id => {
    router.push({
      name: 'learning',
      params: { lessonId: id }
    })
  }

  // 格式化时间
  const formatTime = seconds => {
    if (!seconds) return '0小时0分钟'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}小时${minutes}分钟`
  }

  // 格式化日期
  const formatDate = timestamp => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  // 初始化默认数据
  onMounted(() => {
    // 确保 store 有默认数据
    if (!store.practiceStats.totalTime) {
      store.updatePracticeStats({
        totalTime: 0,
        totalChars: 0,
        speed: 0,
        accuracy: 0
      })
    }
  })
</script>
