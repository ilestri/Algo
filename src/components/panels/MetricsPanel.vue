<template>
  <div>
    <h3 class="font-semibold mb-2">지표</h3>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
      <div class="card p-3">
        <div class="text-xs opacity-70">비교</div>
        <div class="text-lg font-bold">{{ metrics.compares ?? 0 }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">스왑</div>
        <div class="text-lg font-bold">{{ metrics.swaps ?? 0 }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">방문</div>
        <div class="text-lg font-bold">{{ metrics.visits ?? 0 }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">이완</div>
        <div class="text-lg font-bold">{{ metrics.relaxes ?? 0 }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">Enq</div>
        <div class="text-lg font-bold">{{ metrics.enqueues ?? 0 }}</div>
      </div>
      <div class="card p-3">
        <div class="text-xs opacity-70">Deq</div>
        <div class="text-lg font-bold">{{ metrics.dequeues ?? 0 }}</div>
      </div>
    </div>

    <!-- 총합 막대 차트 -->
    <div class="mt-3">
      <v-chart class="h-32" :option="barOption" autoresize />
    </div>

    <!-- 타임라인(선형 차트) -->
    <div class="mt-3">
      <v-chart class="h-28" :option="lineOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { computed } from 'vue'
import type { RunMetrics } from '@/types/step'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent])

const props = defineProps<{
  metrics: RunMetrics
  timeline?: Array<Partial<RunMetrics>> // 선택: 시간 경과에 따른 메트릭 스냅샷
}>()

const dark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const barOption = computed(() => {
  const labels = ['비교', '스왑', '방문', '이완', 'Enq', 'Deq']
  const data = [
    props.metrics.compares ?? 0,
    props.metrics.swaps ?? 0,
    props.metrics.visits ?? 0,
    props.metrics.relaxes ?? 0,
    props.metrics.enqueues ?? 0,
    props.metrics.dequeues ?? 0,
  ]
  return {
    darkMode: dark(),
    grid: { left: 24, right: 12, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, axisLabel: { color: dark() ? '#e5e7eb' : '#374151' } },
    yAxis: { type: 'value', show: false },
    series: [
      {
        type: 'bar',
        data,
        itemStyle: { color: dark() ? '#60a5fa' : '#3b82f6' },
        barWidth: '50%',
      },
    ],
  }
})

const lineOption = computed(() => {
  const tl = props.timeline ?? []
  const x = tl.map((_, i) => i)
  const toSeriesData = (k: keyof RunMetrics) => tl.map(m => Number(m[k] ?? 0))
  return {
    darkMode: dark(),
    grid: { left: 24, right: 12, top: 16, bottom: 16 },
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['비교', '스왑', '방문', '이완', 'Enq', 'Deq'],
      top: 0,
      textStyle: { color: dark() ? '#e5e7eb' : '#374151' }
    },
    xAxis: { type: 'category', show: false, data: x },
    yAxis: { type: 'value', show: false },
    series: [
      { name: '비교', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('compares') },
      { name: '스왑', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('swaps') },
      { name: '방문', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('visits') },
      { name: '이완', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('relaxes') },
      { name: 'Enq', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('enqueues') },
      { name: 'Deq', type: 'line', smooth: true, showSymbol: false, data: toSeriesData('dequeues') },
    ],
  }
})
</script>
