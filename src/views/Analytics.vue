<template>
  <div class="analytics-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">数据分析</h1>
          <p class="text-gray-600">深入分析您的学习数据，获得个性化建议</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">🔍</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">智能分析功能开发中</h2>
            <p class="text-gray-600 mb-6">我们正在为您准备AI驱动的学习分析</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-900 mb-2">学习模式分析</h3>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• 最佳学习时间识别</li>
                  <li>• 学习习惯分析</li>
                  <li>• 进步速度评估</li>
                </ul>
              </div>
              
              <div class="p-4 bg-purple-50 rounded-lg">
                <h3 class="font-medium text-purple-900 mb-2">个性化建议</h3>
                <ul class="text-sm text-purple-700 space-y-1">
                  <li>• 薄弱环节识别</li>
                  <li>• 练习计划推荐</li>
                  <li>• 目标设定建议</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePracticeStore } from '@/stores/practice'

const practiceStore = usePracticeStore()

onMounted(async () => {
  await practiceStore.init()
})
</script>

<style scoped>
.analytics-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

/* 暗色主题 */
[data-theme='dark'] .analytics-view {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .bg-white {
  @apply bg-gray-800;
}

[data-theme='dark'] h1,
[data-theme='dark'] h2 {
  @apply text-gray-100;
}

[data-theme='dark'] p {
  @apply text-gray-300;
}
</style>