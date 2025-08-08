<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">Pseudocode</h3>
      <button class="btn-ghost text-sm" @click="$emit('toggleView')">{{ showCode ? '의사코드' : 'TS 코드' }}</button>
    </div>
    <pre v-if="!showCode" class="bg-black/5 dark:bg-white/10 rounded-2xl p-3 text-sm overflow-auto"><code>
<span v-for="(line, idx) in lines" :key="idx" :class="lineClass(idx+1)">{{ (idx+1).toString().padStart(2,' ') }}  {{ line }}</span>
</code></pre>
    <pre v-else class="bg-black/5 dark:bg-white/10 rounded-2xl p-3 text-sm overflow-auto"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  lines: string[],
  highlight: number[],
  showCode: boolean,
  code: string
}>()

function lineClass(n: number) {
  return props.highlight.includes(n) ? 'bg-yellow-200/50 dark:bg-yellow-400/20 block rounded px-1' : 'block'
}
</script>
