export interface Edge { u: number; v: number; w?: number }
export type AdjList = Record<number, Array<{ v: number; w?: number }>>;
export function listToMatrix(list: AdjList, n: number, weighted = false) {
  const m = Array.from({ length: n }, () => Array(n).fill(weighted ? Infinity : 0));
  for (const [u, arr] of Object.entries(list)) {
    const uu = Number(u);
    for (const { v, w } of arr) m[uu][v] = weighted ? (w ?? 1) : 1;
  }
  return m;
}
export function matrixToList(m: number[][], weighted = false): AdjList {
  const list: AdjList = {};
  for (let u = 0; u < m.length; u++) {
    list[u] = [];
    for (let v = 0; v < m.length; v++) {
      const w = m[u][v];
      if (weighted ? Number.isFinite(w) && w > 0 : w > 0) list[u].push({ v, w: weighted ? w : 1 });
    }
  }
  return list;
}
