<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo 和标题 -->
      <div class="header-brand">
        <router-link to="/" class="brand-link">
          <div class="brand-logo">⌨️</div>
          <div class="brand-text">
            <h1 class="brand-title">双拼练习</h1>
            <p class="brand-subtitle">学习双拼输入法</p>
          </div>
        </router-link>
      </div>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <div class="nav-links">
          <router-link
            v-for="route in navigationRoutes"
            :key="route.name"
            :to="route.path"
            class="nav-link"
            :class="{ 'nav-link--active': $route.name === route.name }"
          >
            <span class="nav-icon">{{ route.meta.icon }}</span>
            <span class="nav-text">{{ route.meta.title }}</span>
          </router-link>
        </div>
      </nav>

      <!-- 用户操作区 -->
      <div class="header-actions">
        <!-- 双拼方案选择器 -->
        <div class="scheme-selector">
          <select
            v-model="currentScheme"
            @change="handleSchemeChange"
            class="scheme-select"
          >
            <option
              v-for="scheme in availableSchemes"
              :key="scheme.key"
              :value="scheme.key"
            >
              {{ scheme.name }}
            </option>
          </select>
        </div>

        <!-- 主题切换 -->
        <div class="theme-selector">
          <Button
            variant="ghost"
            size="sm"
            @click="toggleThemeMenu"
            class="theme-button"
          >
            <span class="theme-icon">{{ getThemeIcon() }}</span>
          </Button>
          
          <transition name="dropdown">
            <div v-if="showThemeMenu" class="theme-dropdown">
              <div
                v-for="(theme, key) in availableThemes"
                :key="key"
                class="theme-option"
                :class="{ 'theme-option--active': currentTheme === key }"
                @click="changeTheme(key)"
              >
                <span class="theme-option-icon">{{ getThemeIcon(key) }}</span>
                <span class="theme-option-name">{{ theme.name }}</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- 设置按钮 -->
        <Button
          variant="ghost"
          size="sm"
          @click="openSettings"
          class="settings-button"
        >
          <span class="settings-icon">⚙️</span>
        </Button>

        <!-- 移动端菜单按钮 -->
        <Button
          variant="ghost"
          size="sm"
          @click="toggleMobileMenu"
          class="mobile-menu-button md:hidden"
        >
          <span class="menu-icon">{{ showMobileMenu ? '✕' : '☰' }}</span>
        </Button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <transition name="mobile-menu">
      <div v-if="showMobileMenu" class="mobile-nav">
        <div class="mobile-nav-content">
          <router-link
            v-for="route in navigationRoutes"
            :key="route.name"
            :to="route.path"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link--active': $route.name === route.name }"
            @click="closeMobileMenu"
          >
            <span class="mobile-nav-icon">{{ route.meta.icon }}</span>
            <span class="mobile-nav-text">{{ route.meta.title }}</span>
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useShuangpinStore } from '@/stores/shuangpin'
import Button from '@/components/base/Button/index.vue'

// Stores
const appStore = useAppStore()
const shuangpinStore = useShuangpinStore()
const router = useRouter()

// 响应式状态
const showThemeMenu = ref(false)
const showMobileMenu = ref(false)

// 计算属性
const navigationRoutes = computed(() => [
  { name: 'dashboard', path: '/', meta: { title: '控制台', icon: '📊' } },
  { name: 'learning', path: '/learning', meta: { title: '键位学习', icon: '⌨️' } },
  { name: 'practice', path: '/practice', meta: { title: '打字练习', icon: '✍️' } },
  { name: 'game', path: '/game', meta: { title: '趣味游戏', icon: '🎮' } },
  { name: 'stats', path: '/stats', meta: { title: '学习统计', icon: '📈' } },
  { name: 'analytics', path: '/analytics', meta: { title: '数据分析', icon: '🔍' } },
  { name: 'achievements', path: '/achievements', meta: { title: '成就系统', icon: '🏆' } }
])

const currentScheme = computed({
  get: () => shuangpinStore.currentSchemeKey,
  set: (value) => shuangpinStore.changeScheme(value)
})

const availableSchemes = computed(() => shuangpinStore.availableSchemes)

const currentTheme = computed(() => appStore.state.currentTheme)

const availableThemes = computed(() => appStore.state.themes)

// 方法
const handleSchemeChange = () => {
  appStore.addNotification({
    type: 'success',
    message: `已切换到${shuangpinStore.currentScheme.name}`,
    duration: 2000
  })
}

const toggleThemeMenu = () => {
  showThemeMenu.value = !showThemeMenu.value
}

const changeTheme = (themeKey) => {
  appStore.changeTheme(themeKey)
  showThemeMenu.value = false
  
  appStore.addNotification({
    type: 'success',
    message: `已切换到${availableThemes.value[themeKey].name}`,
    duration: 2000
  })
}

const getThemeIcon = (theme = null) => {
  const themeIcons = {
    default: '🌟',
    dark: '🌙',
    light: '☀️',
    warm: '🔥',
    cool: '❄️'
  }
  return themeIcons[theme || currentTheme.value] || '🌟'
}

const openSettings = () => {
  router.push('/settings')
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleClickOutside = (event) => {
  if (showThemeMenu.value && !event.target.closest('.theme-selector')) {
    showThemeMenu.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-header {
  @apply fixed top-0 left-0 right-0 z-50;
  @apply bg-white border-b border-gray-200 shadow-sm;
}

.header-container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  @apply flex items-center justify-between h-16;
}

/* 品牌区域 */
.header-brand {
  @apply flex-shrink-0;
}

.brand-link {
  @apply flex items-center space-x-3 text-decoration-none;
}

.brand-logo {
  @apply text-2xl;
}

.brand-text {
  @apply hidden sm:block;
}

.brand-title {
  @apply text-lg font-bold text-gray-900 leading-tight;
}

.brand-subtitle {
  @apply text-xs text-gray-600 leading-tight;
}

/* 导航区域 */
.header-nav {
  @apply hidden md:block flex-1 mx-8;
}

.nav-links {
  @apply flex items-center justify-center space-x-1;
}

.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg;
  @apply text-sm font-medium text-gray-600 hover:text-gray-900;
  @apply hover:bg-gray-100 transition-all duration-200;
  @apply text-decoration-none;
}

.nav-link--active {
  @apply text-blue-600 bg-blue-50;
}

.nav-icon {
  @apply text-base;
}

.nav-text {
  @apply hidden lg:inline;
}

/* 操作区域 */
.header-actions {
  @apply flex items-center space-x-3;
}

.scheme-selector {
  @apply hidden sm:block;
}

.scheme-select {
  @apply px-3 py-1.5 text-sm border border-gray-300 rounded-lg;
  @apply bg-white text-gray-900 focus:ring-2 focus:ring-blue-500;
}

.theme-selector {
  @apply relative;
}

.theme-button {
  @apply p-2;
}

.theme-icon {
  @apply text-lg;
}

.theme-dropdown {
  @apply absolute top-full right-0 mt-2 w-48;
  @apply bg-white border border-gray-200 rounded-lg shadow-lg;
  @apply py-2 z-50;
}

.theme-option {
  @apply flex items-center space-x-3 px-4 py-2;
  @apply text-sm text-gray-700 hover:bg-gray-100;
  @apply cursor-pointer transition-colors;
}

.theme-option--active {
  @apply bg-blue-50 text-blue-600;
}

.theme-option-icon {
  @apply text-base;
}

.theme-option-name {
  @apply font-medium;
}

.settings-button {
  @apply p-2;
}

.settings-icon {
  @apply text-lg;
}

.mobile-menu-button {
  @apply p-2;
}

.menu-icon {
  @apply text-lg;
}

/* 移动端导航 */
.mobile-nav {
  @apply md:hidden bg-white border-t border-gray-200;
}

.mobile-nav-content {
  @apply px-4 py-2 space-y-1;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-3 py-3 rounded-lg;
  @apply text-base font-medium text-gray-600 hover:text-gray-900;
  @apply hover:bg-gray-100 transition-all duration-200;
  @apply text-decoration-none;
}

.mobile-nav-link--active {
  @apply text-blue-600 bg-blue-50;
}

.mobile-nav-icon {
  @apply text-xl;
}

.mobile-nav-text {
  @apply flex-1;
}

/* 动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  @apply transition-all duration-200;
}

.dropdown-enter-from,
.dropdown-leave-to {
  @apply opacity-0 transform scale-95;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  @apply transition-all duration-300;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  @apply opacity-0 transform -translate-y-2;
}

/* 暗色主题 */
[data-theme='dark'] .app-header {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .brand-title {
  @apply text-gray-100;
}

[data-theme='dark'] .brand-subtitle {
  @apply text-gray-300;
}

[data-theme='dark'] .nav-link {
  @apply text-gray-300 hover:text-gray-100 hover:bg-gray-800;
}

[data-theme='dark'] .nav-link--active {
  @apply text-blue-400 bg-blue-900;
}

[data-theme='dark'] .scheme-select {
  @apply bg-gray-800 border-gray-600 text-gray-100;
}

[data-theme='dark'] .theme-dropdown {
  @apply bg-gray-800 border-gray-600;
}

[data-theme='dark'] .theme-option {
  @apply text-gray-300 hover:bg-gray-700;
}

[data-theme='dark'] .theme-option--active {
  @apply bg-blue-900 text-blue-400;
}

[data-theme='dark'] .mobile-nav {
  @apply bg-gray-900 border-gray-700;
}

[data-theme='dark'] .mobile-nav-link {
  @apply text-gray-300 hover:text-gray-100 hover:bg-gray-800;
}

[data-theme='dark'] .mobile-nav-link--active {
  @apply text-blue-400 bg-blue-900;
}
</style>