<template>
  <section class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="d in descriptors"
        :key="d.id"
        type="button"
        class="card p-4 w-full text-left hover:bg-muted/50 transition-colors"
        @click="open(d)"
      >
        <h3 class="text-lg font-semibold">{{ d.title }}</h3>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AlgoCategory, AlgoDescriptor } from '@/types/step'
import { initAlgorithms, listDescriptorsByCategory } from '@/algorithms/registry'
import { useA11yAnnouncements } from '@/composables/useA11yAnnouncements'

const props = defineProps<{ category: AlgoCategory }>()

const descriptors = ref<AlgoDescriptor[]>([])
const router = useRouter()
const announcer = useA11yAnnouncements()

onMounted(async () => {
  await initAlgorithms()
  descriptors.value = listDescriptorsByCategory(props.category)
  announcer.announce(`${descriptors.value.length}개의 알고리즘이 있습니다.`)
})

function open(d: AlgoDescriptor) {
  announcer.announce(`${d.title} 알고리즘 페이지로 이동합니다.`)
  const [category, name] = d.id.split('/') as [string, string]
  router.push({ name: 'visualize', params: { category, name } })
}
</script>
