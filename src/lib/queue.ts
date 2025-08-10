export class Queue<T> {
  private arr: T[] = [];
  private head = 0;

  /**
   * 배열 기반 큐 구현. head/tail 인덱스를 사용하여 O(1) 삽입/삭제를 보장한다.
   * 그래프 탐색 등 다양한 알고리즘에서 재사용할 수 있다.
   */
  enqueue(item: T): void {
    this.arr.push(item);
  }

  dequeue(): T | undefined {
    if (this.head >= this.arr.length) return undefined;
    const value = this.arr[this.head];
    this.head++;
    // 주기적으로 앞부분을 비워 메모리 회수
    if (this.head > 50 && this.head * 2 > this.arr.length) {
      this.arr = this.arr.slice(this.head);
      this.head = 0;
    }
    return value;
  }

  get length(): number {
    return this.arr.length - this.head;
  }
}
