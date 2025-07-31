<template>
  <div class="learning-settings-overlay" @click="$emit('close')">
    <div class="learning-settings" @click.stop>
      <Card>
        <template #header>
          <div class="settings-header">
            <h3 class="settings-title">学习设置</h3>
            <Button variant="ghost" size="sm" @click="$emit('close')">✕</Button>
          </div>
        </template>
        
        <div class="settings-content">
          <div class="setting-group">
            <label class="setting-label">
              <input 
                type="checkbox" 
                v-model="localSettings.showAnimations"
                class="setting-checkbox"
              >
              显示动画效果
            </label>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">
              <input 
                type="checkbox" 
                v-model="localSettings.soundEnabled"
                class="setting-checkbox"
              >
              启用声音提示
            </label>
          </div>
          
          <div class="setting-group">
            <label class="setting-label">
              <input 
                type="checkbox" 
                v-model="localSettings.autoAdvance"
                class="setting-checkbox"
              >
              自动进入下一步
            </label>
          </div>
        </div>
        
        <template #footer>
          <div class="settings-actions">
            <Button variant="outline" @click="$emit('close')">取消</Button>
            <Button variant="solid" @click="saveSettings">保存</Button>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Card from '@/components/base/Card/index.vue'
import Button from '@/components/base/Button/index.vue'

const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const localSettings = ref({ ...props.settings })

const saveSettings = () => {
  emit('save', localSettings.value)
  emit('close')
}

watch(() => props.settings, (newSettings) => {
  localSettings.value = { ...newSettings }
}, { deep: true })
</script>

<style scoped>
.learning-settings-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.learning-settings {
  @apply w-full max-w-md mx-4;
}

.settings-header {
  @apply flex items-center justify-between;
}

.settings-title {
  @apply text-lg font-semibold;
}

.settings-content {
  @apply space-y-4;
}

.setting-group {
  @apply space-y-2;
}

.setting-label {
  @apply flex items-center space-x-3 cursor-pointer;
}

.setting-checkbox {
  @apply w-4 h-4 text-blue-600 rounded focus:ring-blue-500;
}

.settings-actions {
  @apply flex justify-end space-x-3;
}
</style>