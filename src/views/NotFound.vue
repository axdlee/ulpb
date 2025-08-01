<template>
  <div class="not-found-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto text-center">
        <div class="text-8xl mb-8">🤔</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">页面未找到</h1>
        <p class="text-lg text-gray-600 mb-8">抱歉，您访问的页面不存在或已被移动。</p>
        
        <div class="space-y-4">
          <Button 
            variant="solid" 
            size="lg"
            @click="goHome"
          >
            返回首页
          </Button>
          
          <div class="text-sm text-gray-500">
            或者您可以尝试：
          </div>
          
          <div class="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              @click="goToLearning"
            >
              键位学习
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="goToPractice"
            >
              打字练习
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="goToStats"
            >
              学习统计
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from '@/components/base/Button/index.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goToLearning = () => {
  router.push('/learning')
}

const goToPractice = () => {
  router.push('/practice')
}

const goToStats = () => {
  router.push('/stats')
}
</script>

<style scoped>
.not-found-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center;
}

/* 暗色主题 */
[data-theme='dark'] .not-found-view {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] h1 {
  @apply text-gray-100;
}

[data-theme='dark'] p {
  @apply text-gray-300;
}

[data-theme='dark'] .text-gray-500 {
  @apply text-gray-400;
}
</style>