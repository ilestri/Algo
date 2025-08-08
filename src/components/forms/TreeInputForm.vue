<template>
  <form class="space-y-2" @submit.prevent="emit('submit', { keys: keys.value, search: search?.value, remove: remove?.value })">
    <label class="block text-sm">키 목록(쉼표 구분)</label>
    <input v-model="keysText" class="w-full rounded border p-2" />
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="block text-sm">검색 키</label>
        <input v-model.number="search" type="number" class="w-full rounded border p-2" />
      </div>
      <div>
        <label class="block text-sm">삭제 키</label>
        <input v-model.number="remove" type="number" class="w-full rounded border p-2" />
      </div>
    </div>
    <button class="btn-primary" type="submit">적용</button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ initial?: number[] }>();
const emit = defineEmits<{ (e: 'submit', payload: { keys: number[], search?: number, remove?: number }): void }>();

const keysText = ref((props.initial ?? []).join(','));
const keys = computed(() => keysText.value.split(',').map(s => Number(s.trim())).filter(n => n === 0 || Number.isFinite(n)));
const search = ref<number | undefined>(undefined);
const remove = ref<number | undefined>(undefined);
</script>
