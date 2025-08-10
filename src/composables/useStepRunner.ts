import { ref, computed } from 'vue';
import type { Step, SnapshotStrategy, RunMetrics } from '@/types/step';
import type { StepInterpreter } from '@/lib/step-interpreter';

type RunnerEvent = 'beforeStep' | 'afterStep' | 'done';

const deepClone = <T>(v: T): T => {
  // 브라우저가 지원하면 기본 structuredClone을 우선 사용
  try {
    const sc = (globalThis as any).structuredClone;
    if (typeof sc === 'function') return sc(v);
  } catch { /* no-op */ }

  // 폴백: Set/Map/Date/Array/Object를 보존하는 수제 깊은 복제
  const seen = new WeakMap<object, any>();
  const cloneAny = (val: any): any => {
    if (val === null || typeof val !== 'object') return val;

    if (seen.has(val)) return seen.get(val);

    if (val instanceof Date) return new Date(val.getTime());

    if (val instanceof Set) {
      const out = new Set<any>();
      seen.set(val, out);
      val.forEach((item) => out.add(cloneAny(item)));
      return out;
    }

    if (val instanceof Map) {
      const out = new Map<any, any>();
      seen.set(val, out);
      val.forEach((v2, k2) => out.set(cloneAny(k2), cloneAny(v2)));
      return out;
    }

    if (Array.isArray(val)) {
      const out: any[] = [];
      seen.set(val, out);
      for (let i = 0; i < val.length; i++) {
        out[i] = cloneAny(val[i]);
      }
      return out;
    }

    const out: Record<string, any> = {};
    seen.set(val, out);
    for (const key of Object.keys(val)) {
      out[key] = cloneAny(val[key]);
    }
    return out;
  };

  return cloneAny(v);
};

export function useStepRunner<TState>(opts: {
  initialState: TState;
  steps: Step[];
  fps?: number; // 내부 프레임–초당 틱(기본 60)
  snapshotStrategy?: SnapshotStrategy; // 'full' | 'diff' | 'none'
  interpreter?: StepInterpreter<TState>;
}) {
  const fps = opts.fps ?? 60;
  const strategy: SnapshotStrategy = opts.snapshotStrategy ?? 'full';
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

  function applyMetrics(step: Step): RunMetrics {
    const delta: RunMetrics = { steps: 1, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
    switch (step.type) {
      case 'compare': delta.compares = 1; break;
      case 'swap': delta.swaps = 1; break;
      case 'visit': delta.visits = 1; break;
      case 'relax': delta.relaxes = 1; break;
      case 'enqueue': delta.enqueues = 1; break;
      case 'dequeue': delta.dequeues = 1; break;
    }
    return delta;
  }

  function accumulateMetrics(delta: RunMetrics, sign = 1) {
    metrics.value.steps += sign * delta.steps;
    if (delta.compares) metrics.value.compares = (metrics.value.compares || 0) + sign * (delta.compares || 0);
    if (delta.swaps) metrics.value.swaps = (metrics.value.swaps || 0) + sign * (delta.swaps || 0);
    if (delta.visits) metrics.value.visits = (metrics.value.visits || 0) + sign * (delta.visits || 0);
    if (delta.relaxes) metrics.value.relaxes = (metrics.value.relaxes || 0) + sign * (delta.relaxes || 0);
    if (delta.enqueues) metrics.value.enqueues = (metrics.value.enqueues || 0) + sign * (delta.enqueues || 0);
    if (delta.dequeues) metrics.value.dequeues = (metrics.value.dequeues || 0) + sign * (delta.dequeues || 0);
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
      const delta = applyMetrics(step);
      accumulateMetrics(delta);

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

      // 메트릭 역적용
      const delta = applyMetrics(step);
      accumulateMetrics(delta, -1);
    }
  }

  function recomputeMetrics(toIdx: number) {
    metrics.value = { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
    for (let i = 0; i < toIdx; i++) {
      const delta = applyMetrics(steps[i]);
      accumulateMetrics(delta);
    }
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
