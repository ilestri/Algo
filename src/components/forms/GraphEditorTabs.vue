<template>
  <div>
    <div class="flex gap-2 mb-2">
      <button class="btn-ghost" :class="{ 'btn-primary': mode==='list' }" @click="mode='list'">인접 리스트</button>
      <button class="btn-ghost" :class="{ 'btn-primary': mode==='matrix' }" @click="mode='matrix'">인접 행렬</button>
    </div>

    <div v-if="mode==='list'" class="space-y-2">
      <label class="block text-sm">인접 리스트(JSON)</label>
      <textarea v-model="listText" rows="6" class="w-full rounded border p-2 text-black"></textarea>
    </div>

    <div v-else class="space-y-2">
      <label class="block text-sm">인접 행렬(JSON)</label>
      <textarea v-model="matrixText" rows="6" class="w-full rounded border p-2 text-black"></textarea>
    </div>

    <div class="mt-2 flex gap-2">
      <button class="btn-ghost" @click="convert">변환</button>
      <button class="btn-primary" @click="$emit('submit', { list: parsedList, matrix: parsedMatrix })">적용</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { listToMatrix, matrixToList, type AdjList } from '@/lib/graph-utils';

const props = defineProps<{ n: number; list?: AdjList; matrix?: number[][]; weighted?: boolean }>();
defineEmits<{ (e: 'submit', val: { list: AdjList, matrix: number[][] }): void }>();

const mode = ref<'list'|'matrix'>('list');
const listText = ref(JSON.stringify(props.list ?? { 0: [{ v: 1 }] }, null, 2));
const matrixText = ref(JSON.stringify(props.matrix ?? [[0,1],[0,0]], null, 2));

let parsedList: AdjList = props.list ?? { 0: [{ v: 1 }] };
let parsedMatrix: number[][] = props.matrix ?? [[0,1],[0,0]];

function convert() {
  try {
    if (mode.value === 'list') {
      parsedList = JSON.parse(listText.value);
      parsedMatrix = listToMatrix(parsedList, props.n, !!props.weighted);
      matrixText.value = JSON.stringify(parsedMatrix, null, 2);
    } else {
      parsedMatrix = JSON.parse(matrixText.value);
      parsedList = matrixToList(parsedMatrix, !!props.weighted);
      listText.value = JSON.stringify(parsedList, null, 2);
    }
  } catch {
    // no-op; 간단히 무시
  }
}
</script>
