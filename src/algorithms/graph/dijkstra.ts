import type { Step, AlgoDescriptor } from '@/types/step';
import type { AdjList } from '@/lib/graph-utils';

/**
 * @complexity 시간: O((V+E) log V), 공간: O(V)
 * @pseudocodeIndex
 * 1: dist[s] ← 0; PQ ← {(0,s)}
 * 2: while PQ not empty
 * 3:   (d,u) ← extract-min
 * 4:   for (u,v,w) in adj[u]
 * 5:     if dist[v] > d + w: dist[v] ← d+w; relax
 */
export function stepsOf(input: { n: number; adj: AdjList; start: number }): Step[] {
  const { n, adj, start } = input;
  const INF = Number.POSITIVE_INFINITY;
  const dist = Array(n).fill(INF);
  const used = Array(n).fill(false);
  const steps: Step[] = [];
  type QNode = { d: number; u: number };
  const pq: QNode[] = [];

  function push(node: QNode) {
    pq.push(node);
    pq.sort((a, b) => a.d - b.d);
  }
  function pop(): QNode | undefined { return pq.shift(); }

  dist[start] = 0;
  push({ d: 0, u: start });
  steps.push({ type: 'enqueue', payload: { v: start }, pc: [1], explain: `시작 정점 ${start} 거리 0, PQ 삽입` });

  while (pq.length) {
    const cur = pop()!;
    steps.push({ type: 'dequeue', payload: { v: cur.u }, pc: [3], explain: `정점 ${cur.u} 추출` });
    if (used[cur.u]) continue;
    used[cur.u] = true;
    for (const { v, w } of (adj[cur.u] || [])) {
      const nd = (dist[cur.u] === INF ? 0 : dist[cur.u]) + (w ?? 1);
      steps.push({ type: 'compare', payload: { u: cur.u, v, w }, pc: [4], explain: `간선 ${cur.u}→${v} 이완 검사` });
      if (dist[v] > nd) {
        dist[v] = nd;
        steps.push({ type: 'relax', payload: { v, dist: nd }, pc: [5], explain: `정점 ${v} 거리 갱신: ${nd}` });
        push({ d: nd, u: v });
        steps.push({ type: 'enqueue', payload: { v }, pc: [5], explain: `정점 ${v} PQ 삽입` });
      }
    }
  }

  return steps;
}

export const descriptor: AlgoDescriptor<{ n: number; adj: AdjList; start: number }> = {
  id: 'graph/dijkstra',
  category: 'graph',
  title: '다익스트라 (Dijkstra)',
  pseudocode: [
    'dist[s] ← 0; PQ ← {(0,s)}',
    'while PQ not empty:',
    '  (d,u) ← extract-min',
    '  for (u,v,w) in adj[u]:',
    '    if dist[v] > d + w: dist[v] ← d+w',
  ],
  complexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)', space: 'O(V)' },
  defaultInput: { n: 5, adj: { 0: [{ v: 1, w: 2 }, { v: 2, w: 5 }], 1: [{ v: 3, w: 1 }], 2: [{ v: 4, w: 2 }] }, start: 0 },
  normalizeInput: (raw: any) => {
    const n = Number(raw?.n ?? 0);
    const adj = (raw?.adj ?? {}) as AdjList;
    const start = Number(raw?.start ?? 0);
    return { n: Math.max(0, Math.min(1000, n)), adj, start: Number.isFinite(start) ? start : 0 };
  },
};

export const snapshotStrategy = 'diff' as const;