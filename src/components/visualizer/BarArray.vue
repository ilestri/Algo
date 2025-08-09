<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  values: number[];
  active?: number[];
  // 다양한 형태로 들어오는 정렬 표시를 허용(Set, 배열, 맵 형태 등)
  sorted?: any;
  ariaLabel?: string;
}>();
const label = computed(() => props.ariaLabel ?? `막대 그래프: ${props.values.length}개 원소`);

// 렌더링 상수
const SVG_WIDTH = 1000;
// 막대를 약간 위로 올려 하단 라벨 공간 확보 (전체 높이 440에서 아래쪽 40px은 라벨용)
const BASELINE_Y = 400;
// 상단 여백(막대가 꼭대기에 닿지 않도록)
const TOP_PADDING = 20;
// 라벨 y 오프셋(막대와의 간격)
const LABEL_OFFSET = 10;

// 최대값 기준 스케일 계산
const maxVal = computed(() => {
  // values가 비었거나 모두 0이어도 1로 나눗셈 방지
  const m = Math.max(0, ...props.values);
  return m > 0 ? m : 1;
});
const usableHeight = computed(() => BASELINE_Y - TOP_PADDING);
const scale = computed(() => usableHeight.value / maxVal.value);

// 정렬 여부 안전 판별
function isSortedIndex(i: number): boolean {
  const s = props.sorted as any;
  if (!s) return false;
  if (typeof s.has === 'function') return !!s.has(i);           // Set 또는 유사 Set
  if (Array.isArray(s)) return s.includes(i);                   // 배열
  if (typeof s === 'object') return !!s[i];                     // 맵/객체
  return false;
}
</script>
<template>
  <g role="img" :aria-label="label" tabindex="0" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-sm">
    <template v-for="(v,i) in props.values" :key="i">
      <rect
        :x="i * (SVG_WIDTH/props.values.length)"
        :y="BASELINE_Y - (v * scale)"
        :width="(SVG_WIDTH/props.values.length)-2"
        :height="v * scale"
        :data-value="v"
        :class="[
          'transition-all',
          (props.active?.includes(i) ? 'fill-blue-500' : (isSortedIndex(i) ? 'fill-green-500' : 'fill-slate-400'))
        ]"
      />
      <!-- 막대 하단 라벨 -->
      <text
        :x="(i + 0.5) * (SVG_WIDTH/props.values.length)"
        :y="BASELINE_Y + LABEL_OFFSET"
        dominant-baseline="hanging"
        text-anchor="middle"
        class="text-[40px] font-medium fill-slate-700 dark:fill-slate-200 select-none"
      >
        {{ v }}
      </text>
    </template>
  </g>
</template>
