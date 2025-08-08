<script setup lang="ts">
const props = defineProps<{ values: number[]; active?: number[]; sorted?: Set<number> }>();
</script>
<template>
  <g>
    <template v-for="(v,i) in props.values" :key="i">
      <rect :x="i * (1000/props.values.length)" :y="420 - v" :width="(1000/props.values.length)-2" :height="v"
            :class="[
              'transition-all',
              (props.active?.includes(i) ? 'fill-blue-500' : (props.sorted?.has(i) ? 'fill-green-500' : 'fill-slate-400'))
            ]" />
    </template>
  </g>
</template>
