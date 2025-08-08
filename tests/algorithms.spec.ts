import { describe, it, expect } from 'vitest';
import { isSortedAsc } from '../src/lib/array-utils';
import { stepsOf as quickSteps } from '../src/algorithms/sorting/quick';
import { stepsOf as mergeSteps } from '../src/algorithms/sorting/merge';
import { stepsOf as bubbleSteps } from '../src/algorithms/sorting/bubble';
import { stepsOf as insertionSteps } from '../src/algorithms/sorting/insertion';

function applySortingSteps(initial: number[], steps: any[]) {
  const arr = initial.slice();
  for (const s of steps) {
    if (s.type === 'swap') {
      const { i, j } = s.payload;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    } else if (s.type === 'setValue') {
      const { index, value } = s.payload;
      arr[index] = value;
    }
  }
  return arr;
}

describe('Sorting algorithms steps', () => {
  const input = { array: [10, 3, 7, 2, 5, 8] };

  it('QuickSort generates steps and sorts correctly when applied', () => {
    const steps = quickSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const result = applySortingSteps(input.array, steps);
    expect(isSortedAsc(result)).toBe(true);
  });

  it('MergeSort generates steps', () => {
    const steps = mergeSteps(input);
    expect(steps.length).toBeGreaterThan(0);
  });

  it('BubbleSort generates steps and sorts correctly when applied', () => {
    const steps = bubbleSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const result = applySortingSteps(input.array, steps);
    expect(isSortedAsc(result)).toBe(true);
  });

  it('InsertionSort generates steps and sorts correctly when applied', () => {
    const steps = insertionSteps(input);
    expect(steps.length).toBeGreaterThan(0);
    const result = applySortingSteps(input.array, steps);
    expect(isSortedAsc(result)).toBe(true);
  });
});
