import { describe, it, expect, vi } from 'vitest'
import { useStepRunner } from '../src/composables/useStepRunner'

describe('useStepRunner', () => {
  it('steps forward/back and sets speed', () => {
    const onTick = vi.fn()
    const runner = useStepRunner({ onTick })
    expect(runner.stepIndex).toBe(0)
    runner.stepForward()
    expect(runner.stepIndex).toBe(1)
    runner.stepBack()
    expect(runner.stepIndex).toBe(0)
    runner.setSpeed(2)
    expect(runner.speed).toBe(2)
    expect(onTick).toHaveBeenCalled()
  })
})
