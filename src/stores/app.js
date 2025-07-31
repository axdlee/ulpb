/**
 * 主应用状态管理
 * 管理全局应用状态、主题、用户设置等
 */

import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { storageManager } from '../utils/storage.js'

export const useAppStore = defineStore('app', () => {
  // 应用状态
  const state = reactive({
    // 应用信息
    version: '2.0.0',
    name: '双拼学习大师',

    // 主题设置
    currentTheme: 'default',
    themes: {
      default: {
        name: '默认主题',
        colors: {
          primary: 'blue',
          secondary: 'indigo',
          accent: 'purple'
        }
      },
      dark: {
        name: '暗黑主题',
        colors: {
          primary: 'blue',
          secondary: 'indigo',
          accent: 'purple'
        }
      },
      light: {
        name: '明亮主题',
        colors: {
          primary: 'sky',
          secondary: 'cyan',
          accent: 'teal'
        }
      },
      warm: {
        name: '暖色主题',
        colors: {
          primary: 'orange',
          secondary: 'amber',
          accent: 'yellow'
        }
      },
      cool: {
        name: '冷色主题',
        colors: {
          primary: 'emerald',
          secondary: 'teal',
          accent: 'cyan'
        }
      }
    },

    // 用户设置
    settings: {
      // 界面设置
      language: 'zh-CN',
      autoSave: true,
      showAnimations: true,
      showNotifications: true,

      // 练习设置
      soundEnabled: true,
      showPinyin: true,
      showHint: true,
      showKeyboard: true,

      // 难度设置
      difficulty: 'adaptive',
      practiceMode: 'guided',

      // 统计设置
      trackDetailedStats: true,
      shareAnonymousData: false,

      // 隐私设置
      rememberProgress: true,
      cloudSync: false
    },

    // 应用状态
    isLoading: false,
    isOnline: navigator.onLine,
    lastSyncTime: null,

    // 错误状态
    errors: [],

    // 通知状态
    notifications: [],

    // 调试模式
    debugMode: false
  })

  // 计算属性
  const currentThemeConfig = computed(() => {
    return state.themes[state.currentTheme] || state.themes.default
  })

  const isDarkMode = computed(() => {
    return (
      state.currentTheme === 'dark' ||
      (state.currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  })

  const isProductionMode = computed(() => {
    return import.meta.env.MODE === 'production'
  })

  // 动作方法
  const changeTheme = themeName => {
    if (state.themes[themeName]) {
      state.currentTheme = themeName
      applyTheme(themeName)
      saveSettings()
    }
  }

  const applyTheme = themeName => {
    const theme = state.themes[themeName]
    if (!theme) return

    // 应用CSS变量
    const root = document.documentElement
    root.setAttribute('data-theme', themeName)

    // 应用主题色
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, `var(--${value}-500)`)
    })

    // 触发主题变化事件
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeName } }))
  }

  const updateSettings = newSettings => {
    Object.assign(state.settings, newSettings)
    saveSettings()
  }

  const updateSetting = (key, value) => {
    state.settings[key] = value
    saveSettings()
  }

  const saveSettings = () => {
    const dataToSave = {
      currentTheme: state.currentTheme,
      settings: state.settings,
      version: state.version
    }
    storageManager.setData('appSettings', dataToSave)
  }

  const loadSettings = () => {
    const savedData = storageManager.getData('appSettings', {})

    if (savedData.currentTheme) {
      state.currentTheme = savedData.currentTheme
    }

    if (savedData.settings) {
      Object.assign(state.settings, savedData.settings)
    }

    // 应用已保存的主题
    applyTheme(state.currentTheme)
  }

  const setLoading = loading => {
    state.isLoading = loading
  }

  const addError = error => {
    const errorObj = {
      id: Date.now(),
      message: error.message || error,
      timestamp: Date.now(),
      type: error.type || 'error',
      stack: error.stack
    }

    state.errors.unshift(errorObj)

    // 只保留最近20个错误
    if (state.errors.length > 20) {
      state.errors = state.errors.slice(0, 20)
    }

    // 如果开启通知，显示错误通知
    if (state.settings.showNotifications) {
      addNotification({
        type: 'error',
        title: '发生错误',
        message: errorObj.message,
        duration: 5000
      })
    }
  }

  const clearErrors = () => {
    state.errors = []
  }

  const addNotification = notification => {
    const notificationObj = {
      id: Date.now(),
      type: notification.type || 'info',
      title: notification.title || '',
      message: notification.message || '',
      duration: notification.duration || 3000,
      timestamp: Date.now(),
      persistent: notification.persistent || false
    }

    state.notifications.unshift(notificationObj)

    // 自动移除非持久通知
    if (!notificationObj.persistent && notificationObj.duration > 0) {
      setTimeout(() => {
        removeNotification(notificationObj.id)
      }, notificationObj.duration)
    }

    // 只保留最近10个通知
    if (state.notifications.length > 10) {
      state.notifications = state.notifications.slice(0, 10)
    }
  }

  const removeNotification = id => {
    const index = state.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      state.notifications.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    state.notifications = []
  }

  const updateOnlineStatus = () => {
    state.isOnline = navigator.onLine
  }

  const enableDebugMode = () => {
    state.debugMode = true
    console.log('调试模式已启用')
  }

  const disableDebugMode = () => {
    state.debugMode = false
    console.log('调试模式已禁用')
  }

  const exportAppData = () => {
    return {
      settings: state.settings,
      theme: state.currentTheme,
      version: state.version,
      exportTime: Date.now()
    }
  }

  const importAppData = data => {
    try {
      if (data.settings) {
        updateSettings(data.settings)
      }

      if (data.theme) {
        changeTheme(data.theme)
      }

      addNotification({
        type: 'success',
        title: '导入成功',
        message: '应用设置已成功导入'
      })

      return true
    } catch (error) {
      addError(error)
      return false
    }
  }

  const resetApp = () => {
    // 重置所有设置到默认值
    state.currentTheme = 'default'
    state.settings = {
      language: 'zh-CN',
      autoSave: true,
      showAnimations: true,
      showNotifications: true,
      soundEnabled: true,
      showPinyin: true,
      showHint: true,
      showKeyboard: true,
      difficulty: 'adaptive',
      practiceMode: 'guided',
      trackDetailedStats: true,
      shareAnonymousData: false,
      rememberProgress: true,
      cloudSync: false
    }

    // 清除所有状态
    state.errors = []
    state.notifications = []

    // 保存重置后的设置
    saveSettings()

    // 应用默认主题
    applyTheme('default')

    addNotification({
      type: 'info',
      title: '重置完成',
      message: '应用已重置到默认设置'
    })
  }

  // 初始化
  const init = () => {
    loadSettings()

    // 监听在线状态变化
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // 监听系统主题变化
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', e => {
        if (state.currentTheme === 'auto') {
          applyTheme('auto')
        }
      })
    }

    // 全局错误处理
    window.addEventListener('error', event => {
      addError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript'
      })
    })

    window.addEventListener('unhandledrejection', event => {
      addError({
        message: event.reason?.message || 'Promise rejection',
        type: 'promise'
      })
    })
  }

  return {
    // 状态
    state,

    // 计算属性
    currentThemeConfig,
    isDarkMode,
    isProductionMode,

    // 方法
    changeTheme,
    updateSettings,
    updateSetting,
    saveSettings,
    loadSettings,
    setLoading,
    addError,
    clearErrors,
    addNotification,
    removeNotification,
    clearNotifications,
    updateOnlineStatus,
    enableDebugMode,
    disableDebugMode,
    exportAppData,
    importAppData,
    resetApp,
    init
  }
})
