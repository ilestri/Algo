<template>
  <div>
    <div class="mb-2">
      <h3 class="font-semibold">의사코드(Pseudocode)</h3>
    </div>
    <div ref="preEl"
         class="bg-black/5 dark:bg-white/10 rounded-2xl p-3 text-sm overflow-auto font-mono"
         role="list">
      <div
          v-for="(line, idx) in lines"
          :key="idx"
          class="grid grid-cols-[2.5ch,1fr] gap-3 items-start py-0.5"
          role="listitem"
          :aria-current="highlight.includes(idx+1) ? 'true' : undefined"
          :ref="el => setLineRef(idx, el as HTMLElement)"
      >
        <span class="text-right tabular-nums select-none opacity-60">{{
            (idx + 1).toString().padStart(2, ' ')
          }}</span>
        <span class="whitespace-pre rounded px-1" :class="lineClass(idx+1)">{{ line }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, nextTick} from 'vue';

const props = defineProps<{
  lines: string[],
  highlight: number[],
}>()

const preEl = ref<HTMLElement | null>(null);
const lineEls = ref<Record<number, HTMLElement | null>>({});

function setLineRef(idx: number, el: HTMLElement | null) {
  lineEls.value[idx + 1] = el;
}

function lineClass(n: number) {
  return props.highlight.includes(n) ? 'bg-yellow-200/50 dark:bg-yellow-400/20' : ''
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
    container.scrollTo({top: eTop - container.clientHeight / 3, behavior: 'smooth'});
  }
}, {immediate: true});
</script>
