import { defineStore } from 'pinia';

type Theme = 'light' | 'dark';
type Preset = 'A' | 'B';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    algoId: 'sorting/quick',
    theme: 'light' as Theme,
    preset: 'A' as Preset,
    speed: 1,
    shareUrl: ''
  }),
});
