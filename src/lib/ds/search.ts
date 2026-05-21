/**
 * Search primitives used by the projects and insights filter UIs.
 * - binarySearch:   O(log n) lookup over a sorted array
 * - lowerBound:     leftmost position where value can be inserted
 * - trigramScore:   cheap fuzzy similarity 0..1
 * - filterAndRank:  combined filter + relevance-ranked result list
 */

export function binarySearch<T>(
  arr: readonly T[],
  target: T,
  cmp: (a: T, b: T) => number = defaultCompare as (a: T, b: T) => number
): number {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const c = cmp(arr[mid], target);
    if (c === 0) return mid;
    if (c < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

export function lowerBound<T>(
  arr: readonly T[],
  target: T,
  cmp: (a: T, b: T) => number = defaultCompare as (a: T, b: T) => number
): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], target) < 0) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function defaultCompare(a: unknown, b: unknown): number {
  if ((a as number) < (b as number)) return -1;
  if ((a as number) > (b as number)) return 1;
  return 0;
}

function trigrams(s: string): Set<string> {
  const x = `  ${s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}  `;
  const set = new Set<string>();
  for (let i = 0; i < x.length - 2; i++) set.add(x.slice(i, i + 3));
  return set;
}

export function trigramScore(a: string, b: string): number {
  if (!a || !b) return 0;
  const A = trigrams(a);
  const B = trigrams(b);
  if (A.size === 0 || B.size === 0) return 0;
  let common = 0;
  for (const t of A) if (B.has(t)) common++;
  return common / Math.max(A.size, B.size);
}

export interface RankedResult<T> {
  item: T;
  score: number;
}

export function filterAndRank<T>(
  items: readonly T[],
  query: string,
  fields: Array<(item: T) => string>,
  threshold = 0.12
): RankedResult<T>[] {
  if (!query.trim()) return items.map((item) => ({ item, score: 1 }));
  const out: RankedResult<T>[] = [];
  for (const item of items) {
    let best = 0;
    for (const f of fields) {
      const s = trigramScore(query, f(item));
      if (s > best) best = s;
    }
    if (best >= threshold) out.push({ item, score: best });
  }
  out.sort((x, y) => y.score - x.score);
  return out;
}
