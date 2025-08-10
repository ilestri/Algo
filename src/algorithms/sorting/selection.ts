import type {Step, AlgoDescriptor} from '@/types/step'

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
    steps.push({
      type: 'pointer',
      payload: {name: 'i', index: i},
      pc: [1],
      explain: `i=${i} 고정`,
    })
    steps.push({
      type: 'pointer',
      payload: {name: 'min', index: min},
      pc: [2],
      explain: `최솟값 위치 초기화 min=${min}`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        payload: {i: j, j: min},
        pc: [3, 4],
        explain: `A[${j}]와 A[${min}] 비교`,
      })
      if (arr[j] < arr[min]) {
        min = j
        steps.push({
          type: 'pointer',
          payload: {name: 'min', index: min},
          pc: [4],
          explain: `새 최솟값 min=${min}`,
        })
      }
    }

    if (min !== i) {
      const t = arr[i]
      arr[i] = arr[min]
      arr[min] = t
      steps.push({
        type: 'swap',
        payload: {i, j: min},
        pc: [5],
        explain: `A[${i}]와 A[${min}] 교환`,
      })
    }
  }

  for (let k = 0; k < n; k++) {
    steps.push({
      type: 'markSorted',
      payload: {i: k},
      pc: [5],
      explain: `정렬 완료 위치 ${k}`,
    })
  }

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
