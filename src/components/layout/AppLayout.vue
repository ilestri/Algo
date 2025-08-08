<template>
  <div class="min-h-full flex flex-col">
    <header class="sticky top-0 z-20 border-b bg-[var(--panel)]/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-xl font-semibold">Algo Visualizer</span>
        </RouterLink>
        <nav class="flex items-center gap-2">
          <RouterLink class="btn-ghost" to="/playground">Playground</RouterLink>
          <RouterLink class="btn-ghost" to="/about">About</RouterLink>
          <PresetToggle class="ml-2" />
          <ThemeToggle class="ml-2" />
        </nav>
      </div>
    </header>
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="border-t py-4 text-center text-sm opacity-70">
      MIT © 2025 • GitHub Pages 배포
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import ThemeToggle from '../common/ThemeToggle.vue'
import PresetToggle from '../common/PresetToggle.vue'
</script>
