import { defineStore } from 'pinia';
import type { Step } from '@/types/step';

export const useSessionStore = defineStore('session', {
  state: () => ({
    input: {} as any,
    steps: [] as Step[],
    snapshots: [] as any[], // 이전 상태 스냅샷(옵션)
    metrics: { steps: 0, compares: 0, swaps: 0, visits: 0, relaxes: 0, enqueues: 0 },
  }),
});
