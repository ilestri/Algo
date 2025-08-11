import { defineStore } from 'pinia';
import type { PersistedStateOptions } from 'pinia-plugin-persistedstate';
import type { Step, RunMetrics } from '@/types/step';
import { initialMetrics } from '@/lib/metrics';

interface SessionState<I = Record<string, unknown>, S = unknown> {
  input: I;
  steps: Step[];
  snapshots: S[];
  metrics: RunMetrics;
  pc: number[];
  explain: string;
}

const createState = <I = Record<string, unknown>, S = unknown>(): SessionState<I, S> => ({
  input: {} as I,
  steps: [],
  snapshots: [] as S[],
  metrics: { ...initialMetrics },
  pc: [],
  explain: '',
});

export const useSessionStore = defineStore('session', {
  state: () => createState(),
  actions: {
    reset() {
      Object.assign(this, createState());
    },
  },
  persist: { key: 'av-session' } satisfies PersistedStateOptions,
});
