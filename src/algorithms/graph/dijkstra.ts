import type {Step, AlgoDescriptor} from '@/types/step';
import type {AdjList} from '@/lib/graph-utils';
import {normalizeGraphInput} from './utils';
import {createStep} from '@/lib/steps';
import {PriorityQueue} from '@/lib/priority-queue';

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
  const {n, adj, start} = input;
  const INF = Number.POSITIVE_INFINITY;
  const dist = Array(n).fill(INF);
  const used = Array(n).fill(false);
  const steps: Step[] = [];
  type QNode = { d: number; u: number };
  const pq = new PriorityQueue<QNode>((a, b) => a.d - b.d);

  dist[start] = 0;
  pq.push({d: 0, u: start});
  steps.push(createStep('enqueue', {v: start}, [1], `시작 정점 ${start} 거리 0, PQ 삽입`));

  while (pq.length) {
    const cur = pq.pop()!;
    steps.push(createStep('dequeue', {v: cur.u}, [3], `정점 ${cur.u} 추출`));
    if (used[cur.u]) continue;
    used[cur.u] = true;
    for (const {v, w} of (adj[cur.u] || [])) {
      const nd = (dist[cur.u] === INF ? 0 : dist[cur.u]) + (w ?? 1);
      steps.push(createStep('compare', {u: cur.u, v, w}, [4], `간선 ${cur.u}→${v} 이완 검사`));
      if (dist[v] > nd) {
        dist[v] = nd;
        steps.push(createStep('relax', {v, dist: nd}, [5], `정점 ${v} 거리 갱신: ${nd}`));
        pq.push({d: nd, u: v});
        steps.push(createStep('enqueue', {v}, [5], `정점 ${v} PQ 삽입`));
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
  complexity: {
    best: 'O((V+E) log V)',
    average: 'O((V+E) log V)',
    worst: 'O((V+E) log V)',
    space: 'O(V)'
  },
  defaultInput: {
    n: 5,
    adj: {0: [{v: 1, w: 2}, {v: 2, w: 5}], 1: [{v: 3, w: 1}], 2: [{v: 4, w: 2}]},
    start: 0
  },
  normalizeInput: normalizeGraphInput,
};

export const snapshotStrategy = 'diff' as const;