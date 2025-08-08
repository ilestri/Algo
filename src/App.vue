<template>
  <div :data-theme="theme" :class="['min-h-full', presetClass]">
    <AppLayout />
  </div>
</template>

<script setup lang="ts">
import AppLayout from './components/layout/AppLayout.vue'
import { useAppStore } from './stores/app'
import { storeToRefs } from 'pinia'

const app = useAppStore()
const { theme } = storeToRefs(app)
const presetClass = 'preset-a'
</script>
