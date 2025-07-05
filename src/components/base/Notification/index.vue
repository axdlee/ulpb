<!-- 全局通知组件 -->
<template>
  <teleport to="body">
    <div class="notification-container" :class="containerClasses">
      <transition-group name="notification" tag="div" class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="getNotificationClasses(notification)"
          @click="handleNotificationClick(notification)"
        >
          <!-- 图标区域 -->
          <div class="notification-icon">
            <component :is="getNotificationIcon(notification.type)" />
          </div>

          <!-- 内容区域 -->
          <div class="notification-content">
            <div class="notification-title" v-if="notification.title">
              {{ notification.title }}
            </div>
            <div class="notification-message">
              {{ notification.message }}
            </div>
            <div class="notification-actions" v-if="notification.actions?.length">
              <button
                v-for="action in notification.actions"
                :key="action.id"
                class="notification-action"
                :class="`notification-action--${action.type || 'default'}`"
                @click.stop="handleActionClick(notification, action)"
              >
                {{ action.label }}
              </button>
            </div>
          </div>

          <!-- 关闭按钮 -->
          <button
            class="notification-close"
            @click.stop="removeNotification(notification.id)"
            v-if="notification.closable !== false"
          >
            <CloseIcon />
          </button>

          <!-- 进度条 -->
          <div
            class="notification-progress"
            v-if="notification.duration && notification.duration > 0"
            :style="{ 
              animationDuration: `${notification.duration}ms`,
              animationPlayState: notification.paused ? 'paused' : 'running'
            }"
          ></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'

// Icons
const SuccessIcon = {
  template: '<svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
}

const ErrorIcon = {
  template: '<svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>'
}

const WarningIcon = {
  template: '<svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>'
}

const InfoIcon = {
  template: '<svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>'
}

const CloseIcon = {
  template: '<svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>'
}

// Store
const appStore = useAppStore()

// 计算属性
const notifications = computed(() => appStore.notifications)

const containerClasses = computed(() => ({
  'notification-container--top-right': appStore.notificationPosition === 'top-right',
  'notification-container--top-left': appStore.notificationPosition === 'top-left',
  'notification-container--bottom-right': appStore.notificationPosition === 'bottom-right',
  'notification-container--bottom-left': appStore.notificationPosition === 'bottom-left',
  'notification-container--top-center': appStore.notificationPosition === 'top-center',
  'notification-container--bottom-center': appStore.notificationPosition === 'bottom-center'
}))

// 方法
const getNotificationClasses = (notification) => ({
  'notification--success': notification.type === 'success',
  'notification--error': notification.type === 'error',
  'notification--warning': notification.type === 'warning',
  'notification--info': notification.type === 'info',
  'notification--clickable': notification.onClick,
  'notification--persistent': !notification.duration || notification.duration <= 0
})

const getNotificationIcon = (type) => {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  return icons[type] || InfoIcon
}

const removeNotification = (id) => {
  appStore.removeNotification(id)
}

const handleNotificationClick = (notification) => {
  if (notification.onClick) {
    notification.onClick()
  }
  if (notification.clickToClose !== false) {
    removeNotification(notification.id)
  }
}

const handleActionClick = (notification, action) => {
  if (action.onClick) {
    action.onClick()
  }
  if (action.closeOnClick !== false) {
    removeNotification(notification.id)
  }
}

// 键盘事件处理
const handleKeydown = (event) => {
  // ESC键关闭所有通知
  if (event.key === 'Escape') {
    appStore.clearNotifications()
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.notification-container {
  @apply fixed z-[9999] pointer-events-none;
  @apply max-w-sm w-full;
}

.notification-container--top-right {
  @apply top-4 right-4;
}

.notification-container--top-left {
  @apply top-4 left-4;
}

.notification-container--bottom-right {
  @apply bottom-4 right-4;
}

.notification-container--bottom-left {
  @apply bottom-4 left-4;
}

.notification-container--top-center {
  @apply top-4 left-1/2 transform -translate-x-1/2;
}

.notification-container--bottom-center {
  @apply bottom-4 left-1/2 transform -translate-x-1/2;
}

.notification-list {
  @apply space-y-2;
}

.notification {
  @apply relative pointer-events-auto;
  @apply bg-white rounded-lg shadow-lg border;
  @apply p-4 pr-12;
  @apply flex items-start space-x-3;
  @apply transition-all duration-300;
  @apply max-w-md min-w-0;
  @apply overflow-hidden;
}

.notification--clickable {
  @apply cursor-pointer hover:shadow-xl;
}

.notification--success {
  @apply border-green-200 bg-green-50;
}

.notification--error {
  @apply border-red-200 bg-red-50;
}

.notification--warning {
  @apply border-yellow-200 bg-yellow-50;
}

.notification--info {
  @apply border-blue-200 bg-blue-50;
}

.notification-icon {
  @apply flex-shrink-0 mt-0.5;
}

.notification--success .notification-icon {
  @apply text-green-500;
}

.notification--error .notification-icon {
  @apply text-red-500;
}

.notification--warning .notification-icon {
  @apply text-yellow-500;
}

.notification--info .notification-icon {
  @apply text-blue-500;
}

.notification-content {
  @apply flex-1 min-w-0;
}

.notification-title {
  @apply font-semibold text-gray-900 text-sm mb-1;
}

.notification-message {
  @apply text-gray-700 text-sm leading-relaxed;
  @apply break-words;
}

.notification-actions {
  @apply flex space-x-2 mt-3;
}

.notification-action {
  @apply px-3 py-1 text-xs font-medium rounded;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.notification-action--default {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  @apply focus:ring-gray-500;
}

.notification-action--primary {
  @apply bg-blue-100 text-blue-700 hover:bg-blue-200;
  @apply focus:ring-blue-500;
}

.notification-action--success {
  @apply bg-green-100 text-green-700 hover:bg-green-200;
  @apply focus:ring-green-500;
}

.notification-action--danger {
  @apply bg-red-100 text-red-700 hover:bg-red-200;
  @apply focus:ring-red-500;
}

.notification-close {
  @apply absolute top-3 right-3;
  @apply text-gray-400 hover:text-gray-600;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500;
  @apply rounded;
}

.notification-progress {
  @apply absolute bottom-0 left-0 h-1;
  @apply bg-gradient-to-r from-blue-500 to-blue-600;
  @apply w-full;
  animation: notification-progress linear forwards;
}

.notification--success .notification-progress {
  @apply from-green-500 to-green-600;
}

.notification--error .notification-progress {
  @apply from-red-500 to-red-600;
}

.notification--warning .notification-progress {
  @apply from-yellow-500 to-yellow-600;
}

/* 动画 */
.notification-enter-active {
  @apply transition-all duration-300;
}

.notification-leave-active {
  @apply transition-all duration-200;
}

.notification-enter-from {
  @apply opacity-0 transform translate-x-full scale-95;
}

.notification-leave-to {
  @apply opacity-0 transform -translate-x-2 scale-95;
}

.notification-move {
  @apply transition-transform duration-300;
}

@keyframes notification-progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .notification {
    @apply bg-gray-800 border-gray-700;
  }

  .notification--success {
    @apply border-green-700 bg-green-900/30;
  }

  .notification--error {
    @apply border-red-700 bg-red-900/30;
  }

  .notification--warning {
    @apply border-yellow-700 bg-yellow-900/30;
  }

  .notification--info {
    @apply border-blue-700 bg-blue-900/30;
  }

  .notification-title {
    @apply text-gray-100;
  }

  .notification-message {
    @apply text-gray-300;
  }

  .notification-close {
    @apply text-gray-500 hover:text-gray-300;
  }

  .notification-action--default {
    @apply bg-gray-700 text-gray-300 hover:bg-gray-600;
  }

  .notification-action--primary {
    @apply bg-blue-800 text-blue-300 hover:bg-blue-700;
  }

  .notification-action--success {
    @apply bg-green-800 text-green-300 hover:bg-green-700;
  }

  .notification-action--danger {
    @apply bg-red-800 text-red-300 hover:bg-red-700;
  }
}

/* 无障碍增强 */
@media (prefers-reduced-motion: reduce) {
  .notification-enter-active,
  .notification-leave-active,
  .notification-move {
    @apply transition-none;
  }

  .notification-progress {
    animation: none;
  }
}

/* 响应式设计 */
@media (max-width: 640px) {
  .notification-container {
    @apply left-4 right-4 max-w-none;
  }

  .notification-container--top-center,
  .notification-container--bottom-center {
    @apply transform-none left-4 right-4;
  }

  .notification {
    @apply max-w-none;
  }
}
</style>