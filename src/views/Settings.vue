<template>
  <div class="settings-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">设置</h1>
          <p class="text-gray-600">个性化您的学习体验</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-8">
          <div class="text-center">
            <div class="text-6xl mb-4">⚙️</div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">设置功能开发中</h2>
            <p class="text-gray-600 mb-6">我们正在为您准备完整的设置选项</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-medium text-blue-900 mb-2">界面设置</h3>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• 主题切换</li>
                  <li>• 语言选择</li>
                  <li>• 字体大小</li>
                  <li>• 动画效果</li>
                </ul>
              </div>
              
              <div class="p-4 bg-green-50 rounded-lg">
                <h3 class="font-medium text-green-900 mb-2">练习设置</h3>
                <ul class="text-sm text-green-700 space-y-1">
                  <li>• 声音提示</li>
                  <li>• 键位提示</li>
                  <li>• 难度调节</li>
                  <li>• 自动保存</li>
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
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

onMounted(async () => {
  await appStore.init()
})
</script>

<style scoped>
.settings-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

/* 暗色主题 */
[data-theme='dark'] .settings-view {
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