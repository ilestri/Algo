import { describe, it, expect } from 'vitest';
import { stepsOf as bfsSteps } from '../src/algorithms/graph/bfs';
import { stepsOf as dfsSteps } from '../src/algorithms/graph/dfs';
import { stepsOf as dijkstraSteps } from '../src/algorithms/graph/dijkstra';

describe('Graph algorithms steps', () => {
  const n = 5;
  const adj: Record<number, { v: number; w?: number }[]> = {
    0: [{ v: 1, w: 2 }, { v: 2, w: 5 }],
    1: [{ v: 3, w: 1 }],
    2: [{ v: 4, w: 2 }],
    3: [],
    4: [],
  };

  it('BFS produces enqueue/dequeue/visit steps', () => {
    const steps = bfsSteps({ n, adj, start: 0 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some(s => s.type === 'enqueue')).toBe(true);
    expect(steps.some(s => s.type === 'dequeue')).toBe(true);
    expect(steps.some(s => s.type === 'visit')).toBe(true);
  });

  it('DFS produces visit steps', () => {
    const steps = dfsSteps({ n, adj, start: 0 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some(s => s.type === 'visit')).toBe(true);
  });

  it('Dijkstra produces relax steps', () => {
    const steps = dijkstraSteps({ n, adj, start: 0 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.some(s => s.type === 'relax')).toBe(true);
  });
});
