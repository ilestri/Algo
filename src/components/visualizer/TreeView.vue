<script setup lang="ts">
import { computed } from 'vue';
import {computed} from "vue";

const props = defineProps<{ nodes: Array<{ id: number; x: number; y: number; value: number; highlight?: boolean }>; edges: Array<{ x1: number; y1: number; x2: number; y2: number }>; ariaLabel?: string }>();
const label = computed(() => props.ariaLabel ?? `이진 탐색 트리: 노드 ${props.nodes.length}개`);
</script>

<template>
  <g role="img" :aria-label="label">
    <g v-for="(e,idx) in props.edges" :key="idx" stroke="currentColor" opacity="0.5">
      <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" stroke-width="2" />
    </g>
    <g v-for="n in props.nodes" :key="n.id" :transform="`translate(${n.x},${n.y})`">
      <circle :r="16" :fill="n.highlight ? 'var(--accent)' : 'var(--panel)'" stroke="currentColor" stroke-width="2" />
      <text text-anchor="middle" dy="5" class="text-sm fill-current select-none">{{ n.value }}</text>
    </g>
  </g>
</template>
