import type { Step } from '@/types/step';
import { useGlobalStore } from '@/stores/global';

type GenerateFn = (id: string, payload: any, fallback: () => Step[]) => Promise<Step[]>;

export function useStepsWorker(opts?: { bigArray?: number; bigNodes?: number }): { generate: GenerateFn } {
  const global = useGlobalStore?.() as { workerEnabled?: boolean } | undefined;
  const BIG_ARRAY = opts?.bigArray ?? 5000;
  const BIG_NODES = opts?.bigNodes ?? 1000;

  function isBigInput(payload: any) {
    const len = Array.isArray(payload?.array) ? payload.array.length : 0;
    const n = Number(payload?.n ?? 0);
    return len >= BIG_ARRAY || n >= BIG_NODES;
  }

  function runWorker(id: string, payload: any): Promise<Step[]> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('@/workers/steps-worker.ts', import.meta.url), { type: 'module' });
      const onMsg = (e: MessageEvent<any>) => {
        const data = e.data;
        if (data?.type === 'result' && data.id === id) {
          cleanup(); resolve(data.steps as Step[]);
        } else if (data?.type === 'error' && data.id === id) {
          cleanup(); reject(new Error(data.message || 'worker error'));
        }
      };
      const cleanup = () => {
        worker.removeEventListener('message', onMsg as any);
        worker.terminate();
      };
      worker.addEventListener('message', onMsg as any);
      worker.postMessage({ type: 'generate', id, input: payload });
    });
  }

  const generate: GenerateFn = async (id, payload, fallback) => {
    const enabled = !!global?.workerEnabled;
    if (enabled && isBigInput(payload)) {
      try {
        return await runWorker(id, payload);
      } catch {
        // fallback to main thread on error
      }
    }
    return Promise.resolve(fallback());
  };

  return { generate };
}
