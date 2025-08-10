/**
 * 최소 힙 기반 우선순위 큐. 사용자 정의 비교 함수를 받아 다양한 알고리즘에서 사용할 수 있다.
 */
export class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {}

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.compare(this.heap[idx], this.heap[parent]) >= 0) break;
      this.swap(idx, parent);
      idx = parent;
    }
  }

  private bubbleDown(idx: number): void {
    const last = this.heap.length - 1;
    while (true) {
      let left = idx * 2 + 1;
      let right = idx * 2 + 2;
      let smallest = idx;
      if (left <= last && this.compare(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right <= last && this.compare(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === idx) break;
      this.swap(idx, smallest);
      idx = smallest;
    }
  }

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (!this.heap.length) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return top;
  }

  get length(): number {
    return this.heap.length;
  }
}
