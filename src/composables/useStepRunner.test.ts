import { describe, it, expect } from 'vitest';
import { useStepRunner } from './useStepRunner';
import type { Step } from '@/types/step';

describe('useStepRunner', () => {
  it('advances and rewinds with afterBack payload', () => {
    const steps: Step[] = Array.from({ length: 5 }, () => ({ type: 'visit', payload: {}, pc: [1], explain: '' }));
    const r = useStepRunner({ initialState: {}, steps });
    let payload: any = null;
    r.on('afterBack', p => (payload = p));
    r.stepForward(2);
    expect(r.index.value).toBe(2);
    r.stepBack();
    expect(r.index.value).toBe(1);
    expect(payload?.index).toBe(1);
    expect(payload?.metrics.steps).toBe(1);
    expect(r.metrics.value.steps).toBe(1);
  });
});
