import type { AlgoModule, AlgoDescriptor } from '@/types/step';
import { useRegistryStore } from '@/stores/registry';
import {descriptor} from "./graph/bfs";

/**
 * src/algorithms/**/registry.ts 를 제외한 모든 알고리즘 모듈을 지연 로딩한다.
 * 각 모듈은 { descriptor, stepsOf, snapshotStrategy? }를 export 해야 한다.
 */
const moduleLoaders = import.meta.glob<true, string, { descriptor: AlgoDescriptor<any>, stepsOf: Function, snapshotStrategy?: any }>(
  [
    './**/*.ts',
    '!./**/registry.ts',
  ],
  { eager: false }
);

let initialized = false;

export async function initAlgorithms() {
  if (initialized) return;
  const store = useRegistryStore();

  const entries = Object.entries(moduleLoaders);
  for (const [path, loader] of entries) {
    try {
      const mod: any = await loader();
      if (mod && mod.descriptor && typeof mod.stepsOf === 'function') {
        const algo: AlgoModule = {
          descriptor: mod.descriptor,
          stepsOf: mod.stepsOf,
          snapshotStrategy: mod.snapshotStrategy,
        };
        store.register(algo);
      } else {
        // descriptor/stepsOf 누락 시 스킵
        // console.warn(`[algorithms/registry] Invalid module shape at ${path}`);
      }
    } catch (e) {
      // 모듈 로딩 실패는 전체 초기화를 중단하지 않음
      // console.error(`[algorithms/registry] Failed to load ${path}`, e);
    }
  }
  initialized = true;
}

/** 정렬된 descriptor 목록 반환(카테고리 > 한글 제목) */
export function listDescriptors(): AlgoDescriptor[] {
  const store = useRegistryStore();
  return store.list().map(m => m.descriptor);
}

/** id로 모듈 조회 */
export function getAlgorithm(id: string): AlgoModule | undefined {
  const store = useRegistryStore();
  return store.get(id);
}
