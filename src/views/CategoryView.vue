<template>
  <section class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="d in descriptors"
        :key="d.id"
        class="card p-4 hover:bg-muted/50 transition-colors"
        :to="{ name: 'visualize', params: { category: d.category, name: d.id.split('/')[1] } }"
      >
        <h3 class="text-lg font-semibold">{{ d.title }}</h3>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { AlgoCategory, AlgoDescriptor } from '@/types/step';
import { initAlgorithms, listDescriptorsByCategory } from '@/algorithms/registry';

const props = defineProps<{ category: AlgoCategory }>();

const descriptors = ref<AlgoDescriptor[]>([]);

onMounted(async () => {
  await initAlgorithms();
  descriptors.value = listDescriptorsByCategory(props.category);
});
</script>
