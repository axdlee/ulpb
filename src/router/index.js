import { createRouter, createWebHistory } from 'vue-router'

// 路由组件懒加载
const Dashboard = () => import('../views/Dashboard.vue')
const KeyboardLearning = () => import('../views/KeyboardLearning.vue')
const Practice = () => import('../views/Practice.vue')
const Stats = () => import('../views/Stats.vue')
const Review = () => import('../views/Review.vue')
const Achievements = () => import('../views/Achievements.vue')
const Analytics = () => import('../views/Analytics.vue')
const Game = () => import('../views/Game.vue')
const Settings = () => import('../views/Settings.vue')
const Help = () => import('../views/Help.vue')

// 路由配置
const routes = [
  // 主页 - 仪表板
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      title: '控制台',
      description: '学习概览和快速入口',
      icon: '📊',
      transition: 'fade',
      category: 'main',
      showInNav: true,
      requiresAuth: false
    }
  },

  // 键位学习
  {
    path: '/learning/:lessonId?',
    name: 'learning',
    component: KeyboardLearning,
    meta: {
      title: '键位学习',
      description: '逐步学习双拼键位',
      icon: '⌨️',
      transition: 'slide-left',
      category: 'learning',
      showInNav: true,
      requiresAuth: false
    },
    props: route => ({
      lessonId: route.params.lessonId ? parseInt(route.params.lessonId) : null
    })
  },

  // 打字练习
  {
    path: '/practice/:lessonId?',
    name: 'practice',
    component: Practice,
    meta: {
      title: '打字练习',
      description: '双拼打字练习和测试',
      icon: '✍️',
      transition: 'slide-left',
      category: 'practice',
      showInNav: true,
      requiresAuth: false
    },
    props: route => ({
      lessonId: route.params.lessonId ? parseInt(route.params.lessonId) : null
    })
  },

  // 趣味游戏
  {
    path: '/game/:gameType?',
    name: 'game',
    component: Game,
    meta: {
      title: '趣味游戏',
      description: '游戏化的打字练习',
      icon: '🎮',
      transition: 'slide-up',
      category: 'game',
      showInNav: true,
      requiresAuth: false
    },
    props: route => ({
      gameType: route.params.gameType || 'falling'
    })
  },

  // 学习统计
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
    meta: {
      title: '学习统计',
      description: '练习数据和统计图表',
      icon: '📈',
      transition: 'slide-right',
      category: 'analysis',
      showInNav: true,
      requiresAuth: false
    }
  },

  // 数据分析
  {
    path: '/analytics',
    name: 'analytics',
    component: Analytics,
    meta: {
      title: '数据分析',
      description: '深度学习分析和建议',
      icon: '🔍',
      transition: 'slide-right',
      category: 'analysis',
      showInNav: true,
      requiresAuth: false
    }
  },

  // 成就系统
  {
    path: '/achievements',
    name: 'achievements',
    component: Achievements,
    meta: {
      title: '成就系统',
      description: '学习成就和里程碑',
      icon: '🏆',
      transition: 'slide-up',
      category: 'social',
      showInNav: true,
      requiresAuth: false
    }
  },

  // 复习模式
  {
    path: '/review',
    name: 'review',
    component: Review,
    meta: {
      title: '复习模式',
      description: '复习薄弱键位和错误',
      icon: '📚',
      transition: 'slide-left',
      category: 'learning',
      showInNav: false,
      requiresAuth: false
    }
  },

  // 设置页面
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      title: '设置',
      description: '应用设置和个性化配置',
      icon: '⚙️',
      transition: 'slide-up',
      category: 'system',
      showInNav: false,
      requiresAuth: false
    }
  },

  // 帮助页面
  {
    path: '/help',
    name: 'help',
    component: Help,
    meta: {
      title: '帮助',
      description: '使用指南和常见问题',
      icon: '❓',
      transition: 'fade',
      category: 'system',
      showInNav: false,
      requiresAuth: false
    }
  },

  // 旧路由兼容性重定向
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/practice/:lessonId',
    redirect: to => `/practice/${to.params.lessonId}`
  },
  {
    path: '/learning/:lessonId',
    redirect: to => `/learning/${to.params.lessonId}`
  },

  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      description: '您访问的页面不存在',
      icon: '❌',
      transition: 'fade',
      category: 'system',
      showInNav: false,
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 验证路由参数
  if (to.name === 'learning' && to.params.lessonId) {
    const lessonId = parseInt(to.params.lessonId)
    if (isNaN(lessonId) || lessonId < 1 || lessonId > 15) {
      // 无效的课程ID，重定向到学习主页
      next({ name: 'learning' })
      return
    }
  }

  if (to.name === 'practice' && to.params.lessonId) {
    const lessonId = parseInt(to.params.lessonId)
    if (isNaN(lessonId) || lessonId < 1 || lessonId > 15) {
      // 无效的课程ID，重定向到练习主页
      next({ name: 'practice' })
      return
    }
  }

  if (to.name === 'game' && to.params.gameType) {
    const validGameTypes = ['falling', 'racing', 'puzzle', 'challenge']
    if (!validGameTypes.includes(to.params.gameType)) {
      // 无效的游戏类型，重定向到游戏主页
      next({ name: 'game' })
      return
    }
  }

  // 继续导航
  next()
})

router.afterEach((to, from) => {
  // 更新页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 双拼练习`
  } else {
    document.title = '双拼练习'
  }

  // 更新meta描述
  const descriptionMeta = document.querySelector('meta[name="description"]')
  if (descriptionMeta && to.meta?.description) {
    descriptionMeta.content = to.meta.description
  }

  // 添加页面加载完成的类名用于CSS动画
  setTimeout(() => {
    document.body.classList.add('route-loaded')
  }, 100)
})

// 路由工具函数
export const routeUtils = {
  // 获取导航路由列表
  getNavigationRoutes() {
    return routes.filter(route => route.meta?.showInNav)
  },

  // 按分类获取路由
  getRoutesByCategory(category) {
    return routes.filter(route => route.meta?.category === category)
  },

  // 获取面包屑导航
  getBreadcrumbs(currentRoute) {
    const breadcrumbs = []
    
    // 添加首页
    if (currentRoute.name !== 'dashboard') {
      breadcrumbs.push({
        name: '控制台',
        path: '/',
        icon: '📊'
      })
    }

    // 添加当前页面的上级页面
    const categoryRoutes = {
      learning: { name: '学习中心', path: '/learning', icon: '📚' },
      practice: { name: '练习中心', path: '/practice', icon: '✍️' },
      analysis: { name: '数据中心', path: '/stats', icon: '📊' },
      game: { name: '游戏中心', path: '/game', icon: '🎮' },
      social: { name: '社交中心', path: '/achievements', icon: '👥' }
    }

    const parentCategory = categoryRoutes[currentRoute.meta?.category]
    if (parentCategory && currentRoute.name !== parentCategory.path.slice(1)) {
      breadcrumbs.push(parentCategory)
    }

    // 添加当前页面
    if (currentRoute.meta?.title) {
      breadcrumbs.push({
        name: currentRoute.meta.title,
        path: currentRoute.path,
        icon: currentRoute.meta.icon,
        current: true
      })
    }

    return breadcrumbs
  },

  // 检查路由权限
  hasRoutePermission(route, user = null) {
    if (!route.meta?.requiresAuth) {
      return true
    }
    return user && user.isAuthenticated
  },

  // 获取路由的完整URL
  getFullUrl(routeName, params = {}) {
    const route = router.resolve({ name: routeName, params })
    return window.location.origin + route.href
  },

  // 生成分享链接
  generateShareUrl(routeName, params = {}, query = {}) {
    const route = router.resolve({ name: routeName, params, query })
    return {
      url: window.location.origin + route.href,
      title: route.meta?.title || '双拼练习',
      description: route.meta?.description || '学习双拼输入法的最佳选择'
    }
  }
}

// 路由常量
export const ROUTE_NAMES = {
  DASHBOARD: 'dashboard',
  LEARNING: 'learning',
  PRACTICE: 'practice',
  GAME: 'game',
  STATS: 'stats',
  ANALYTICS: 'analytics',
  ACHIEVEMENTS: 'achievements',
  REVIEW: 'review',
  SETTINGS: 'settings',
  HELP: 'help'
}

// 路由分类
export const ROUTE_CATEGORIES = {
  MAIN: 'main',
  LEARNING: 'learning',
  PRACTICE: 'practice',
  GAME: 'game',
  ANALYSIS: 'analysis',
  SOCIAL: 'social',
  SYSTEM: 'system'
}

export default router