import { describe, it, expect } from 'vitest';
import { quickSortSteps } from '@/algorithms/sorting/quick';

describe('quickSortSteps', () => {
  it('emits non-empty steps', () => {
    const steps = quickSortSteps([3,1,2]);
    expect(steps.length).toBeGreaterThan(0);
  });
});
