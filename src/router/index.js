import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/learning',
    name: 'learning',
    component: () => import('../views/KeyboardLearning.vue')
  },
  {
    path: '/practice/:lessonId',
    name: 'practice',
    component: () => import('../views/Practice.vue')
  },
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../views/Stats.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 