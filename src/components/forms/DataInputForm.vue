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

    <!-- 이진탐색용 타깃 입력(필수) -->
    <div v-if="requireKey" class="space-y-1">
      <label for="target-input" class="block text-sm">타깃 값(필수)</label>
      <input
        id="target-input"
        name="key"
        v-model="keyText"
        type="number"
        inputmode="numeric"
        class="w-full rounded border p-2 text-black"
        :aria-invalid="keyError ? 'true' : 'false'"
        aria-label="타깃 숫자 입력"
        placeholder="예: 7"
      />
      <div class="text-sm text-red-600 h-4" role="alert">{{ keyError }}</div>
    </div>

    <div class="text-sm text-red-600 h-4" role="alert">{{ error }}</div>

    <div class="flex gap-2">
      <button type="button" class="btn-ghost" @click="randomize" aria-label="랜덤 생성">랜덤</button>
      <button type="submit" class="btn-primary" aria-label="입력 적용">적용</button>
    </div>

    <!-- 자동 정렬 안내: 배열이 오름차순이 아닐 때 -->
    <div v-if="unsortedPrompt" class="mt-2 p-3 rounded border border-amber-400 bg-amber-50 text-amber-900" aria-live="polite">
      <p class="text-sm mb-2">이진 탐색은 오름차순으로 정렬된 배열이 필요합니다. 자동으로 정렬하여 적용할까요?</p>
      <div class="flex flex-wrap gap-2">
        <button type="button" class="btn-primary" @click="autoSortAndSubmit">자동으로 정렬하여 적용</button>
        <button type="button" class="btn" @click="unsortedPrompt=false">취소</button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useInputsStore } from '@/stores/inputs';

const inputs = useInputsStore();

const props = defineProps<{ initial?: number[], requireKey?: boolean, initialKey?: number }>();
const emit = defineEmits<{
  (e: 'submit', payload: number[] | { array: number[], key?: number, action?: 'normal' | 'autoSort' }): void
}>();

const text = ref<string>('');
const error = ref<string | null>(null);
const values = ref<number[]>([]);

// 타깃 입력
const keyText = ref<string>('');
const keyError = ref<string | null>(null);

// 정렬 선택지 표시
const unsortedPrompt = ref<boolean>(false);

const requireKey = computed(() => props.requireKey === true);

function parseTextToArray(t: string): number[] {
  if (!t.trim()) return [];
  return t
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => Number(s))
    .filter(n => n === 0 || Number.isFinite(n));
}

function isSortedAscending(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] > arr[i]) return false;
  }
  return true;
}

function syncFromInitial(arr: number[], k?: number) {
  values.value = Array.isArray(arr) ? arr.slice() : [];
  text.value = values.value.join(',');
  error.value = null;

  if (requireKey.value) {
    if (typeof k === 'number' && Number.isFinite(k)) keyText.value = String(k);
    else keyText.value = '';
    keyError.value = null;
  }
}

onMounted(() => {
  syncFromInitial(props.initial ?? [], props.initialKey);
});

watch(() => props.initial, (nv) => {
  syncFromInitial(nv ?? [], props.initialKey);
}, { deep: true });

watch(() => props.initialKey, (nv) => {
  if (requireKey.value) syncFromInitial(props.initial ?? [], nv);
});

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
  const n = 20;
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
  text.value = arr.join(',');
  // 이진탐색 모드일 때 타깃 값을 자동으로 하나 선택
  if (requireKey.value && arr.length > 0) {
    const pick = arr[Math.floor(Math.random() * arr.length)];
    keyText.value = String(pick);
    keyError.value = null;
  }
}

function onSubmit() {
  if (error.value) return;

  // 빈 배열 방지
  if (!Array.isArray(values.value) || values.value.length === 0) {
    error.value = '배열을 입력하세요.';
    return;
  }

  // 타깃 값 필수
  let keyNum: number | undefined = undefined;
  if (requireKey.value) {
    const keyStr = String(keyText.value ?? '').trim();
    if (keyStr === '') {
      keyError.value = '타깃 값을 입력하세요.';
      return;
    }
    const n = Number(keyStr);
    if (!Number.isFinite(n)) {
      keyError.value = '타깃 값은 숫자여야 합니다.';
      return;
    }
    keyError.value = null;
    keyNum = n;

    // 정렬 여부 확인 후 선택지 표시
    if (!isSortedAscending(values.value)) {
      unsortedPrompt.value = true;
      return;
    }
  }

  // 전역 입력 스토어 커밋
  inputs.array = values.value.slice();
  if (requireKey.value && typeof keyNum === 'number') {
    inputs.key = keyNum;
  }

  // 기본 제출
  if (requireKey.value) {
    emit('submit', { array: values.value.slice(), key: keyNum, action: 'normal' });
  } else {
    emit('submit', values.value.slice());
  }
}

// 선택지: 자동 정렬하여 적용
function autoSortAndSubmit() {
  unsortedPrompt.value = false;
  const sorted = values.value.slice().sort((a, b) => a - b);
  const keyStr = String(keyText.value ?? '').trim();
  const n = Number(keyStr);

  // 전역 입력 스토어 커밋
  inputs.array = sorted.slice();
  if (requireKey.value && Number.isFinite(n)) {
    inputs.key = n;
  }

  emit('submit', { array: sorted, key: Number.isFinite(n) ? n : undefined, action: 'autoSort' });
}
</script>
