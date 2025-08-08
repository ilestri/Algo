<template>
  <section class="max-w-6xl mx-auto px-4 py-10 space-y-6">
    <div class="card p-6 space-y-3">
      <h1 class="text-2xl font-bold">About</h1>
      <p>이 프로젝트는 Vue 3 + TypeScript + Vite 기반의 자료구조·알고리즘 시각화 도구입니다.</p>
      <ul class="list-disc pl-5">
        <li>키보드: Space(재생/일시정지), ←/→(스텝), Home/End(처음/끝), ?(단축키 도움말)</li>
        <li>상태 공유: URL 쿼리로 현재 알고리즘/입력/속도 공유 가능</li>
        <li>접근성: 버튼/슬라이더에 aria 속성, 키보드 조작 지원</li>
      </ul>
    </div>
    <div class="card p-6 space-y-2">
      <h2 class="text-xl font-semibold">설계 개요</h2>
      <p>각 알고리즘은 step 스트림을 방출하며, useStepRunner가 tick 기반으로 재생을 제어합니다. PseudocodePanel은 step.pc로 라인 하이라이트를 동기화합니다.</p>
      <p>시각화는 SVG를 기본으로 하며, 필요 시 Canvas로 대체 가능한 계층으로 구성되어 있습니다.</p>
    </div>
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-2">라이선스</h2>
      <p class="mb-2">MIT</p>
      <ul class="list-disc pl-5 text-sm space-y-1">
        <li>Vue, Vue Router — MIT</li>
        <li>Pinia — MIT</li>
        <li>ECharts, vue-echarts — Apache-2.0</li>
        <li>LZ-String — MIT</li>
        <li>Lucide Icons — ISC</li>
        <li>Tailwind CSS — MIT</li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
