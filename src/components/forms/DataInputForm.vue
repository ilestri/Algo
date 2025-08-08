<template>
  <form class="space-y-2" @submit.prevent="onSubmit" aria-label="데이터 입력 폼">
    <label for="array-textarea" class="block text-sm">배열(쉼표 구분)</label>
    <textarea
      id="array-textarea"
      name="array"
      v-model="text"
      rows="3"
      class="w-full rounded border p-2 text-black"
      :aria-invalid="error ? 'true' : 'false'"
      aria-label="숫자 배열 입력"
      placeholder="예: 10,3,7,2,5,8"
    ></textarea>
    <div class="text-xs text-red-600 h-4" role="alert">{{ error }}</div>
    <div class="flex gap-2">
      <button type="button" class="btn-ghost" @click="randomize" aria-label="랜덤 생성">랜덤</button>
      <button type="submit" class="btn-primary" aria-label="입력 적용">적용</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, watchEffect } from 'vue';

const props = defineProps<{ initial?: number[] }>();
const emit = defineEmits<{ (e: 'submit', values: number[]): void }>();

const text = ref<string>('');
const error = ref<string | null>(null);
const values = ref<number[]>([]);

function parseTextToArray(t: string): number[] {
  if (!t.trim()) return [];
  return t
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => Number(s))
    .filter(n => n === 0 || Number.isFinite(n));
}

function syncFromInitial(arr: number[]) {
  values.value = Array.isArray(arr) ? arr.slice() : [];
  text.value = values.value.join(',');
  error.value = null;
}

onMounted(() => {
  syncFromInitial(props.initial ?? []);
});

watch(() => props.initial, (nv) => {
  syncFromInitial(nv ?? []);
}, { deep: true });

watch(text, (t) => {
  const arr = parseTextToArray(t);
  values.value = arr;
  // 유효성: 입력에 숫자 외 값이 있으면 경고
  const tokens = t.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const invalid = tokens.some(s => {
    const n = Number(s);
    return !(s === '0' || Number.isFinite(n));
  });
  error.value = invalid ? '입력 형식이 올바르지 않습니다.' : null;
});

function randomize() {
  const n = 10;
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
  text.value = arr.join(',');
}

function onSubmit() {
  if (error.value) return;
  emit('submit', values.value.slice());
}
</script>
