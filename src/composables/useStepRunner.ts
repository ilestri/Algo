import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

type Options = {
  onTick?: (index: number) => void // index는 1-based로 현재 적용된 step 수
}

export function useStepRunner(options: Options = {}) {
  const isPlaying = ref(false)
  const speed = ref(1) // 0.25 ~ 4
  const stepIndex = ref(0) // 적용된 step 수 (0 = 초기 상태)
  let raf = 0
  let last = 0

  function loop(ts: number) {
    if (!isPlaying.value) return
    if (!last) last = ts
    const delta = ts - last
    const interval = 500 / speed.value // 기본 0.5초/step
    if (delta >= interval) {
      last = ts
      stepForward()
    }
    raf = requestAnimationFrame(loop)
  }

  function toggle() {
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) {
      last = 0
      raf = requestAnimationFrame(loop)
    } else {
      cancelAnimationFrame(raf)
    }
  }

  function setSpeed(v: number) {
    speed.value = Math.min(4, Math.max(0.25, v))
  }

  function stepForward() {
    stepIndex.value += 1
    options.onTick?.(stepIndex.value)
  }

  function stepBack() {
    stepIndex.value = Math.max(0, stepIndex.value - 1)
    options.onTick?.(stepIndex.value)
  }

  function reset() {
    stepIndex.value = 0
    options.onTick?.(stepIndex.value)
  }

  function skipToEnd(total = Infinity) {
    stepIndex.value = total
    options.onTick?.(stepIndex.value)
  }

  onBeforeUnmount(() => cancelAnimationFrame(raf))

  // 키보드
  function onKey(e: KeyboardEvent) {
    if (e.key === ' ') { e.preventDefault(); toggle() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepForward() }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepBack() }
    else if (e.key === 'Home') { e.preventDefault(); reset() }
    else if (e.key === 'End') { e.preventDefault(); skipToEnd() }
  }
  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

  return reactive({ isPlaying, speed, stepIndex, toggle, setSpeed, stepForward, stepBack, reset, skipToEnd })
}
