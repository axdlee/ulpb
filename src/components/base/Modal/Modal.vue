<template>
  <!-- 背景遮罩 -->
  <Teleport to="body">
    <Transition
      name="modal-backdrop"
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        :class="backdropClasses"
        @click="handleBackdropClick"
        @keydown.esc="handleEscape"
        tabindex="-1"
      >
        <!-- 模态框容器 -->
        <Transition
          name="modal-content"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="visible"
            :class="containerClasses"
            role="dialog"
            :aria-modal="true"
            :aria-labelledby="titleId"
            :aria-describedby="descriptionId"
            @click.stop
          >
            <!-- 模态框内容 -->
            <div :class="contentClasses">
              <!-- 头部 -->
              <div v-if="$slots.header || title || closable" :class="headerClasses">
                <slot name="header">
                  <div class="flex items-center">
                    <!-- 图标 -->
                    <div v-if="icon" :class="iconClasses">
                      <component :is="icon" class="w-6 h-6" />
                    </div>
                    
                    <!-- 标题 -->
                    <div class="flex-1 min-w-0">
                      <h3 v-if="title" :id="titleId" :class="titleClasses">
                        {{ title }}
                      </h3>
                      <p v-if="subtitle" :class="subtitleClasses">
                        {{ subtitle }}
                      </p>
                    </div>
                  </div>
                </slot>

                <!-- 关闭按钮 -->
                <button
                  v-if="closable"
                  type="button"
                  :class="closeButtonClasses"
                  @click="close"
                  :aria-label="closeLabel"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- 主体内容 -->
              <div v-if="$slots.default" :class="bodyClasses">
                <div v-if="description" :id="descriptionId" class="text-gray-600 mb-4">
                  {{ description }}
                </div>
                <slot />
              </div>

              <!-- 底部操作区 -->
              <div v-if="$slots.footer || showDefaultActions" :class="footerClasses">
                <slot name="footer">
                  <div v-if="showDefaultActions" class="flex justify-end space-x-3">
                    <Button
                      v-if="showCancelButton"
                      variant="outline"
                      @click="handleCancel"
                      :disabled="loading"
                    >
                      {{ cancelText }}
                    </Button>
                    <Button
                      v-if="showConfirmButton"
                      :variant="confirmVariant"
                      @click="handleConfirm"
                      :loading="loading"
                    >
                      {{ confirmText }}
                    </Button>
                  </div>
                </slot>
              </div>
            </div>

            <!-- 加载遮罩 -->
            <div
              v-if="loading"
              class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-inherit"
            >
              <LoadingSpinner :size="32" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { generateId } from '../../../utils/helpers.js'
import Button from '../Button/Button.vue'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.vue'

const props = defineProps({
  // 显示控制
  modelValue: Boolean,
  
  // 内容属性
  title: String,
  subtitle: String,
  description: String,
  icon: [String, Object],
  
  // 尺寸和样式
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  
  maxWidth: String,
  maxHeight: String,
  
  // 行为控制
  closable: {
    type: Boolean,
    default: true
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  escClosable: {
    type: Boolean,
    default: true
  },
  
  // 动作按钮
  showDefaultActions: Boolean,
  showCancelButton: {
    type: Boolean,
    default: true
  },
  showConfirmButton: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  confirmVariant: {
    type: String,
    default: 'primary'
  },
  
  // 状态
  loading: Boolean,
  destroyOnClose: Boolean,
  
  // 可访问性
  closeLabel: {
    type: String,
    default: '关闭对话框'
  },
  
  // 层级
  zIndex: {
    type: Number,
    default: 1000
  }
})

const emit = defineEmits([
  'update:modelValue',
  'open',
  'close',
  'confirm',
  'cancel',
  'after-open',
  'after-close'
])

// 内部状态
const visible = ref(false)
const previousActiveElement = ref(null)

// 生成唯一ID
const titleId = computed(() => generateId('modal-title'))
const descriptionId = computed(() => generateId('modal-description'))

// 样式类计算
const backdropClasses = computed(() => [
  'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4',
  'overflow-y-auto',
  {
    'z-[1000]': props.zIndex === 1000,
    [`z-[${props.zIndex}]`]: props.zIndex !== 1000
  }
])

const containerClasses = computed(() => {
  const classes = [
    'relative bg-white rounded-lg shadow-xl',
    'w-full transform transition-all',
    'max-h-full overflow-hidden'
  ]
  
  // 尺寸样式
  switch (props.size) {
    case 'xs':
      classes.push('max-w-xs')
      break
    case 'sm':
      classes.push('max-w-sm')
      break
    case 'md':
      classes.push('max-w-md')
      break
    case 'lg':
      classes.push('max-w-lg')
      break
    case 'xl':
      classes.push('max-w-xl')
      break
    case 'full':
      classes.push('max-w-full h-full')
      break
  }
  
  return classes
})

const contentClasses = computed(() => [
  'flex flex-col max-h-full',
  props.loading ? 'pointer-events-none' : ''
])

const headerClasses = computed(() => [
  'flex items-start justify-between p-6 pb-4',
  'border-b border-gray-200'
])

const iconClasses = computed(() => {
  const classes = ['flex-shrink-0 mr-3']
  
  // 根据图标类型添加颜色
  if (typeof props.icon === 'string') {
    switch (props.icon) {
      case 'warning':
        classes.push('text-yellow-500')
        break
      case 'error':
        classes.push('text-red-500')
        break
      case 'success':
        classes.push('text-green-500')
        break
      case 'info':
        classes.push('text-blue-500')
        break
      default:
        classes.push('text-gray-500')
    }
  }
  
  return classes
})

const titleClasses = computed(() => [
  'text-lg font-semibold text-gray-900'
])

const subtitleClasses = computed(() => [
  'mt-1 text-sm text-gray-500'
])

const closeButtonClasses = computed(() => [
  'text-gray-400 hover:text-gray-600 transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-primary-500 rounded',
  'p-1 -m-1'
])

const bodyClasses = computed(() => {
  const classes = ['flex-1 overflow-y-auto']
  
  if (props.size === 'full') {
    classes.push('px-6 py-4')
  } else {
    classes.push('px-6 pb-6')
  }
  
  return classes
})

const footerClasses = computed(() => [
  'px-6 py-4 bg-gray-50 border-t border-gray-200',
  'flex-shrink-0'
])

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    open()
  } else {
    close()
  }
})

// 打开模态框
const open = async () => {
  if (visible.value) return
  
  // 保存当前焦点元素
  previousActiveElement.value = document.activeElement
  
  visible.value = true
  emit('open')
  
  // 禁止body滚动
  document.body.style.overflow = 'hidden'
  
  await nextTick()
  emit('after-open')
}

// 关闭模态框
const close = async () => {
  if (!visible.value) return
  
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
  
  // 恢复body滚动
  document.body.style.overflow = ''
  
  // 恢复焦点
  if (previousActiveElement.value) {
    previousActiveElement.value.focus()
    previousActiveElement.value = null
  }
  
  await nextTick()
  emit('after-close')
}

// 事件处理
const handleBackdropClick = () => {
  if (props.maskClosable && !props.loading) {
    close()
  }
}

const handleEscape = (event) => {
  if (props.escClosable && !props.loading && event.key === 'Escape') {
    close()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  if (!props.loading) {
    close()
  }
}

// 初始化时根据modelValue显示
onMounted(() => {
  if (props.modelValue) {
    open()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (visible.value) {
    document.body.style.overflow = ''
  }
})

// 暴露方法
defineExpose({
  open,
  close,
  visible
})
</script>

<script>
export default {
  name: 'Modal'
}
</script>

<style scoped>
.rounded-inherit {
  border-radius: inherit;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .bg-white {
    @apply bg-gray-800;
  }
  
  .text-gray-900 {
    @apply text-white;
  }
  
  .text-gray-600 {
    @apply text-gray-300;
  }
  
  .text-gray-500 {
    @apply text-gray-400;
  }
  
  .border-gray-200 {
    @apply border-gray-700;
  }
  
  .bg-gray-50 {
    @apply bg-gray-700;
  }
}

/* 焦点陷阱样式 */
.modal-focus-trap {
  outline: none;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>