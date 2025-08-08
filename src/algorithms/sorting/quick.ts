import type { Step, AlgoDescriptor } from '@/types/step';

/**
 * @complexity best: O(n log n), average: O(n log n), worst: O(n^2), space: O(log n)
 * @pseudocodeIndex 1→quickSort(A,l,r), 2→partition, 3→for, 4→if, 5→swap, 6→pivot swap
 */
export function quickSortSteps(a: number[]): Step[] {
  const arr = a.slice();
  const steps: Step[] = [];
  function swap(i:number,j:number){
    [arr[i],arr[j]]=[arr[j],arr[i]];
    steps.push({type:'swap',payload:{i,j},pc:[6],explain:`인덱스 ${i}↔${j} 교환`});
  }
  function part(l:number,r:number,p:number){
    steps.push({type:'highlightRange',payload:{l,r},pc:[2],explain:`구간 [${l},${r}] 파티션`});
    let i=l;
    for(let j=l;j<r;j++){
      steps.push({type:'compare',payload:{i:j,p},pc:[4],explain:`피벗(${p})과 ${j} 비교`});
      if(arr[j]<arr[p]){swap(i,j);i++;}
    }
    swap(i,p); return i;
  }
  function qs(l:number,r:number){ if(l>=r) return; const p=r; const m=part(l,r,p); qs(l,m-1); qs(m+1,r); }
  qs(0,arr.length-1);
  // 선택: 최종 정렬 상태 마킹
  arr.forEach((_,i)=>steps.push({type:'markSorted',payload:{i},pc:[1],explain:`정렬 완료 위치 ${i}`}));
  return steps;
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/quick',
  category: 'sorting',
  title: '퀵 정렬 (Quick Sort)',
  pseudocode: [
    'procedure quickSort(A, l, r)',
    '  if l ≥ r: return',
    '  p ← r; i ← l',
    '  for j ← l to r-1:',
    '    if A[j] < A[p]: swap A[i], A[j]; i ← i+1',
    '  swap A[i], A[p]; quickSort(A, l, i-1); quickSort(A, i+1, r)'
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)', space: 'O(log n)' },
  defaultInput: { array: [10,3,7,2,5,8] }
};
