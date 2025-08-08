import { describe, it, expect } from 'vitest';
import { stepsOf as dijkstraSteps } from '@/algorithms/graph/dijkstra';

describe('Dijkstra shortest paths', () => {
  it('computes correct shortest distances via relax steps', () => {
    const n = 5;
    const adj: Record<number, { v: number; w?: number }[]> = {
      0: [{ v: 1, w: 2 }, { v: 2, w: 5 }],
      1: [{ v: 3, w: 1 }],
      2: [{ v: 4, w: 2 }],
      3: [],
      4: [],
    };
    const start = 0;

    const steps = dijkstraSteps({ n, adj, start });
    expect(steps.length).toBeGreaterThan(0);

    const INF = Number.POSITIVE_INFINITY;
    const dist = Array(n).fill(INF);
    dist[start] = 0;

    for (const s of steps) {
      if (s.type === 'relax') {
        const { v, dist: nd } = s.payload as { v: number; dist: number };
        dist[v] = Math.min(dist[v], nd);
      }
    }

    // 기대 거리:
    // 0→1:2, 0→2:5, 0→3:3(0→1→3), 0→4:7(0→2→4)
    expect(dist[0]).toBe(0);
    expect(dist[1]).toBe(2);
    expect(dist[3]).toBe(3);
    expect(dist[2]).toBe(5);
    expect(dist[4]).toBe(7);
  });
});
