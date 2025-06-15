<template>
  <div class="space-y-6">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">双拼方案选择</h3>
          <p class="mt-1 text-sm text-gray-500">
            选择你想要学习的双拼方案
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <select
            v-model="store.currentScheme"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="microsoft">微软双拼</option>
            <option value="ziranma">自然码</option>
            <option value="sougou">搜狗双拼</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">键位图</h3>
        <div class="mt-5">
          <div class="keyboard-layout grid grid-cols-10 gap-1">
            <template v-for="key in keyboardLayout" :key="key.key">
              <div
                class="key-cell p-2 text-center border rounded"
                :class="{
                  'bg-blue-100': isKeyHighlighted(key.key),
                  'hover:bg-gray-100': !isKeyHighlighted(key.key)
                }"
                @click="selectKey(key)"
              >
                <div class="text-sm font-medium">{{ key.key }}</div>
                <div class="text-xs text-gray-500">{{ key.initial }}</div>
                <div class="text-xs text-gray-500">{{ key.final }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow sm:rounded-lg" v-if="selectedKey">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          键位详情: {{ selectedKey.key }}
        </h3>
        <div class="mt-3 text-sm text-gray-500">
          <p>声母: {{ selectedKey.initial || '无' }}</p>
          <p>韵母: {{ selectedKey.final || '无' }}</p>
          <div class="mt-4">
            <h4 class="font-medium">练习示例:</h4>
            <div class="mt-2 space-y-2">
              <div v-for="(example, index) in selectedKey.examples" :key="index">
                {{ example }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()
const selectedKey = ref(null)

// 这里使用简化的键盘布局，实际使用时需要根据不同的方案动态生成
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
  // 添加更多键位...
]

const selectKey = (key) => {
  selectedKey.value = {
    ...key,
    examples: [
      '清(qing) -> q + ing',
      '球(qiu) -> q + iu',
      // 添加更多示例...
    ]
  }
}

const isKeyHighlighted = (key) => {
  return selectedKey.value?.key === key
}
</script>

<style scoped>
.keyboard-layout {
  max-width: 800px;
  margin: 0 auto;
}

.key-cell {
  aspect-ratio: 1;
  cursor: pointer;
  transition: all 0.2s;
}
</style> 