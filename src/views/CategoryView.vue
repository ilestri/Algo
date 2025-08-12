<template>
  <section class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="d in descriptors"
        :key="d.id"
        class="card p-4 hover:bg-muted/50 transition-colors cursor-pointer"
        @click="open(d)"
      >
        <h3 class="text-lg font-semibold">{{ d.title }}</h3>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AlgoCategory, AlgoDescriptor } from '@/types/step';
import { initAlgorithms, listDescriptorsByCategory } from '@/algorithms/registry';

const props = defineProps<{ category: AlgoCategory }>();

const descriptors = ref<AlgoDescriptor[]>([]);
const router = useRouter();

onMounted(async () => {
  await initAlgorithms();
  descriptors.value = listDescriptorsByCategory(props.category);
});

function open(d: AlgoDescriptor) {
  const [category, name] = d.id.split('/') as [string, string];
  router.push({ name: 'visualize', params: { category, name } });
}
</script>
