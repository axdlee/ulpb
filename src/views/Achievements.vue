<template>
  <div class="achievements-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">成就系统</h1>
          <p class="text-gray-600">解锁成就，记录您的学习里程碑</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">🏆</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">成就系统开发中</h2>
            <p class="text-gray-600 mb-6">我们正在为您准备丰富的成就体系</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl mb-2">🥉</div>
                <h3 class="font-medium text-yellow-900 mb-2">入门成就</h3>
                <ul class="text-sm text-yellow-700 space-y-1">
                  <li>• 首次练习</li>
                  <li>• 完成第一课</li>
                  <li>• 连续练习3天</li>
                </ul>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl mb-2">🥈</div>
                <h3 class="font-medium text-gray-900 mb-2">进阶成就</h3>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>• 速度达到30字/分</li>
                  <li>• 准确率达到95%</li>
                  <li>• 完成10个课程</li>
                </ul>
              </div>
              
              <div class="p-4 bg-yellow-100 rounded-lg">
                <div class="text-2xl mb-2">🥇</div>
                <h3 class="font-medium text-yellow-900 mb-2">大师成就</h3>
                <ul class="text-sm text-yellow-800 space-y-1">
                  <li>• 速度达到60字/分</li>
                  <li>• 完美准确率</li>
                  <li>• 连续练习30天</li>
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
.achievements-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

/* 暗色主题 */
[data-theme='dark'] .achievements-view {
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

[data-theme='dark'] .bg-gray-50 {
  @apply bg-gray-700;
}

[data-theme='dark'] .text-gray-900 {
  @apply text-gray-100;
}

[data-theme='dark'] .text-gray-700 {
  @apply text-gray-300;
}
</style>