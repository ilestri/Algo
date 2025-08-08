<template>
  <button class="btn-ghost" @click="toggle" aria-label="프리셋 토글">
    프리셋 {{ preset }}
  </button>
</template>

<script setup lang="ts">
import { useAppStore } from '../../stores/app'
import { storeToRefs } from 'pinia'

const app = useAppStore()
const { preset } = storeToRefs(app)

function toggle() {
  app.togglePreset()
}
</script>
