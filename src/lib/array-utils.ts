export { cloneDeep } from './cloneDeep';
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
export const seededRandom = (seed: number) => {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
};
export function swap<T>(arr: T[], i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
export const isSortedAsc = (arr: number[]) => arr.every((v, i, a) => i === 0 || a[i - 1] <= v);
