import { defineStore } from 'pinia';
import type { Step, RunMetrics } from '@/types/step';

export const useSessionStore = defineStore('session', {
  state: () => ({
    input: {} as any,
    steps: [] as Step[],
    snapshots: [] as any[], // 스냅샷(전략에 따라)
    metrics: { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 } as RunMetrics,
    pc: [] as number[],
    explain: '' as string,
  }),
  actions: {
    reset() {
      this.input = {} as any;
      this.steps = [];
      this.snapshots = [];
      this.metrics = { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0, dequeues: 0 };
      this.pc = [];
      this.explain = '';
    },
  },
  persist: { key: 'av-session' } as any,
});
