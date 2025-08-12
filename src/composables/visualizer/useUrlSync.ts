import {watch, type Ref, type ComputedRef} from 'vue';
import type {AlgoDescriptor} from '@/types/step';

interface UrlSyncOptions {
  selectedId: Ref<string>;
  input: any;
  speed: Ref<number>;
  currentMeta: ComputedRef<AlgoDescriptor | null>;
  buildAndLoadSteps: () => void;
  urlState: Ref<any>;
  patch: (payload: any) => void;
  patchSelected: (id: string) => void;
}

export function useUrlSync({
  selectedId,
  input,
  speed,
  currentMeta,
  buildAndLoadSteps,
  urlState,
  patch,
  patchSelected,
}: UrlSyncOptions) {

  watch(selectedId, (id) => {
    patchSelected(id);
    const plainInput = JSON.parse(JSON.stringify(input));
    patch({algo: id, input: plainInput, speed: speed.value});
  });

  watch(
    () => urlState.value.algo,
    (nv) => {
      if (nv && nv !== selectedId.value) {
        selectedId.value = nv;
      }
    },
    {immediate: true},
  );

  watch(
    () => urlState.value.input,
    (nv) => {
      if (!nv) return;
      const normalize = (currentMeta.value as any)?.normalizeInput ?? ((x: any) => x);
      const normalized = normalize(nv);
      Object.keys(input).forEach((k) => delete (input as any)[k]);
      Object.assign(input, JSON.parse(JSON.stringify(normalized)));
      buildAndLoadSteps();
    },
    {deep: true},
  );
  watch(
    () => currentMeta.value,
    (meta) => {
      if (!meta) return;
      const src = urlState.value.input ?? meta.defaultInput;
      const normalize = (meta as any)?.normalizeInput ?? ((x: any) => x);
      const normalized = normalize(src);
      Object.keys(input).forEach((k) => delete (input as any)[k]);
      Object.assign(input, JSON.parse(JSON.stringify(normalized)));
      if (!urlState.value.input) {
        patch({algo: selectedId.value, input: JSON.parse(JSON.stringify(input))});
      }
      buildAndLoadSteps();
    },
    {immediate: true},
  );
}

