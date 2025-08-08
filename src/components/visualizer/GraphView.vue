<script setup lang="ts">
import { computed } from 'vue';

interface Node { id: number; x: number; y: number; label?: string }
interface Edge { u: number; v: number; w?: number }
const props = defineProps<{ nodes: Node[]; edges: Edge[]; activeNodes?: number[]; activeEdge?: [number, number]; showWeights?: boolean; ariaLabel?: string }>();
const label = computed(() => props.ariaLabel ?? `그래프: 노드 ${props.nodes.length}개, 간선 ${props.edges.length}개`);
</script>
<template>
  <g role="img" :aria-label="label">
    <g v-for="e in props.edges" :key="e.u+'-'+e.v" class="stroke-slate-500">
      <line :x1="props.nodes[e.u].x" :y1="props.nodes[e.u].y"
            :x2="props.nodes[e.v].x" :y2="props.nodes[e.v].y" stroke-width="2" />
      <template v-if="props.showWeights && e.w != null">
        <text :x="(props.nodes[e.u].x + props.nodes[e.v].x)/2"
              :y="(props.nodes[e.u].y + props.nodes[e.v].y)/2 - 4"
              text-anchor="middle"
              class="fill-slate-700 dark:fill-slate-200 text-xs select-none">
          {{ e.w }}
        </text>
      </template>
    </g>
    <g v-for="n in props.nodes" :key="n.id">
      <circle :cx="n.x" :cy="n.y" r="16" :class="['stroke-2', 'stroke-white',
          (props.activeNodes?.includes(n.id) ? 'fill-blue-500' : 'fill-slate-600')]" />
      <text :x="n.x" :y="n.y+4" text-anchor="middle" class="fill-white text-xs select-none">{{ n.label ?? n.id }}</text>
    </g>
  </g>
</template>
