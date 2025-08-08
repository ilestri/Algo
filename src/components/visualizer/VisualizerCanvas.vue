<template>
  <div>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" :class="mode==='array' ? 'h-64' : 'h-72'">
      <g v-if="mode==='array'">
        <BarArray
          :values="state.array || []"
          :active="state.highlight || []"
          :sorted="state.sorted"
          aria-label="배열 시각화"
        />
        <Overlays
          :n="(state.array && state.array.length) || 0"
          :highlights="state.highlight || []"
          :highlightRange="state.highlightRange || null"
          :pivotIndex="state.pivotIndex ?? null"
          :pointers="state.pointers || []"
        />
      </g>

      <g v-else-if="mode==='graph'">
        <GraphView
          :nodes="state.nodes || []"
          :edges="state.edges || []"
          :active-nodes="state.activeNodes || []"
          :aria-label="'그래프 시각화'"
          :show-weights="true"
        />
      </g>

      <g v-else>
        <TreeView
          :nodes="state.nodes || []"
          :edges="state.edges || []"
          aria-label="트리 시각화"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import BarArray from './BarArray.vue'
import GraphView from './GraphView.vue'
import TreeView from './TreeView.vue'
import Overlays from './Overlays.vue'

const props = defineProps<{
  mode: 'array' | 'graph' | 'tree',
  state: any,
  steps: any[],
  currentIndex: number
}>()

const width = 1000
const height = 440
</script>
