import { useShuangpinStore } from '../stores/shuangpin'

// 主题管理工具
export class ThemeManager {
  constructor() {
    this.store = useShuangpinStore()
    this.init()
  }

  // 初始化主题
  init() {
    // 从localStorage加载主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && this.store.themes[savedTheme]) {
      this.store.changeTheme(savedTheme)
    }
    
    // 应用主题
    this.applyTheme()
    
    // 监听系统主题变化
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.store.currentTheme === 'auto') {
          this.applyTheme()
        }
      })
    }
  }

  // 应用主题
  applyTheme() {
    const theme = this.getCurrentTheme()
    const root = document.documentElement
    
    // 设置CSS变量
    root.style.setProperty('--primary-color', this.getColorValue(theme.colors.primary))
    root.style.setProperty('--secondary-color', this.getColorValue(theme.colors.secondary))
    root.style.setProperty('--accent-color', this.getColorValue(theme.colors.accent))
    root.style.setProperty('--background-color', this.getColorValue(theme.colors.background))
    root.style.setProperty('--text-color', this.getColorValue(theme.colors.text))
    
    // 设置暗色模式
    if (theme.name === '暗黑主题' || this.isSystemDark()) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  // 获取当前主题
  getCurrentTheme() {
    if (this.store.currentTheme === 'auto') {
      return this.isSystemDark() ? this.store.themes.dark : this.store.themes.light
    }
    return this.store.themes[this.store.currentTheme]
  }

  // 检查系统是否是暗色模式
  isSystemDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 获取颜色值
  getColorValue(color) {
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

  // 切换主题
  changeTheme(themeName) {
    this.store.changeTheme(themeName)
    this.applyTheme()
    localStorage.setItem('theme', themeName)
  }

  // 获取所有主题
  getThemes() {
    return Object.entries(this.store.themes).map(([key, theme]) => ({
      value: key,
      ...theme
    }))
  }

  // 创建自定义主题
  createCustomTheme(name, colors) {
    const customTheme = {
      name,
      colors,
      isCustom: true
    }
    
    this.store.themes[`custom-${Date.now()}`] = customTheme
    return customTheme
  }

  // 删除自定义主题
  deleteCustomTheme(themeKey) {
    if (this.store.themes[themeKey] && this.store.themes[themeKey].isCustom) {
      delete this.store.themes[themeKey]
      
      // 如果删除的是当前主题，切换到默认主题
      if (this.store.currentTheme === themeKey) {
        this.changeTheme('default')
      }
    }
  }

  // 导出主题
  exportTheme(themeKey) {
    const theme = this.store.themes[themeKey]
    if (theme) {
      return JSON.stringify({
        name: theme.name,
        colors: theme.colors,
        exportDate: new Date().toISOString()
      }, null, 2)
    }
    return null
  }

  // 导入主题
  importTheme(themeData) {
    try {
      const theme = JSON.parse(themeData)
      if (theme.name && theme.colors) {
        const themeKey = `imported-${Date.now()}`
        this.store.themes[themeKey] = {
          name: theme.name,
          colors: theme.colors,
          isCustom: true,
          isImported: true
        }
        return { success: true, themeKey }
      }
      return { success: false, error: '主题格式不正确' }
    } catch (error) {
      return { success: false, error: '主题数据解析失败' }
    }
  }
}

// 创建主题管理器实例
export const themeManager = new ThemeManager()

// 主题切换组件辅助函数
export function useTheme() {
  const store = useShuangpinStore()
  
  return {
    currentTheme: store.currentTheme,
    themes: store.themes,
    changeTheme: (theme) => themeManager.changeTheme(theme),
    getCurrentTheme: () => themeManager.getCurrentTheme(),
    applyTheme: () => themeManager.applyTheme()
  }
}

// 主题预设
export const THEME_PRESETS = {
  productivity: {
    name: '高效工作',
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  relaxed: {
    name: '休闲舒适',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#faf5ff',
      text: '#581c87'
    }
  },
  focus: {
    name: '专注模式',
    colors: {
      primary: '#1f2937',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#f3f4f6',
      text: '#111827'
    }
  },
  vibrant: {
    name: '活力四射',
    colors: {
      primary: '#ef4444',
      secondary: '#f97316',
      accent: '#f59e0b',
      background: '#fef2f2',
      text: '#991b1b'
    }
  }
}