<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- 练习头部 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">打字练习</h2>
                <p class="mt-1 text-sm text-gray-500">
                  {{ isStarted ? '正在练习中...' : '准备开始练习' }}
                </p>
              </div>
              <div class="flex space-x-6">
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-500">速度</p>
                  <p class="mt-1 text-2xl font-semibold text-blue-600">
                    {{ speed }}<span class="text-sm ml-1">字/分</span>
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-500">正确率</p>
                  <p class="mt-1 text-2xl font-semibold text-green-600">
                    {{ accuracy }}<span class="text-sm ml-1">%</span>
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-500">时间</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ formatTime(time) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 练习区域 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="relative">
              <!-- 提示区 -->
              <div class="mb-4 p-4 bg-blue-50 rounded-lg" v-if="currentKey">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-blue-800">当前练习键位</p>
                    <p class="mt-1 text-lg font-bold text-blue-900">
                      {{ currentKey.key }} - {{ currentKey.initial }}{{ currentKey.final }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium text-blue-800">双拼组合</p>
                    <p class="mt-1 text-lg font-bold text-blue-900">
                      {{ currentKey.key }} + {{ currentKey.final }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 文本显示区 -->
              <div
                class="text-lg leading-8 font-mono p-4 rounded-lg"
                :class="{ 'opacity-50': !isStarted, 'bg-gray-50': isStarted }"
              >
                <span
                  v-for="(char, index) in text"
                  :key="index"
                  class="transition-all duration-200"
                  :class="{
                    'text-green-500 font-bold': typedChars[index] === char,
                    'text-red-500 font-bold': typedChars[index] && typedChars[index] !== char,
                    'bg-yellow-200': currentIndex === index,
                    'text-gray-400': index > currentIndex
                  }"
                >{{ char }}</span>
              </div>

              <!-- 输入区 -->
              <div class="mt-4">
                <textarea
                  ref="inputRef"
                  v-model="input"
                  class="w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{
                    'border-gray-200': !isStarted,
                    'border-blue-500': isStarted && !isFinished,
                    'border-green-500': isFinished
                  }"
                  :placeholder="isStarted ? '输入双拼...' : '按回车键开始练习'"
                  :disabled="!isStarted || isFinished"
                  @input="handleInput"
                  @keydown.backspace.prevent
                ></textarea>
              </div>
            </div>

            <!-- 控制按钮 -->
            <div class="mt-6 flex justify-center space-x-4">
              <button
                v-if="!isStarted"
                @click="start"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                开始练习
              </button>
              <button
                v-else-if="isFinished"
                @click="restart"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                再来一次
              </button>
            </div>
          </div>
        </div>

        <!-- 练习结果 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden" v-if="isFinished">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">练习结果</h3>
            <div class="mt-4 grid grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-sm font-medium text-gray-500">最终速度</p>
                <p class="mt-2 text-3xl font-bold text-blue-600">
                  {{ speed }}<span class="text-sm ml-1">字/分</span>
                </p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-sm font-medium text-gray-500">正确率</p>
                <p class="mt-2 text-3xl font-bold text-green-600">
                  {{ accuracy }}<span class="text-sm ml-1">%</span>
                </p>
              </div>
              <div class="bg-gray-50 rounded-lg p-4 text-center">
                <p class="text-sm font-medium text-gray-500">用时</p>
                <p class="mt-2 text-3xl font-bold text-gray-900">
                  {{ formatTime(time) }}
                </p>
              </div>
            </div>

            <!-- 错误分析 -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-gray-900">错误分析</h4>
              <div class="mt-2 space-y-2">
                <div
                  v-for="(error, index) in errors"
                  :key="index"
                  class="flex items-center p-2 bg-red-50 rounded"
                >
                  <span class="text-red-600">{{ error.expected }}</span>
                  <span class="mx-2 text-gray-400">→</span>
                  <span class="text-red-600">{{ error.actual }}</span>
                  <span class="ml-4 text-sm text-gray-500">
                    出现 {{ error.count }} 次
                  </span>
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
import { ref, computed, onUnmounted } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()
const currentKey = computed(() => store.currentPracticeKey)

// 练习状态
const isStarted = ref(false)
const isFinished = ref(false)
const input = ref('')
const typedChars = ref([])
const currentIndex = ref(0)
const time = ref(0)
const timer = ref(null)
const inputRef = ref(null)
const errors = ref([])

// 生成练习文本
const generateText = () => {
  if (!currentKey.value) {
    return '请先在键位学习页面选择要练习的键位'
  }
  // 这里应该根据当前练习的键位生成相应的文本
  return '今天天气真好，我们一起去公园散步吧。春天的花都开了，空气很清新。'
}

const text = generateText()

// 计算指标
const speed = computed(() => {
  if (time.value === 0) return 0
  return Math.round((currentIndex.value / time.value) * 60)
})

const accuracy = computed(() => {
  if (currentIndex.value === 0) return 100
  const correct = typedChars.value.filter((char, i) => char === text[i]).length
  return Math.round((correct / currentIndex.value) * 100)
})

// 开始练习
const start = () => {
  isStarted.value = true
  timer.value = setInterval(() => {
    time.value++
  }, 1000)
  inputRef.value?.focus()
}

// 处理输入
const handleInput = () => {
  const char = input.value.slice(-1)
  input.value = ''
  
  if (currentIndex.value < text.length) {
    typedChars.value[currentIndex.value] = char
    
    // 记录错误
    if (char !== text[currentIndex.value]) {
      const error = {
        expected: text[currentIndex.value],
        actual: char,
        count: 1
      }
      const existingError = errors.value.find(
        e => e.expected === error.expected && e.actual === error.actual
      )
      if (existingError) {
        existingError.count++
      } else {
        errors.value.push(error)
      }
    }
    
    currentIndex.value++

    if (currentIndex.value === text.length) {
      finish()
    }
  }
}

// 完成练习
const finish = () => {
  isFinished.value = true
  clearInterval(timer.value)
  
  // 记录练习结果
  store.recordPractice(
    text.length,
    typedChars.value.filter((char, i) => char === text[i]).length,
    time.value
  )
}

// 重新开始
const restart = () => {
  input.value = ''
  typedChars.value = []
  currentIndex.value = 0
  isStarted.value = false
  isFinished.value = false
  time.value = 0
  errors.value = []
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script> 