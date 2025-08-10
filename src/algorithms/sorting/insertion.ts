import type {Step, AlgoDescriptor} from '@/types/step'
import {createStep, markSorted} from '@/lib/steps'
import { normalizeArrayInput } from '@/lib/normalize-array-input'

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
  const arr = input.array.slice()
  const steps: Step[] = []
  const n = arr.length

  for (let i = 1; i < n; i++) {
    const key = arr[i]
    steps.push(
        createStep('highlight', {i}, [1], `i=${i} 위치의 값을 삽입 정렬`),
    )
    steps.push(
        createStep('pointer', {name: 'key', index: i}, [2], `key=A[${i}]=${key}`),
    )

    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      steps.push(
          createStep(
              'compare',
              {i: j, key},
              [3],
              `A[${j}](${arr[j]}) > key(${key}) 비교`,
          ),
      )
      arr[j + 1] = arr[j]
      steps.push(
          createStep(
              'setValue',
              {index: j + 1, value: arr[j]},
              [4],
              `A[${j + 1}] ← A[${j}] (${arr[j]})`,
          ),
      )
      j--
    }
    arr[j + 1] = key
    steps.push(
        createStep(
            'setValue',
            {index: j + 1, value: key},
            [5],
            `A[${j + 1}] ← key (${key})`,
        ),
    )
  }

  markSorted(steps, n, [5])

  return steps
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/insertion',
  category: 'sorting',
  title: '삽입 정렬 (Insertion Sort)',
  pseudocode: [
    'for i ← 1 to n-1',
    '  key ← A[i]; j ← i-1',
    '  while j ≥ 0 and A[j] > key',
    '    A[j+1] ← A[j]; j ← j-1',
    '  A[j+1] ← key',
  ],
  complexity: {best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)'},
  defaultInput: {array: [10, 3, 7, 2, 5, 8]},
  normalizeInput: normalizeArrayInput,
}
