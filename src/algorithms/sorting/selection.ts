import type { Step, AlgoDescriptor } from '@/types/step';
/**
Pseudocode:
1: for i ← 0 to n-2
2:   min ← i
3:   for j ← i+1 to n-1
4:     if a[j] < a[min] then min ← j
5:   swap a[i], a[min]
*/
export const pseudocode = [
  'for i ← 0 to n-2',
  '  min ← i',
  '  for j ← i+1 to n-1',
  '    if a[j] < a[min] then min ← j',
  '  swap a[i], a[min]'
]

export function* generate(input: number[]): Generator<Step> {
  const a = [...input]
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    let min = i
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', payload: { i: j, j: min }, pc: [3,4], explain: `최솟값 후보 비교` }
      if (a[j] < a[min]) min = j
    }
    if (min !== i) {
      yield { type: 'swap', payload: { i, j: min }, pc: [5], explain: '최솟값과 교환' }
      ;[a[i], a[min]] = [a[min], a[i]]
    }
  }
}

export function apply(state: any, step: Step, metrics: any) {
  const s = { ...state, highlight: [] as number[] }
  if (step.type === 'compare') {
    s.highlight = [step.payload.i, step.payload.j]
    metrics.compares++
  } else if (step.type === 'swap') {
    const { i, j } = step.payload
    ;[s.array[i], s.array[j]] = [s.array[j], s.array[i]]
    s.highlight = [i, j]
    metrics.swaps++
  }
  return s
}

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
