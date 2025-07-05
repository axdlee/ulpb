<!-- NotFound 404页面 - 页面未找到 -->
<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <!-- 404图标 -->
        <div class="error-icon">
          <span class="error-code">404</span>
          <div class="error-emoji">😕</div>
        </div>
        
        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移动。
          </p>
          <p class="error-suggestion">
            您可以尝试以下操作：
          </p>
          
          <!-- 建议操作 -->
          <div class="suggestions">
            <div class="suggestion-item">
              ✓ 检查网址是否输入正确
            </div>
            <div class="suggestion-item">
              ✓ 返回首页重新导航
            </div>
            <div class="suggestion-item">
              ✓ 使用搜索功能查找内容
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <button @click="goHome" class="btn btn-primary">
            🏠 返回首页
          </button>
          <button @click="goBack" class="btn btn-secondary">
            ← 返回上页
          </button>
        </div>
        
        <!-- 快速导航 -->
        <div class="quick-nav">
          <h3 class="quick-nav-title">快速导航</h3>
          <div class="quick-nav-grid">
            <router-link to="/learning" class="quick-nav-item">
              ⌨️ 键位学习
            </router-link>
            <router-link to="/practice" class="quick-nav-item">
              ✍️ 打字练习
            </router-link>
            <router-link to="/game" class="quick-nav-item">
              🎮 趣味游戏
            </router-link>
            <router-link to="/stats" class="quick-nav-item">
              📊 学习统计
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 方法
const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  @apply min-h-screen bg-gray-50 flex items-center justify-center;
}

.app--dark .not-found {
  @apply bg-gray-900;
}

.container {
  @apply max-w-2xl mx-auto px-4 text-center;
}

.not-found-content {
  @apply space-y-8;
}

/* 错误图标 */
.error-icon {
  @apply relative;
}

.error-code {
  @apply block text-8xl font-bold text-gray-300 mb-4;
}

.app--dark .error-code {
  @apply text-gray-600;
}

.error-emoji {
  @apply text-6xl;
}

/* 错误信息 */
.error-info {
  @apply space-y-4;
}

.error-title {
  @apply text-3xl font-bold text-gray-900;
}

.app--dark .error-title {
  @apply text-gray-100;
}

.error-description {
  @apply text-lg text-gray-600;
}

.app--dark .error-description {
  @apply text-gray-400;
}

.error-suggestion {
  @apply text-gray-500 font-medium;
}

.app--dark .error-suggestion {
  @apply text-gray-500;
}

/* 建议列表 */
.suggestions {
  @apply space-y-2 text-left max-w-md mx-auto;
}

.suggestion-item {
  @apply text-gray-600 bg-gray-100 px-4 py-2 rounded-lg;
}

.app--dark .suggestion-item {
  @apply text-gray-400 bg-gray-800;
}

/* 操作按钮 */
.error-actions {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

.btn {
  @apply px-6 py-3 rounded-lg font-medium transition-colors duration-200 min-w-[120px];
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}

/* 快速导航 */
.quick-nav {
  @apply pt-8 border-t border-gray-200;
}

.app--dark .quick-nav {
  @apply border-gray-700;
}

.quick-nav-title {
  @apply text-lg font-semibold text-gray-900 mb-4;
}

.app--dark .quick-nav-title {
  @apply text-gray-100;
}

.quick-nav-grid {
  @apply grid grid-cols-2 sm:grid-cols-4 gap-3;
}

.quick-nav-item {
  @apply block p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200;
}

.app--dark .quick-nav-item {
  @apply bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-blue-600;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .error-code {
    @apply text-6xl;
  }
  
  .error-emoji {
    @apply text-4xl;
  }
  
  .error-title {
    @apply text-2xl;
  }
  
  .error-description {
    @apply text-base;
  }
}
</style>