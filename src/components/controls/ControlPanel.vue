<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <button class="btn-primary" @click="$emit('toggle')" aria-label="재생/일시정지 (Space)">
        <component :is="isPlaying ? Pause : Play" class="w-4 h-4" />
        <span>{{ isPlaying ? '일시정지' : '재생' }}</span>
      </button>
      <button class="btn-ghost" :disabled="!canStepBack" @click="$emit('back')" aria-label="이전 (←)">
        <component :is="StepBack" class="w-4 h-4" />
      </button>
      <button class="btn-ghost" :disabled="!canStepForward" @click="$emit('forward')" aria-label="다음 (→)">
        <component :is="StepForward" class="w-4 h-4" />
      </button>
      <button class="btn-ghost" @click="$emit('reset')" aria-label="처음으로 (Home)">
        처음
      </button>
      <button class="btn-ghost" @click="$emit('end')" aria-label="끝으로 (End)">
        끝까지
      </button>
      <button class="btn-ghost" @click="$emit('share')" aria-label="공유 링크 복사">
        공유 링크
      </button>
      <div class="ml-auto text-sm opacity-80">
        {{ current }} / {{ total }} step
      </div>
    </div>
    <div class="flex items-center gap-3">
      <label for="speed" class="text-sm w-20">속도</label>
      <input
        id="speed"
        type="range"
        min="0.25"
        max="4"
        step="0.25"
        :value="speed"
        @input="$emit('update:speed', Number(($event.target as HTMLInputElement).value))"
        aria-valuemin="0.25"
        aria-valuemax="4"
        :aria-valuenow="speed"
        class="w-full"
      />
      <span class="text-sm w-14 text-right">{{ speed.toFixed(2) }}x</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, StepBack, StepForward } from 'lucide-vue-next'

defineProps<{
  isPlaying: boolean
  canStepBack: boolean
  canStepForward: boolean
  speed: number
  current: number
  total: number
}>()

defineEmits<{
  (e: 'toggle'): void
  (e: 'back'): void
  (e: 'forward'): void
  (e: 'reset'): void
  (e: 'end'): void
  (e: 'update:speed', val: number): void
  (e: 'share'): void
}>()
</script>
