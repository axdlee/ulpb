<template>
  <div class="space-y-6">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium leading-6 text-gray-900">打字练习</h3>
          <div class="flex space-x-4 text-sm">
            <div>
              <span class="text-gray-500">速度：</span>
              <span class="font-medium">{{ speed }}</span>
              <span class="text-gray-500">字/分</span>
            </div>
            <div>
              <span class="text-gray-500">正确率：</span>
              <span class="font-medium">{{ accuracy }}%</span>
            </div>
            <div>
              <span class="text-gray-500">时间：</span>
              <span class="font-medium">{{ formatTime(time) }}</span>
            </div>
          </div>
        </div>

        <div class="relative">
          <div
            class="text-lg leading-8 whitespace-pre-wrap font-mono"
            :class="{ 'opacity-50': !isStarted }"
          >
            <span
              v-for="(char, index) in text"
              :key="index"
              :class="{
                'text-green-500': typedChars[index] === char,
                'text-red-500': typedChars[index] && typedChars[index] !== char,
                'bg-gray-200': currentIndex === index
              }"
            >{{ char }}</span>
          </div>

          <textarea
            ref="inputRef"
            v-model="input"
            class="absolute inset-0 opacity-0"
            :disabled="!isStarted || isFinished"
            @input="handleInput"
            @keydown.backspace.prevent
          ></textarea>
        </div>

        <div class="flex justify-center space-x-4">
          <button
            v-if="!isStarted"
            @click="start"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            开始练习
          </button>
          <button
            v-else-if="isFinished"
            @click="restart"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            重新开始
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg" v-if="isFinished">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">练习结果</h3>
        <div class="mt-4 grid grid-cols-3 gap-4 text-center">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-gray-900">{{ speed }}</div>
            <div class="text-sm text-gray-500">字/分</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-gray-900">{{ accuracy }}%</div>
            <div class="text-sm text-gray-500">正确率</div>
          </div>
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="text-2xl font-bold text-gray-900">{{ formatTime(time) }}</div>
            <div class="text-sm text-gray-500">用时</div>
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

// 示例文本，实际使用时应该从后端获取或使用更多样的文本
const text = '今天天气真好，我们一起去公园散步吧。春天的花都开了，空气很清新。'
const input = ref('')
const typedChars = ref([])
const currentIndex = ref(0)
const isStarted = ref(false)
const isFinished = ref(false)
const time = ref(0)
const timer = ref(null)
const inputRef = ref(null)

const speed = computed(() => {
  if (time.value === 0) return 0
  return Math.round((currentIndex.value / time.value) * 60)
})

const accuracy = computed(() => {
  if (currentIndex.value === 0) return 100
  const correct = typedChars.value.filter((char, i) => char === text[i]).length
  return Math.round((correct / currentIndex.value) * 100)
})

const start = () => {
  isStarted.value = true
  timer.value = setInterval(() => {
    time.value++
  }, 1000)
  inputRef.value?.focus()
}

const handleInput = () => {
  const char = input.value.slice(-1)
  input.value = ''
  
  if (currentIndex.value < text.length) {
    typedChars.value[currentIndex.value] = char
    currentIndex.value++

    if (currentIndex.value === text.length) {
      finish()
    }
  }
}

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

const restart = () => {
  input.value = ''
  typedChars.value = []
  currentIndex.value = 0
  isStarted.value = false
  isFinished.value = false
  time.value = 0
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