<template>
  <div class="space-y-6">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium leading-6 text-gray-900">双拼打字游戏</h3>
          <div class="flex space-x-4">
            <div class="text-sm">
              <span class="text-gray-500">得分：</span>
              <span class="font-medium">{{ score }}</span>
            </div>
            <div class="text-sm">
              <span class="text-gray-500">时间：</span>
              <span class="font-medium">{{ formatTime(timeLeft) }}</span>
            </div>
          </div>
        </div>

        <div v-if="!isStarted" class="text-center py-12">
          <h3 class="text-xl font-medium text-gray-900 mb-4">
            打字消除游戏
          </h3>
          <p class="text-gray-500 mb-8">
            在限定时间内，输入正确的双拼组合消除文字，获得高分！
          </p>
          <button
            @click="startGame"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            开始游戏
          </button>
        </div>

        <div v-else class="relative min-h-[400px]">
          <!-- 游戏区域 -->
          <div class="absolute inset-0">
            <div
              v-for="(word, index) in fallingWords"
              :key="index"
              class="absolute transition-all duration-1000"
              :style="{
                left: `${word.x}%`,
                top: `${word.y}%`,
                transform: 'translateX(-50%)'
              }"
            >
              <div class="text-lg font-medium" :class="{ 'text-red-500': word.isTarget }">
                {{ word.text }}
              </div>
              <div class="text-sm text-gray-500">{{ word.pinyin }}</div>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="absolute bottom-0 left-0 right-0">
            <input
              ref="inputRef"
              v-model="input"
              type="text"
              class="block w-full px-4 py-2 text-lg border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="输入双拼..."
              @input="handleInput"
              :disabled="!isStarted || isGameOver"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏结束弹窗 -->
    <div
      v-if="isGameOver"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">游戏结束</h3>
        <p class="text-gray-500 mb-2">最终得分：{{ score }}</p>
        <p class="text-gray-500 mb-4">消除文字：{{ eliminatedWords }}</p>
        <div class="flex justify-end">
          <button
            @click="restartGame"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            再玩一次
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()

// 游戏状态
const isStarted = ref(false)
const isGameOver = ref(false)
const score = ref(0)
const timeLeft = ref(60)
const eliminatedWords = ref(0)
const input = ref('')
const timer = ref(null)
const gameLoop = ref(null)
const inputRef = ref(null)

// 游戏配置
const GAME_DURATION = 60
const WORD_SPAWN_INTERVAL = 2000
const WORD_FALL_SPEED = 1000

// 游戏数据
const fallingWords = ref([])
const words = [
  { text: '你好', pinyin: 'ni hao' },
  { text: '世界', pinyin: 'shi jie' },
  { text: '双拼', pinyin: 'shuang pin' },
  { text: '学习', pinyin: 'xue xi' },
  { text: '快乐', pinyin: 'kuai le' },
  // 添加更多词组...
]

const startGame = () => {
  isStarted.value = true
  isGameOver.value = false
  score.value = 0
  timeLeft.value = GAME_DURATION
  eliminatedWords.value = 0
  fallingWords.value = []
  input.value = ''

  // 开始计时
  timer.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)

  // 开始生成文字
  gameLoop.value = setInterval(() => {
    spawnWord()
  }, WORD_SPAWN_INTERVAL)

  // 聚焦输入框
  inputRef.value?.focus()
}

const spawnWord = () => {
  const word = words[Math.floor(Math.random() * words.length)]
  fallingWords.value.push({
    ...word,
    id: Date.now(),
    x: Math.random() * 80 + 10, // 10% - 90%
    y: 0,
    isTarget: false
  })
}

const handleInput = () => {
  const inputValue = input.value.toLowerCase()
  
  // 检查是否有匹配的文字
  const targetIndex = fallingWords.value.findIndex(
    word => word.pinyin.replace(' ', '') === inputValue
  )

  if (targetIndex !== -1) {
    // 消除匹配的文字
    fallingWords.value.splice(targetIndex, 1)
    score.value += 10
    eliminatedWords.value++
    input.value = ''
  }
}

const endGame = () => {
  isGameOver.value = true
  clearInterval(timer.value)
  clearInterval(gameLoop.value)
  
  // 记录游戏分数
  store.recordGameScore(score.value)
}

const restartGame = () => {
  startGame()
}

const formatTime = (seconds) => {
  return seconds.toString().padStart(2, '0')
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isStarted.value && !isGameOver.value) {
      startGame()
    }
  })
})

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
  if (gameLoop.value) clearInterval(gameLoop.value)
})
</script>

<style scoped>
.falling-word {
  transition: top 1s linear;
}
</style> 