import { Heap } from 'heap-js';

// Same problem as the hand-rolled version in ./minheap.js, using heap-js.
// Keep a min-heap of size k -> it holds the k largest seen so far,
// and its root is the smallest of those = the kth largest overall.
function kthLargest(nums, k) {
  if (k < 1 || k > nums.length) throw new Error('k out of range');

  const heap = new Heap(Heap.minComparatorNumber); // (a, b) => a - b
  for (const x of nums) {
    if (heap.size() < k) heap.push(x);
    else if (x > heap.peek()) heap.replace(x); // pop + push in one sift
  }
  return heap.peek();
}

// Built-in alternative. NOTE: heap-js names these by comparator priority, not
// by magnitude — nlargest = "the n highest-priority elements", so a MAX
// comparator is what yields the numerically largest. The returned array is
// unsorted heap order, so take the min rather than indexing into it.
function kthLargestBuiltin(nums, k) {
  if (k < 1 || k > nums.length) throw new Error('k out of range');
  return Math.min(...Heap.nlargest(k, nums, Heap.maxComparatorNumber));
}

const nums = [9, 8, 7, 6, 11, 2, 4];
console.log('kthLargest       ', kthLargest(nums, 4));        // 7
console.log('kthLargestBuiltin', kthLargestBuiltin(nums, 4)); // 7

// --- basic API, mirroring minheap.js ---
const minHeap = new Heap(Heap.minComparatorNumber);
minHeap.push(9, 8, 7, 6, 11, 2, 4); // push is variadic
console.log('peek  ', minHeap.peek());       // 2
console.log('array ', minHeap.toArray());    // heap order, not sorted
console.log('drain ', [...minHeap.clone()]); // iterating consumes: sorted asc

// Max-heap and object priority queues
const maxHeap = new Heap(Heap.maxComparatorNumber);
maxHeap.init([9, 8, 7, 6, 11, 2, 4]); // heapify an existing array, O(n)
console.log('max   ', maxHeap.peek()); // 11

const tasks = new Heap((a, b) => a.priority - b.priority);
tasks.push({ name: 'deploy', priority: 3 }, { name: 'hotfix', priority: 1 });
console.log('task  ', tasks.pop()); // { name: 'hotfix', priority: 1 }

// --- fuzz check against a sort-based reference ---
const ref = (a, k) => [...a].sort((x, y) => y - x)[k - 1];
let bad = 0;
for (let t = 0; t < 2000; t++) {
  const len = 1 + Math.floor(Math.random() * 30);
  const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 50) - 25);
  const k = 1 + Math.floor(Math.random() * len);
  if (kthLargest(arr, k) !== ref(arr, k) || kthLargestBuiltin(arr, k) !== ref(arr, k)) bad++;
}
console.log(bad === 0 ? 'fuzz: 2000/2000 pass' : `fuzz: ${bad} MISMATCHES`);
