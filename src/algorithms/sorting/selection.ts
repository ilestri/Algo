import type {Step, AlgoDescriptor} from '@/types/step'
import {createStep, markSorted} from '@/lib/steps'

/**
 * @complexity 시간: O(n^2), 공간: O(1)
 * @pseudocodeIndex
 * 1: for i ← 0 to n-2
 * 2:   min ← i
 * 3:   for j ← i+1 to n-1
 * 4:     if A[j] < A[min] then min ← j
 * 5:   swap A[i], A[min]
 */
export function stepsOf(input: { array: number[] }): Step[] {
  const arr = input.array.slice()
  const n = arr.length
  const steps: Step[] = []

  for (let i = 0; i < n - 1; i++) {
    let min = i
    steps.push(
        createStep('pointer', {name: 'i', index: i}, [1], `i=${i} 고정`),
    )
    steps.push(
        createStep(
            'pointer',
            {name: 'min', index: min},
            [2],
            `최솟값 위치 초기화 min=${min}`,
        ),
    )

    for (let j = i + 1; j < n; j++) {
      steps.push(
          createStep(
              'compare',
              {i: j, j: min},
              [3, 4],
              `A[${j}]와 A[${min}] 비교`,
          ),
      )
      if (arr[j] < arr[min]) {
        min = j
        steps.push(
            createStep('pointer', {name: 'min', index: min}, [4], `새 최솟값 min=${min}`),
        )
      }
    }

    if (min !== i) {
      const t = arr[i]
      arr[i] = arr[min]
      arr[min] = t
      steps.push(
          createStep('swap', {i, j: min}, [5], `A[${i}]와 A[${min}] 교환`),
      )
    }
  }

  markSorted(steps, n, [5])

  return steps
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/selection',
  category: 'sorting',
  title: '선택 정렬 (Selection Sort)',
  pseudocode: [
    'for i ← 0 to n-2',
    '  min ← i',
    '  for j ← i+1 to n-1',
    '    if A[j] < A[min] then min ← j',
    '  swap A[i], A[min]',
  ],
  complexity: {best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)'},
  defaultInput: {array: [5, 3, 8, 1, 4]},
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array)
        ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x))
        : []
    return {array: arr.slice(0, 5000)}
  },
}
