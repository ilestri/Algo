<script setup lang="ts">
import { NModal, NCard } from 'naive-ui';
import { shortcuts } from '@/components/controls/KeyboardShortcuts';
const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ (e:'update:show', v:boolean):void }>();
</script>

<template>
  <NModal :show="props.show" @update:show="v => emit('update:show', v)" preset="dialog" aria-label="키보드 단축키 도움말" auto-focus>
    <NCard title="키보드 단축키" size="small">
      <ul class="space-y-1">
        <li v-for="s in shortcuts" :key="s.keys" class="flex justify-between">
          <span class="font-mono">{{ s.keys }}</span>
          <span class="opacity-70">{{ s.label }}</span>
        </li>
      </ul>
    </NCard>
  </NModal>
</template>

<style scoped>
:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
</style>
