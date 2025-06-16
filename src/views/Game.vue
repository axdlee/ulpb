<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- 游戏选择 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900">趣味游戏</h2>
            <p class="mt-1 text-sm text-gray-500">
              通过有趣的游戏来练习双拼输入
            </p>
            <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <!-- 下落方块 -->
              <div
                class="relative group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                @click="startGame('falling')"
              >
                <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-blue-600">
                  <div class="flex items-center justify-center">
                    <span class="text-4xl text-white">🎮</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-medium text-gray-900">双拼方块</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    击打下落的汉字，练习双拼输入速度
                  </p>
                </div>
              </div>

              <!-- 记忆配对 -->
              <div
                class="relative group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                @click="startGame('memory')"
              >
                <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-green-500 to-green-600">
                  <div class="flex items-center justify-center">
                    <span class="text-4xl text-white">🎯</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-medium text-gray-900">记忆配对</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    配对汉字和双拼组合，加深记忆
                  </p>
                </div>
              </div>

              <!-- 速度挑战 -->
              <div
                class="relative group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                @click="startGame('speed')"
              >
                <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-purple-500 to-purple-600">
                  <div class="flex items-center justify-center">
                    <span class="text-4xl text-white">⚡</span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-medium text-gray-900">速度挑战</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    限时输入，挑战你的极限速度
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏区域 -->
        <div v-if="currentGame" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ gameTitle }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{ gameDescription }}
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-500">得分</p>
                  <p class="mt-1 text-2xl font-semibold text-blue-600">
                    {{ score }}
                  </p>
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-gray-500">时间</p>
                  <p class="mt-1 text-2xl font-semibold text-gray-900">
                    {{ formatTime(gameTime) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 游戏内容 -->
            <div class="mt-6">
              <!-- 下落方块游戏 -->
              <div v-if="currentGame === 'falling'" class="relative h-96 bg-gray-100 rounded-lg">
                <div
                  v-for="block in fallingBlocks"
                  :key="block.id"
                  class="absolute px-4 py-2 bg-white rounded shadow-sm transform transition-transform"
                  :style="{
                    left: `${block.x}%`,
                    top: `${block.y}%`,
                    transform: `translateX(-50%)`
                  }"
                >
                  <div class="text-lg font-medium">{{ block.char }}</div>
                  <div class="text-xs text-gray-500">{{ block.pinyin }}</div>
                </div>
                <input
                  v-model="gameInput"
                  class="absolute bottom-0 left-0 w-full px-4 py-2 text-lg border-t focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入双拼..."
                  @input="handleGameInput"
                />
              </div>

              <!-- 记忆配对游戏 -->
              <div v-if="currentGame === 'memory'" class="grid grid-cols-4 gap-4">
                <div
                  v-for="card in memoryCards"
                  :key="card.id"
                  class="aspect-w-1 aspect-h-1"
                >
                  <button
                    class="w-full h-full flex items-center justify-center text-lg font-medium rounded-lg transition-all"
                    :class="{
                      'bg-white shadow-sm hover:shadow': !card.isFlipped && !card.isMatched,
                      'bg-blue-50 text-blue-600': card.isFlipped && !card.isMatched,
                      'bg-green-50 text-green-600': card.isMatched
                    }"
                    @click="flipCard(card)"
                    :disabled="card.isMatched"
                  >
                    <span v-if="!card.isFlipped && !card.isMatched">?</span>
                    <span v-else>{{ card.content }}</span>
                  </button>
                </div>
              </div>

              <!-- 速度挑战游戏 -->
              <div v-if="currentGame === 'speed'" class="space-y-6">
                <div class="text-center">
                  <div class="text-6xl font-bold">{{ currentChar }}</div>
                  <div class="mt-2 text-lg text-gray-500">{{ currentPinyin }}</div>
                </div>
                <input
                  v-model="gameInput"
                  class="w-full px-4 py-2 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入双拼..."
                  @input="handleGameInput"
                />
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-600 transition-all"
                    :style="{ width: `${(timeLeft / gameDuration) * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史记录 -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-medium text-gray-900">历史最高分</h3>
            <div class="mt-4">
              <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              游戏
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              分数
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              日期
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="(score, index) in topScores" :key="index">
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm font-medium text-gray-900">
                                {{ getGameName(score.gameType) }}
                              </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm text-gray-900">{{ score.score }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm text-gray-500">
                                {{ formatDate(score.timestamp) }}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
import { ref, computed, onUnmounted } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()

// 游戏状态
const currentGame = ref(null)
const score = ref(0)
const gameTime = ref(0)
const gameInput = ref('')
const gameTimer = ref(null)
const gameDuration = 60 // 游戏时长（秒）
const timeLeft = ref(gameDuration)

// 下落方块游戏状态
const fallingBlocks = ref([])
const fallingTimer = ref(null)

// 记忆配对游戏状态
const memoryCards = ref([])
const flippedCards = ref([])

// 速度挑战游戏状态
const currentChar = ref('')
const currentPinyin = ref('')

// 游戏标题和描述
const gameTitle = computed(() => {
  switch (currentGame.value) {
    case 'falling':
      return '双拼方块'
    case 'memory':
      return '记忆配对'
    case 'speed':
      return '速度挑战'
    default:
      return ''
  }
})

const gameDescription = computed(() => {
  switch (currentGame.value) {
    case 'falling':
      return '输入正确的双拼组合击打下落的汉字'
    case 'memory':
      return '找出配对的汉字和双拼组合'
    case 'speed':
      return '在限定时间内输入尽可能多的汉字'
    default:
      return ''
  }
})

// 历史最高分
const topScores = computed(() => {
  return store.gameScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
})

// 开始游戏
const startGame = (type) => {
  currentGame.value = type
  score.value = 0
  gameTime.value = 0
  timeLeft.value = gameDuration
  gameInput.value = ''

  // 清除之前的定时器
  clearInterval(gameTimer.value)
  clearInterval(fallingTimer.value)

  // 开始游戏定时器
  gameTimer.value = setInterval(() => {
    gameTime.value++
    if (currentGame.value === 'speed') {
      timeLeft.value--
      if (timeLeft.value <= 0) {
        endGame()
      }
    }
  }, 1000)

  // 初始化游戏
  switch (type) {
    case 'falling':
      initFallingGame()
      break
    case 'memory':
      initMemoryGame()
      break
    case 'speed':
      initSpeedGame()
      break
  }
}

// 初始化下落方块游戏
const initFallingGame = () => {
  fallingBlocks.value = []
  fallingTimer.value = setInterval(() => {
    // 添加新方块
    if (Math.random() < 0.1) {
      fallingBlocks.value.push({
        id: Date.now(),
        char: '测',
        pinyin: 'ce',
        x: Math.random() * 80 + 10,
        y: 0
      })
    }

    // 更新方块位置
    fallingBlocks.value.forEach(block => {
      block.y += 1
    })

    // 移除超出边界的方块
    fallingBlocks.value = fallingBlocks.value.filter(block => block.y < 100)
  }, 50)
}

// 初始化记忆配对游戏
const initMemoryGame = () => {
  const pairs = [
    { char: '测', pinyin: 'ce' },
    { char: '试', pinyin: 'shi' },
    { char: '双', pinyin: 'shuang' },
    { char: '拼', pinyin: 'pin' },
    { char: '输', pinyin: 'shu' },
    { char: '入', pinyin: 'ru' },
    { char: '法', pinyin: 'fa' },
    { char: '好', pinyin: 'hao' }
  ]

  const cards = []
  pairs.forEach(pair => {
    cards.push(
      {
        id: `char-${pair.char}`,
        content: pair.char,
        type: 'char',
        pair: pair.pinyin,
        isFlipped: false,
        isMatched: false
      },
      {
        id: `pinyin-${pair.pinyin}`,
        content: pair.pinyin,
        type: 'pinyin',
        pair: pair.char,
        isFlipped: false,
        isMatched: false
      }
    )
  })

  // 随机排序
  memoryCards.value = cards.sort(() => Math.random() - 0.5)
}

// 初始化速度挑战游戏
const initSpeedGame = () => {
  generateNewChar()
}

// 生成新的汉字
const generateNewChar = () => {
  currentChar.value = '测'
  currentPinyin.value = 'ce'
}

// 处理游戏输入
const handleGameInput = () => {
  const input = gameInput.value.trim()
  
  switch (currentGame.value) {
    case 'falling':
      handleFallingInput(input)
      break
    case 'speed':
      handleSpeedInput(input)
      break
  }
  
  gameInput.value = ''
}

// 处理下落方块游戏输入
const handleFallingInput = (input) => {
  const hitBlock = fallingBlocks.value.find(block => input === block.pinyin)
  if (hitBlock) {
    score.value += Math.max(1, Math.floor((100 - hitBlock.y) / 10))
    fallingBlocks.value = fallingBlocks.value.filter(block => block !== hitBlock)
  }
}

// 处理速度挑战游戏输入
const handleSpeedInput = (input) => {
  if (input === currentPinyin.value) {
    score.value++
    generateNewChar()
  }
}

// 翻转记忆卡片
const flipCard = (card) => {
  if (flippedCards.value.length === 2) return
  
  card.isFlipped = true
  flippedCards.value.push(card)
  
  if (flippedCards.value.length === 2) {
    const [first, second] = flippedCards.value
    if (first.pair === second.content && second.pair === first.content) {
      // 匹配成功
      first.isMatched = true
      second.isMatched = true
      score.value += 10
      
      // 检查游戏是否结束
      if (memoryCards.value.every(card => card.isMatched)) {
        endGame()
      }
    } else {
      // 匹配失败，翻回
      setTimeout(() => {
        first.isFlipped = false
        second.isFlipped = false
      }, 1000)
    }
    flippedCards.value = []
  }
}

// 结束游戏
const endGame = () => {
  clearInterval(gameTimer.value)
  clearInterval(fallingTimer.value)
  
  // 记录分数
  store.recordGameScore(score.value, currentGame.value)
  
  // 重置游戏状态
  currentGame.value = null
  gameInput.value = ''
  fallingBlocks.value = []
  memoryCards.value = []
  flippedCards.value = []
}

// 格式化时间
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

// 获取游戏名称
const getGameName = (type) => {
  switch (type) {
    case 'falling':
      return '双拼方块'
    case 'memory':
      return '记忆配对'
    case 'speed':
      return '速度挑战'
    default:
      return type
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  clearInterval(gameTimer.value)
  clearInterval(fallingTimer.value)
})
</script> 