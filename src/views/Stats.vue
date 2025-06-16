<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- 总体统计 -->
      <div class="mb-8">
        <h2 class="text-2xl font-medium text-gray-900 mb-6">练习统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm font-medium text-gray-500">总练习时间</div>
            <div class="mt-2 flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ formatTime(stats.totalTime) }}
              </div>
              <div class="ml-2 text-sm text-gray-500">小时</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm font-medium text-gray-500">练习字数</div>
            <div class="mt-2 flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ stats.totalChars }}
              </div>
              <div class="ml-2 text-sm text-gray-500">字</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm font-medium text-gray-500">平均速度</div>
            <div class="mt-2 flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ stats.speed }}
              </div>
              <div class="ml-2 text-sm text-gray-500">字/分</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="text-sm font-medium text-gray-500">平均正确率</div>
            <div class="mt-2 flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ stats.accuracy }}
              </div>
              <div class="ml-2 text-sm text-gray-500">%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 课程进度 -->
      <div class="mb-8">
        <h2 class="text-2xl font-medium text-gray-900 mb-6">课程进度</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="lesson in lessons" :key="lesson.id">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-sm font-medium text-gray-900">{{ lesson.title }}</div>
                  <div class="text-sm text-gray-500">{{ lesson.progress }}%</div>
                </div>
                <div class="h-2 bg-gray-100 rounded-full">
                  <div 
                    class="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    :style="{ width: `${lesson.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近练习记录 -->
      <div>
        <h2 class="text-2xl font-medium text-gray-900 mb-6">练习记录</h2>
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="space-y-4">
              <div 
                v-for="record in practiceRecords" 
                :key="record.id"
                class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div class="font-medium text-gray-900">{{ record.title }}</div>
                  <div class="text-sm text-gray-500">{{ record.time }}</div>
                </div>
                <div class="flex items-center space-x-8">
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ record.chars }} 字</div>
                    <div class="text-xs text-gray-500">练习字数</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ record.speed }} 字/分</div>
                    <div class="text-xs text-gray-500">输入速度</div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ record.accuracy }}%</div>
                    <div class="text-xs text-gray-500">正确率</div>
                  </div>
                </div>
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
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()

// 获取统计数据
const stats = computed(() => store.practiceStats)

// 课程数据
const lessons = ref([
  {
    id: 1,
    title: '声母键位学习',
    progress: 100
  },
  {
    id: 2,
    title: '韵母键位学习',
    progress: 75
  },
  {
    id: 3,
    title: '整字练习',
    progress: 50
  },
  {
    id: 4,
    title: '词组练习',
    progress: 25
  }
])

// 练习记录
const practiceRecords = ref([
  {
    id: 1,
    title: '声母键位练习 - b、p、m、f',
    time: '2024-03-20 14:30',
    chars: 100,
    speed: 30,
    accuracy: 95
  },
  {
    id: 2,
    title: '韵母键位练习 - a、o、e、i',
    time: '2024-03-19 16:20',
    chars: 80,
    speed: 25,
    accuracy: 88
  }
])

// 格式化时间
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}:${minutes.toString().padStart(2, '0')}`
}
</script> 