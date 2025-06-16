<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <!-- 学习建议 -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-8">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0012 18.75V22"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-bold text-white">学习建议</h2>
                <div class="mt-2 text-blue-100">
                  <p v-for="(tip, index) in learningTips" :key="index" class="text-sm">
                    {{ tip }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 方案选择 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">双拼方案</h2>
                <p class="mt-1 text-sm text-gray-500">选择你想要学习的双拼方案</p>
              </div>
              <select
                v-model="store.currentScheme"
                class="mt-1 block w-48 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="microsoft">微软双拼</option>
                <option value="ziranma">自然码</option>
                <option value="sougou">搜狗双拼</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 键位学习区域 -->
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- 键位图 -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-medium text-gray-900">键位图</h3>
                  <div class="flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      已掌握: {{ store.learningProgress.masteredKeys.length }}
                    </span>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      学习中: {{ store.learningProgress.completedKeys.length - store.learningProgress.masteredKeys.length }}
                    </span>
                  </div>
                </div>

                <div class="keyboard-layout grid grid-cols-10 gap-1.5">
                  <template v-for="key in keyboardLayout" :key="key.key">
                    <div
                      class="key-cell relative aspect-square rounded-lg border-2 transition-all cursor-pointer"
                      :class="{
                        'border-green-500 bg-green-100 shadow-md': getKeyStatus(key.key) === 'mastered',
                        'border-blue-500 bg-blue-100 shadow-md': getKeyStatus(key.key) === 'learning',
                        'border-gray-300 hover:border-blue-400 hover:bg-blue-50': getKeyStatus(key.key) === 'new',
                        'ring-2 ring-blue-500 ring-offset-2': isKeyHighlighted(key.key)
                      }"
                      @click="selectKey(key)"
                    >
                      <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-xl font-bold" :class="{ 
                          'text-green-700': getKeyStatus(key.key) === 'mastered',
                          'text-blue-700': getKeyStatus(key.key) === 'learning',
                          'text-gray-900': getKeyStatus(key.key) === 'new'
                        }">
                          {{ key.key }}
                        </span>
                        <div class="mt-1 text-sm space-y-0.5">
                          <div :class="{ 
                            'text-green-600 font-medium': getKeyStatus(key.key) === 'mastered',
                            'text-blue-600 font-medium': getKeyStatus(key.key) === 'learning',
                            'text-gray-800': getKeyStatus(key.key) === 'new'
                          }">
                            {{ key.initial || '·' }}
                          </div>
                          <div :class="{ 
                            'text-green-600 font-medium': getKeyStatus(key.key) === 'mastered',
                            'text-blue-600 font-medium': getKeyStatus(key.key) === 'learning',
                            'text-gray-800': getKeyStatus(key.key) === 'new'
                          }">
                            {{ key.final || '·' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- 键位分类说明 -->
                <div class="mt-6 grid grid-cols-3 gap-4">
                  <div class="text-center">
                    <h4 class="text-sm font-medium text-gray-900">声母键位</h4>
                    <p class="mt-1 text-2xl font-bold text-blue-600">
                      {{ keyCategories.initial.length }}
                    </p>
                  </div>
                  <div class="text-center">
                    <h4 class="text-sm font-medium text-gray-900">韵母键位</h4>
                    <p class="mt-1 text-2xl font-bold text-green-600">
                      {{ keyCategories.final.length }}
                    </p>
                  </div>
                  <div class="text-center">
                    <h4 class="text-sm font-medium text-gray-900">复合键位</h4>
                    <p class="mt-1 text-2xl font-bold text-purple-600">
                      {{ keyCategories.both.length }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 键位详情 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedKey ? `键位详情: ${selectedKey.key}` : '选择键位查看详情' }}
                </h3>
                <div v-if="selectedKey" class="mt-4 space-y-4">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">声母</h4>
                    <p class="mt-1 text-lg font-medium">{{ selectedKey.initial || '无' }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">韵母</h4>
                    <p class="mt-1 text-lg font-medium">{{ selectedKey.final || '无' }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-gray-500">示例</h4>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="(example, index) in selectedKey.examples"
                        :key="index"
                        class="p-2 rounded bg-gray-50"
                      >
                        <p class="text-sm text-gray-900">{{ example }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-6">
                    <button
                      @click="startPractice"
                      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      练习这个键位
                    </button>
                  </div>
                </div>
                <div v-else class="mt-4 text-center text-gray-500">
                  点击键盘上的按键查看详细信息
                </div>
              </div>
            </div>

            <!-- 学习进度 -->
            <div class="mt-6 bg-white rounded-lg shadow-lg">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900">学习进度</h3>
                <div class="mt-4">
                  <div class="relative pt-1">
                    <div class="flex mb-2 items-center justify-between">
                      <div>
                        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          进行中
                        </span>
                      </div>
                      <div class="text-right">
                        <span class="text-xs font-semibold inline-block text-blue-600">
                          {{ Math.round((completedKeys.length / totalKeys) * 100) }}%
                        </span>
                      </div>
                    </div>
                    <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        :style="{ width: `${(completedKeys.length / totalKeys) * 100}%` }"
                        class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-500">
                    已掌握 {{ completedKeys.length }} / {{ totalKeys }} 个键位
                  </p>
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
import { useRouter } from 'vue-router'

const store = useShuangpinStore()
const router = useRouter()
const selectedKey = ref(null)

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
const keyboardLayout = computed(() => keyboardLayouts[store.currentScheme] || keyboardLayouts.microsoft)

// 示例词组
const exampleWords = {
  microsoft: {
    'q': ['青(qing)', '秋(qiu)', '前(qian)'],
    'w': ['为(wei)', '万(wan)', '文(wen)'],
    'e': ['饿(e)', '恩(en)', '耳(er)'],
    // ... 其他键位的示例词组
  }
}

// 生成示例
const generateExamples = (key) => {
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
const selectKey = (key) => {
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

// 学习建议
const learningTips = computed(() => {
  const tips = []
  const progress = store.learningProgress
  
  if (progress.completedKeys.length === 0) {
    tips.push('建议从声母键位开始学习')
    tips.push('先掌握基本的声母组合')
  } else if (progress.completedKeys.length < 10) {
    tips.push('继续学习常用韵母键位')
    tips.push('尝试组合已学习的声母和韵母')
  } else {
    tips.push('挑战更复杂的组合')
    tips.push('多练习实际词组输入')
  }
  
  return tips
})

// 键位状态
const getKeyStatus = (key) => {
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

const isKeyHighlighted = (key) => {
  return selectedKey.value?.key === key
}
</script>

<style scoped>
.keyboard-layout {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.key-cell {
  min-height: 60px;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.key-cell:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (min-width: 640px) {
  .key-cell {
    min-height: 80px;
  }
}
</style> 