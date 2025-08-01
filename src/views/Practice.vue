<template>
  <div class="practice-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">打字练习</h1>
          <p class="text-gray-600">通过练习提高您的双拼输入速度和准确率</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">✍️</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">练习功能开发中</h2>
            <p class="text-gray-600 mb-6">我们正在为您准备更好的练习体验</p>
            
            <div class="space-y-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-900">即将推出的功能：</h3>
                <ul class="mt-2 text-sm text-blue-700 space-y-1">
                  <li>• 分级练习课程</li>
                  <li>• 实时速度和准确率统计</li>
                  <li>• 个性化练习内容</li>
                  <li>• 错误分析和改进建议</li>
                </ul>
              </div>
              
              <Button 
                variant="solid" 
                size="lg"
                @click="goToLearning"
              >
                先去学习键位
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePracticeStore } from '@/stores/practice'
import Button from '@/components/base/Button/index.vue'

const router = useRouter()
const practiceStore = usePracticeStore()

const goToLearning = () => {
  router.push('/learning')
}

onMounted(async () => {
  try {
    // 加载练习历史
    await practiceStore.loadRecentSessions()
  } catch (error) {
    console.error('加载练习数据失败:', error)
  }
})
</script>

<style scoped>
.practice-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

.container {
  @apply max-w-7xl mx-auto;
}

/* 暗色主题 */
[data-theme='dark'] .practice-view {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .bg-white {
  @apply bg-gray-800;
}

[data-theme='dark'] h1 {
  @apply text-gray-100;
}

[data-theme='dark'] h2 {
  @apply text-gray-100;
}

[data-theme='dark'] p {
  @apply text-gray-300;
}
</style>