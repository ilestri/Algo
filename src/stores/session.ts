import { defineStore } from 'pinia';
import type { Step, RunMetrics } from '@/types/step';
import { initialMetrics } from '@/lib/metrics';

export const useSessionStore = defineStore('session', {
  state: () => ({
    input: {} as any,
    steps: [] as Step[],
    snapshots: [] as any[], // 스냅샷(전략에 따라)
    metrics: { ...initialMetrics } as RunMetrics,
    pc: [] as number[],
    explain: '' as string,
  }),
  actions: {
    reset() {
      this.input = {} as any;
      this.steps = [];
      this.snapshots = [];
      this.metrics = { ...initialMetrics };
      this.pc = [];
      this.explain = '';
    },
  },
  persist: { key: 'av-session' } as any,
});
