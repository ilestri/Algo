import { ref, computed } from 'vue';
import type { Step } from '@/types/step';

export function useStepRunner<TState>(opts: {
  initialState: TState;
  steps: Step[];
  fps?: number; // 내부 프레임–초당 틱(기본 60)
}) {
  const fps = opts.fps ?? 60;
  const speed = ref(1); // 0.25x ~ 4x
  const index = ref(0); // 현재 스텝 인덱스
  const playing = ref(false);
  const done = computed(() => index.value >= opts.steps.length);

  let _timer: number | null = null;

  function play() {
    if (done.value) return;
    playing.value = true;
    loop();
  }
  function pause() {
    playing.value = false;
    if (_timer) cancelAnimationFrame(_timer);
  }
  function reset() { pause(); index.value = 0; }
  function stepForward(n = 1) { index.value = Math.min(opts.steps.length, index.value + n); }
  function stepBack(n = 1) { index.value = Math.max(0, index.value - n); }
  function setSpeed(v: number) { speed.value = Math.min(4, Math.max(0.25, v)); }

  function loop() {
    const interval = 1000 / (fps * speed.value);
    let last = performance.now();
    const tick = () => {
      if (!playing.value) return;
      const now = performance.now();
      if (now - last >= interval) { last = now; stepForward(1); if (done.value) { pause(); return; } }
      _timer = requestAnimationFrame(tick);
    };
    _timer = requestAnimationFrame(tick);
  }

  return { speed, index, playing, done, play, pause, reset, stepForward, stepBack, setSpeed };
}
