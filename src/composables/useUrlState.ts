import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
export function useUrlState() {
  const route = useRoute(); const router = useRouter();
  const state = computed(() => ({
    algo: (route.query.algo as string) || 'sorting/quick',
    input: (route.query.input as string) || '10,3,7,2,5,8',
    speed: Number(route.query.speed ?? 1),
  }));
  function patch(p: Record<string, any>) {
    router.replace({ query: { ...route.query, ...p } });
  }
  return { state, patch };
}
