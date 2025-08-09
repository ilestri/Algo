import { describe, it, expect } from 'vitest'
import { generate, init } from '@/algorithms/sorting/bubble'

describe('bubble sort generator', () => {
  it('produces steps and final array is sorted when applied', () => {
    const arr = [5, 1, 4, 2, 8]
    const steps = [...generate(arr)]
    const state = init({ array: arr }).state
    const metrics = { compares: 0, swaps: 0, visits: 0, steps: () => steps.length }
    let s = state
    for (const st of steps) {
      // @ts-ignore apply is default export in module adapter but omitted here for isolation
      const { apply } = require('@/algorithms/sorting/bubble')
      s = apply(s, st, metrics)
    }
    expect([...s.array]).toEqual([1, 2, 4, 5, 8])
    expect(metrics.compares).toBeGreaterThan(0)
  })
})
