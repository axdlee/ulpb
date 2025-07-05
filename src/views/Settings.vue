<!-- Settings 设置页面 - 应用配置管理 -->
<template>
  <div class="settings">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <h1 class="page-title">
            ⚙️ 设置
          </h1>
          <p class="page-subtitle">
            个性化您的学习体验，调整应用配置
          </p>
        </div>
      </div>
    </section>

    <!-- 设置内容 -->
    <section class="settings-content">
      <div class="container">
        <div class="settings-grid">
          
          <!-- 外观设置 -->
          <div class="settings-group">
            <h2 class="group-title">🎨 外观设置</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">主题模式</label>
                <p class="setting-description">选择您喜欢的界面主题</p>
              </div>
              <div class="setting-control">
                <select v-model="appStore.state.currentTheme" @change="handleThemeChange" class="theme-selector">
                  <option value="default">默认主题</option>
                  <option value="dark">暗黑主题</option>
                  <option value="light">明亮主题</option>
                  <option value="warm">暖色主题</option>
                  <option value="cool">冷色主题</option>
                </select>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">动画效果</label>
                <p class="setting-description">启用或禁用界面动画</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.showAnimations"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 学习设置 -->
          <div class="settings-group">
            <h2 class="group-title">📚 学习设置</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">显示拼音</label>
                <p class="setting-description">在练习时显示拼音提示</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.showPinyin"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">显示键盘</label>
                <p class="setting-description">在练习时显示虚拟键盘</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.showKeyboard"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">声音提示</label>
                <p class="setting-description">启用按键和提示音效</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.soundEnabled"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 数据设置 -->
          <div class="settings-group">
            <h2 class="group-title">💾 数据设置</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">自动保存</label>
                <p class="setting-description">自动保存学习进度</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.autoSave"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <label class="setting-label">详细统计</label>
                <p class="setting-description">记录详细的练习统计数据</p>
              </div>
              <div class="setting-control">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    v-model="appStore.state.settings.trackDetailedStats"
                    @change="handleSettingChange"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="settings-actions">
            <button @click="resetSettings" class="btn btn-outline">
              🔄 重置设置
            </button>
            <button @click="exportSettings" class="btn btn-primary">
              📤 导出设置
            </button>
            <button @click="importSettings" class="btn btn-secondary">
              📥 导入设置
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

// Store
const appStore = useAppStore()

// 响应式数据
const isLoading = ref(false)

// 方法
const handleThemeChange = () => {
  appStore.changeTheme(appStore.state.currentTheme)
  appStore.addNotification({
    type: 'success',
    message: '主题已更换'
  })
}

const handleSettingChange = () => {
  appStore.saveSettings()
  appStore.addNotification({
    type: 'info',
    message: '设置已保存'
  })
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置吗？这将恢复到默认配置。')) {
    appStore.resetApp()
  }
}

const exportSettings = () => {
  try {
    const settings = appStore.exportAppData()
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `双拼练习_设置_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    appStore.addNotification({
      type: 'success',
      message: '设置已导出'
    })
  } catch (error) {
    appStore.addNotification({
      type: 'error',
      message: '导出失败：' + error.message
    })
  }
}

const importSettings = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target.result)
        if (appStore.importAppData(settings)) {
          appStore.addNotification({
            type: 'success',
            message: '设置已导入'
          })
        }
      } catch (error) {
        appStore.addNotification({
          type: 'error',
          message: '导入失败：文件格式错误'
        })
      }
    }
    reader.readAsText(file)
  }
  
  input.click()
}

// 生命周期
onMounted(() => {
  // 初始化设置页面
})
</script>

<style scoped>
.settings {
  @apply min-h-screen bg-gray-50;
}

.app--dark .settings {
  @apply bg-gray-900;
}

.page-header {
  @apply py-8 bg-white border-b border-gray-200;
}

.app--dark .page-header {
  @apply bg-gray-800 border-gray-700;
}

.container {
  @apply max-w-4xl mx-auto px-4;
}

.header-content {
  @apply text-center;
}

.page-title {
  @apply text-3xl font-bold text-gray-900 mb-2;
}

.app--dark .page-title {
  @apply text-gray-100;
}

.page-subtitle {
  @apply text-lg text-gray-600;
}

.app--dark .page-subtitle {
  @apply text-gray-400;
}

.settings-content {
  @apply py-8;
}

.settings-grid {
  @apply space-y-8;
}

.settings-group {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6;
}

.app--dark .settings-group {
  @apply bg-gray-800 border-gray-700;
}

.group-title {
  @apply text-xl font-semibold text-gray-900 mb-4;
}

.app--dark .group-title {
  @apply text-gray-100;
}

.setting-item {
  @apply flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0;
}

.app--dark .setting-item {
  @apply border-gray-700;
}

.setting-info {
  @apply flex-1;
}

.setting-label {
  @apply block text-sm font-medium text-gray-900 mb-1;
}

.app--dark .setting-label {
  @apply text-gray-100;
}

.setting-description {
  @apply text-sm text-gray-500;
}

.app--dark .setting-description {
  @apply text-gray-400;
}

.setting-control {
  @apply ml-4;
}

.theme-selector {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.app--dark .theme-selector {
  @apply bg-gray-700 border-gray-600 text-gray-100;
}

.toggle-switch {
  @apply relative inline-block w-12 h-6;
}

.toggle-switch input {
  @apply opacity-0 w-0 h-0;
}

.toggle-slider {
  @apply absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition-all duration-300;
}

.toggle-slider:before {
  @apply absolute content-[''] h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-all duration-300;
}

.toggle-switch input:checked + .toggle-slider {
  @apply bg-blue-500;
}

.toggle-switch input:checked + .toggle-slider:before {
  @apply transform translate-x-6;
}

.settings-actions {
  @apply flex gap-4 justify-center pt-6;
}

.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}

.btn-outline {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50;
}

.app--dark .btn-outline {
  @apply border-gray-600 text-gray-300 hover:bg-gray-700;
}
</style>