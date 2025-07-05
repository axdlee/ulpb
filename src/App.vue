<!-- 现代化双拼练习应用主组件 -->
<template>
  <div 
    id="app" 
    :data-theme="appStore.currentTheme"
    :class="appClasses"
  >
    <!-- 全局通知系统 -->
    <Notification />

    <!-- 应用头部导航 -->
    <Header />

    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 路由视图与过渡动画 -->
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="getTransitionName(route)" 
          mode="out-in"
          @enter="onRouteEnter"
          @leave="onRouteLeave"
        >
          <component 
            :is="Component" 
            :key="route.path"
            class="route-view" 
          />
        </transition>
      </router-view>
    </main>

    <!-- 全局加载遮罩 -->
    <transition name="loading-overlay">
      <div 
        class="loading-overlay" 
        v-if="appStore.isLoading"
      >
        <div class="loading-spinner">
          <LoadingSpinner size="large" />
          <p class="loading-text">{{ appStore.loadingMessage || '加载中...' }}</p>
        </div>
      </div>
    </transition>

    <!-- 全局模态框容器 -->
    <div id="modal-container"></div>

    <!-- 调试信息 (仅开发模式) -->
    <div 
      class="debug-info" 
      v-if="isDevelopment && showDebugInfo"
    >
      <div class="debug-panel">
        <h3>调试信息</h3>
        <div class="debug-item">
          <span>当前路由:</span>
          <span>{{ $route.path }}</span>
        </div>
        <div class="debug-item">
          <span>当前主题:</span>
          <span>{{ appStore.currentTheme }}</span>
        </div>
        <div class="debug-item">
          <span>双拼方案:</span>
          <span>{{ shuangpinStore.currentScheme?.name }}</span>
        </div>
        <div class="debug-item">
          <span>练习状态:</span>
          <span>{{ practiceStore.isActive ? '进行中' : '未开始' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from './stores/app'
import { useShuangpinStore } from './stores/shuangpin'
import { usePracticeStore } from './stores/practice'

// 组件导入
import Header from './components/layout/Header/index.vue'
import Notification from './components/base/Notification/index.vue'
import LoadingSpinner from './components/base/LoadingSpinner/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const practiceStore = usePracticeStore()

// 路由
const route = useRoute()
const router = useRouter()

// 响应式状态
const showDebugInfo = ref(false)
const isDevelopment = ref(process.env.NODE_ENV === 'development')

// 计算属性
const appClasses = computed(() => ({
  'app--mobile': appStore.isMobile,
  'app--dark': appStore.currentTheme === 'dark',
  'app--loading': appStore.isLoading,
  'app--modal-open': appStore.isModalOpen,
  [`app--theme-${appStore.currentTheme}`]: true
}))

// 方法
const getTransitionName = (route) => {
  // 根据路由配置或路径决定过渡动画
  if (route.meta?.transition) {
    return route.meta.transition
  }
  
  // 默认过渡效果
  const transitions = {
    '/': 'fade',
    '/learning': 'slide-left',
    '/practice': 'slide-left', 
    '/game': 'slide-up',
    '/stats': 'slide-right',
    '/analytics': 'slide-right',
    '/achievements': 'slide-up'
  }
  
  return transitions[route.path] || 'fade'
}

const onRouteEnter = (el) => {
  // 路由进入动画完成回调
  nextTick(() => {
    // 确保页面内容可见
    el.style.opacity = '1'
  })
}

const onRouteLeave = (el) => {
  // 路由离开动画开始回调
  el.style.opacity = '0.8'
}

// 全局快捷键处理
const handleGlobalShortcuts = (event) => {
  // 组合键检测
  const isCtrl = event.ctrlKey || event.metaKey
  const isShift = event.shiftKey
  const isAlt = event.altKey

  // 快捷键映射
  const shortcuts = {
    // Ctrl/Cmd + K: 快速搜索
    'k': () => {
      if (isCtrl) {
        event.preventDefault()
        appStore.addNotification({
          type: 'info',
          message: '快速搜索功能即将推出',
          duration: 2000
        })
      }
    },
    
    // Ctrl/Cmd + ,: 打开设置
    ',': () => {
      if (isCtrl) {
        event.preventDefault()
        appStore.addNotification({
          type: 'info',
          message: '设置功能即将推出',
          duration: 2000
        })
      }
    },
    
    // Escape: 关闭模态框/通知
    'Escape': () => {
      if (appStore.isModalOpen) {
        appStore.closeModal()
      } else {
        appStore.clearNotifications()
      }
    },
    
    // F1: 帮助
    'F1': () => {
      event.preventDefault()
      router.push('/help')
    },
    
    // Ctrl/Cmd + Shift + D: 开发者调试信息
    'd': () => {
      if (isCtrl && isShift && isDevelopment.value) {
        event.preventDefault()
        showDebugInfo.value = !showDebugInfo.value
      }
    },
    
    // Ctrl/Cmd + 1-7: 快速切换页面
    '1': () => isCtrl && router.push('/'),
    '2': () => isCtrl && router.push('/learning'),
    '3': () => isCtrl && router.push('/practice'),
    '4': () => isCtrl && router.push('/game'),
    '5': () => isCtrl && router.push('/stats'),
    '6': () => isCtrl && router.push('/analytics'),
    '7': () => isCtrl && router.push('/achievements')
  }

  const handler = shortcuts[event.key]
  if (handler) {
    handler()
  }
}

// 主题切换处理
const handleThemeChange = () => {
  // 应用主题到 document
  document.documentElement.setAttribute('data-theme', appStore.currentTheme)
  
  // 更新 meta 标签
  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    const themeColors = {
      default: '#3b82f6',
      dark: '#1f2937',
      light: '#06b6d4',
      warm: '#f59e0b',
      cool: '#10b981'
    }
    themeColorMeta.content = themeColors[appStore.currentTheme] || themeColors.default
  }
}

// 路由导航守卫
const setupRouterGuards = () => {
  router.beforeEach((to, from, next) => {
    // 显示页面加载状态
    if (to.meta?.requiresAuth && !appStore.isAuthenticated) {
      // 如果需要认证但未登录，重定向到登录页
      next('/login')
      return
    }
    
    // 更新页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - 双拼练习`
    } else {
      document.title = '双拼练习'
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0)
    
    next()
  })

  router.afterEach((to) => {
    // 路由切换完成后的处理
    appStore.setCurrentRoute(to)
  })
}

// 错误处理
const setupErrorHandling = () => {
  // 全局错误处理
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    appStore.addNotification({
      type: 'error',
      message: '应用发生错误，请刷新页面重试',
      duration: 5000
    })
  })

  // Promise 拒绝处理
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    appStore.addNotification({
      type: 'error',
      message: '数据加载失败，请稍后重试',
      duration: 5000
    })
  })
}

// 应用初始化
const initializeApp = async () => {
  try {
    // 显示加载状态
    appStore.setLoading(true, '正在初始化应用...')

    // 初始化stores
    await Promise.all([
      appStore.init(),
      shuangpinStore.init(),
      practiceStore.init()
    ])

    // 应用主题
    handleThemeChange()

    // 显示欢迎消息
    appStore.addNotification({
      type: 'success',
      message: '欢迎使用双拼练习！',
      duration: 3000
    })

  } catch (error) {
    console.error('App initialization failed:', error)
    appStore.addNotification({
      type: 'error',
      message: '应用初始化失败，请刷新页面重试',
      duration: 0 // 持久显示
    })
  } finally {
    appStore.setLoading(false)
  }
}

// 监听器
watch(() => appStore.currentTheme, handleThemeChange)

// 生命周期
onMounted(async () => {
  // 设置路由守卫
  setupRouterGuards()
  
  // 设置错误处理
  setupErrorHandling()
  
  // 添加全局事件监听器
  document.addEventListener('keydown', handleGlobalShortcuts)
  
  // 初始化应用
  await initializeApp()
  
  // 检测设备类型
  appStore.detectDevice()
})

onUnmounted(() => {
  // 清理事件监听器
  document.removeEventListener('keydown', handleGlobalShortcuts)
})
</script>

<style>
/* 全局样式重置和基础样式 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  line-height: 1.6;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

#app {
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 主题相关的全局样式 */
:root {
  --primary-color: theme('colors.blue.500');
  --primary-dark: theme('colors.blue.600');
  --primary-light: theme('colors.blue.400');
  --secondary-color: theme('colors.indigo.500');
  --accent-color: theme('colors.purple.500');
  --text-primary: theme('colors.gray.900');
  --text-secondary: theme('colors.gray.600');
  --bg-primary: theme('colors.white');
  --bg-secondary: theme('colors.gray.50');
  --border-color: theme('colors.gray.200');
}

[data-theme='dark'] {
  --primary-color: theme('colors.blue.400');
  --primary-dark: theme('colors.blue.500');
  --primary-light: theme('colors.blue.300');
  --secondary-color: theme('colors.indigo.400');
  --accent-color: theme('colors.purple.400');
  --text-primary: theme('colors.gray.100');
  --text-secondary: theme('colors.gray.300');
  --bg-primary: theme('colors.gray.900');
  --bg-secondary: theme('colors.gray.800');
  --border-color: theme('colors.gray.700');
}

[data-theme='light'] {
  --primary-color: theme('colors.sky.500');
  --primary-dark: theme('colors.sky.600');
  --primary-light: theme('colors.sky.400');
  --secondary-color: theme('colors.cyan.500');
  --accent-color: theme('colors.teal.500');
}

[data-theme='warm'] {
  --primary-color: theme('colors.orange.500');
  --primary-dark: theme('colors.orange.600');
  --primary-light: theme('colors.orange.400');
  --secondary-color: theme('colors.amber.500');
  --accent-color: theme('colors.yellow.500');
}

[data-theme='cool'] {
  --primary-color: theme('colors.emerald.500');
  --primary-dark: theme('colors.emerald.600');
  --primary-light: theme('colors.emerald.400');
  --secondary-color: theme('colors.teal.500');
  --accent-color: theme('colors.cyan.500');
}

/* 应用主体样式 */
.app--dark {
  @apply bg-gray-900 text-gray-100;
}

.app--mobile {
  /* 移动端特殊样式 */
}

.app--modal-open {
  overflow: hidden;
}

/* 主要内容区域 */
.main-content {
  @apply pt-16; /* 为固定头部留出空间 */
  min-height: calc(100vh - 4rem);
}

.route-view {
  @apply w-full;
}

/* 全局加载遮罩 */
.loading-overlay {
  @apply fixed inset-0 z-[9998];
  @apply bg-white/80 backdrop-blur-sm;
  @apply flex items-center justify-center;
}

.app--dark .loading-overlay {
  @apply bg-gray-900/80;
}

.loading-spinner {
  @apply text-center;
}

.loading-text {
  @apply mt-4 text-lg font-medium text-gray-700;
}

.app--dark .loading-text {
  @apply text-gray-300;
}

/* 调试信息面板 */
.debug-info {
  @apply fixed bottom-4 left-4 z-[9999];
  @apply bg-black/80 text-white text-xs;
  @apply p-3 rounded-lg shadow-lg;
  @apply max-w-xs;
}

.debug-panel h3 {
  @apply font-bold mb-2 text-yellow-400;
}

.debug-item {
  @apply flex justify-between mb-1;
}

.debug-item span:first-child {
  @apply text-gray-300;
}

.debug-item span:last-child {
  @apply text-white font-mono;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 加载动画 */
.loading-overlay-enter-active,
.loading-overlay-leave-active {
  transition: all 0.3s ease;
}

.loading-overlay-enter-from,
.loading-overlay-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 选择文本样式 */
::selection {
  background-color: var(--primary-color);
  color: white;
}

/* 无障碍增强 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --border-color: theme('colors.black');
  }
  
  [data-theme='dark'] {
    --border-color: theme('colors.white');
  }
}

/* 打印样式 */
@media print {
  .loading-overlay,
  .debug-info,
  header,
  .notification-container {
    display: none !important;
  }
  
  .main-content {
    padding-top: 0 !important;
  }
}
</style>