<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h1 class="text-2xl font-bold mb-2">자료구조·알고리즘 시각화</h1>
        <p class="opacity-80">
          브라우저만으로 학습하는 인터랙티브 시각화 도구입니다. 정렬/탐색/트리/그래프 알고리즘을 단계별로 따라가 보세요.
        </p>
        <div class="mt-4 flex gap-2">
          <RouterLink class="btn-primary" :to="{ name: 'visualize', params: { category: 'sorting', name: 'bubble' } }">
            정렬 시작하기
          </RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'visualize', params: { category: 'graph', name: 'bfs' } }">
            그래프 BFS
          </RouterLink>
        </div>
      </div>
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-2">빠른 진입</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <RouterLink class="btn-ghost" :to="{ name: 'visualize', params: { category: 'sorting', name: 'selection' } }">Selection Sort</RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'visualize', params: { category: 'sorting', name: 'insertion' } }">Insertion Sort</RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'visualize', params: { category: 'searching', name: 'binary' } }">Binary Search</RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'visualize', params: { category: 'tree', name: 'bst' } }">BST</RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'playground' }">Playground</RouterLink>
          <RouterLink class="btn-ghost" :to="{ name: 'about' }">About</RouterLink>
        </div>
        <div class="mt-6">
          <p class="text-sm opacity-70">테마 토글은 헤더에서 변경할 수 있습니다.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
