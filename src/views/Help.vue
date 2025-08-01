<template>
  <div class="help-view">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">帮助中心</h1>
          <p class="text-gray-600">学习如何使用双拼练习应用</p>
        </div>

        <div class="space-y-6">
          <!-- 快速开始 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">🚀 快速开始</h2>
            <div class="space-y-3 text-gray-600">
              <p>1. 选择您想要学习的双拼方案（推荐小鹤双拼）</p>
              <p>2. 从"键位学习"开始，了解键位布局</p>
              <p>3. 进入"打字练习"进行实际练习</p>
              <p>4. 查看"学习统计"了解您的进步</p>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">❓ 常见问题</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-gray-900 mb-2">什么是双拼？</h3>
                <p class="text-gray-600">双拼是一种中文输入法，每个汉字的拼音最多只需要两次按键就能输入完成，大大提高了输入效率。</p>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-900 mb-2">如何选择双拼方案？</h3>
                <p class="text-gray-600">推荐初学者使用小鹤双拼，它的设计比较科学，容易记忆。您也可以根据个人喜好选择其他方案。</p>
              </div>
              
              <div>
                <h3 class="font-medium text-gray-900 mb-2">学习双拼需要多长时间？</h3>
                <p class="text-gray-600">一般来说，每天练习30分钟，大约1-2周就能基本掌握，1-2个月可以达到熟练水平。</p>
              </div>
            </div>
          </div>

          <!-- 快捷键 -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">⌨️ 快捷键</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Ctrl + 1</span>
                  <span class="text-gray-900">控制台</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ctrl + 2</span>
                  <span class="text-gray-900">键位学习</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ctrl + 3</span>
                  <span class="text-gray-900">打字练习</span>
                </div>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">Ctrl + ,</span>
                  <span class="text-gray-900">设置</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">F1</span>
                  <span class="text-gray-900">帮助</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Esc</span>
                  <span class="text-gray-900">关闭弹窗</span>
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
// 帮助页面不需要特殊的逻辑
</script>

<style scoped>
.help-view {
  @apply min-h-screen bg-gradient-to-br from-gray-50 to-gray-100;
}

/* 暗色主题 */
[data-theme='dark'] .help-view {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}

[data-theme='dark'] .bg-white {
  @apply bg-gray-800;
}

[data-theme='dark'] h1,
[data-theme='dark'] h2,
[data-theme='dark'] h3 {
  @apply text-gray-100;
}

[data-theme='dark'] p {
  @apply text-gray-300;
}

[data-theme='dark'] .text-gray-900 {
  @apply text-gray-100;
}

[data-theme='dark'] .text-gray-600 {
  @apply text-gray-300;
}
</style>