export type StepType =
  | 'highlight' | 'compare' | 'swap' | 'visit' | 'insert' | 'delete'
  | 'relink' | 'enqueue' | 'dequeue' | 'relax' | 'highlightRange' | 'markSorted';

export interface Step<T = any> {
  type: StepType;
  payload: T;
  pc: number[]; // 의사코드 라인 번호 목록(1-index 기준)
  explain: string; // 한국어 해설
  t?: number;      // 선택: 해당 스텝 예상 소요(ms)
}

export interface RunMetrics {
  steps: number;
  compares?: number;
  swaps?: number;
  visits?: number;
  relaxes?: number;
  enqueues?: number;
}

export type AlgoCategory = 'sorting' | 'searching' | 'graph' | 'tree' | 'structure';

export interface AlgoDescriptor<I = any> {
  id: string;
  category: AlgoCategory;
  title: string;
  pseudocode: string[]; // 각 라인 1-index 기준 문자열
  complexity: { best: string; average: string; worst: string; space: string };
  defaultInput: I;
}
