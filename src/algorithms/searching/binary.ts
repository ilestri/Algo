import type { Step } from '../../types/steps'
/**
Pseudocode:
1: l ← 0, r ← n-1
2: while l ≤ r
3:   m ← ⌊(l + r)/2⌋
4:   if a[m] == x return m
5:   else if a[m] < x then l ← m+1
6:   else r ← m-1
*/
export const pseudocode = [
  'l ← 0, r ← n-1',
  'while l ≤ r',
  '  m ← ⌊(l + r)/2⌋',
  '  if a[m] == x return m',
  '  else if a[m] < x then l ← m+1',
  '  else r ← m-1'
]

export function* generate({ array, x }: { array: number[], x: number }): Generator<Step> {
  let l = 0, r = array.length - 1
  while (l <= r) {
    yield { type: 'highlightRange', payload: { l, r }, pc: [2], explain: '검색 범위' }
    const m = Math.floor((l + r) / 2)
    yield { type: 'compare', payload: { i: m }, pc: [3,4], explain: `중간값 비교` }
    if (array[m] === x) {
      yield { type: 'visit', payload: { i: m }, pc: [4], explain: '발견' }
      return
    } else if (array[m] < x) {
      l = m + 1
      yield { type: 'highlightRange', payload: { l, r }, pc: [5], explain: '오른쪽 절반' }
    } else {
      r = m - 1
      yield { type: 'highlightRange', payload: { l, r }, pc: [6], explain: '왼쪽 절반' }
    }
  }
}

export function apply(state: any, step: Step, metrics: any) {
  const s = { ...state, highlight: [] as number[], range: state.range }
  if (step.type === 'highlightRange') {
    s.range = { l: step.payload.l, r: step.payload.r }
  } else if (step.type === 'compare') {
    s.highlight = [step.payload.i]
    metrics.compares++
  } else if (step.type === 'visit') {
    s.found = step.payload.i
  }
  return s
}

export function init({ array }: { array?: number[] }) {
  const arr = array && array.length ? array : [1, 3, 4, 5, 7, 8, 10]
  const x = arr[Math.floor(arr.length / 2)]
  return { input: { array: arr, x }, state: { array: [...arr], highlight: [], range: { l: 0, r: arr.length - 1 }, found: null } }
}

export const adapter = {
  canvas: 'array' as const,
  init,
  generate,
  apply,
  pseudocode,
  code: generate.toString()
}
import type { Step, AlgoDescriptor } from '@/types/step';

/**
 * @complexity 시간: O(log n), 공간: O(1)
 * @pseudocodeIndex
 * 1: l ← 0; r ← n-1
 * 2: while l ≤ r
 * 3:   m ← ⌊(l+r)/2⌋
 * 4:   if A[m] == key: return m
 * 5:   else if A[m] < key: l ← m+1
 * 6:   else: r ← m-1
 */
export function stepsOf(input: { array: number[]; key: number }): Step[] {
  const a = input.array.slice().sort((x, y) => x - y);
  const key = input.key;
  const steps: Step[] = [];

  let l = 0, r = a.length - 1;
  steps.push({ type: 'highlightRange', payload: { l, r }, pc: [1], explain: `탐색 구간 초기화 [${l}, ${r}]` });

  while (l <= r) {
    steps.push({ type: 'highlightRange', payload: { l, r }, pc: [2], explain: `현재 구간 [${l}, ${r}]` });
    const m = (l + r) >> 1;
    steps.push({ type: 'compare', payload: { i: m }, pc: [3, 4], explain: `중앙 인덱스 ${m} 값과 키 비교` });
    if (a[m] === key) {
      steps.push({ type: 'visit', payload: { i: m }, pc: [4], explain: `키 발견: 인덱스 ${m}` });
      break;
    } else if (a[m] < key) {
      steps.push({ type: 'pointer', payload: { name: 'l', index: m + 1 }, pc: [5], explain: `좌측 경계 이동: l=${m + 1}` });
      l = m + 1;
    } else {
      steps.push({ type: 'pointer', payload: { name: 'r', index: m - 1 }, pc: [6], explain: `우측 경계 이동: r=${m - 1}` });
      r = m - 1;
    }
  }
  return steps;
}

export const descriptor: AlgoDescriptor<{ array: number[]; key: number }> = {
  id: 'searching/binary',
  category: 'searching',
  title: '이진 탐색 (Binary Search)',
  pseudocode: [
    'l ← 0; r ← n-1',
    'while l ≤ r:',
    '  m ← ⌊(l+r)/2⌋',
    '  if A[m] == key: return m',
    '  else if A[m] < key: l ← m+1',
    '  else: r ← m-1'
  ],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  defaultInput: { array: [1, 3, 5, 7, 9, 11, 13], key: 7 },
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array) ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x)) : [];
    const key = Number(raw?.key);
    return { array: arr.slice(0, 5000), key: Number.isFinite(key) ? key : 0 };
  }
};