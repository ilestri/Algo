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
