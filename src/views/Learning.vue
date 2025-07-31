<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部进度条 -->
    <div class="fixed top-16 left-0 right-0 h-1 bg-gray-200">
      <div class="h-full bg-blue-500" :style="{ width: `${progress}%` }"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- 练习区域 -->
      <div class="space-y-8 mt-8">
        <!-- 当前任务 -->
        <div class="text-center space-y-4">
          <h2 class="text-2xl font-medium text-gray-900">{{ currentTask.title }}</h2>
          <p class="text-gray-600">{{ currentTask.description }}</p>
        </div>

        <!-- 键位预览 -->
        <div class="flex justify-center space-x-4 text-3xl font-mono">
          <div
            v-for="char in previewChars"
            :key="char"
            class="w-12 h-12 flex items-center justify-center rounded-lg"
            :class="[
              char === currentChar ? 'bg-blue-500 text-white' : 'bg-white text-gray-900',
              'shadow-sm'
            ]"
          >
            {{ char }}
          </div>
        </div>

        <!-- 键盘区域 -->
        <div class="relative">
          <!-- 键盘布局 -->
          <div class="keyboard-layout bg-white rounded-xl shadow-sm p-8">
            <div class="grid grid-cols-10 gap-1">
              <template v-for="key in keyboardLayout" :key="key.key">
                <div
                  class="key-cell relative aspect-square rounded-lg transition-all"
                  :class="{
                    'bg-green-100 border border-green-500': getKeyStatus(key.key) === 'mastered',
                    'bg-blue-100 border border-blue-500': getKeyStatus(key.key) === 'learning',
                    'bg-gray-50 border border-gray-200': getKeyStatus(key.key) === 'new',
                    'ring-2 ring-blue-500': isKeyHighlighted(key.key)
                  }"
                  @click="selectKey(key)"
                >
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      class="text-lg font-medium"
                      :class="{
                        'text-green-700': getKeyStatus(key.key) === 'mastered',
                        'text-blue-700': getKeyStatus(key.key) === 'learning',
                        'text-gray-700': getKeyStatus(key.key) === 'new'
                      }"
                      >{{ key.key.toUpperCase() }}</span
                    >
                    <div class="text-xs mt-1 space-y-0.5">
                      <div v-if="key.shengmu" class="text-gray-500">{{ key.shengmu }}</div>
                      <div v-if="key.yunmu" class="text-gray-500">{{ key.yunmu }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 手指指法动画 -->
          <div class="absolute inset-0 pointer-events-none">
            <div class="relative h-full">
              <!-- 手指SVG动画 -->
              <svg
                class="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                width="600"
                height="200"
                viewBox="0 0 600 200"
              >
                <!-- 手掌 -->
                <path class="hand" d="..." fill="none" stroke="#666" stroke-width="2" />
                <!-- 手指 -->
                <g v-for="finger in fingers" :key="finger.id">
                  <path
                    :class="['finger', { active: finger.active }]"
                    :d="finger.path"
                    fill="none"
                    stroke="#666"
                    stroke-width="2"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <!-- 右侧工具栏 -->
        <div class="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4">
          <!-- 键盘布局切换 -->
          <button class="tool-button">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          <!-- 指法提示开关 -->
          <button class="tool-button" :class="{ 'bg-blue-500 text-white': showFingerHints }">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
              />
            </svg>
          </button>

          <!-- 声音开关 -->
          <button class="tool-button" :class="{ 'bg-blue-500 text-white': soundEnabled }">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useShuangpinStore } from '../stores/shuangpin'
  import { useRouter } from 'vue-router'

  const store = useShuangpinStore()
  const router = useRouter()
  const selectedKey = ref(null)
  const progress = ref(23) // 当前进度
  const showFingerHints = ref(true)
  const soundEnabled = ref(true)

  // 键盘布局配置
  const keyboardLayouts = {
    microsoft: [
      { key: 'Q', initial: 'q', final: 'iu' },
      { key: 'W', initial: 'w', final: 'ia' },
      { key: 'E', initial: '', final: 'e' },
      { key: 'R', initial: 'r', final: 'uan' },
      { key: 'T', initial: 't', final: 'ue' },
      { key: 'Y', initial: 'y', final: 'uai' },
      { key: 'U', initial: '', final: 'u' },
      { key: 'I', initial: '', final: 'i' },
      { key: 'O', initial: '', final: 'o' },
      { key: 'P', initial: 'p', final: 'un' },
      { key: 'A', initial: '', final: 'a' },
      { key: 'S', initial: 's', final: 'ong' },
      { key: 'D', initial: 'd', final: 'iang' },
      { key: 'F', initial: 'f', final: 'en' },
      { key: 'G', initial: 'g', final: 'eng' },
      { key: 'H', initial: 'h', final: 'ang' },
      { key: 'J', initial: 'j', final: 'an' },
      { key: 'K', initial: 'k', final: 'ao' },
      { key: 'L', initial: 'l', final: 'ai' },
      { key: ';', initial: '', final: 'ing' },
      { key: 'Z', initial: 'z', final: 'ei' },
      { key: 'X', initial: 'x', final: 'ie' },
      { key: 'C', initial: 'c', final: 'iao' },
      { key: 'V', initial: 'zh', final: 'ui' },
      { key: 'B', initial: 'b', final: 'ou' },
      { key: 'N', initial: 'n', final: 'in' },
      { key: 'M', initial: 'm', final: 'ian' }
    ],
    ziranma: [
      // 自然码布局配置
    ],
    sougou: [
      // 搜狗双拼布局配置
    ]
  }

  // 当前键盘布局
  const keyboardLayout = computed(
    () => keyboardLayouts[store.currentScheme] || keyboardLayouts.microsoft
  )

  // 示例词组
  const exampleWords = {
    microsoft: {
      q: ['青(qing)', '秋(qiu)', '前(qian)'],
      w: ['为(wei)', '万(wan)', '文(wen)'],
      e: ['饿(e)', '恩(en)', '耳(er)']
      // ... 其他键位的示例词组
    }
  }

  // 生成示例
  const generateExamples = key => {
    const examples = []

    if (key.initial && key.final) {
      // 声韵母组合示例
      examples.push(`声母：${key.initial}，韵母：${key.final}`)
      examples.push(`组合键位：${key.key} + ${key.key}`)

      // 添加实际词组示例
      const schemeExamples = exampleWords[store.currentScheme]
      if (schemeExamples && schemeExamples[key.key.toLowerCase()]) {
        examples.push('示例词组：')
        examples.push(...schemeExamples[key.key.toLowerCase()].map(word => `  ${word}`))
      }
    } else if (key.initial) {
      examples.push(`声母：${key.initial}`)
      examples.push('可组合的韵母：')
      keyboardLayout.value
        .filter(k => k.final)
        .slice(0, 3)
        .forEach(k => {
          examples.push(`  ${key.initial}${k.final} -> ${key.key}+${k.key}`)
        })
    } else if (key.final) {
      examples.push(`韵母：${key.final}`)
      examples.push('可组合的声母：')
      keyboardLayout.value
        .filter(k => k.initial)
        .slice(0, 3)
        .forEach(k => {
          examples.push(`  ${k.initial}${key.final} -> ${k.key}+${key.key}`)
        })
    }

    return examples
  }

  // 选择键位
  const selectKey = key => {
    selectedKey.value = {
      ...key,
      examples: generateExamples(key)
    }

    // 更新学习进度
    if (!store.learningProgress.completedKeys.includes(key.key)) {
      store.updateLearningProgress(key.key)
    }
  }

  // 开始练习
  const startPractice = () => {
    if (selectedKey.value) {
      store.setCurrentPracticeKey(selectedKey.value)
      router.push('/practice')
    }
  }

  // 键位分类
  const keyCategories = computed(() => {
    const categories = {
      initial: [],
      final: [],
      both: []
    }

    keyboardLayout.value.forEach(key => {
      if (key.initial && key.final) {
        categories.both.push(key)
      } else if (key.initial) {
        categories.initial.push(key)
      } else if (key.final) {
        categories.final.push(key)
      }
    })

    return categories
  })

  // 键位状态
  const getKeyStatus = key => {
    const progress = store.learningProgress
    if (progress.masteredKeys.includes(key)) {
      return 'mastered'
    } else if (progress.completedKeys.includes(key)) {
      return 'learning'
    }
    return 'new'
  }

  const totalKeys = computed(() => keyboardLayout.length)
  const completedKeys = computed(() => store.learningProgress.completedKeys)

  const isKeyHighlighted = key => {
    return selectedKey.value?.key === key
  }

  const currentTask = {
    title: '学习 f 和 j 键位',
    description: '这两个键位是食指的基准位置,有突起标记'
  }

  const previewChars = ['f', 'j', 'f', 'j', 'f']
  const currentChar = ref('f')

  // 手指位置数据
  const fingers = [
    { id: 1, path: '...', active: false }, // 左手小指
    { id: 2, path: '...', active: false }, // 左手无名指
    { id: 3, path: '...', active: false }, // 左手中指
    { id: 4, path: '...', active: true }, // 左手食指 (f)
    { id: 5, path: '...', active: true }, // 右手食指 (j)
    { id: 6, path: '...', active: false }, // 右手中指
    { id: 7, path: '...', active: false }, // 右手无名指
    { id: 8, path: '...', active: false } // 右手小指
  ]
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

  .tool-button {
    @apply w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500;
  }

  /* 手指动画 */
  .finger {
    transition: all 0.3s ease-in-out;
  }

  .finger.active {
    stroke: #3b82f6;
    stroke-width: 3;
  }

  .hand {
    transition: transform 0.3s ease-in-out;
  }

  /* 键位预览动画 */
  @keyframes highlight {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .preview-char-active {
    animation: highlight 0.5s ease-in-out;
  }
</style>
