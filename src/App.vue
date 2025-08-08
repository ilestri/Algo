<template>
  <div :data-theme="theme" :class="['min-h-full', presetClass]">
    <AppLayout />
  </div>
</template>

<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
import { useAppStore } from './stores/app'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const app = useAppStore()
const { theme, preset } = storeToRefs(app)
const presetClass = computed(() => (preset.value === 'A' ? 'preset-a' : 'preset-b'))
</script>
