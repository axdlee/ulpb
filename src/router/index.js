import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import KeyboardLearning from '../views/KeyboardLearning.vue'
import Practice from '../views/Practice.vue'
import Stats from '../views/Stats.vue'
import Review from '../views/Review.vue'
import Achievements from '../views/Achievements.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/learning/:lessonId?',
      name: 'learning',
      component: KeyboardLearning
    },
    {
      path: '/practice/:lessonId',
      name: 'practice',
      component: Practice
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats
    },
    {
      path: '/review',
      name: 'review',
      component: Review
    },
    {
      path: '/achievements',
      name: 'achievements',
      component: Achievements
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: Analytics
    }
  ]
})

export default router 