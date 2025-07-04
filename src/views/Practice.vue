<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 练习区域 -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- 练习信息 -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-medium text-gray-900">{{ currentLesson.title }}</h1>
          <p class="mt-1 text-sm text-gray-500">
            {{ isStarted ? '正在练习...' : '按空格开始练习' }}
          </p>
        </div>
        <div class="flex items-center space-x-8 text-sm">
          <div>
            <div class="text-gray-500">速度</div>
            <div class="text-xl font-medium text-gray-900">{{ speed }} 字/分</div>
          </div>
          <div>
            <div class="text-gray-500">正确率</div>
            <div class="text-xl font-medium text-gray-900">{{ accuracy }}%</div>
          </div>
          <div>
            <div class="text-gray-500">用时</div>
            <div class="text-xl font-medium text-gray-900">{{ formatTime(time) }}</div>
          </div>
        </div>
      </div>

      <!-- 练习内容 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 提示字符 -->
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-8">
            <div class="text-center">
              <div class="text-6xl font-medium" :class="{
                'text-gray-300': !isStarted,
                'text-gray-900': isStarted
              }">{{ currentChar }}</div>
              <div class="mt-2 text-sm text-gray-500">当前汉字</div>
            </div>
            <div class="text-center" v-if="currentPinyin">
              <div class="text-3xl font-medium text-blue-600">
                {{ currentPinyin.shengmu.toUpperCase() }}
              </div>
              <div class="mt-1 text-sm text-gray-500">声母</div>
            </div>
            <div class="text-center" v-if="currentPinyin">
              <div class="text-3xl font-medium text-green-600">
                {{ currentPinyin.yunmu.toUpperCase() }}
              </div>
              <div class="mt-1 text-sm text-gray-500">韵母</div>
            </div>
          </div>
          
          <!-- 练习进度 -->
          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <div class="text-sm text-gray-500">练习进度</div>
              <div class="text-sm text-gray-500">
                {{ currentIndex + 1 }}/{{ practiceText.length }}
              </div>
            </div>
            <div class="h-2 bg-gray-100 rounded-full">
              <div 
                class="h-2 bg-blue-500 rounded-full transition-all duration-300"
                :style="{ width: `${(currentIndex / practiceText.length) * 100}%` }"
              ></div>
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
                      'ring-2 ring-blue-500 ring-offset-2': isTargetKey(key),
                      'bg-red-50 border-red-200': isErrorKey(key)
                    }
                  ]"
                >
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-1">
                    <span class="text-base font-medium" :class="{
                      'text-blue-700': key.type === 'shengmu',
                      'text-green-700': key.type === 'yunmu',
                      'text-gray-700': !key.type,
                      'text-red-700': isErrorKey(key)
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
            <div class="h-32 flex items-center justify-center bg-gray-100 rounded-lg opacity-50">
              <span class="text-gray-400 text-sm">指法提示</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 练习控制 -->
      <div class="mt-8 flex justify-between items-center">
        <button 
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          @click="quitPractice"
        >
          退出练习
        </button>
        <button 
          v-if="!isStarted"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="startPractice"
        >
          开始练习
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useShuangpinStore } from '../stores/shuangpin'
import { getShuangpinCode, validateShuangpinInput, generatePracticeText, checkKeyMatch } from '../utils/pinyin'
import { getLesson } from '../data/lessons'
import { updateErrorRecord } from '../utils/review'

const router = useRouter()
const route = useRoute()
const store = useShuangpinStore()

// 练习状态
const isStarted = ref(false)
const time = ref(0)
const timer = ref(null)
const speed = ref(0)
const accuracy = ref(100)
const errorKeys = ref(new Set())

// 当前课程信息
const currentLesson = ref(null)

// 初始化课程信息
onMounted(() => {
  if (route.params.type === 'review') {
    // 复习模式
    currentLesson.value = JSON.parse(route.params.lesson)
  } else {
    // 普通练习模式
    currentLesson.value = getLesson(parseInt(route.params.lessonId))
  }
})

// 练习文本
const practiceText = ref([])
const currentIndex = ref(0)

// 当前练习字符
const currentChar = computed(() => practiceText.value[currentIndex.value]?.char || '')

// 当前拼音
const currentPinyin = computed(() => {
  if (!currentChar.value) return null
  return practiceText.value[currentIndex.value]
})

// 键盘布局
const keyboardLayout = computed(() => {
  return store.getCurrentSchemeLayout
})

// 判断是否目标键位
const isTargetKey = (key) => {
  if (!currentPinyin.value) return false
  const { shengmu, yunmu } = currentPinyin.value
  return key.key === shengmu || key.key === yunmu
}

// 判断是否错误键位
const isErrorKey = (key) => {
  return errorKeys.value.has(key.key)
}

// 开始练习
const startPractice = () => {
  // 生成练习文本
  if (currentLesson.value) {
    practiceText.value = generatePracticeText(currentLesson.value)
  } else {
    // 默认练习文本
    practiceText.value = [
      { char: '我', shengmu: 'w', yunmu: 'o', pinyin: 'wo' },
      { char: '是', shengmu: 'u', yunmu: 'i', pinyin: 'shi' },
      { char: '你', shengmu: 'n', yunmu: 'i', pinyin: 'ni' }
    ]
  }

  isStarted.value = true
  currentIndex.value = 0
  time.value = 0
  speed.value = 0
  accuracy.value = 100
  errorKeys.value.clear()

  timer.value = setInterval(() => {
    time.value++
    updateSpeed()
  }, 1000)

  window.addEventListener('keydown', handleKeydown)
}

// 退出练习
const quitPractice = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  window.removeEventListener('keydown', handleKeydown)
  
  if (route.params.type === 'review') {
    router.push('/review')
  } else {
    router.push('/learning')
  }
}

// 处理键盘输入
const handleKeydown = (event) => {
  if (!isStarted.value) {
    if (event.code === 'Space') {
      startPractice()
    }
    return
  }
  
  const key = event.key.toLowerCase()
  if (!currentPinyin.value) return

  const { char, shengmu, yunmu } = currentPinyin.value
  
  if (checkKeyMatch(key, shengmu, yunmu)) {
    // 正确按键
    errorKeys.value.delete(key)
    currentIndex.value++
    
    // 更新错误记录（正确）
    updateErrorRecord(char, shengmu, yunmu, false)
    
    if (currentIndex.value >= practiceText.value.length) {
      // 完成练习
      finishPractice()
    }
  } else {
    // 错误按键
    errorKeys.value.add(key)
    updateAccuracy()
    
    // 更新错误记录（错误）
    updateErrorRecord(char, shengmu, yunmu, true)
  }
}

// 更新速度
const updateSpeed = () => {
  if (time.value === 0) return
  speed.value = Math.round((currentIndex.value * 60) / time.value)
}

// 更新正确率
const updateAccuracy = () => {
  const totalAttempts = currentIndex.value + errorKeys.value.size
  accuracy.value = Math.round((currentIndex.value / totalAttempts) * 100)
}

// 完成练习
const finishPractice = () => {
  clearInterval(timer.value)
  window.removeEventListener('keydown', handleKeydown)
  
  // 更新练习统计
  store.updatePracticeStats({
    totalTime: store.practiceStats.totalTime + time.value,
    totalChars: store.practiceStats.totalChars + practiceText.value.length,
    accuracy: Math.round((store.practiceStats.accuracy + accuracy.value) / 2),
    speed: Math.round((store.practiceStats.speed + speed.value) / 2)
  })

  // 更新课程进度
  if (currentLesson.value.id) {
    store.updateLessonProgress(currentLesson.value.id, 100)
  }
}

// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 组件生命周期
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  window.removeEventListener('keydown', handleKeydown)
})
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