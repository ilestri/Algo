<template>
  <div>
    <h3 class="font-semibold mb-2">지표</h3>
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="card p-3">
        <div class="text-xs opacity-70">비교</div>
        <div class="text-lg font-bold">{{ metrics.compares }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">스왑</div>
        <div class="text-lg font-bold">{{ metrics.swaps }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">방문</div>
        <div class="text-lg font-bold">{{ metrics.visits }}</div>
      </div>
    </div>
    <div class="mt-3">
      <v-chart class="h-28" :option="option" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { computed } from 'vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

defineProps<{ metrics: { compares: number, swaps: number, visits: number, steps: () => number } }>()

const option = computed(() => ({
  grid: { left: 10, right: 10, top: 10, bottom: 10 },
  xAxis: { type: 'category', show: false, data: Array.from({ length: 10 }, (_, i) => i) },
  yAxis: { type: 'value', show: false },
  series: [{
    type: 'line',
    smooth: true,
    data: Array.from({ length: 10 }, () => Math.round(Math.random() * 10)),
    showSymbol: false
  }]
}))
</script>
