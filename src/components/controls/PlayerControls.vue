<template>
  <div class="flex flex-col gap-3" tabindex="0" @keydown="onKey">
    <div class="flex items-center gap-2">
      <button class="btn-ghost" :disabled="!canBack" @click="$emit('home')" aria-label="처음으로 (Home)">처음</button>
      <button class="btn-ghost" :disabled="!canBack" @click="$emit('back')" aria-label="이전 (←)">←</button>
      <button class="btn-primary" @click="$emit('toggle')" aria-label="재생/일시정지 (Space)">
        {{ playing ? '일시정지' : '재생' }}
      </button>
      <button class="btn-ghost" :disabled="!canForward" @click="$emit('forward')" aria-label="다음 (→)">→</button>
      <button class="btn-ghost" :disabled="!canForward" @click="$emit('end')" aria-label="끝으로 (End)">끝</button>
      <ShareLinkButton class="ml-2" :algo="algo" :input="input" :speed="speed" @copied="$emit('shared')" />
      <div class="ml-auto text-sm opacity-80" aria-live="polite">{{ index }} / {{ total }} step</div>
    </div>
    <SpeedSlider :value="speed" @change="$emit('update:speed', $event)" />
  </div>
</template>

<script setup lang="ts">
import SpeedSlider from './SpeedSlider.vue';
import ShareLinkButton from './ShareLinkButton.vue';

const props = defineProps<{
  playing: boolean;
  canBack: boolean;
  canForward: boolean;
  index: number;
  total: number;
  speed: number;
  algo: string;
  input?: any;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'home'): void;
  (e: 'back'): void;
  (e: 'forward'): void;
  (e: 'end'): void;
  (e: 'update:speed', val: number): void;
  (e: 'shared'): void;
}>();

function onKey(e: KeyboardEvent) {
  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
    // 상위에서 모달 열기 처리(옵션)
    e.preventDefault();
  } else if (e.key === ' ') {
    emit('toggle'); e.preventDefault();
  } else if (e.key === 'ArrowRight') {
    emit('forward'); e.preventDefault();
  } else if (e.key === 'ArrowLeft') {
    emit('back'); e.preventDefault();
  } else if (e.key === 'Home') {
    emit('home'); e.preventDefault();
  } else if (e.key === 'End') {
    emit('end'); e.preventDefault();
  }
}
</script>
