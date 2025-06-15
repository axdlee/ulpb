import { createRouter, createWebHistory } from 'vue-router'
import Learning from '../views/Learning.vue'
import Practice from '../views/Practice.vue'
import Game from '../views/Game.vue'
import Stats from '../views/Stats.vue'

const routes = [
  {
    path: '/',
    name: 'Learning',
    component: Learning
  },
  {
    path: '/practice',
    name: 'Practice',
    component: Practice
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 