<template>
  <button class="btn-ghost" @click="toggle" aria-label="테마 토글">
    <component :is="icon" class="w-4 h-4" />
    <span class="hidden sm:inline">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { useAppStore } from '../../stores/app'
import { Sun, Moon } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const app = useAppStore()
const { theme } = storeToRefs(app)
const icon = computed(() => theme.value === 'dark' ? Sun : Moon)
const label = computed(() => theme.value === 'dark' ? '라이트' : '다크')
function toggle() {
  app.toggleTheme()
}
</script>
