import { describe, it, expect } from 'vitest';
import { useStepRunner } from './useStepRunner';
import type { Step } from '@/types/step';

describe('useStepRunner', () => {
  it('advances and rewinds', () => {
    const steps: Step[] = Array.from({length:5},()=>({type:'visit',payload:{},pc:[1],explain:''}));
    const r = useStepRunner({ initialState: {}, steps });
    r.stepForward(); expect(r.index.value).toBe(1);
    r.stepBack(); expect(r.index.value).toBe(0);
  });
});
