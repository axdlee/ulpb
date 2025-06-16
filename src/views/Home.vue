<!-- Home.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- 欢迎区域 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">双拼练习</h1>
        <p class="text-lg text-gray-600">通过科学的学习方法，快速掌握双拼输入法</p>
      </div>

      <!-- 学习路径 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div 
          v-for="stage in learningStages" 
          :key="stage.id"
          class="bg-white rounded-lg shadow-sm p-6"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component 
                :is="stage.icon" 
                class="h-8 w-8"
                :class="stage.iconClass"
              />
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ stage.title }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ stage.description }}</p>
              <div class="mt-4">
                <router-link
                  :to="stage.link"
                  class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  开始学习
                  <svg class="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习进度 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">最近学习</h2>
        <div class="space-y-4">
          <div 
            v-for="lesson in recentLessons" 
            :key="lesson.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ lesson.title }}</h4>
              <p class="text-sm text-gray-500">{{ lesson.lastPracticed }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ lesson.accuracy }}%
                </div>
                <div class="text-xs text-gray-500">正确率</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ lesson.speed }}字/分
                </div>
                <div class="text-xs text-gray-500">速度</div>
              </div>
              <router-link
                :to="{ name: 'practice', params: { lessonId: lesson.id }}"
                class="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                继续练习
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShuangpinStore } from '../stores/shuangpin'

const store = useShuangpinStore()

// 学习阶段数据
const learningStages = ref([
  {
    id: 1,
    title: '键位学习',
    description: '通过科学的分组学习方法，快速掌握双拼键位',
    icon: 'KeyboardIcon',
    iconClass: 'text-blue-500',
    link: '/learning'
  },
  {
    id: 2,
    title: '单字练习',
    description: '巩固键位记忆，提高输入准确度',
    icon: 'DocumentTextIcon',
    iconClass: 'text-green-500',
    link: '/practice/1'
  },
  {
    id: 3,
    title: '词组练习',
    description: '通过常用词组练习，提升实际输入速度',
    icon: 'DocumentDuplicateIcon',
    iconClass: 'text-yellow-500',
    link: '/practice/2'
  },
  {
    id: 4,
    title: '成绩统计',
    description: '查看练习数据，分析提升空间',
    icon: 'ChartBarIcon',
    iconClass: 'text-purple-500',
    link: '/stats'
  }
])

// 最近练习数据
const recentLessons = ref([
  {
    id: 1,
    title: '声母键位练习 - b、p、m、f',
    lastPracticed: '今天 14:30',
    accuracy: 95,
    speed: 30
  },
  {
    id: 2,
    title: '韵母键位练习 - a、o、e、i',
    lastPracticed: '昨天 16:20',
    accuracy: 88,
    speed: 25
  }
])

// 图标组件
const KeyboardIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  `
}

const DocumentTextIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const DocumentDuplicateIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    </svg>
  `
}

const ChartBarIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  `
}
</script> 