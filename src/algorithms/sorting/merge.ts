import type { Step, AlgoDescriptor } from '@/types/step';

export function mergeSortSteps(a: number[]): Step[] {
  const arr = a.slice();
  const steps: Step[] = [];
  function merge(l:number,m:number,r:number){
    steps.push({type:'highlightRange',payload:{l,r},pc:[3],explain:`병합 구간 [${l},${r}]`});
    const L = arr.slice(l,m+1), R = arr.slice(m+1,r+1);
    let i=0,j=0,k=l; while(i<L.length && j<R.length){
      steps.push({type:'compare',payload:{i:l+i,j:m+1+j},pc:[4],explain:`${l+i}와 ${m+1+j} 비교`});
      if(L[i]<=R[j]){arr[k++]=L[i++];} else {arr[k++]=R[j++];}
    }
    while(i<L.length) arr[k++]=L[i++]; while(j<R.length) arr[k++]=R[j++];
  }
  function sort(l:number,r:number){ if(l>=r) return; const m=(l+r>>1); sort(l,m); sort(m+1,r); merge(l,m,r); }
  sort(0,arr.length-1);
  return steps;
}

export const descriptor: AlgoDescriptor<{ array: number[] }> = {
  id: 'sorting/merge',
  category: 'sorting',
  title: '병합 정렬 (Merge Sort)',
  pseudocode: [
    'procedure mergeSort(A, l, r)',
    '  if l ≥ r: return',
    '  m ← ⌊(l+r)/2⌋; ',
    '  mergeSort(A, l, m);',
    '  mergeSort(A, m+1, r)',
    '  merge(A, l, m, r)'
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  defaultInput: { array: [10,3,7,2,5,8] },
  normalizeInput: (raw: any) => {
    const arr = Array.isArray(raw?.array)
      ? raw.array.map((x: any) => Number(x)).filter((x: any) => Number.isFinite(x))
      : [];
    return { array: arr.slice(0, 5000) };
  }
};

export function stepsOf(input: { array: number[] }): Step[] {
  return mergeSortSteps(input.array);
}
