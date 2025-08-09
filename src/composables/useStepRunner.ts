import { ref, computed } from 'vue';
import type { Step, SnapshotStrategy, RunMetrics } from '@/types/step';
import type { StepInterpreter } from '@/lib/step-interpreter';

type RunnerEvent = 'beforeStep' | 'afterStep' | 'done';

const deepClone = <T>(v: T): T => {
  try {
    const sc = (globalThis as any).structuredClone;
    if (typeof sc === 'function') return sc(v);
  } catch { void 0 }
  return JSON.parse(JSON.stringify(v));
};

export function useStepRunner<TState>(opts: {
  initialState: TState;
  steps: Step[];
  fps?: number; // 내부 프레임–초당 틱(기본 60)
  snapshotStrategy?: SnapshotStrategy; // 'full' | 'diff' | 'none'
  interpreter?: StepInterpreter<TState>;
}) {
  const fps = opts.fps ?? 60;
  const strategy: SnapshotStrategy = opts.snapshotStrategy ?? 'none';
  const steps = opts.steps;

  const speed = ref(1); // 0.25x ~ 4x
  const index = ref(0); // 현재 스텝 인덱스(적용된 개수 기준)
  const playing = ref(false);
  const done = computed(() => index.value >= steps.length);

  // 메트릭 집계
  const metrics = ref<RunMetrics>({ steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 });

  // 스냅샷(전략별)
  const snapshots: TState[] = [];
  if (strategy === 'full') snapshots[0] = deepClone(opts.initialState);

  // 이벤트 리스너
  const listeners: Record<RunnerEvent, Set<(payload?: any) => void>> = {
    beforeStep: new Set(),
    afterStep: new Set(),
    done: new Set(),
  };
  const emit = (ev: RunnerEvent, payload?: any) => listeners[ev].forEach(cb => cb(payload));
  const on = (ev: RunnerEvent, cb: (payload?: any) => void) => {
    listeners[ev].add(cb);
    return () => listeners[ev].delete(cb);
  };

  // 내부 루프 상태
  let _timer: number | null = null;
  let _last = 0;

  function play() {
    if (done.value) return;
    if (playing.value) return;
    playing.value = true;
    _last = performance.now();
    loop();
  }

  function pause() {
    playing.value = false;
    if (_timer != null) cancelAnimationFrame(_timer);
    _timer = null;
  }

  function reset() {
    pause();
    index.value = 0;
    metrics.value = { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
    if (strategy === 'full') {
      snapshots.length = 0;
      snapshots[0] = deepClone(opts.initialState);
    }
  }

  function setSpeed(v: number) { speed.value = Math.min(4, Math.max(0.25, v)); }

  function applyMetrics(step: Step) {
    metrics.value.steps += 1;
    switch (step.type) {
      case 'compare': metrics.value.compares = (metrics.value.compares || 0) + 1; break;
      case 'swap': metrics.value.swaps = (metrics.value.swaps || 0) + 1; break;
      case 'visit': metrics.value.visits = (metrics.value.visits || 0) + 1; break;
      case 'relax': metrics.value.relaxes = (metrics.value.relaxes || 0) + 1; break;
      case 'enqueue': metrics.value.enqueues = (metrics.value.enqueues || 0) + 1; break;
      case 'dequeue': metrics.value.dequeues = (metrics.value.dequeues || 0) + 1; break;
    }
  }

  function stepForward(n = 1) {
    for (let i = 0; i < n; i++) {
      if (done.value) break;
      const curIdx = index.value;           // 현재 스텝 인덱스(적용 전)
      const step = steps[curIdx];
      emit('beforeStep', { index: curIdx, step });

      // 외부 상태 인터프리터 적용(옵션)
      opts.interpreter?.apply?.(opts.initialState, step);

      // 메트릭
      applyMetrics(step);

      // 스냅샷(풀)
      if (strategy === 'full') {
        snapshots[curIdx + 1] = deepClone(opts.initialState);
      }

      index.value = curIdx + 1;
      emit('afterStep', { index: curIdx, step });

      if (index.value >= steps.length) {
        emit('done', { index: index.value - 1, step: { type: 'done', payload: null, pc: [], explain: '완료' } as Step });
        pause();
        break;
      }
    }
  }

  function stepBack(n = 1) {
    if (strategy === 'none') return; // 되감기 불가
    for (let i = 0; i < n; i++) {
      if (index.value <= 0) break;
      const prevIdx = index.value - 1;
      const step = steps[prevIdx];

      if (strategy === 'diff') {
        // 역연산 지원 시 되감기
        opts.interpreter?.revert?.(opts.initialState, step);
      } else if (strategy === 'full') {
        // 스냅샷 복원
        const snap = snapshots[prevIdx];
        if (snap != null) {
          const restored = deepClone(snap);
          // Object.assign으로 대상 객체 재할당
          Object.keys(opts.initialState as any).forEach(k => delete (opts.initialState as any)[k]);
          Object.assign(opts.initialState as any, restored as any);
        }
      }
      index.value = prevIdx;
    }
    // 메트릭은 간단히 재계산(정확성 우선)
    recomputeMetrics(index.value);
  }

  function recomputeMetrics(toIdx: number) {
    metrics.value = { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
    for (let i = 0; i < toIdx; i++) applyMetrics(steps[i]);
  }

  function jumpTo(pos: number) {
    const clamped = Math.max(0, Math.min(steps.length, pos));
    if (clamped === index.value) return;

    if (strategy === 'full' && snapshots[clamped]) {
      const snap = deepClone(snapshots[clamped]);
      Object.keys(opts.initialState as any).forEach(k => delete (opts.initialState as any)[k]);
      Object.assign(opts.initialState as any, snap as any);
      index.value = clamped;
      recomputeMetrics(clamped);
      return;
    }

    // diff/none은 반복 이동
    const delta = clamped - index.value;
    if (delta > 0) stepForward(delta);
    else stepBack(-delta);
  }

  function loop() {
    const tick = () => {
      if (!playing.value) return;
      const now = performance.now();
      const curIdx = index.value;
      const baseInterval = 1000 / (fps);
      const step = steps[curIdx];
      const target = (step?.t ?? baseInterval) / speed.value;

      if (now - _last >= target) {
        _last = now;
        stepForward(1);
        if (done.value) return;
      }
      _timer = requestAnimationFrame(tick);
    };
    _timer = requestAnimationFrame(tick);
  }

  return { speed, index, playing, done, play, pause, reset, stepForward, stepBack, setSpeed, jumpTo, on };
}
