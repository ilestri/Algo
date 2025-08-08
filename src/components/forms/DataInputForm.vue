<script setup lang="ts">
import { ref } from 'vue';
import { useMessage, NForm, NFormItem, NInput, NButton } from 'naive-ui';

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
