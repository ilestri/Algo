import { defineStore } from 'pinia';
import type { AlgoModule } from '@/types/step';

export const useRegistryStore = defineStore('registry', {
  state: () => ({
    modules: new Map<string, AlgoModule>(),
  }),
  actions: {
    register(mod: AlgoModule) {
      this.modules.set(mod.descriptor.id, mod);
    },
    get(id: string) {
      return this.modules.get(id);
    },
    list() {
      return Array.from(this.modules.values()).sort((a, b) => {
        if (a.descriptor.category === b.descriptor.category) {
          return a.descriptor.title.localeCompare(b.descriptor.title, 'ko');
        }
        return a.descriptor.category.localeCompare(b.descriptor.category);
      });
    },
  },
});
