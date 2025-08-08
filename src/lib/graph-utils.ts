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
