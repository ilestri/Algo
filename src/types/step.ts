export type StepType =
  | 'highlight' | 'compare' | 'swap' | 'visit' | 'insert' | 'delete'
  | 'relink' | 'enqueue' | 'dequeue' | 'relax' | 'highlightRange' | 'markSorted'
  | 'setValue' | 'pivot' | 'pointer' | 'done';

export interface Step<T = any> {
  type: StepType;
  payload: T;
  pc: number[];        // 의사코드 라인 번호 1-based
  explain: string;     // 한국어 해설(한 문장)
  t?: number;          // 예상 소요(ms), 없으면 러너 속도 기준
}

export interface RunMetrics {
  steps: number;
  compares?: number;
  swaps?: number;
  visits?: number;
  relaxes?: number;
  enqueues?: number;
  dequeues?: number;
}

export type AlgoCategory = 'sorting' | 'searching' | 'graph' | 'tree' | 'structure';

export interface AlgoDescriptor<I = any> {
  id: string;                // 예: 'sorting/quick'
  category: AlgoCategory;
  title: string;
  pseudocode: string[];      // 각 라인 1-index 문자열
  complexity: { best: string; average: string; worst: string; space: string };
  defaultInput: I;
  normalizeInput: (raw: any) => I; // 입력 검증 및 정규화
}

export type SnapshotStrategy = 'full' | 'diff' | 'none';

export interface AlgoModule<I = any> {
  descriptor: AlgoDescriptor<I>;
  stepsOf(input: I): Step[];
  snapshotStrategy?: SnapshotStrategy;  // 되감기 전략
  init?: (input: any) => { state?: any; input?: any };
}
