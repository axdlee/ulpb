<!-- Header组件 - 现代化应用导航栏 -->
<template>
  <header class="header" :class="headerClasses">
    <div class="header-container">
      <!-- Logo和标题区域 -->
      <div class="header-brand">
        <div class="brand-logo">
          <span class="logo-icon">✨</span>
          <h1 class="brand-title">双拼练习</h1>
        </div>
        <div class="brand-info" v-if="!isMobile">
          <span class="scheme-indicator">
            {{ currentSchemeName }}
          </span>
        </div>
      </div>

      <!-- 桌面端导航菜单 -->
      <nav class="header-nav" v-if="!isMobile">
        <router-link
          v-for="route in navigationRoutes"
          :key="route.path"
          :to="route.path"
          class="nav-link"
          :class="{ 'nav-link--active': isActiveRoute(route.path) }"
        >
          <span class="nav-icon" v-if="route.meta?.icon">{{ route.meta.icon }}</span>
          <span class="nav-text">{{ route.meta?.title || route.name }}</span>
        </router-link>
      </nav>

      <!-- 右侧操作区域 -->
      <div class="header-actions">
        <!-- 主题切换器 -->
        <div class="theme-selector" v-if="!isMobile">
          <button
            v-for="(theme, themeKey) in availableThemes"
            :key="themeKey"
            class="theme-button"
            :class="{ 'theme-button--active': appStore.currentTheme === themeKey }"
            :style="{ backgroundColor: theme.primaryColor }"
            @click="switchTheme(themeKey)"
            :title="theme.name"
          >
            <span class="theme-indicator"></span>
          </button>
        </div>

        <!-- 用户菜单 -->
        <div class="user-menu" ref="userMenuRef">
          <button 
            class="user-menu-trigger"
            @click="toggleUserMenu"
            :class="{ 'user-menu-trigger--active': isUserMenuOpen }"
          >
            <span class="user-avatar">👤</span>
            <span class="user-name" v-if="!isMobile">用户</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          
          <transition name="dropdown">
            <div class="user-menu-dropdown" v-show="isUserMenuOpen">
              <a href="#" class="menu-item" @click="openSettings">
                <span class="menu-icon">⚙️</span>
                <span class="menu-text">设置</span>
              </a>
              <a href="#" class="menu-item" @click="exportData">
                <span class="menu-icon">📤</span>
                <span class="menu-text">导出数据</span>
              </a>
              <a href="#" class="menu-item" @click="importData">
                <span class="menu-icon">📥</span>
                <span class="menu-text">导入数据</span>
              </a>
              <div class="menu-divider"></div>
              <a href="#" class="menu-item" @click="showAbout">
                <span class="menu-icon">ℹ️</span>
                <span class="menu-text">关于</span>
              </a>
            </div>
          </transition>
        </div>

        <!-- 移动端菜单按钮 -->
        <button 
          class="mobile-menu-toggle"
          v-if="isMobile"
          @click="toggleMobileMenu"
          :class="{ 'mobile-menu-toggle--active': isMobileMenuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <transition name="mobile-menu">
      <div class="mobile-nav" v-if="isMobile && isMobileMenuOpen">
        <div class="mobile-nav-content">
          <!-- 移动端方案信息 -->
          <div class="mobile-scheme-info">
            <span class="mobile-scheme-label">当前方案</span>
            <span class="mobile-scheme-name">{{ currentSchemeName }}</span>
          </div>

          <!-- 移动端导航链接 -->
          <nav class="mobile-nav-links">
            <router-link
              v-for="route in navigationRoutes"
              :key="route.path"
              :to="route.path"
              class="mobile-nav-link"
              @click="closeMobileMenu"
            >
              <span class="mobile-nav-icon" v-if="route.meta?.icon">{{ route.meta.icon }}</span>
              <span class="mobile-nav-text">{{ route.meta?.title || route.name }}</span>
            </router-link>
          </nav>

          <!-- 移动端主题选择 -->
          <div class="mobile-theme-selector">
            <div class="mobile-theme-title">主题选择</div>
            <div class="mobile-theme-grid">
              <button
                v-for="(theme, themeKey) in availableThemes"
                :key="themeKey"
                class="mobile-theme-option"
                :class="{ 'mobile-theme-option--active': appStore.currentTheme === themeKey }"
                @click="switchTheme(themeKey)"
              >
                <div 
                  class="mobile-theme-preview"
                  :style="{ backgroundColor: theme.primaryColor }"
                ></div>
                <span class="mobile-theme-name">{{ theme.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useShuangpinStore } from '@/stores/shuangpin'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const route = useRoute()
const router = useRouter()

// 响应式状态
const isMobile = ref(false)
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)

// 计算属性
const currentSchemeName = computed(() => {
  return shuangpinStore.currentScheme?.name || '小鹤双拼'
})

const headerClasses = computed(() => ({
  'header--mobile': isMobile.value,
  'header--dark': appStore.currentTheme === 'dark',
  'header--mobile-menu-open': isMobileMenuOpen.value
}))

const navigationRoutes = computed(() => [
  { path: '/', name: 'dashboard', meta: { title: '控制台', icon: '📊' } },
  { path: '/learning', name: 'learning', meta: { title: '键位学习', icon: '⌨️' } },
  { path: '/practice', name: 'practice', meta: { title: '打字练习', icon: '✍️' } },
  { path: '/game', name: 'game', meta: { title: '趣味游戏', icon: '🎮' } },
  { path: '/stats', name: 'stats', meta: { title: '学习统计', icon: '📈' } },
  { path: '/analytics', name: 'analytics', meta: { title: '数据分析', icon: '🔍' } },
  { path: '/achievements', name: 'achievements', meta: { title: '成就系统', icon: '🏆' } }
])

const availableThemes = computed(() => ({
  default: { name: '默认', primaryColor: '#3b82f6' },
  dark: { name: '暗黑', primaryColor: '#1f2937' },
  light: { name: '明亮', primaryColor: '#06b6d4' },
  warm: { name: '暖色', primaryColor: '#f59e0b' },
  cool: { name: '冷色', primaryColor: '#10b981' }
}))

// 方法
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const switchTheme = (themeKey) => {
  appStore.changeTheme(themeKey)
  if (isMobile.value) {
    appStore.addNotification({
      type: 'success',
      message: `已切换到${availableThemes.value[themeKey].name}主题`,
      duration: 2000
    })
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const openSettings = () => {
  closeUserMenu()
  router.push('/settings')
}

const exportData = () => {
  closeUserMenu()
  try {
    // 综合导出所有数据
    const appData = appStore.exportAppData()
    const shuangpinData = {
      currentScheme: shuangpinStore.currentSchemeKey,
      customSchemes: shuangpinStore.customSchemes,
      schemeProgress: shuangpinStore.schemeProgress,
      keyMastery: shuangpinStore.keyMastery
    }
    
    const exportData = {
      app: appData,
      shuangpin: shuangpinData,
      exportDate: new Date().toISOString(),
      version: '2.0'
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `双拼练习_完整数据_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    appStore.addNotification({
      type: 'success',
      message: '数据导出成功！',
      duration: 3000
    })
  } catch (error) {
    appStore.addNotification({
      type: 'error',
      message: '数据导出失败：' + error.message,
      duration: 5000
    })
  }
}

const importData = () => {
  closeUserMenu()
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        
        // 导入应用设置
        if (data.app && appStore.importAppData(data.app)) {
          appStore.addNotification({
            type: 'success',
            message: '应用设置导入成功',
            duration: 2000
          })
        }
        
        // 导入双拼数据
        if (data.shuangpin) {
          if (data.shuangpin.currentScheme) {
            shuangpinStore.changeScheme(data.shuangpin.currentScheme)
          }
          if (data.shuangpin.customSchemes) {
            Object.assign(shuangpinStore.customSchemes, data.shuangpin.customSchemes)
          }
          if (data.shuangpin.schemeProgress) {
            Object.assign(shuangpinStore.schemeProgress, data.shuangpin.schemeProgress)
          }
          if (data.shuangpin.keyMastery) {
            Object.assign(shuangpinStore.keyMastery, data.shuangpin.keyMastery)
          }
          
          // 保存双拼数据
          localStorage.setItem('customSchemes', JSON.stringify(shuangpinStore.customSchemes))
          localStorage.setItem('schemeProgress', JSON.stringify(shuangpinStore.schemeProgress))
          localStorage.setItem('keyMastery', JSON.stringify(shuangpinStore.keyMastery))
          
          appStore.addNotification({
            type: 'success',
            message: '双拼数据导入成功',
            duration: 2000
          })
        }
        
        appStore.addNotification({
          type: 'success',
          message: '数据导入完成！',
          duration: 3000
        })
        
      } catch (error) {
        appStore.addNotification({
          type: 'error',
          message: '导入失败：文件格式错误',
          duration: 5000
        })
      }
    }
    reader.readAsText(file)
  }
  
  input.click()
}

const showAbout = () => {
  closeUserMenu()
  
  // 创建关于信息模态框
  const aboutContent = `
    <div style="max-width: 500px; padding: 24px; background: white; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 48px; margin-bottom: 12px;">✨</div>
        <h2 style="margin: 0; font-size: 24px; font-weight: bold; color: #1f2937;">双拼练习大师</h2>
        <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">现代化双拼输入法学习应用</p>
      </div>
      
      <div style="space-y: 12px; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #6b7280;">版本</span>
          <span style="font-weight: 500;">v2.0.0</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #6b7280;">技术栈</span>
          <span style="font-weight: 500;">Vue 3 + Tauri + Tailwind CSS</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
          <span style="color: #6b7280;">支持方案</span>
          <span style="font-weight: 500;">小鹤、微软、自然码等6种</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 8px 0;">
          <span style="color: #6b7280;">开发时间</span>
          <span style="font-weight: 500;">2025</span>
        </div>
      </div>
      
      <div style="text-align: center; color: #6b7280; font-size: 14px; line-height: 1.5;">
        <p style="margin: 0;">感谢您使用双拼练习大师！</p>
        <p style="margin: 8px 0 0 0;">希望这个应用能帮助您更好地学习双拼输入法。</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="this.closest('.about-modal').remove(); document.body.style.overflow = ''" 
                style="background: #3b82f6; color: white; padding: 8px 24px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer;">
          确定
        </button>
      </div>
    </div>
  `
  
  // 创建模态框背景
  const modal = document.createElement('div')
  modal.className = 'about-modal'
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);
  `
  
  modal.innerHTML = aboutContent
  
  // 点击背景关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
      document.body.style.overflow = ''
    }
  })
  
  // 添加到页面并阻止滚动
  document.body.appendChild(modal)
  document.body.style.overflow = 'hidden'
}

// 响应式检测
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// 点击外部关闭菜单
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    closeUserMenu()
  }
}

// 生命周期
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.header {
  @apply fixed top-0 left-0 right-0 z-50;
  @apply bg-white/80 backdrop-blur-md border-b border-gray-200;
  @apply transition-all duration-300;
}

.header--dark {
  @apply bg-gray-900/80 border-gray-700;
}

.header-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  @apply flex items-center justify-between h-16;
}

/* Logo和品牌区域 */
.header-brand {
  @apply flex items-center space-x-4;
}

.brand-logo {
  @apply flex items-center space-x-2;
}

.logo-icon {
  @apply text-2xl;
}

.brand-title {
  @apply text-xl font-bold text-gray-900;
}

.header--dark .brand-title {
  @apply text-white;
}

.brand-info {
  @apply hidden sm:block;
}

.scheme-indicator {
  @apply text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full;
}

.header--dark .scheme-indicator {
  @apply text-gray-300 bg-gray-700;
}

/* 桌面端导航 */
.header-nav {
  @apply hidden md:flex items-center space-x-1;
}

.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg;
  @apply text-sm font-medium text-gray-700 hover:text-gray-900;
  @apply transition-colors duration-200;
}

.nav-link:hover {
  @apply bg-gray-100;
}

.nav-link--active {
  @apply text-blue-600 bg-blue-50;
}

.header--dark .nav-link {
  @apply text-gray-300 hover:text-white;
}

.header--dark .nav-link:hover {
  @apply bg-gray-700;
}

.header--dark .nav-link--active {
  @apply text-blue-400 bg-blue-900/30;
}

.nav-icon {
  @apply text-lg;
}

/* 右侧操作区域 */
.header-actions {
  @apply flex items-center space-x-4;
}

/* 主题选择器 */
.theme-selector {
  @apply flex items-center space-x-2;
}

.theme-button {
  @apply w-8 h-8 rounded-full border-2 border-transparent;
  @apply transition-all duration-200;
  @apply hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.theme-button--active {
  @apply ring-2 ring-blue-500 ring-offset-2;
}

.theme-indicator {
  @apply block w-full h-full rounded-full;
}

/* 用户菜单 */
.user-menu {
  @apply relative;
}

.user-menu-trigger {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg;
  @apply text-sm font-medium text-gray-700 hover:text-gray-900;
  @apply transition-colors duration-200;
}

.user-menu-trigger:hover {
  @apply bg-gray-100;
}

.user-menu-trigger--active {
  @apply bg-gray-100 text-gray-900;
}

.header--dark .user-menu-trigger {
  @apply text-gray-300 hover:text-white;
}

.header--dark .user-menu-trigger:hover,
.header--dark .user-menu-trigger--active {
  @apply bg-gray-700;
}

.user-avatar {
  @apply text-lg;
}

.dropdown-arrow {
  @apply text-xs transition-transform duration-200;
}

.user-menu-trigger--active .dropdown-arrow {
  @apply rotate-180;
}

.user-menu-dropdown {
  @apply absolute right-0 top-full mt-2 w-48;
  @apply bg-white rounded-lg shadow-lg border border-gray-200;
  @apply py-2;
}

.header--dark .user-menu-dropdown {
  @apply bg-gray-800 border-gray-700;
}

.menu-item {
  @apply flex items-center space-x-3 px-4 py-2;
  @apply text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100;
  @apply transition-colors duration-200;
}

.header--dark .menu-item {
  @apply text-gray-300 hover:text-white hover:bg-gray-700;
}

.menu-icon {
  @apply text-base;
}

.menu-divider {
  @apply my-2 border-t border-gray-200;
}

.header--dark .menu-divider {
  @apply border-gray-700;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  @apply md:hidden flex flex-col justify-center items-center w-8 h-8;
  @apply space-y-1 focus:outline-none;
}

.hamburger-line {
  @apply w-6 h-0.5 bg-gray-600 transition-all duration-300;
}

.header--dark .hamburger-line {
  @apply bg-gray-300;
}

.mobile-menu-toggle--active .hamburger-line:nth-child(1) {
  @apply rotate-45 translate-y-1.5;
}

.mobile-menu-toggle--active .hamburger-line:nth-child(2) {
  @apply opacity-0;
}

.mobile-menu-toggle--active .hamburger-line:nth-child(3) {
  @apply -rotate-45 -translate-y-1.5;
}

/* 移动端导航菜单 */
.mobile-nav {
  @apply absolute top-full left-0 right-0;
  @apply bg-white border-b border-gray-200;
  @apply md:hidden;
}

.header--dark .mobile-nav {
  @apply bg-gray-900 border-gray-700;
}

.mobile-nav-content {
  @apply max-w-7xl mx-auto px-4 py-6 space-y-6;
}

.mobile-scheme-info {
  @apply flex justify-between items-center;
  @apply bg-gray-50 rounded-lg p-3;
}

.header--dark .mobile-scheme-info {
  @apply bg-gray-800;
}

.mobile-scheme-label {
  @apply text-sm font-medium text-gray-600;
}

.header--dark .mobile-scheme-label {
  @apply text-gray-400;
}

.mobile-scheme-name {
  @apply text-sm font-bold text-gray-900;
}

.header--dark .mobile-scheme-name {
  @apply text-white;
}

.mobile-nav-links {
  @apply space-y-2;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-4 py-3 rounded-lg;
  @apply text-base font-medium text-gray-700 hover:text-gray-900;
  @apply transition-colors duration-200;
}

.mobile-nav-link:hover {
  @apply bg-gray-100;
}

.mobile-nav-link.router-link-active {
  @apply text-blue-600 bg-blue-50;
}

.header--dark .mobile-nav-link {
  @apply text-gray-300 hover:text-white;
}

.header--dark .mobile-nav-link:hover {
  @apply bg-gray-700;
}

.header--dark .mobile-nav-link.router-link-active {
  @apply text-blue-400 bg-blue-900/30;
}

.mobile-nav-icon {
  @apply text-xl;
}

/* 移动端主题选择 */
.mobile-theme-selector {
  @apply space-y-3;
}

.mobile-theme-title {
  @apply text-sm font-medium text-gray-900;
}

.header--dark .mobile-theme-title {
  @apply text-white;
}

.mobile-theme-grid {
  @apply grid grid-cols-5 gap-2;
}

.mobile-theme-option {
  @apply flex flex-col items-center space-y-2 p-2 rounded-lg;
  @apply transition-colors duration-200;
}

.mobile-theme-option:hover {
  @apply bg-gray-100;
}

.mobile-theme-option--active {
  @apply bg-blue-50 ring-2 ring-blue-500;
}

.header--dark .mobile-theme-option:hover {
  @apply bg-gray-700;
}

.header--dark .mobile-theme-option--active {
  @apply bg-blue-900/30 ring-blue-400;
}

.mobile-theme-preview {
  @apply w-8 h-8 rounded-full;
}

.mobile-theme-name {
  @apply text-xs font-medium text-gray-700;
}

.header--dark .mobile-theme-name {
  @apply text-gray-300;
}

/* 动画效果 */
.dropdown-enter-active,
.dropdown-leave-active {
  @apply transition-all duration-200;
}

.dropdown-enter-from,
.dropdown-leave-to {
  @apply opacity-0 transform scale-95 -translate-y-2;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  @apply transition-all duration-300;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  @apply opacity-0 transform -translate-y-4;
}
</style>