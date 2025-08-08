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
