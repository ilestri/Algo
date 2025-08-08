<template>
  <div class="space-y-2">
    <h3 class="font-semibold">인스펙터</h3>
    <div class="text-sm">
      <div><span class="opacity-70">알고리즘:</span> {{ meta?.title }}</div>
      <div class="flex gap-2">
        <div><span class="opacity-70">Best:</span> {{ meta?.complexity.best }}</div>
        <div><span class="opacity-70">Avg:</span> {{ meta?.complexity.average }}</div>
        <div><span class="opacity-70">Worst:</span> {{ meta?.complexity.worst }}</div>
        <div><span class="opacity-70">Space:</span> {{ meta?.complexity.space }}</div>
      </div>
      <div class="mt-2">
        <div class="opacity-70">현재 스텝</div>
        <div class="font-medium">{{ explain || '대기 중' }}</div>
        <div class="text-xs opacity-70">라인: {{ pc?.join(', ') || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AlgoDescriptor } from '@/types/step';

defineProps<{
  pc: number[] | null;
  explain: string | null;
  meta: AlgoDescriptor<any> | null;
}>();
</script>
