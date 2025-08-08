import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';
type Preset = 'A';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    algoId: 'sorting/quick',
    theme: 'light' as Theme,
    preset: 'A' as Preset,
    speed: 1,
    shareUrl: '',
    workerEnabled: true,
  }),
  persist: { key: 'av-global' } as any,
});
