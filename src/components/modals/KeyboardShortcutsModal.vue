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
<template>
  <div v-if="open" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 w-full max-w-md" v-trap-focus role="dialog" aria-modal="true" aria-label="단축키 도움말">
      <header class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">단축키</h3>
        <button class="btn-ghost" @click="$emit('close')" aria-label="닫기">×</button>
      </header>
      <ul class="space-y-1 text-sm">
        <li><b>Space</b> 재생/일시정지</li>
        <li><b>←/→</b> 이전/다음</li>
        <li><b>Shift+←/→</b> 5스텝 이동</li>
        <li><b>Home/End</b> 처음/끝으로</li>
        <li><b>?</b> 도움말 열기</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>();
defineEmits<{ (e: 'close'): void }>();
</script>
<style scoped>
:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
</style>
