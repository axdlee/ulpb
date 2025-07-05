<template>
  <div :class="wrapperClasses">
    <!-- 标签 -->
    <label 
      v-if="label || $slots.label" 
      :for="inputId"
      :class="labelClasses"
    >
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- 输入框容器 -->
    <div :class="containerClasses">
      <!-- 前置图标 -->
      <div v-if="prefixIcon || $slots.prefix" :class="prefixClasses">
        <slot name="prefix">
          <component v-if="prefixIcon" :is="prefixIcon" class="w-5 h-5 text-gray-400" />
        </slot>
      </div>

      <!-- 输入框 -->
      <component
        :is="inputComponent"
        :id="inputId"
        ref="inputRef"
        v-model="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :min="min"
        :max="max"
        :step="step"
        :rows="rows"
        :cols="cols"
        :autocomplete="autocomplete"
        :class="inputClasses"
        :style="inputStyles"
        v-bind="$attrs"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @paste="handlePaste"
      />

      <!-- 后置图标/操作 -->
      <div v-if="suffixIcon || $slots.suffix || showClearButton || showPasswordToggle" :class="suffixClasses">
        <!-- 清除按钮 -->
        <button
          v-if="showClearButton && modelValue && !disabled && !readonly"
          type="button"
          :class="clearButtonClasses"
          @click="clearInput"
          @mousedown.prevent
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- 密码显示切换 -->
        <button
          v-if="showPasswordToggle && type === 'password'"
          type="button"
          :class="passwordToggleClasses"
          @click="togglePasswordVisibility"
          @mousedown.prevent
        >
          <svg v-if="showPassword" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        </button>

        <!-- 自定义后置内容 -->
        <slot name="suffix">
          <component v-if="suffixIcon" :is="suffixIcon" class="w-5 h-5 text-gray-400" />
        </slot>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <LoadingSpinner :size="16" />
      </div>
    </div>

    <!-- 帮助文本/错误信息 -->
    <div v-if="helpText || errorMessage || $slots.help" :class="helpClasses">
      <slot name="help">
        <span v-if="errorMessage" class="text-red-600">{{ errorMessage }}</span>
        <span v-else-if="helpText" class="text-gray-500">{{ helpText }}</span>
      </slot>
    </div>

    <!-- 字符计数 -->
    <div v-if="showCount && maxlength" class="flex justify-end mt-1">
      <span :class="countClasses">
        {{ currentLength }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch } from 'vue'
import { generateId } from '../../../utils/helpers.js'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.vue'

const props = defineProps({
  // v-model
  modelValue: [String, Number],
  
  // 基础属性
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  label: String,
  helpText: String,
  errorMessage: String,
  
  // 验证属性
  required: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  
  // 限制属性
  maxlength: [String, Number],
  minlength: [String, Number],
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  
  // 多行文本属性
  multiline: Boolean,
  rows: {
    type: [String, Number],
    default: 3
  },
  cols: [String, Number],
  autoResize: Boolean,
  
  // 样式属性
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'filled', 'outlined'].includes(value)
  },
  
  // 功能属性
  clearable: Boolean,
  showCount: Boolean,
  loading: Boolean,
  
  // 图标
  prefixIcon: [String, Object],
  suffixIcon: [String, Object],
  
  // 自动完成
  autocomplete: String,
  
  // 其他
  id: String
})

const emit = defineEmits([
  'update:modelValue',
  'input',
  'change',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'paste',
  'clear'
])

const inputRef = ref(null)
const isFocused = ref(false)
const showPassword = ref(false)

// 生成唯一ID
const inputId = computed(() => props.id || generateId('input'))

// 输入组件类型
const inputComponent = computed(() => {
  return props.multiline ? 'textarea' : 'input'
})

// 输入类型
const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

// 当前字符长度
const currentLength = computed(() => {
  return String(props.modelValue || '').length
})

// 是否显示清除按钮
const showClearButton = computed(() => {
  return props.clearable && !props.multiline
})

// 是否显示密码切换按钮
const showPasswordToggle = computed(() => {
  return props.type === 'password' && !props.multiline
})

// 样式类计算
const wrapperClasses = computed(() => {
  return ['input-wrapper']
})

const labelClasses = computed(() => {
  const classes = ['block', 'text-sm', 'font-medium', 'mb-2']
  
  if (props.disabled) {
    classes.push('text-gray-400')
  } else if (props.errorMessage) {
    classes.push('text-red-700')
  } else {
    classes.push('text-gray-700')
  }
  
  return classes
})

const containerClasses = computed(() => {
  const classes = ['relative', 'flex', 'items-center']
  
  if (props.multiline) {
    classes.push('items-start')
  }
  
  return classes
})

const inputClasses = computed(() => {
  const classes = ['block', 'w-full', 'transition-colors', 'duration-200']
  
  // 尺寸样式
  switch (props.size) {
    case 'sm':
      classes.push(props.multiline ? 'px-3 py-2 text-sm' : 'px-3 py-2 text-sm')
      break
    case 'lg':
      classes.push(props.multiline ? 'px-4 py-3 text-lg' : 'px-4 py-3 text-lg')
      break
    default:
      classes.push(props.multiline ? 'px-3 py-2' : 'px-3 py-2')
  }
  
  // 变体样式
  switch (props.variant) {
    case 'filled':
      classes.push('bg-gray-100', 'border-0', 'rounded-md')
      if (isFocused.value) {
        classes.push('bg-white', 'ring-2', 'ring-primary-500')
      }
      break
    case 'outlined':
      classes.push('bg-transparent', 'border-2', 'rounded-md')
      if (props.errorMessage) {
        classes.push('border-red-500')
      } else if (isFocused.value) {
        classes.push('border-primary-500')
      } else {
        classes.push('border-gray-300')
      }
      break
    default:
      classes.push('bg-white', 'border', 'rounded-md', 'shadow-sm')
      if (props.errorMessage) {
        classes.push('border-red-500', 'ring-1', 'ring-red-500')
      } else if (isFocused.value) {
        classes.push('border-primary-500', 'ring-1', 'ring-primary-500')
      } else {
        classes.push('border-gray-300')
      }
  }
  
  // 状态样式
  if (props.disabled) {
    classes.push('bg-gray-50', 'text-gray-500', 'cursor-not-allowed')
  } else if (props.readonly) {
    classes.push('bg-gray-50', 'text-gray-700')
  } else {
    classes.push('text-gray-900')
  }
  
  // 前后缀图标的内边距调整
  if (props.prefixIcon || $slots.prefix) {
    classes.push('pl-10')
  }
  
  if (props.suffixIcon || $slots.suffix || showClearButton.value || showPasswordToggle.value || props.loading) {
    classes.push('pr-10')
  }
  
  // 焦点样式
  classes.push('focus:outline-none')
  
  return classes
})

const inputStyles = computed(() => {
  const styles = {}
  
  if (props.autoResize && props.multiline) {
    styles.resize = 'none'
    styles.overflow = 'hidden'
  }
  
  return styles
})

const prefixClasses = computed(() => {
  return [
    'absolute', 'inset-y-0', 'left-0', 'flex', 'items-center', 'pl-3',
    props.multiline ? 'items-start pt-2' : 'items-center'
  ]
})

const suffixClasses = computed(() => {
  return [
    'absolute', 'inset-y-0', 'right-0', 'flex', 'items-center', 'pr-3', 'space-x-1',
    props.multiline ? 'items-start pt-2' : 'items-center'
  ]
})

const clearButtonClasses = computed(() => {
  return [
    'text-gray-400', 'hover:text-gray-600', 'focus:outline-none',
    'transition-colors', 'duration-200'
  ]
})

const passwordToggleClasses = computed(() => {
  return [
    'text-gray-400', 'hover:text-gray-600', 'focus:outline-none',
    'transition-colors', 'duration-200'
  ]
})

const helpClasses = computed(() => {
  return ['mt-2', 'text-sm']
})

const countClasses = computed(() => {
  const classes = ['text-xs']
  
  if (currentLength.value > props.maxlength) {
    classes.push('text-red-600')
  } else if (currentLength.value > props.maxlength * 0.8) {
    classes.push('text-yellow-600')
  } else {
    classes.push('text-gray-500')
  }
  
  return classes
})

// 事件处理
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', event)
  
  // 自动调整高度
  if (props.autoResize && props.multiline) {
    nextTick(() => {
      autoResize()
    })
  }
}

const handleChange = (event) => {
  emit('change', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

const handleKeyup = (event) => {
  emit('keyup', event)
}

const handlePaste = (event) => {
  emit('paste', event)
}

// 清除输入
const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  focus()
}

// 切换密码显示
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 自动调整文本域高度
const autoResize = () => {
  if (inputRef.value && props.multiline && props.autoResize) {
    inputRef.value.style.height = 'auto'
    inputRef.value.style.height = inputRef.value.scrollHeight + 'px'
  }
}

// 聚焦方法
const focus = () => {
  inputRef.value?.focus()
}

// 失焦方法
const blur = () => {
  inputRef.value?.blur()
}

// 选择文本
const select = () => {
  inputRef.value?.select()
}

// 监听modelValue变化，用于自动调整高度
watch(() => props.modelValue, () => {
  if (props.autoResize && props.multiline) {
    nextTick(() => {
      autoResize()
    })
  }
}, { immediate: true })

// 暴露方法
defineExpose({
  focus,
  blur,
  select,
  inputRef
})
</script>

<script>
export default {
  name: 'Input'
}
</script>

<style scoped>
/* 移除浏览器默认样式 */
.input-wrapper input::-webkit-outer-spin-button,
.input-wrapper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-wrapper input[type=number] {
  -moz-appearance: textfield;
}

/* 占位符样式 */
.input-wrapper input::placeholder,
.input-wrapper textarea::placeholder {
  @apply text-gray-400;
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .input-wrapper input,
  .input-wrapper textarea {
    @apply bg-gray-800 border-gray-600 text-white;
  }
  
  .input-wrapper input::placeholder,
  .input-wrapper textarea::placeholder {
    @apply text-gray-500;
  }
  
  .input-wrapper input:focus,
  .input-wrapper textarea:focus {
    @apply border-primary-400 ring-primary-400;
  }
  
  .input-wrapper .bg-gray-50 {
    @apply bg-gray-700;
  }
  
  .input-wrapper .bg-gray-100 {
    @apply bg-gray-700;
  }
}

/* 自动调整高度的平滑过渡 */
.input-wrapper textarea {
  transition: height 0.2s ease-out;
}
</style>