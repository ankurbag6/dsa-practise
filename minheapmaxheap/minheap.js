class MinHeap {
  constructor(cmp = (a, b) => a - b) {
    this.a = [];
    this.cmp = cmp;
  }

  size() {
    return this.a.length;
  }
  peek() {
    return this.a[0];
  }
  push(x) {
    this.a.push(x);
    this._up(this.a.length - 1);
  }
  pop() {
    const top = this.a[0],
      last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      this._down(0);
    }
    return top;
  }

  _up(i) {
    // while (i && this.cmp(this.a[i], this.a[(i-1)>>1]) < 0) {
    //   [this.a[i], this.a[(i-1)>>1]] = [this.a[(i-1)>>1], this.a[i]];
    //   i = (i-1)>>1;
    // }

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.cmp(this.a[i], this.a[parent]) >= 0) break; // parent is fine
      [this.a[i], this.a[parent]] = [this.a[parent], this.a[i]];
      i = parent;
    }
  }

  _down(i) {
    const n = this.a.length;
    while (true) {
      let parent = i,
        l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && this.cmp(this.a[l], this.a[parent]) < 0) parent = l;
      if (r < n && this.cmp(this.a[r], this.a[parent]) < 0) parent = r;
      if (parent === i) break;
      [this.a[i], this.a[parent]] = [this.a[parent], this.a[i]];
      i = parent;
    }
  }
}

const mh = new MinHeap();
mh.push(9);
mh.push(8);
mh.push(7);
mh.push(6);
mh.push(11);
mh.push(2);
mh.push(4);

console.log(mh.a);
/**
 Yes — peek() returns this.a[0], and in a min-heap a[0] is always the smallest element. That's exactly what kthLargest wants.

The trick: you're keeping a min-heap capped at size k, so it holds the k largest elements seen so far. The root of that heap is the smallest of those k, which is by definition the kth largest overall. And pop() evicting a[0] is what makes it work — every time you overflow, you throw away the weakest survivor.

Trace on your call, kthLargest([9,8,7,6,11,2,4], 4):

step	heap after push	size > 4?	heap after pop
9	[9]	no	—
8	[8,9]	no	—
7	[7,9,8]	no	—
6	[6,7,8,9]	no	—
11	[6,7,8,9,11]	yes → evicts 6	[7,9,8,11]
2	[2,7,8,11,9]	yes → evicts 2	[7,9,8,11]
4	[4,7,8,11,9]	yes → evicts 4	[7,9,8,11]
Final heap holds {7, 8, 9, 11} — the 4 largest — and peek() is 7. Sorted descending the input is 11, 9, 8, 7, 6, 4, 2, so the 4th largest is 7. ✓

Two notes on the current file:

1. The variable rename in _down is misleading. At minheap.js:33-37 the tracking variable is called parent, but it holds the index of the smallest among node and its two children — often a child, and after the swap you descend into it. parent reads like it goes upward. Call it smallest (or keep the original s); parent is the right name only in _up.

2. kthLargest will silently return undefined if k > nums.length — the heap never overflows, and peek() on a heap of size < k returns the overall min instead of an error. Add a guard if you want it explicit:


if (k < 1 || k > nums.length) throw new Error("k out of range");
For interviews it's worth being able to state 
the cost out loud: O(n log k) time, 
O(k) space — better than sorting's O(n log n) when k is small.
 */
function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const n of nums) {
    heap.push(n);
    if (heap.size() > k) heap.pop(); // evict the weakest
  }
  console.log("heap", heap);
  return heap.peek();
}

console.log(kthLargest([9, 8, 7, 6, 11, 2, 4], 4));

/**
 Q2 — Top Support Topics 🟡 (custom comparator + tie-breaking)

A support inbox produces a stream of ticket tags. Given the list of tags and k, return the k most frequent tags, most frequent first; ties broken alphabetically. ["billing","login","billing","export","login","billing"], k=2 → ["billing","login"].

Approach: frequency map, then a size-k min-heap ordered by (count asc, tag desc). The comparator is the whole question: the heap's top must be the entry that deserves eviction first — lowest count, and among equal counts, the alphabetically last tag (because alphabetically-earlier wins ties, so later loses them).
 */

function topKTags(tags, k) {
  const freq = new Map();
  for (const t of tags) freq.set(t, (freq.get(t) ?? 0) + 1);

  // top = "worst of the club": smaller count first; on ties, LATER alphabet first
  const heap = new MinHeap((a, b) =>
    a.count !== b.count ? a.count - b.count : b.tag.localeCompare(a.tag),
  );

  for (const [tag, count] of freq) {
    heap.push({ tag, count });
    if (heap.size() > k) heap.pop();
  }

  const out = [];
  while (heap.size()) out.push(heap.pop().tag);
  return out.reverse(); // heap pops worst-first; answer wants best-first
}
// Time O(n + m log k) where m = distinct tags, space O(m)

/*

Q3 — Nearest Depots 🟡 (distance as priority)

Given depot coordinates [[x,y],...] and a service call at the origin, 
 return the k closest depots. [[1,3],[-2,2],[5,8],[0,1]], k=2 → [[-2,2],[0,1]] (any order).

Approach: identical machine to Q1 — K smallest by distance → max-heap of size k (flip the comparator; 
no second heap class needed). Compare squared distances: x² + y². 
Skipping the Math.sqrt isn't a micro-optimization flex — it avoids floating-point entirely, and saying "monotonic transform, so ordering is preserved" is a free correctness point.
*/

function kClosest(points, k) {
  const dist2 = ([x, y]) => x * x + y * y;
  const heap = new MinHeap((a, b) => dist2(b) - dist2(a)); // max-heap via flip

  for (const p of points) {
    heap.push(p);
    if (heap.size() > k) heap.pop(); // evict the farthest
  }
  return heap.a; // the k survivors, any order
}
// Time O(n log k), space O(k)
