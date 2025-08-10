import type {Step, AlgoDescriptor} from '@/types/step'

/**
 * @complexity 시간: O(n^2), 공간: O(1)
 * @pseudocodeIndex
 * 1: for i ← 0 to n-2
 * 2:   swapped ← false
 * 3:   for j ← 0 to n-i-2
 * 4:     if A[j] > A[j+1]
 * 5:       swap A[j], A[j+1]
 * 6:       swapped ← true
 * 7:   if !swapped
 * 8:     break
 */
export function stepsOf(input: { array: number[] }): Step[] {
  const arr = input.array.slice()
  const n = arr.length
  const steps: Step[] = []

  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        payload: {i: j, j: j + 1},
        pc: [4],
        explain: `인덱스 ${j}와 ${j + 1} 비교`,
      })
      if (arr[j] > arr[j + 1]) {
        steps.push({
          type: 'swap',
          payload: {i: j, j: j + 1},
          pc: [5],
          explain: '두 원소 교환',
        })
        const t = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = t
        swapped = true
      }
    }
    if (!swapped) break
  }

  for (let k = 0; k < n; k++) {
    steps.push({
      type: 'markSorted',
      payload: {i: k},
      pc: [1],
      explain: `정렬 완료 위치 ${k}`,
    })
  }

  return steps
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/bubble',
  category: 'sorting',
  title: '버블 정렬 (Bubble Sort)',
  pseudocode: [
    'for i ← 0 to n-2',
    '  swapped ← false',
    '  for j ← 0 to n-i-2',
    '    if A[j] > A[j+1]',
    '      swap A[j], A[j+1]',
    '      swapped ← true',
    '  if !swapped',
    '    break',
  ],
  complexity: {best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)', space: 'O(1)'},
  defaultInput: {array: [5, 3, 8, 1, 4]},
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array)
        ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x))
        : []
    return {array: arr.slice(0, 5000)}
  },
}
