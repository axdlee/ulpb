<!-- KeyboardLearning.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 学习进度 -->
    <div class="h-1 bg-gray-100">
      <div class="h-full bg-blue-500 transition-all duration-300" :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 当前学习内容 -->
      <div class="mb-8">
        <h1 class="text-2xl font-medium text-gray-900">{{ currentLesson.title }}</h1>
        <p class="mt-2 text-gray-600">{{ currentLesson.description }}</p>
      </div>

      <!-- 键位学习区域 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 键位说明 -->
        <div class="mb-8 flex items-start space-x-8">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">声母键位</h3>
            <div class="grid grid-cols-5 gap-4">
              <div v-for="key in shengmuKeys" 
                   :key="key.key"
                   class="flex items-center space-x-2 text-sm">
                <span class="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded">
                  {{ key.key }}
                </span>
                <span class="text-gray-600">{{ key.shengmu }}</span>
              </div>
            </div>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900 mb-2">韵母键位</h3>
            <div class="grid grid-cols-5 gap-4">
              <div v-for="key in yunmuKeys" 
                   :key="key.key"
                   class="flex items-center space-x-2 text-sm">
                <span class="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded">
                  {{ key.key }}
                </span>
                <span class="text-gray-600">{{ key.yunmu }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 键盘区域 -->
        <div class="relative">
          <div class="keyboard-layout">
            <div class="grid grid-cols-10 gap-x-1 gap-y-1">
              <template v-for="key in keyboardLayout" :key="key.key">
                <div
                  class="key-cell"
                  :class="[
                    'relative aspect-square rounded transition-all',
                    {
                      'bg-blue-50 border border-blue-200': key.type === 'shengmu',
                      'bg-green-50 border border-green-200': key.type === 'yunmu',
                      'bg-gray-50 border border-gray-200': !key.type,
                      'ring-2 ring-blue-500 ring-offset-2': isCurrentKey(key)
                    }
                  ]"
                >
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-1">
                    <span class="text-base font-medium" :class="{
                      'text-blue-700': key.type === 'shengmu',
                      'text-green-700': key.type === 'yunmu',
                      'text-gray-700': !key.type
                    }">{{ key.key.toUpperCase() }}</span>
                    <div class="text-xs space-y-0.5 text-center">
                      <div v-if="key.shengmu" class="text-blue-600">{{ key.shengmu }}</div>
                      <div v-if="key.yunmu" class="text-green-600">{{ key.yunmu }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 手指指法提示 -->
          <div class="absolute inset-x-0 -bottom-20 flex justify-center">
            <img src="../assets/hands.png" alt="指法提示" class="h-32 opacity-50">
          </div>
        </div>
      </div>

      <!-- 练习控制区 -->
      <div class="mt-8 flex justify-between items-center">
        <button 
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          @click="prevLesson"
        >
          上一课
        </button>
        <button 
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="startPractice"
        >
          开始练习
        </button>
        <button 
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          @click="nextLesson"
        >
          下一课
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShuangpinStore } from '../stores/shuangpin'

const router = useRouter()
const store = useShuangpinStore()
const progress = ref(0)

// 当前课程信息
const currentLesson = ref({
  id: 1,
  title: '声母键位学习 - b、p、m、f',
  description: '这节课我们将学习声母 b、p、m、f 的键位。这些声母都在键盘的左手区域,分别由左手的不同手指负责。'
})

// 键盘布局数据
const keyboardLayout = computed(() => {
  // 根据当前的双拼方案返回键盘布局
  return store.getCurrentSchemeLayout()
})

// 声母键位
const shengmuKeys = computed(() => {
  return keyboardLayout.value.filter(key => key.type === 'shengmu')
})

// 韵母键位
const yunmuKeys = computed(() => {
  return keyboardLayout.value.filter(key => key.type === 'yunmu')
})

// 判断是否当前学习的键位
const isCurrentKey = (key) => {
  return ['b', 'p', 'm', 'f'].includes(key.key)
}

// 课程控制
const prevLesson = () => {
  if (currentLesson.value.id > 1) {
    currentLesson.value.id--
    // 更新课程内容
  }
}

const nextLesson = () => {
  currentLesson.value.id++
  // 更新课程内容
}

const startPractice = () => {
  router.push({
    name: 'practice',
    params: { lessonId: currentLesson.value.id }
  })
}
</script>

<style scoped>
.keyboard-layout {
  max-width: 800px;
  margin: 0 auto;
}

.key-cell {
  min-height: 60px;
  user-select: none;
}

@media (min-width: 640px) {
  .key-cell {
    min-height: 45px;
  }
}

@media (min-width: 768px) {
  .key-cell {
    min-height: 50px;
  }
}
</style> 