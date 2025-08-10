import type { AdjList } from '@/lib/graph-utils';

export function normalizeGraphInput(raw: any): { n: number; adj: AdjList; start: number } {
  const nRaw = Number(raw?.n ?? 0);
  const n = Number.isFinite(nRaw) ? Math.floor(nRaw) : 0;
  const boundedN = Math.max(0, Math.min(1000, n));

  const adj = (raw?.adj ?? {}) as AdjList;

  const startRaw = Number(raw?.start ?? 0);
  let start = Number.isFinite(startRaw) ? Math.floor(startRaw) : 0;
  if (start < 0 || start >= boundedN) start = 0;

  return { n: boundedN, adj, start };
}
