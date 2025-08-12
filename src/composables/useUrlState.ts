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
  const encoded = route.query.s as string | undefined;

  let payload: any = null;
  if (encoded) {
    payload = decodeState<any>(encoded);
  }

  let input: any = undefined;
  if (payload?.array !== undefined || payload?.key !== undefined) {
    input = {};
    if (payload.array !== undefined) input.array = payload.array;
    if (payload.key !== undefined) input.key = payload.key;
  }
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

  const payload: any = { speed: merged.speed };
  if (merged.input?.array !== undefined) payload.array = merged.input.array;
  if (merged.input?.key !== undefined) payload.key = merged.input.key;
  const s = encodeState(payload);
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
