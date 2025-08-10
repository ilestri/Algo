import {type Ref, type ComputedRef} from 'vue';
import {useStepsWorker} from '@/composables/useStepsWorker';
import type {AlgoModule, AlgoDescriptor, Step} from '@/types/step';

interface WorkerArgs {
  currentModule: ComputedRef<AlgoModule | undefined>;
  currentMeta: ComputedRef<AlgoDescriptor | null>;
  input: any;
  state: any;
  steps: Ref<Step[]>;
  metrics: any;
  metricsTimeline: Ref<Array<Partial<any>>>;
  pc: Ref<number[]>;
  explain: Ref<string>;
  session: any;
  reset: () => void;
  jumpTo: (i: number) => void;
  patch: (payload: any) => void;
  selectedId: Ref<string>;
  speed: Ref<number>;
}

export function useVisualizerWorker(args: WorkerArgs) {
  const stepsWorker = useStepsWorker({bigArray: 5000, bigNodes: 1000});

  async function buildAndLoadSteps(shouldPatch: boolean = true) {
    const mod = args.currentModule.value;
    const meta = args.currentMeta.value as any;
    if (!mod || !meta) return;

    const normalize = meta.normalizeInput ?? ((x: any) => x);
    const normalized = normalize(JSON.parse(JSON.stringify(args.input)));

    if (meta.category === 'sorting' || meta.category === 'searching') {
      args.state.array = Array.isArray(normalized.array) ? normalized.array.slice() : [];
    }
    args.state.highlight = [];
    args.state.sorted = new Set<number>();
    args.state.highlightRange = null;
    args.state.pivotIndex = null;
    args.state.pointers = [];
    args.state.found = null;

    try {
      const generated: Step[] = await stepsWorker.generate(
        mod.descriptor.id,
        normalized,
        () => mod.stepsOf(normalized),
      );
      const newSteps = Array.isArray(generated) ? generated : [];
      args.steps.value.splice(0, args.steps.value.length, ...newSteps);
    } catch {
      args.steps.value.splice(0, args.steps.value.length);
    }

    args.metrics.steps = 0;
    args.metrics.compares = 0;
    args.metrics.swaps = 0;
    args.metrics.visits = 0;
    args.metrics.relaxes = 0;
    args.metrics.enqueues = 0;
    args.metrics.dequeues = 0;
    args.metricsTimeline.value = [];

    args.pc.value = [];
    args.explain.value = '';
    args.session.pc = args.pc.value;
    args.session.explain = args.explain.value;

    try {
      args.reset();
      args.jumpTo(0);
    } catch {
      // noop
    }

    if (shouldPatch) {
      const plainInput = JSON.parse(JSON.stringify(args.input));
      args.patch({algo: args.selectedId.value, input: plainInput, speed: args.speed.value});
    }
  }

  return {buildAndLoadSteps};
}

