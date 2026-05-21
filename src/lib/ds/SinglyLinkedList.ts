/**
 * Singly linked list with O(1) push at the tail. Used to schedule animation
 * frame callbacks in registration order — the smooth-scroll wrapper drains it
 * once per frame and runs every callback exactly once.
 */
export class SLLNode<T> {
  next: SLLNode<T> | null = null;
  constructor(public value: T) {}
}

export class SinglyLinkedList<T> {
  head: SLLNode<T> | null = null;
  tail: SLLNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  push(value: T): SLLNode<T> {
    const node = new SLLNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
    return node;
  }

  /** Iterate while preserving order. */
  forEach(fn: (value: T, index: number) => void): void {
    let i = 0;
    let cur = this.head;
    while (cur) {
      fn(cur.value, i++);
      cur = cur.next;
    }
  }

  clear(): void {
    this.head = this.tail = null;
    this._size = 0;
  }

  remove(predicate: (value: T) => boolean): boolean {
    let prev: SLLNode<T> | null = null;
    let cur = this.head;
    while (cur) {
      if (predicate(cur.value)) {
        if (prev) prev.next = cur.next;
        else this.head = cur.next;
        if (cur === this.tail) this.tail = prev;
        this._size--;
        return true;
      }
      prev = cur;
      cur = cur.next;
    }
    return false;
  }

  toArray(): T[] {
    const out: T[] = [];
    this.forEach((v) => out.push(v));
    return out;
  }
}
