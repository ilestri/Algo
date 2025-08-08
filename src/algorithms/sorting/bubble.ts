import type { Step } from '../../types/steps'

/**
Pseudocode (라인 번호):
1: for i from 0 to n-2
2:   for j from 0 to n-i-2
3:     compare a[j], a[j+1]
4:     if a[j] > a[j+1]
5:       swap a[j], a[j+1]
*/
export const pseudocode = [
  'for i ← 0 to n-2',
  '  for j ← 0 to n-i-2',
  '    compare a[j], a[j+1]',
  '    if a[j] > a[j+1]',
  '      swap a[j], a[j+1]'
]

export function* generate(input: number[]): Generator<Step> {
  const a = [...input]
  const n = a.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', payload: { i: j, j: j + 1 }, pc: [3], explain: `인덱스 ${j}와 ${j+1} 비교` }
      if (a[j] > a[j + 1]) {
        yield { type: 'swap', payload: { i: j, j: j + 1 }, pc: [4,5], explain: '두 원소 교환' }
        const t = a[j]; a[j] = a[j+1]; a[j+1] = t
      }
    }
  }
}

// 시각화 상태 적용
export function apply(state: any, step: Step, metrics: any) {
  const s = { ...state }
  s.highlight = []
  if (step.type === 'compare') {
    const { i, j } = step.payload
    s.highlight = [i, j]
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
