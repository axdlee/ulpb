<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    {
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900': store.currentTheme === 'default',
      'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white': store.currentTheme === 'dark',
      'bg-gradient-to-br from-sky-50 via-cyan-50 to-teal-50 text-gray-900': store.currentTheme === 'light',
      'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 text-gray-900': store.currentTheme === 'warm',
      'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-gray-900': store.currentTheme === 'cool'
    }
  ]">
    <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" :class="{
      'bg-white/70 border-gray-200': store.currentTheme !== 'dark',
      'bg-gray-900/70 border-gray-700': store.currentTheme === 'dark'
    }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold" :class="{
              'text-gray-900': store.currentTheme !== 'dark',
              'text-white': store.currentTheme === 'dark'
            }">双拼练习</h1>
          </div>

          <div class="flex items-center space-x-4">
            <router-link
              v-for="(route, index) in routes"
              :key="index"
              :to="route.path"
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{
                'text-gray-900 hover:bg-gray-100': store.currentTheme !== 'dark',
                'text-gray-300 hover:bg-gray-700 hover:text-white': store.currentTheme === 'dark'
              }"
            >
              {{ route.name }}
            </router-link>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <button
                v-for="(theme, name) in store.themes"
                :key="name"
                class="w-8 h-8 rounded-full border-2 transition-all"
                :class="{
                  'border-blue-500 ring-2 ring-blue-500 ring-offset-2': store.currentTheme === name,
                  'border-transparent hover:border-gray-300': store.currentTheme !== name,
                  'bg-gradient-to-br from-blue-500 to-purple-500': name === 'default',
                  'bg-gradient-to-br from-gray-900 to-gray-700': name === 'dark',
                  'bg-gradient-to-br from-sky-500 to-teal-500': name === 'light',
                  'bg-gradient-to-br from-orange-500 to-yellow-500': name === 'warm',
                  'bg-gradient-to-br from-emerald-500 to-cyan-500': name === 'cool'
                }"
                @click="store.changeTheme(name)"
                :title="theme.name"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="pt-16">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useShuangpinStore } from './stores/shuangpin'

const router = useRouter()
const store = useShuangpinStore()

const routes = [
  { path: '/', name: '键位学习' },
  { path: '/practice', name: '打字练习' },
  { path: '/game', name: '趣味游戏' },
  { path: '/stats', name: '学习统计' }
]
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 主题相关的全局样式 */
:root {
  --primary-color: theme('colors.blue.500');
  --secondary-color: theme('colors.indigo.500');
  --accent-color: theme('colors.purple.500');
}

[data-theme='dark'] {
  --primary-color: theme('colors.blue.400');
  --secondary-color: theme('colors.indigo.400');
  --accent-color: theme('colors.purple.400');
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-color);
}
</style> 