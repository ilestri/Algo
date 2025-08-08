import type { Step, AlgoDescriptor } from '@/types/step';
import type { AdjList } from '@/lib/graph-utils';

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
  const { n, adj, start } = input;
  const visited = Array(n).fill(false);
  const q: number[] = [];
  const steps: Step[] = [];

  q.push(start);
  steps.push({ type: 'enqueue', payload: { v: start }, pc: [1], explain: `시작 정점 ${start} 큐에 삽입` });
  visited[start] = true;

  while (q.length) {
    steps.push({ type: 'compare', payload: { size: q.length }, pc: [2], explain: `큐 크기 ${q.length}` });
    const u = q.shift()!;
    steps.push({ type: 'dequeue', payload: { v: u }, pc: [3], explain: `정점 ${u} 큐에서 제거` });
    steps.push({ type: 'visit', payload: { v: u }, pc: [3], explain: `정점 ${u} 방문` });
    for (const { v } of (adj[u] || [])) {
      steps.push({ type: 'compare', payload: { u, v }, pc: [4], explain: `간선 ${u}→${v} 확인` });
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
        steps.push({ type: 'enqueue', payload: { v }, pc: [5], explain: `정점 ${v} 큐에 삽입` });
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
  complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
  defaultInput: { n: 5, adj: { 0: [{ v: 1 }, { v: 2 }], 1: [{ v: 3 }], 2: [{ v: 4 }] }, start: 0 },
  normalizeInput: (raw: any) => {
    const n = Number(raw?.n ?? 0);
    const adj = (raw?.adj ?? {}) as AdjList;
    const start = Number(raw?.start ?? 0);
    return { n: Math.max(0, Math.min(1000, n)), adj, start: Number.isFinite(start) ? start : 0 };
  }
};