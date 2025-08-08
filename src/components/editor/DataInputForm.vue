<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">입력</h3>
      <button class="btn-ghost text-sm" @click="$emit('loadSample')">예제 불러오기</button>
    </div>
    <div v-if="category === 'sorting' || category === 'searching'">
      <label class="text-sm mb-1 block">배열 (쉼표 구분)</label>
      <input class="w-full" type="text" :value="arrayText" @input="onArrayChange" placeholder="e.g. 5,3,8,1,4" />
      <p v-if="arrayError" class="text-danger text-sm mt-1">{{ arrayError }}</p>
    </div>
    <div v-else-if="category === 'graph'">
      <GraphEditorTabs :model-value="graph" @update:modelValue="onGraphChange" />
    </div>
    <div v-else-if="category === 'tree'">
      <label class="text-sm mb-1 block">삽입/삭제 시퀀스 (쉼표 구분)</label>
      <input class="w-full" type="text" :value="seqText" @input="onSeqChange" placeholder="e.g. 8,3,10,1,6,14" />
      <p v-if="seqError" class="text-danger text-sm mt-1">{{ seqError }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { parseNumberArray } from '../../lib/utils'
import GraphEditorTabs from './GraphEditorTabs.vue'

const props = defineProps<{
  category: string
  name: string
  initialArray?: number[]
  initialGraph?: string
  initialSeq?: number[]
}>()

const emits = defineEmits<{
  (e: 'update:array', v: number[]): void
  (e: 'update:graph', v: string): void
  (e: 'update:seq', v: number[]): void
  (e: 'loadSample'): void
}>()

const arrayText = computed(() => (props.initialArray ?? []).join(','))
const graph = computed(() => props.initialGraph ?? '')
const seqText = computed(() => (props.initialSeq ?? []).join(','))

const arrayError = ref<string | null>(null)
const seqError = ref<string | null>(null)

function onArrayChange(e: Event) {
  const text = (e.target as HTMLInputElement).value
  const parsed = parseNumberArray(text)
  if (!parsed.ok) {
    arrayError.value = parsed.error
  } else {
    arrayError.value = null
    emits('update:array', parsed.value)
  }
}

function onGraphChange(v: string) {
  emits('update:graph', v)
}

function onSeqChange(e: Event) {
  const text = (e.target as HTMLInputElement).value
  const parsed = parseNumberArray(text)
  if (!parsed.ok) {
    seqError.value = parsed.error
  } else {
    seqError.value = null
    emits('update:seq', parsed.value)
  }
}
</script>
