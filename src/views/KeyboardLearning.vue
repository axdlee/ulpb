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
        <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- 声母键位 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">声母键位</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div 
                v-for="(keys, initial) in groupedInitials" 
                :key="initial"
                class="p-3 rounded-lg"
                :class="{
                  'bg-blue-50 ring-2 ring-blue-500 ring-offset-2': isCurrentInitial(initial)
                }"
              >
                <div class="text-sm font-medium text-gray-900">{{ initial }}</div>
                <div class="mt-1 flex items-center space-x-2">
                  <span 
                    v-for="key in keys" 
                    :key="key"
                    class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded"
                    :class="{
                      'bg-blue-100 text-blue-700': isCurrentKey(key),
                      'bg-gray-100 text-gray-700': !isCurrentKey(key)
                    }"
                  >
                    {{ key.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 韵母键位 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">韵母键位</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div 
                v-for="(keys, final) in groupedFinals" 
                :key="final"
                class="p-3 rounded-lg"
                :class="{
                  'bg-green-50 ring-2 ring-green-500 ring-offset-2': isCurrentFinal(final)
                }"
              >
                <div class="text-sm font-medium text-gray-900">{{ final }}</div>
                <div class="mt-1 flex items-center space-x-2">
                  <span 
                    v-for="key in keys" 
                    :key="key"
                    class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded"
                    :class="{
                      'bg-green-100 text-green-700': isCurrentKey(key),
                      'bg-gray-100 text-gray-700': !isCurrentKey(key)
                    }"
                  >
                    {{ key.toUpperCase() }}
                  </span>
                </div>
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
                      'ring-2 ring-blue-500 ring-offset-2': isCurrentKey(key.key)
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

        <!-- 示例汉字 -->
        <div class="mt-12">
          <h3 class="text-lg font-medium text-gray-900 mb-4">练习示例</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              v-for="example in currentLesson.examples" 
              :key="example.char"
              class="p-4 bg-gray-50 rounded-lg text-center"
            >
              <div class="text-2xl font-medium text-gray-900">{{ example.char }}</div>
              <div class="mt-2 text-sm text-gray-500">
                {{ example.shengmu.toUpperCase() }} + {{ example.yunmu.toUpperCase() }}
              </div>
            </div>
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
import { getLesson, getLessonProgress } from '../data/lessons'

const router = useRouter()
const store = useShuangpinStore()

// 当前课程信息
const currentLesson = ref(getLesson(1))
const progress = computed(() => getLessonProgress(currentLesson.value.id))

// 键盘布局
const keyboardLayout = computed(() => {
  return store.getCurrentSchemeLayout
})

// 声母分组
const groupedInitials = computed(() => {
  const groups = {}
  for (const [initial, key] of Object.entries(store.currentScheme.shengmu)) {
    if (!groups[initial]) {
      groups[initial] = []
    }
    groups[initial].push(key)
  }
  return groups
})

// 韵母分组
const groupedFinals = computed(() => {
  const groups = {}
  for (const [final, key] of Object.entries(store.currentScheme.yunmu)) {
    if (!groups[final]) {
      groups[final] = []
    }
    groups[final].push(key)
  }
  return groups
})

// 判断是否当前学习的声母
const isCurrentInitial = (initial) => {
  return currentLesson.value.initials?.includes(initial) || false
}

// 判断是否当前学习的韵母
const isCurrentFinal = (final) => {
  return currentLesson.value.finals?.includes(final) || false
}

// 判断是否当前学习的键位
const isCurrentKey = (key) => {
  return currentLesson.value.initials?.includes(key) || 
         currentLesson.value.finals?.includes(key)
}

// 课程控制
const prevLesson = () => {
  if (currentLesson.value.id > 1) {
    currentLesson.value = getLesson(currentLesson.value.id - 1)
  }
}

const nextLesson = () => {
  const nextId = currentLesson.value.id + 1
  const nextLesson = getLesson(nextId)
  if (nextLesson) {
    currentLesson.value = nextLesson
  }
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