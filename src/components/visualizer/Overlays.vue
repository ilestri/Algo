<script setup lang="ts">
/**
 * props:
 * - highlights: number[]            // 인덱스 하이라이트
 * - highlightRange: { l: number, r: number } | null
 * - pivotIndex?: number | null
 * - pointers?: Array<{ name: string, index: number }>
 */
const props = defineProps<{
  highlights?: number[]
  highlightRange?: { l: number, r: number } | null
  pivotIndex?: number | null
  pointers?: Array<{ name: string, index: number }>
  n?: number
}>();
</script>

<template>
  <g>
    <template v-if="props.highlightRange">
      <rect
        :x="(props.highlightRange!.l) * (1000/(props.n||1))"
        y="0"
        :width="(props.highlightRange!.r - props.highlightRange!.l + 1) * (1000/(props.n||1))"
        height="100%"
        class="fill-blue-400/10"
      />
    </template>
    <template v-if="Number.isFinite(props?.pivotIndex)">
      <rect
        :x="(props!.pivotIndex as number) * (1000/(props.n||1))"
        y="0"
        :width="(1000/(props.n||1))"
        height="100%"
        class="fill-amber-400/20"
      />
    </template>
    <template v-for="p in props.pointers || []" :key="p.name">
      <text
        :x="(p.index + 0.5) * (1000/(props.n||1))"
        y="12"
        text-anchor="middle"
        class="text-[10px] fill-amber-600 dark:fill-amber-300"
      >
        {{ p.name }}
      </text>
    </template>
  </g>
</template>
