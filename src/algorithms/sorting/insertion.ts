import type { Step } from '../../types/steps'
/**
Pseudocode:
1: for i ← 1 to n-1
2:   key ← a[i]
3:   j ← i - 1
4:   while j ≥ 0 and a[j] > key
5:     a[j+1] ← a[j]; j ← j - 1
6:   a[j+1] ← key
*/
export const pseudocode = [
  'for i ← 1 to n-1',
  '  key ← a[i]',
  '  j ← i - 1',
  '  while j ≥ 0 and a[j] > key',
  '    a[j+1] ← a[j]; j ← j - 1',
  '  a[j+1] ← key'
]

export function* generate(input: number[]): Generator<Step> {
  const a = [...input]
  const n = a.length
  for (let i = 1; i < n; i++) {
    const key = a[i]
    yield { type: 'highlight', payload: { i }, pc: [1,2], explain: `키 선택: ${key}` }
    let j = i - 1
    while (j >= 0 && a[j] > key) {
      yield { type: 'compare', payload: { i: j, key }, pc: [4], explain: `a[${j}]와 key 비교` }
      a[j + 1] = a[j]
      yield { type: 'insert', payload: { i: j + 1, value: a[j] }, pc: [5], explain: `shift` }
      j--
    }
    a[j + 1] = key
    yield { type: 'insert', payload: { i: j + 1, value: key }, pc: [6], explain: `key 삽입` }
  }
}

export function apply(state: any, step: Step, metrics: any) {
  const s = { ...state, highlight: [] as number[] }
  if (step.type === 'highlight') {
    s.highlight = [step.payload.i]
  } else if (step.type === 'compare') {
    s.highlight = [step.payload.i]
    metrics.compares++
  } else if (step.type === 'insert') {
    s.array[step.payload.i] = step.payload.value
  }
  return s
}
import type { Step, AlgoDescriptor } from '@/types/step';

/**
 * @complexity 시간: O(n^2), 공간: O(1)
 * @pseudocodeIndex
 * 1: for i ← 1 to n-1
 * 2:   key ← A[i]; j ← i-1
 * 3:   while j ≥ 0 and A[j] > key
 * 4:     A[j+1] ← A[j]; j ← j-1
 * 5:   A[j+1] ← key
 */
export function stepsOf(input: { array: number[] }): Step[] {
  const a = input.array.slice();
  const steps: Step[] = [];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    const key = a[i];
    steps.push({ type: 'highlight', payload: { i }, pc: [1], explain: `i=${i} 위치의 값을 삽입 정렬` });
    let j = i - 1;

    steps.push({ type: 'pointer', payload: { name: 'key', index: i }, pc: [2], explain: `key=A[${i}]=${key}` });

    while (j >= 0 && a[j] > key) {
      steps.push({ type: 'compare', payload: { i: j, key }, pc: [3], explain: `A[${j}](${a[j]}) > key(${key}) 비교` });
      a[j + 1] = a[j];
      steps.push({ type: 'setValue', payload: { index: j + 1, value: a[j] }, pc: [4], explain: `A[${j + 1}] ← A[${j}] (${a[j]})` });
      j--;
    }
    a[j + 1] = key;
    steps.push({ type: 'setValue', payload: { index: j + 1, value: key }, pc: [5], explain: `A[${j + 1}] ← key (${key})` });
  }

  // 완료 표시(선택)
  for (let k = 0; k < n; k++) {
    steps.push({ type: 'markSorted', payload: { i: k }, pc: [5], explain: `정렬 완료 위치 ${k}` });
  }

  return steps;
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/insertion',
  category: 'sorting',
  title: '삽입 정렬 (Insertion Sort)',
  pseudocode: [
    'for i ← 1 to n-1',
    '  key ← A[i]; j ← i-1',
    '  while j ≥ 0 and A[j] > key:',
    '    A[j+1] ← A[j]; j ← j-1',
    '  A[j+1] ← key',
  ],
  complexity: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)' },
  defaultInput: { array: [10, 3, 7, 2, 5, 8] },
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array) ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x)) : [];
    return { array: arr.slice(0, 5000) };
  },
};
export function init({ array }: { array?: number[] }) {
  const arr = array && array.length ? array : [5, 3, 8, 1, 4]
  return { input: arr, state: { array: [...arr], highlight: [] } }
}

export const adapter = {
  canvas: 'array' as const,
  init,
  generate,
  apply,
  pseudocode,
  code: generate.toString()
}
