import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { initAlgorithms, __setModuleLoaders, __restoreModuleLoaders } from '../src/algorithms/registry';
import { useRegistryStore } from '../src/stores/registry';
import { createPinia, setActivePinia } from 'pinia';

describe('algorithm registry logging', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    __restoreModuleLoaders();
    const store = useRegistryStore();
    store.$reset();
  });

  it('warns when module shape is invalid', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    __setModuleLoaders({
      './bad.ts': () => Promise.resolve({}),
    });

    await initAlgorithms();
    expect(warn).toHaveBeenCalledWith('[algorithms/registry] Invalid module shape at ./bad.ts');
    warn.mockRestore();
  });

  it('errors when module fails to load', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    __setModuleLoaders({
      './fail.ts': () => Promise.reject(new Error('fail')),
    });

    await initAlgorithms();
    expect(error.mock.calls[0][0]).toContain('[algorithms/registry] Failed to load ./fail.ts');
    error.mockRestore();
  });
});
