<script setup lang="ts">
/**
 * props:
 * - highlights: number[]            // 인덱스 하이라이트
 * - highlightRange: { l: number, r: number } | null
 * - pivotIndex?: number | null
 * - pointers?: Array<{ name: string, index: number }>
 * - values?: number[]               // 현재 배열 값(포인터 툴팁에 사용)
 */
const props = defineProps<{
  highlights?: number[]
  highlightRange?: { l: number, r: number } | null
  pivotIndex?: number | null
  pointers?: Array<{ name: string, index: number }>
  n?: number
  values?: number[]
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
      <g :transform="`translate(${(p.index + 0.5) * (1000/(props.n||1))}, 0)`">
        <!-- SVG 기본 툴팁: 포인터 이름, 인덱스, 값 -->
        <title>
          {{
            `${(p.name || '').toUpperCase()} @ ${p.index}` +
            (Number.isFinite(props.values?.[p.index] as any) ? ` = ${props.values![p.index]}` : '')
          }}
        </title>
        <!-- 포인터 삼각형(아래쪽을 향한 마커) -->
        <polygon
          points="0,18 -6,6 6,6"
          :class="p.name === 'l'
              ? 'fill-red-600 dark:fill-red-400'
              : (p.name === 'r'
                  ? 'fill-blue-600 dark:fill-blue-400'
                  : 'fill-green-600 dark:fill-green-400')"
        />
        <!-- 포인터 라벨 -->
        <text
          x="0"
          y="12"
          text-anchor="middle"
          :class="p.name === 'l'
              ? 'text-[10px] fill-red-700 dark:fill-red-300'
              : (p.name === 'r'
                  ? 'text-[10px] fill-blue-700 dark:fill-blue-300'
                  : 'text-[10px] fill-green-700 dark:fill-green-300')"
        >
          {{ p.name }}
        </text>
      </g>
    </template>
  </g>
</template>
