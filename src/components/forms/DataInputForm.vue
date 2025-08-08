<script setup lang="ts">
import { ref } from 'vue';
import { useMessage, NForm, NFormItem, NInput, NButton } from 'naive-ui';
<template>
  <form class="space-y-2" @submit.prevent="emit('submit', values)">
    <label class="block text-sm">배열(쉼표 구분)</label>
    <textarea v-model="text" rows="3" class="w-full rounded border p-2" :aria-invalid="error ? 'true' : 'false'"></textarea>
    <div class="text-xs text-red-600 h-4" role="alert">{{ error }}</div>
    <div class="flex gap-2">
      <button type="button" class="btn-ghost" @click="randomize">랜덤</button>
      <button type="submit" class="btn-primary">적용</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ initial?: number[] }>();
const emit = defineEmits<{ (e: 'submit', values: number[]): void }>();

const text = ref((props.initial ?? []).join(','));
const error = ref<string | null>(null);
const values = ref<number[]>(props.initial ?? []);

watch(text, (t) => {
  try {
    const arr = t.split(',').map(s => Number(s.trim())).filter(n => n === 0 || Number.isFinite(n));
    values.value = arr;
    error.value = null;
  } catch {
    error.value = '입력 형식이 올바르지 않습니다.';
  }
});

function randomize() {
  const n = 10;
  const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1);
  text.value = arr.join(',');
}
</script>
const emit = defineEmits<{ (e:'submit', v:any):void; (e:'loadSample'):void }>();
const values = ref('10,3,7,2,5,8');
const seed = ref(42);
const msg = useMessage();

function onSubmit() {
  const arr = values.value.split(',').map(s => Number(s.trim())).filter(n => Number.isFinite(n));
  if (!arr.length) return msg.error('유효한 숫자 배열을 입력하세요.');
  emit('submit', { array: arr, seed: seed.value });
}
</script>
<template>
  <NForm @submit.prevent="onSubmit" aria-label="데이터 입력 폼">
    <NFormItem label="배열 입력(콤마 구분)">
      <NInput v-model:value="values" placeholder="예: 10,3,7,2,5,8" aria-label="숫자 배열 입력" />
    </NFormItem>
    <NFormItem label="랜덤 시드">
      <NInput v-model:value="seed" type="number" aria-label="랜덤 시드 입력" />
    </NFormItem>
    <div class="flex gap-2">
      <NButton type="primary" @click="onSubmit" aria-label="입력 적용">적용</NButton>
      <NButton @click="$emit('loadSample')" aria-label="예제 불러오기">예제 불러오기</NButton>
    </div>
  </NForm>
</template>
