<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="visible"
      :class="['fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 flex items-center gap-2 shadow-lg rounded-lg', toastClasses]"
    >
      <component :is="icon" class="w-4 h-4" />
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, AlertCircle, Info } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    message: string
    visible: boolean
    type?: 'success' | 'error' | 'info'
  }>(),
  {
    message: '',
    visible: false,
    type: 'info',
  },
)

const colorMap: Record<'success' | 'error' | 'info', string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-indigo-600',
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const toastClasses = computed(() => `${colorMap[props.type]} text-white`)
const icon = computed(() => iconMap[props.type])
</script>
