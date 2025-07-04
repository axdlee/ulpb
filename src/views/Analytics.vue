<!-- Analytics.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-medium text-gray-900">学习分析</h1>
        <p class="mt-2 text-gray-600">
          查看您的学习数据和进步趋势
        </p>
      </div>

      <!-- 总体进度 -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">学习进度</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="text-sm text-blue-600">完成课程</div>
            <div class="mt-1 text-2xl font-medium text-blue-900">
              {{ progress.completedLessons }}/15
            </div>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <div class="text-sm text-green-600">练习字数</div>
            <div class="mt-1 text-2xl font-medium text-green-900">
              {{ progress.totalChars }}
            </div>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="text-sm text-purple-600">练习时长</div>
            <div class="mt-1 text-2xl font-medium text-purple-900">
              {{ Math.round(progress.totalTime / 60) }}分钟
            </div>
          </div>
          <div class="p-4 bg-yellow-50 rounded-lg">
            <div class="text-sm text-yellow-600">总体进度</div>
            <div class="mt-1 text-2xl font-medium text-yellow-900">
              {{ progress.estimatedProgress }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图表 -->
      <div class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 速度趋势 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">速度趋势</h3>
          <div class="h-64">
            <canvas ref="speedChart"></canvas>
          </div>
        </div>

        <!-- 正确率趋势 -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">正确率趋势</h3>
          <div class="h-64">
            <canvas ref="accuracyChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 错误分析 -->
      <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">常见错误分析</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">汉字</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">声母</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">韵母</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">错误次数</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="error in errorAnalysis" :key="error.char">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ error.char }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ error.shengmu }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ error.yunmu }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ error.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 学习报告 -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">学习报告</h2>
        
        <!-- 总体统计 -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">总体统计</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">平均速度</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.totalStats.avgSpeed }} 字/分钟
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">平均正确率</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.totalStats.avgAccuracy }}%
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">练习次数</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.totalStats.practices }} 次
              </div>
            </div>
          </div>
        </div>
        
        <!-- 最近进步 -->
        <div class="mb-6">
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">最近7天</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">平均速度</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.recentStats.avgSpeed }} 字/分钟
              </div>
              <div class="mt-1 text-sm" :class="[
                report.recentStats.avgSpeed > report.totalStats.avgSpeed
                  ? 'text-green-600'
                  : 'text-red-600'
              ]">
                {{ report.recentStats.avgSpeed - report.totalStats.avgSpeed > 0 ? '↑' : '↓' }}
                {{ Math.abs(report.recentStats.avgSpeed - report.totalStats.avgSpeed) }} 字/分钟
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">平均正确率</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.recentStats.avgAccuracy }}%
              </div>
              <div class="mt-1 text-sm" :class="[
                report.recentStats.avgAccuracy > report.totalStats.avgAccuracy
                  ? 'text-green-600'
                  : 'text-red-600'
              ]">
                {{ report.recentStats.avgAccuracy - report.totalStats.avgAccuracy > 0 ? '↑' : '↓' }}
                {{ Math.abs(report.recentStats.avgAccuracy - report.totalStats.avgAccuracy) }}%
              </div>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="text-sm text-gray-500">练习次数</div>
              <div class="mt-1 text-xl font-medium text-gray-900">
                {{ report.recentStats.practices }} 次
              </div>
            </div>
          </div>
        </div>
        
        <!-- 学习建议 -->
        <div>
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">学习建议</h3>
          <div class="space-y-3">
            <div 
              v-for="suggestion in report.suggestions" 
              :key="suggestion.type"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <h4 class="font-medium text-gray-900">{{ suggestion.title }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ suggestion.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import {
  calculateLearningProgress,
  calculateSpeedTrend,
  calculateAccuracyTrend,
  calculateErrorAnalysis,
  generateLearningReport
} from '../utils/analytics'

// 图表引用
const speedChart = ref(null)
const accuracyChart = ref(null)

// 数据
const progress = ref({
  completedLessons: 0,
  totalChars: 0,
  totalTime: 0,
  estimatedProgress: 0
})
const errorAnalysis = ref([])
const report = ref({
  totalStats: {
    avgSpeed: 0,
    avgAccuracy: 0,
    practices: 0
  },
  recentStats: {
    avgSpeed: 0,
    avgAccuracy: 0,
    practices: 0
  },
  suggestions: []
})

// 初始化图表
const initCharts = () => {
  // 速度趋势图表
  const speedTrend = calculateSpeedTrend()
  new Chart(speedChart.value, {
    type: 'line',
    data: {
      labels: speedTrend.map(d => d.date.split(' ')[1] + '/' + d.date.split(' ')[2]),
      datasets: [{
        label: '速度（字/分钟）',
        data: speedTrend.map(d => d.speed),
        borderColor: '#2563EB',
        backgroundColor: '#93C5FD',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
  
  // 正确率趋势图表
  const accuracyTrend = calculateAccuracyTrend()
  new Chart(accuracyChart.value, {
    type: 'line',
    data: {
      labels: accuracyTrend.map(d => d.date.split(' ')[1] + '/' + d.date.split(' ')[2]),
      datasets: [{
        label: '正确率（%）',
        data: accuracyTrend.map(d => d.accuracy),
        borderColor: '#059669',
        backgroundColor: '#6EE7B7',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  })
}

// 初始化数据
onMounted(() => {
  // 获取学习进度
  progress.value = calculateLearningProgress()
  
  // 获取错误分析
  errorAnalysis.value = calculateErrorAnalysis()
  
  // 获取学习报告
  report.value = generateLearningReport()
  
  // 初始化图表
  initCharts()
})
</script> 