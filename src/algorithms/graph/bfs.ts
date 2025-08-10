import type {Step, AlgoDescriptor} from '@/types/step';
import type {AdjList} from '@/lib/graph-utils';
import {normalizeGraphInput} from './utils';
import {createStep} from '@/lib/steps';

/**
 * @complexity 시간: O(V+E), 공간: O(V)
 * @pseudocodeIndex
 * 1: enqueue(s)
 * 2: while Q not empty
 * 3:   u ← dequeue()
 * 4:   for v in adj[u]
 * 5:     if not visited[v]: enqueue(v)
 */
export function stepsOf(input: { n: number; adj: AdjList; start: number }): Step[] {
  const {n, adj, start} = input;
  const visited = Array(n).fill(false);
  const q: number[] = [];
  const steps: Step[] = [];

  q.push(start);
  steps.push(createStep('enqueue', {v: start}, [1], `시작 정점 ${start} 큐에 삽입`));
  visited[start] = true;

  while (q.length) {
    steps.push(createStep('compare', {size: q.length}, [2], `큐 크기 ${q.length}`));
    const u = q.shift()!;
    steps.push(createStep('dequeue', {v: u}, [3], `정점 ${u} 큐에서 제거`));
    steps.push(createStep('visit', {v: u}, [3], `정점 ${u} 방문`));
    for (const {v} of (adj[u] || [])) {
      steps.push(createStep('compare', {u, v}, [4], `간선 ${u}→${v} 확인`));
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
        steps.push(createStep('enqueue', {v}, [5], `정점 ${v} 큐에 삽입`));
      }
    }
  }
  return steps;
}

export const descriptor: AlgoDescriptor<{ n: number; adj: AdjList; start: number }> = {
  id: 'graph/bfs',
  category: 'graph',
  title: '너비 우선 탐색 (BFS)',
  pseudocode: [
    'enqueue(s)',
    'while Q not empty:',
    '  u ← dequeue()',
    '  for v in adj[u]:',
    '    if not visited[v]: enqueue(v)',
  ],
  complexity: {best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)'},
  defaultInput: {n: 5, adj: {0: [{v: 1}, {v: 2}], 1: [{v: 3}], 2: [{v: 4}]}, start: 0},
  normalizeInput: normalizeGraphInput
};