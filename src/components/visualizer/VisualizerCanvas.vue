<template>
  <div>
    <svg v-if="mode==='array'" :viewBox="`0 0 ${width} ${height}`" class="w-full h-64" role="img" aria-label="배열 시각화">
      <g v-for="(v,i) in state.array" :key="i" :transform="`translate(${i*barWidth},0)`">
        <rect
          :x="1" :y="height - v * scaleY"
          :width="barWidth-2" :height="v * scaleY"
          :fill="barColor(i)"
          rx="6" />
        <text :x="barWidth/2" :y="height - v * scaleY - 4" text-anchor="middle" class="text-[10px] fill-current opacity-70">{{ v }}</text>
      </g>
    </svg>

    <svg v-else-if="mode==='graph'" :viewBox="`0 0 ${width} ${height}`" class="w-full h-72" role="img" aria-label="그래프 시각화">
      <g>
        <g v-for="(e,idx) in state.edges" :key="idx" stroke="currentColor" :opacity="e.visited ? 1 : 0.4">
          <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" stroke-width="2" />
        </g>
        <g v-for="n in state.nodes" :key="n.id" :transform="`translate(${n.x},${n.y})`">
          <circle :r="18" :fill="n.visited ? 'var(--accent)' : 'var(--panel)'" stroke="currentColor" stroke-width="2" />
          <text text-anchor="middle" dy="5" class="text-sm fill-current">{{ n.id }}</text>
        </g>
      </g>
    </svg>

    <svg v-else :viewBox="`0 0 ${width} ${height}`" class="w-full h-72" role="img" aria-label="트리 시각화">
      <g v-for="(e,idx) in state.edges" :key="idx" stroke="currentColor" opacity="0.5">
        <line :x1="e.x1" :y1="e.y1" :x2="e.x2" :y2="e.y2" stroke-width="2" />
      </g>
      <g v-for="n in state.nodes" :key="n.id" :transform="`translate(${n.x},${n.y})`">
        <circle :r="16" :fill="n.highlight ? 'var(--accent)' : 'var(--panel)'" stroke="currentColor" stroke-width="2" />
        <text text-anchor="middle" dy="5" class="text-sm fill-current">{{ n.value }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  mode: 'array' | 'graph' | 'tree',
  state: any,
  steps: any[],
  currentIndex: number
}>()

const width = 800
const height = 240

// array
const barWidth = computed(() => props.state?.array ? Math.max(6, Math.min(40, width / props.state.array.length)) : 20)
const maxVal = computed(() => Math.max(1, ...(props.state?.array ?? [1])))
const scaleY = computed(() => (height - 20) / maxVal.value)
function barColor(i: number) {
  const hi = props.state?.highlight ?? []
  if (hi.includes(i)) return 'var(--accent)'
  return 'var(--primary)'
}
</script>
