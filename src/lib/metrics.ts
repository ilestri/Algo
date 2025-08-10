import type { RunMetrics } from '@/types/step';

export const initialMetrics: RunMetrics = {
  steps: 0,
  compares: 0,
  swaps: 0,
  visits: 0,
  relaxes: 0,
  enqueues: 0,
  dequeues: 0,
};
