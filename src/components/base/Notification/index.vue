<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div" class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="[
            `notification--${notification.type}`,
            { 'notification--persistent': notification.persistent }
          ]"
        >
          <div class="notification-content">
            <div class="notification-icon">
              {{ getNotificationIcon(notification.type) }}
            </div>
            <div class="notification-body">
              <div v-if="notification.title" class="notification-title">
                {{ notification.title }}
              </div>
              <div class="notification-message">
                {{ notification.message }}
              </div>
            </div>
            <button
              class="notification-close"
              @click="removeNotification(notification.id)"
            >
              ✕
            </button>
          </div>
          
          <!-- 进度条 -->
          <div
            v-if="!notification.persistent && notification.duration > 0"
            class="notification-progress"
            :style="{ animationDuration: `${notification.duration}ms` }"
          ></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const notifications = computed(() => appStore.state.notifications)

const getNotificationIcon = (type) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || 'ℹ️'
}

const removeNotification = (id) => {
  appStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  @apply fixed top-20 right-4 z-[9999] pointer-events-none;
}

.notification-list {
  @apply space-y-3;
}

.notification {
  @apply relative bg-white rounded-lg shadow-lg border;
  @apply max-w-sm w-full overflow-hidden pointer-events-auto;
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

.notification-content {
  @apply flex items-start space-x-3 p-4;
}

.notification-icon {
  @apply text-lg flex-shrink-0 mt-0.5;
}

.notification-body {
  @apply flex-1 min-w-0;
}

.notification-title {
  @apply font-semibold text-gray-900 text-sm mb-1;
}

.notification-message {
  @apply text-gray-700 text-sm;
}

.notification-close {
  @apply flex-shrink-0 text-gray-400 hover:text-gray-600;
  @apply transition-colors duration-200 cursor-pointer;
  @apply bg-transparent border-none text-sm;
}

.notification-progress {
  @apply absolute bottom-0 left-0 h-1 bg-current opacity-30;
  @apply w-full origin-left;
  animation: notification-progress linear forwards;
}

.notification--success .notification-progress {
  @apply bg-green-500;
}

.notification--error .notification-progress {
  @apply bg-red-500;
}

.notification--warning .notification-progress {
  @apply bg-yellow-500;
}

.notification--info .notification-progress {
  @apply bg-blue-500;
}

/* 动画 */
.notification-enter-active {
  @apply transition-all duration-300;
}

.notification-leave-active {
  @apply transition-all duration-200;
}

.notification-enter-from {
  @apply opacity-0 transform translate-x-full;
}

.notification-leave-to {
  @apply opacity-0 transform translate-x-full scale-95;
}

.notification-move {
  @apply transition-transform duration-300;
}

@keyframes notification-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* 暗色主题 */
[data-theme='dark'] .notification {
  @apply bg-gray-800 border-gray-600;
}

[data-theme='dark'] .notification--success {
  @apply border-green-600 bg-green-900;
}

[data-theme='dark'] .notification--error {
  @apply border-red-600 bg-red-900;
}

[data-theme='dark'] .notification--warning {
  @apply border-yellow-600 bg-yellow-900;
}

[data-theme='dark'] .notification--info {
  @apply border-blue-600 bg-blue-900;
}

[data-theme='dark'] .notification-title {
  @apply text-gray-100;
}

[data-theme='dark'] .notification-message {
  @apply text-gray-300;
}

[data-theme='dark'] .notification-close {
  @apply text-gray-400 hover:text-gray-200;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .notification-container {
    @apply left-4 right-4 top-20;
  }
  
  .notification {
    @apply max-w-none;
  }
}
</style>