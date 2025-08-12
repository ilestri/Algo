import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';
import { encodeState, decodeState } from '@/lib/url-compress';

type UrlState = {
  algo: string;
  input?: any;
  speed?: number;
};

function read(route: ReturnType<typeof useRoute>): UrlState {
  const category = route.params.category as string | undefined;
  const name = route.params.name as string | undefined;
  const algo = category && name ? `${category}/${name}` : (route.query.algo as string) ?? 'sorting/quick';
  const compressed = route.query.s as string | undefined;

  let payload: any = null;
  if (compressed) {
    payload = decodeState<any>(compressed);
  }

  const input = payload?.input ?? (route.query.input as any | undefined);
  let speed = Number(payload?.speed ?? route.query.speed ?? 1);
  if (!Number.isFinite(speed)) speed = 1;

  return { algo, input, speed };
}

function write(
  router: ReturnType<typeof useRouter>,
  route: ReturnType<typeof useRoute>,
  next: Partial<UrlState>
) {
  const current = read(route);
  const merged: UrlState = { ...current, ...next };

  const s = encodeState({ input: merged.input, speed: merged.speed });
  const [category, name] = merged.algo.split('/') as [string, string];
  router.replace({
    name: 'visualize',
    params: { category, name },
    query: { s },
  });
}

export function useUrlState() {
  const route = useRoute();
  const router = useRouter();

  const state = computed<UrlState>(() => read(route));

  function patch(patchObj: Partial<UrlState>) {
    write(router, route, patchObj);
  }

  return { state, patch };
}
