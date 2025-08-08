self.onmessage = (e: MessageEvent) => {
  const { algo, payload } = e.data as { algo: string; payload:any };
  // TODO: algo에 따라 스텝 생성기 호출(동일 파일 복사 or importScripts)
  // 예: if (algo === 'sorting/quick') { const steps = quickSortSteps(payload.array); postMessage({ steps }); }
  postMessage({ steps: [] });
};
/// <reference lib="webworker" />
import type { Step } from '@/types/step';

type InMsg =
  | { type: 'generate', id: string, input: any }
  ;
type OutMsg =
  | { type: 'result', id: string, steps: Step[] }
  | { type: 'error', id: string, message: string }
  ;

const loaders = import.meta.glob('../algorithms/**/!(*registry).ts');

self.onmessage = async (e: MessageEvent<InMsg>) => {
  const msg = e.data;
  if (msg.type === 'generate') {
    try {
      // id 예: 'sorting/quick'
      const key = Object.keys(loaders).find(p => p.endsWith(`${msg.id}.ts`));
      if (!key) {
        (self as any).postMessage({ type: 'error', id: msg.id, message: `알고리즘 모듈을 찾을 수 없습니다: ${msg.id}` } as OutMsg);
        return;
      }
      const mod: any = await (loaders as any)[key]();
      const steps: Step[] = typeof mod.stepsOf === 'function' ? mod.stepsOf(msg.input) : [];
      (self as any).postMessage({ type: 'result', id: msg.id, steps } as OutMsg);
    } catch (err: any) {
      (self as any).postMessage({ type: 'error', id: msg.id, message: err?.message || String(err) } as OutMsg);
    }
  }
};