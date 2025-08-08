export function useStepsWorker() {
  const worker = new Worker(new URL('@/workers/steps-worker.ts', import.meta.url), { type: 'module' });
  function run(algo:string, payload:any){
    return new Promise((resolve) => {
      worker.onmessage = (e) => resolve((e.data as any).steps);
      worker.postMessage({ algo, payload });
    });
  }
  return { run };
}
