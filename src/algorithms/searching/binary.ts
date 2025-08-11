import type {Step, AlgoDescriptor} from '@/types/step'
import {pushStep} from '@/lib/steps'

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

type BinarySearchEvent =
  | { type: 'init'; l: number; r: number }
  | { type: 'range'; l: number; r: number }
  | { type: 'mid'; m: number }
  | { type: 'compare'; m: number }
  | { type: 'found'; m: number }
  | { type: 'moveL'; l: number; r: number }
  | { type: 'moveR'; l: number; r: number }

function* coreBinarySearch(a: number[], x: number): Generator<BinarySearchEvent> {
  let l = 0,
    r = a.length - 1
  yield { type: 'init', l, r }
  while (l <= r) {
    yield { type: 'range', l, r }
    const m = (l + r) >> 1
    yield { type: 'mid', m }
    yield { type: 'compare', m }
    if (a[m] === x) {
      yield { type: 'found', m }
      break
    } else if (a[m] < x) {
      l = m + 1
      yield { type: 'moveL', l, r }
    } else {
      r = m - 1
      yield { type: 'moveR', l, r }
    }
  }
}

export function* generate({array, x}: { array: number[]; x: number }): Generator<Step> {
  for (const e of coreBinarySearch(array, x)) {
    switch (e.type) {
      case 'range':
        yield {
          type: 'highlightRange',
          payload: { l: e.l, r: e.r },
          pc: [2],
          explain: '검색 범위',
        }
        break
      case 'compare':
        yield {
          type: 'compare',
          payload: { i: e.m },
          pc: [3, 4],
          explain: '중간값 비교',
        }
        break
      case 'found':
        yield { type: 'visit', payload: { i: e.m }, pc: [4], explain: '발견' }
        return
      case 'moveL':
        yield {
          type: 'highlightRange',
          payload: { l: e.l, r: e.r },
          pc: [5],
          explain: '오른쪽 절반',
        }
        break
      case 'moveR':
        yield {
          type: 'highlightRange',
          payload: { l: e.l, r: e.r },
          pc: [6],
          explain: '왼쪽 절반',
        }
        break
    }
  }
}

export function apply(state: any, step: Step, metrics: any) {
  const s = {...state, highlight: [] as number[], range: state.range}
  if (step.type === 'highlightRange') {
    s.range = {l: step.payload.l, r: step.payload.r}
  } else if (step.type === 'compare') {
    s.highlight = [step.payload.i]
    metrics.compares++
  } else if (step.type === 'visit') {
    s.found = step.payload.i
  }
  return s
}

export function init({array}: { array?: number[] }) {
  const arr = array && array.length ? array : [1, 3, 4, 5, 7, 8, 10]
  const x = arr[Math.floor(arr.length / 2)]
  return {
    input: {array: arr, x},
    state: {array: [...arr], highlight: [], range: {l: 0, r: arr.length - 1}, found: null}
  }
}

export const adapter = {
  canvas: 'array' as const,
  init,
  generate,
  apply,
  pseudocode,
  code: generate.toString()
}

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
  // 입력을 그대로 사용(자동 정렬하지 않음)
  const a = input.array.slice()
  const key = input.key
  const steps: Step[] = []

  for (const e of coreBinarySearch(a, key)) {
    switch (e.type) {
      case 'init':
        pushStep(steps, 'pointer', { name: 'l', index: e.l }, [1], `좌측 경계 초기화 l=${e.l}`)
        pushStep(steps, 'pointer', { name: 'r', index: e.r }, [1], `우측 경계 초기화 r=${e.r}`)
        pushStep(steps, 'highlightRange', { l: e.l, r: e.r }, [1], `탐색 구간 초기화 [${e.l}, ${e.r}]`)
        break
      case 'range':
        pushStep(steps, 'highlightRange', { l: e.l, r: e.r }, [2], `현재 구간 [${e.l}, ${e.r}]`)
        break
      case 'mid':
        pushStep(steps, 'pointer', { name: 'm', index: e.m }, [3], `중앙 인덱스 설정 m=${e.m}`)
        break
      case 'compare':
        pushStep(steps, 'compare', { i: e.m }, [3, 4], `중앙 인덱스 ${e.m} 값과 키 비교`)
        break
      case 'found':
        pushStep(steps, 'visit', { i: e.m }, [4], `키 발견: 인덱스 ${e.m}`)
        break
      case 'moveL':
        pushStep(steps, 'pointer', { name: 'l', index: e.l }, [5], `좌측 경계 이동: l=${e.l}`)
        break
      case 'moveR':
        pushStep(steps, 'pointer', { name: 'r', index: e.r }, [6], `우측 경계 이동: r=${e.r}`)
        break
    }
  }
  return steps
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
  complexity: {best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)'},
  defaultInput: {array: [1, 3, 5, 7, 9, 11, 13], key: 7},
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array) ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x)) : [];
    const key = Number(raw?.key);
    return {array: arr.slice(0, 5000), key: Number.isFinite(key) ? key : 0};
  }
};