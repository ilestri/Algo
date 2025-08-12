import {type Ref, type ComputedRef, watch} from 'vue';
import {useUrlState} from '@/composables/useUrlState';
import {useUrlSync} from '@/composables/visualizer/useUrlSync';
import type {AlgoDescriptor} from '@/types/step';

interface UrlManagerArgs {
  selectedId: Ref<string>;
  input: any;
  speed: Ref<number>;
  currentMeta: ComputedRef<AlgoDescriptor | null>;
  buildAndLoadSteps: () => void;
  setSpeed: (val: number) => void;
  patchSelected: (id: string) => void;
}

export function useUrlManager({
  selectedId,
  input,
  speed,
  currentMeta,
  buildAndLoadSteps,
  setSpeed,
  patchSelected,
}: UrlManagerArgs) {
  const {state: urlState, patch} = useUrlState();

  useUrlSync({
    selectedId,
    input,
    speed,
    currentMeta,
    buildAndLoadSteps,
    urlState,
    patch,
    patchSelected,
  });

  watch(
    () => urlState.value.speed,
    (nv) => {
      if (typeof nv === 'number' && !Number.isNaN(nv)) {
        setSpeed(nv);
      }
    },
    { immediate: true },
  );

  function onSpeedChange(val: number) {
    setSpeed(val);
    const plainInput = JSON.parse(JSON.stringify(input));
    patch({algo: selectedId.value, input: plainInput, speed: val});
  }

  return {urlState, onSpeedChange};
}
