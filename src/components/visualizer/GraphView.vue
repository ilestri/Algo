<script setup lang="ts">
interface Node { id: number; x: number; y: number; label?: string }
interface Edge { u: number; v: number; w?: number }
const props = defineProps<{ nodes: Node[]; edges: Edge[]; activeNodes?: number[]; activeEdge?: [number, number] }>();
</script>
<template>
  <g>
    <line v-for="e in props.edges" :key="e.u+'-'+e.v" :x1="props.nodes[e.u].x" :y1="props.nodes[e.u].y"
          :x2="props.nodes[e.v].x" :y2="props.nodes[e.v].y" class="stroke-slate-500" stroke-width="2" />
    <g v-for="n in props.nodes" :key="n.id">
      <circle :cx="n.x" :cy="n.y" r="16" :class="['stroke-2', 'stroke-white',
          (props.activeNodes?.includes(n.id) ? 'fill-blue-500' : 'fill-slate-600')]" />
      <text :x="n.x" :y="n.y+4" text-anchor="middle" class="fill-white text-xs">{{ n.label ?? n.id }}</text>
    </g>
  </g>
</template>
