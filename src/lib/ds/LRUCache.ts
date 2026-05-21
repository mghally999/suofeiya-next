/**
 * LRU (Least Recently Used) cache backed by a Map.
 * O(1) get / set / delete. Insertion order = recency order.
 * Used on the client to memoise expensive view-state (project list filter
 * results, search hits, parsed CSS variables, etc.) so the same input never
 * recomputes within the same session.
 */
export class LRUCache<K, V> {
  private readonly store = new Map<K, V>();
  constructor(public readonly capacity: number) {
    if (capacity <= 0) throw new Error('LRUCache capacity must be > 0');
  }

  get size(): number {
    return this.store.size;
  }

  has(key: K): boolean {
    return this.store.has(key);
  }

  get(key: K): V | undefined {
    if (!this.store.has(key)) return undefined;
    const value = this.store.get(key)!;
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key: K, value: V): this {
    if (this.store.has(key)) this.store.delete(key);
    else if (this.store.size >= this.capacity) {
      const oldest = this.store.keys().next().value as K | undefined;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, value);
    return this;
  }

  delete(key: K): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  keys(): IterableIterator<K> {
    return this.store.keys();
  }
}

/** Wrap a pure function with an LRU memoiser. */
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  capacity = 128,
  keyOf: (...args: Args) => string = (...a) => JSON.stringify(a)
): (...args: Args) => R {
  const cache = new LRUCache<string, R>(capacity);
  return (...args: Args): R => {
    const k = keyOf(...args);
    const hit = cache.get(k);
    if (hit !== undefined) return hit;
    const v = fn(...args);
    cache.set(k, v);
    return v;
  };
}
