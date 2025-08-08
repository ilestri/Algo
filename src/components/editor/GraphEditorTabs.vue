<template>
  <div>
    <div class="flex gap-2 mb-2">
      <button :class="['btn-ghost', tab==='list' && 'bg-black/5 dark:bg-white/10']" @click="tab='list'">인접 리스트</button>
      <button :class="['btn-ghost', tab==='matrix' && 'bg-black/5 dark:bg-white/10']" @click="tab='matrix'">인접 행렬</button>
    </div>
    <div v-if="tab==='list'">
      <textarea class="w-full" rows="6" :value="modelValue" @input="onChange" placeholder="0:1(1),2(4)\n1:2(2)\n2:3(1)\n3:"></textarea>
      <p class="text-xs opacity-70 mt-1">형식: u:v(w),x(y) ... (무게 생략 가능)</p>
    </div>
    <div v-else>
      <textarea class="w-full" rows="6" :value="modelValue" @input="onChange" placeholder="0,1,4,0\n1,0,2,0\n4,2,0,1\n0,0,1,0"></textarea>
      <p class="text-xs opacity-70 mt-1">쉼표 구분 숫자 행렬. 0은 간선 없음.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const tab = ref<'list' | 'matrix'>('list')

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>
