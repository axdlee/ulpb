<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- 方案选择 -->
      <div class="mb-8">
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

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 键位图 -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">键位图</h3>
              <div class="mt-4">
                <div class="keyboard-layout grid grid-cols-10 gap-1.5">
                  <template v-for="key in keyboardLayout" :key="key.key">
                    <div
                      class="key-cell relative aspect-square rounded-lg border-2 transition-all cursor-pointer"
                      :class="{
                        'border-blue-500 bg-blue-50': isKeyHighlighted(key.key),
                        'border-gray-200 hover:border-gray-300 hover:bg-gray-50': !isKeyHighlighted(key.key)
                      }"
                      @click="selectKey(key)"
                    >
                      <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span class="text-lg font-medium" :class="{ 'text-blue-600': isKeyHighlighted(key.key) }">
                          {{ key.key }}
                        </span>
                        <div class="mt-1 text-xs space-y-0.5">
                          <div :class="{ 'text-blue-500': isKeyHighlighted(key.key), 'text-gray-500': !isKeyHighlighted(key.key) }">
                            {{ key.initial || '·' }}
                          </div>
                          <div :class="{ 'text-blue-500': isKeyHighlighted(key.key), 'text-gray-500': !isKeyHighlighted(key.key) }">
                            {{ key.final || '·' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 键位详情 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6">
              <h3 class="text-lg font-medium text-gray-900">
                {{ selectedKey ? `键位详情: ${selectedKey.key}` : '选择键位查看详情' }}
              </h3>
              <div v-if="selectedKey" class="mt-4 space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500">声母</h4>
                  <p class="mt-1 text-lg">{{ selectedKey.initial || '无' }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">韵母</h4>
                  <p class="mt-1 text-lg">{{ selectedKey.final || '无' }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500">练习示例</h4>
                  <div class="mt-2 space-y-2">
                    <div
                      v-for="(example, index) in selectedKey.examples"
                      :key="index"
                      class="flex items-center p-2 rounded bg-gray-50"
                    >
                      <span class="text-gray-900">{{ example }}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <button
                    @click="startPractice"
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <div class="mt-6 bg-white rounded-lg shadow-sm">
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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'
import { useRouter } from 'vue-router'

const store = useShuangpinStore()
const router = useRouter()
const selectedKey = ref(null)

// 完整的键盘布局
const keyboardLayout = [
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
  { key: ';', initial: '', final: '' },
  { key: 'Z', initial: 'z', final: 'ei' },
  { key: 'X', initial: 'x', final: 'ie' },
  { key: 'C', initial: 'c', final: 'iao' },
  { key: 'V', initial: 'zh', final: 'ui' },
  { key: 'B', initial: 'b', final: 'ou' },
  { key: 'N', initial: 'n', final: 'in' },
  { key: 'M', initial: 'm', final: 'ian' }
]

const totalKeys = computed(() => keyboardLayout.length)
const completedKeys = computed(() => store.learningProgress.completedKeys)

const selectKey = (key) => {
  selectedKey.value = {
    ...key,
    examples: generateExamples(key)
  }
}

const generateExamples = (key) => {
  // 这里应该根据键位生成实际的例子
  if (key.initial && key.final) {
    return [
      `${key.initial}${key.final} -> ${key.key}`,
      '示例：清(qing) -> q + y',
      '示例：球(qiu) -> q + q'
    ]
  } else if (key.initial) {
    return [`声母：${key.initial}`]
  } else if (key.final) {
    return [`韵母：${key.final}`]
  }
  return []
}

const isKeyHighlighted = (key) => {
  return selectedKey.value?.key === key
}

const startPractice = () => {
  if (selectedKey.value) {
    // 存储当前选中的键位用于练习
    store.setCurrentPracticeKey(selectedKey.value)
    router.push('/practice')
  }
}
</script>

<style scoped>
.keyboard-layout {
  max-width: 800px;
  margin: 0 auto;
}

.key-cell {
  min-height: 60px;
}

@media (min-width: 640px) {
  .key-cell {
    min-height: 80px;
  }
}
</style> 