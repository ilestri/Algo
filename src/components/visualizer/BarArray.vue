<script setup lang="ts">
import { computed } from 'vue';
import {computed} from "vue";

const props = defineProps<{ values: number[]; active?: number[]; sorted?: Set<number>; ariaLabel?: string }>();
const label = computed(() => props.ariaLabel ?? `막대 그래프: ${props.values.length}개 원소`);
</script>
<template>
  <g role="img" :aria-label="label" tabindex="0" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-sm">
    <template v-for="(v,i) in props.values" :key="i">
      <rect :x="i * (1000/props.values.length)" :y="420 - v" :width="(1000/props.values.length)-2" :height="v"
            :data-value="v"
            :class="[
              'transition-all',
              (props.active?.includes(i) ? 'fill-blue-500' : (props.sorted?.has(i) ? 'fill-green-500' : 'fill-slate-400'))
            ]" />
    </template>
  </g>
</template>
