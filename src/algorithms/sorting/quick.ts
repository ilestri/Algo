import type {Step, AlgoDescriptor} from '@/types/step'
import {createStep, markSorted} from '@/lib/steps'
import {swap} from '@/lib/array-utils'

/**
 * @complexity 시간: 최선/평균 O(n log n), 최악 O(n^2), 공간: O(log n)
 * @pseudocodeIndex
 * 1: procedure quickSort(A, l, r)
 * 2:   if l ≥ r: return
 * 3:   p ← r; i ← l
 * 4:   for j ← l to r-1
 * 5:     if A[j] < A[p]: swap A[i], A[j]; i ← i+1
 * 6:   swap A[i], A[p]; quickSort(A, l, i-1); quickSort(A, i+1, r)
 */
export function stepsOf(input: { array: number[] }): Step[] {
  const arr = input.array.slice()
  const steps: Step[] = []

  function partition(l: number, r: number, p: number) {
    steps.push(
        createStep('highlightRange', {l, r}, [3], `구간 [${l}, ${r}] 파티션`),
    )
    let i = l
    for (let j = l; j < r; j++) {
      steps.push(
          createStep('compare', {i: j, j: p}, [5], `인덱스 ${j}와 피벗 ${p} 비교`),
      )
      if (arr[j] < arr[p]) {
        swap(arr, i, j)
        steps.push(
            createStep('swap', {i, j}, [6], `인덱스 ${i}와 ${j} 교환`),
        )
        i++
      }
    }
    swap(arr, i, p)
    steps.push(
        createStep('swap', {i, j: p}, [6], `인덱스 ${i}와 ${p} 교환`),
    )
    return i
  }

  function qs(l: number, r: number) {
    if (l >= r) return
    const p = r
    const m = partition(l, r, p)
    qs(l, m - 1)
    qs(m + 1, r)
  }

  qs(0, arr.length - 1)

  markSorted(steps, arr.length, [1])

  return steps
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/quick',
  category: 'sorting',
  title: '퀵 정렬 (Quick Sort)',
  pseudocode: [
    'procedure quickSort(A, l, r)',
    '  if l ≥ r: return',
    '  p ← r; i ← l',
    '  for j ← l to r-1',
    '    if A[j] < A[p]',
    '      swap A[i], A[j]',
    '      i ← i+1',
    '  swap A[i], A[p]',
    '  quickSort(A, l, i-1)',
    '  quickSort(A, i+1, r)',
  ],
  complexity: {best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)'},
  defaultInput: {array: [10, 3, 7, 2, 5, 8]},
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array)
        ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x))
        : []
    return {array: arr.slice(0, 5000)}
  },
}
