/**
 * Doubly linked list. Used by the project carousel to walk slides in either
 * direction in O(1) and by the objects-of-desire rail to keep a moving cursor
 * on the active item.
 */
export class DLLNode<T> {
  prev: DLLNode<T> | null = null;
  next: DLLNode<T> | null = null;
  constructor(public value: T) {}
}

export class DoublyLinkedList<T> {
  head: DLLNode<T> | null = null;
  tail: DLLNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  push(value: T): DLLNode<T> {
    const node = new DLLNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
    return node;
  }

  unshift(value: T): DLLNode<T> {
    const node = new DLLNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this._size++;
    return node;
  }

  /** Returns the next node, wrapping around to head when at tail. */
  nextOf(node: DLLNode<T>): DLLNode<T> {
    return node.next ?? this.head!;
  }

  /** Returns the previous node, wrapping around to tail when at head. */
  prevOf(node: DLLNode<T>): DLLNode<T> {
    return node.prev ?? this.tail!;
  }

  toArray(): T[] {
    const out: T[] = [];
    let cur = this.head;
    while (cur) {
      out.push(cur.value);
      cur = cur.next;
    }
    return out;
  }

  static from<T>(values: T[]): DoublyLinkedList<T> {
    const dll = new DoublyLinkedList<T>();
    for (const v of values) dll.push(v);
    return dll;
  }
}
