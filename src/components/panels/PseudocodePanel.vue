<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">Pseudocode</h3>
      <button class="btn-ghost text-sm" @click="$emit('toggleView')">{{ showCode ? '의사코드' : 'TS 코드' }}</button>
    </div>
    <pre v-if="!showCode" ref="preEl" class="bg-black/5 dark:bg-white/10 rounded-2xl p-3 text-sm overflow-auto" role="list"><code>
<span
  v-for="(line, idx) in lines"
  :key="idx"
  :class="lineClass(idx+1)"
  role="listitem"
  :aria-current="highlight.includes(idx+1) ? 'true' : undefined"
  :ref="el => setLineRef(idx, el as HTMLElement)"
>
  {{ (idx+1).toString().padStart(2,' ') }}  {{ line }}
</span>
</code></pre>
    <pre v-else class="bg-black/5 dark:bg-white/10 rounded-2xl p-3 text-sm overflow-auto"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  lines: string[],
  highlight: number[],
  showCode: boolean,
  code: string
}>()

const preEl = ref<HTMLElement | null>(null);
const lineEls = ref<Record<number, HTMLElement | null>>({});

function setLineRef(idx: number, el: HTMLElement | null) {
  lineEls.value[idx + 1] = el;
}

function lineClass(n: number) {
  return props.highlight.includes(n) ? 'bg-yellow-200/50 dark:bg-yellow-400/20 block rounded px-1' : 'block'
}

watch(() => props.highlight.slice(), async (vals) => {
  await nextTick();
  const targetLine = vals[0];
  if (!targetLine) return;
  const container = preEl.value;
  const el = lineEls.value[targetLine];
  if (!container || !el) return;

  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = el.offsetTop - 8;
  const eBottom = eTop + el.clientHeight + 8;

  if (eTop < cTop || eBottom > cBottom) {
    container.scrollTo({ top: eTop - container.clientHeight / 3, behavior: 'smooth' });
  }
}, { immediate: true });
</script>
