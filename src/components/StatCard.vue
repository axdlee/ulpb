<!-- StatCard.vue -->
<template>
  <div
    class="stat-card bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md"
    :class="[sizeClass, colorClass]"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center">
          <div v-if="icon" class="flex-shrink-0 mr-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-white"
              :class="iconBgClass"
            >
              <span class="text-sm">{{ icon }}</span>
            </div>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">{{ title }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">
              {{ formattedValue }}
              <span v-if="unit" class="text-lg font-normal text-gray-500 ml-1">{{ unit }}</span>
            </p>
          </div>
        </div>

        <div v-if="showChange && change !== null" class="mt-2 flex items-center">
          <span class="text-sm font-medium flex items-center" :class="changeColorClass">
            <span class="mr-1">{{ changeIcon }}</span>
            {{ Math.abs(change) }}{{ unit }}
          </span>
          <span class="text-sm text-gray-500 ml-2">{{ changeText }}</span>
        </div>

        <div v-if="description" class="mt-2">
          <p class="text-sm text-gray-500">{{ description }}</p>
        </div>
      </div>

      <div v-if="showTrend && trendData" class="ml-4">
        <div class="w-16 h-8">
          <svg class="w-full h-full" viewBox="0 0 64 32">
            <polyline
              :points="trendPoints"
              fill="none"
              stroke="currentColor"
              :class="trendColorClass"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div v-if="showProgress && maxValue" class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-300"
          :class="progressColorClass"
          :style="{ width: `${Math.min((value / maxValue) * 100, 100)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    unit: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'blue',
      validator: value =>
        ['blue', 'green', 'red', 'yellow', 'purple', 'indigo', 'gray'].includes(value)
    },
    size: {
      type: String,
      default: 'medium',
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    change: {
      type: Number,
      default: null
    },
    changeText: {
      type: String,
      default: '较上期'
    },
    showChange: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    maxValue: {
      type: Number,
      default: null
    },
    showTrend: {
      type: Boolean,
      default: false
    },
    trendData: {
      type: Array,
      default: () => []
    }
  })

  const formattedValue = computed(() => {
    if (typeof props.value === 'number') {
      return props.value.toLocaleString()
    }
    return props.value
  })

  const sizeClass = computed(() => {
    const sizes = {
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8'
    }
    return sizes[props.size]
  })

  const colorClass = computed(() => {
    const colors = {
      blue: 'border-blue-200',
      green: 'border-green-200',
      red: 'border-red-200',
      yellow: 'border-yellow-200',
      purple: 'border-purple-200',
      indigo: 'border-indigo-200',
      gray: 'border-gray-200'
    }
    return colors[props.color]
  })

  const iconBgClass = computed(() => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500'
    }
    return colors[props.color]
  })

  const progressColorClass = computed(() => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      gray: 'bg-gray-500'
    }
    return colors[props.color]
  })

  const changeIcon = computed(() => {
    if (props.change === null) return ''
    return props.change > 0 ? '↗' : props.change < 0 ? '↘' : '→'
  })

  const changeColorClass = computed(() => {
    if (props.change === null) return 'text-gray-500'
    return props.change > 0 ? 'text-green-600' : props.change < 0 ? 'text-red-600' : 'text-gray-500'
  })

  const trendColorClass = computed(() => {
    if (!props.trendData || props.trendData.length === 0) return 'text-gray-400'
    const first = props.trendData[0]
    const last = props.trendData[props.trendData.length - 1]
    return last > first ? 'text-green-500' : last < first ? 'text-red-500' : 'text-gray-400'
  })

  const trendPoints = computed(() => {
    if (!props.trendData || props.trendData.length === 0) return ''

    const data = props.trendData
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 64
        const y = 32 - ((value - min) / range) * 24
        return `${x},${y}`
      })
      .join(' ')
  })
</script>
