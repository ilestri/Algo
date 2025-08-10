import type {Step, AlgoDescriptor} from '@/types/step';
import type {AdjList} from '@/lib/graph-utils';
import {normalizeGraphInput} from './utils';
import {createStep} from '@/lib/steps';

/**
 * @complexity 시간: O(V+E), 공간: O(V)
 * @pseudocodeIndex
 * 1: dfs(u)
 * 2:   visit(u)
 * 3:   for v in adj[u]
 * 4:     if not visited[v]: dfs(v)
 */
export function stepsOf(input: { n: number; adj: AdjList; start: number }): Step[] {
  const {n, adj, start} = input;
  const visited = Array(n).fill(false);
  const steps: Step[] = [];

  function dfs(u: number) {
    visited[u] = true;
    steps.push(createStep('visit', {v: u}, [2], `정점 ${u} 방문`));
    for (const {v} of (adj[u] || [])) {
      steps.push(createStep('compare', {u, v}, [3], `간선 ${u}→${v} 확인`));
      if (!visited[v]) {
        steps.push(createStep('highlight', {v}, [4], `정점 ${v} 재귀 탐색`));
        dfs(v);
      }
    }
  }

  steps.push(createStep('highlight', {v: start}, [1], `시작 정점 ${start}`));
  dfs(start);
  return steps;
}

export const descriptor: AlgoDescriptor<{ n: number; adj: AdjList; start: number }> = {
  id: 'graph/dfs',
  category: 'graph',
  title: '깊이 우선 탐색 (DFS)',
  pseudocode: [
    'dfs(u):',
    '  visit(u)',
    '  for v in adj[u]:',
    '    if not visited[v]: dfs(v)',
  ],
  complexity: {best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)'},
  defaultInput: {n: 5, adj: {0: [{v: 1}, {v: 2}], 1: [{v: 3}], 2: [{v: 4}]}, start: 0},
  normalizeInput: normalizeGraphInput
};
