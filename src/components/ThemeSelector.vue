<!-- ThemeSelector.vue -->
<template>
  <div class="theme-selector">
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2"> 选择主题 </label>
      <select
        v-model="selectedTheme"
        @change="handleThemeChange"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="auto">跟随系统</option>
        <option v-for="theme in themes" :key="theme.value" :value="theme.value">
          {{ theme.name }}
        </option>
      </select>
    </div>

    <!-- 主题预览 -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div
        v-for="theme in themes"
        :key="theme.value"
        class="theme-preview p-3 rounded-lg border-2 cursor-pointer transition-all"
        :class="{
          'border-blue-500 ring-2 ring-blue-200': selectedTheme === theme.value,
          'border-gray-200 hover:border-gray-300': selectedTheme !== theme.value
        }"
        @click="selectTheme(theme.value)"
      >
        <div class="flex items-center space-x-2 mb-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: getColorValue(theme.colors.primary) }"
          ></div>
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: getColorValue(theme.colors.secondary) }"
          ></div>
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: getColorValue(theme.colors.accent) }"
          ></div>
        </div>
        <div class="text-sm font-medium text-gray-900">{{ theme.name }}</div>
        <div class="text-xs text-gray-500">{{ theme.description || '预设主题' }}</div>
      </div>
    </div>

    <!-- 自定义主题 -->
    <div v-if="showCustomTheme" class="custom-theme-editor border-t pt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-3">自定义主题</h3>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-500 mb-1">主题名称</label>
          <input
            v-model="customTheme.name"
            type="text"
            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="输入主题名称"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">主色调</label>
            <input
              v-model="customTheme.colors.primary"
              type="color"
              class="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">次要色</label>
            <input
              v-model="customTheme.colors.secondary"
              type="color"
              class="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">强调色</label>
            <input
              v-model="customTheme.colors.accent"
              type="color"
              class="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">背景色</label>
            <input
              v-model="customTheme.colors.background"
              type="color"
              class="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            @click="saveCustomTheme"
            class="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            保存主题
          </button>
          <button
            @click="resetCustomTheme"
            class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-between items-center pt-4 border-t">
      <button @click="toggleCustomTheme" class="text-sm text-blue-600 hover:text-blue-700">
        {{ showCustomTheme ? '收起' : '自定义主题' }}
      </button>

      <div class="flex space-x-2">
        <button @click="exportTheme" class="text-sm text-gray-600 hover:text-gray-700">导出</button>
        <button @click="importTheme" class="text-sm text-gray-600 hover:text-gray-700">导入</button>
      </div>
    </div>

    <!-- 导入主题弹窗 -->
    <div
      v-if="showImportDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium mb-4">导入主题</h3>
        <textarea
          v-model="importData"
          class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="粘贴主题数据..."
        ></textarea>
        <div class="flex justify-end space-x-3 mt-4">
          <button @click="cancelImport" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-700">
            取消
          </button>
          <button
            @click="confirmImport"
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            导入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAppStore } from '../stores/app'

  const appStore = useAppStore()

  // 组件状态
  const selectedTheme = ref(appStore.state.currentTheme)
  const showCustomTheme = ref(false)
  const showImportDialog = ref(false)
  const importData = ref('')

  // 自定义主题数据
  const customTheme = ref({
    name: '',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#111827'
    }
  })

  // 计算属性
  const themes = computed(() => {
    return Object.entries(appStore.state.themes).map(([key, theme]) => ({
      value: key,
      ...theme
    }))
  })

  // 方法
  const handleThemeChange = () => {
    appStore.changeTheme(selectedTheme.value)
  }

  const selectTheme = themeValue => {
    selectedTheme.value = themeValue
    handleThemeChange()
  }

  const getColorValue = color => {
    const colorMap = {
      blue: '#3b82f6',
      indigo: '#6366f1',
      purple: '#8b5cf6',
      gray: '#6b7280',
      white: '#ffffff',
      sky: '#0ea5e9',
      cyan: '#06b6d4',
      teal: '#14b8a6',
      orange: '#f97316',
      amber: '#f59e0b',
      yellow: '#eab308',
      emerald: '#10b981'
    }
    return colorMap[color] || color
  }

  const toggleCustomTheme = () => {
    showCustomTheme.value = !showCustomTheme.value
  }

  const saveCustomTheme = () => {
    if (customTheme.value.name.trim()) {
      // 创建自定义主题
      const themeKey = `custom_${Date.now()}`
      appStore.state.themes[themeKey] = {
        name: customTheme.value.name,
        colors: customTheme.value.colors,
        isCustom: true
      }
      // 自动切换到新创建的主题
      selectTheme(themeKey)
      resetCustomTheme()
      appStore.saveSettings()
    }
  }

  const resetCustomTheme = () => {
    customTheme.value = {
      name: '',
      colors: {
        primary: '#3b82f6',
        secondary: '#6366f1',
        accent: '#8b5cf6',
        background: '#ffffff',
        text: '#111827'
      }
    }
  }

  const exportTheme = () => {
    const theme = appStore.state.themes[selectedTheme.value]
    if (theme) {
      const themeData = JSON.stringify(
        {
          name: theme.name,
          colors: theme.colors,
          exportDate: new Date().toISOString()
        },
        null,
        2
      )

      // 创建下载链接
      const blob = new Blob([themeData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `theme-${selectedTheme.value}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const importTheme = () => {
    showImportDialog.value = true
  }

  const confirmImport = () => {
    try {
      const themeData = JSON.parse(importData.value)
      if (themeData.name && themeData.colors) {
        const themeKey = `imported_${Date.now()}`
        appStore.state.themes[themeKey] = {
          name: themeData.name,
          colors: themeData.colors,
          isCustom: true,
          isImported: true
        }
        appStore.saveSettings()
        // 导入成功，切换到新主题
        selectTheme(themeKey)
        showImportDialog.value = false
        importData.value = ''
        appStore.addNotification({
          type: 'success',
          title: '导入成功',
          message: '主题已成功导入'
        })
      } else {
        appStore.addNotification({
          type: 'error',
          title: '导入失败',
          message: '主题格式不正确'
        })
      }
    } catch (error) {
      appStore.addNotification({
        type: 'error',
        title: '导入失败',
        message: '主题数据解析失败'
      })
    }
  }

  const cancelImport = () => {
    showImportDialog.value = false
    importData.value = ''
  }

  // 生命周期
  onMounted(() => {
    // 初始化主题
    appStore.loadSettings()
  })
</script>

<style scoped>
  .theme-preview {
    min-height: 80px;
  }

  .theme-selector {
    max-width: 400px;
  }
</style>
