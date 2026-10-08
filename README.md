# dsa-practise

Data structures and algorithms practice — a collection of solutions to common
interview-style problems, organized by topic. Most solutions are in JavaScript,
with some in Java.

## Structure

| Topic | Folder | Contents |
| --- | --- | --- |
| Arrays | [`arrays/`](arrays) | Reverse, move zeroes, rotate, remove duplicates, remove element, sorted squares, find max/min, sort colors, buy/sell stock, product except self, longest substring, contains nearby duplicate, majority element, longest common prefix, valid parentheses |
| Two Pointers | [`two-pointers/`](two-pointers) | Move zeroes, container with most water, triangle number triplets |
| Binary Search | [`binarysearch/`](binarysearch) | First bad build, conflicting appointments, min in rotated array, lonely element |
| Sliding Window | [`slidingwindow/`](slidingwindow) | Max sum subarray of size k, smallest subarray with given sum, longest substring with at most k distinct characters, max points from cards, max sum of a distinct-element window |
| Maps | [`maps/`](maps) | Group anagrams, first repeated session ID in one pass, counting subarrays with a target sum |
| Merge Intervals | [`mergeIntervals/`](mergeIntervals) | Insert into a sorted interval list, interval list intersections, can-attend-all-meetings, minimum removals to de-overlap |
| Heaps | [`minheapmaxheap/`](minheapmaxheap) | Min-heap from scratch, top-k patterns, the same problems via `heap-js` |
| Trees | [`trees/`](trees) | BFS, DFS, iterative traversal, level-order sums, right side view, root-to-leaf target sum, sum of all nodes, max value, max depth, same-tree, node definitions |
| Graphs | [`graphs/`](graphs) | BFS, DFS, connected components, number of islands (grid), rotting oranges (multi-source BFS), minimum knight moves |
| Dynamic Programming | [`dynamic-programming/`](dynamic-programming) | Fibonacci via top-down memoization and bottom-up tabulation, each with a written deep-dive; climbing stairs, unique grid paths |
| Sorting | [`sorting/`](sorting) | Selection sort (Java) |
| OOD | [`ood/`](ood) | ASCII canvas, rectangle canvas, cats and rabbits, 2048, jigsaw puzzle, parking lot, elevator system, topological sort |

## Files

### Arrays (`arrays/`)
- [`reversearrays.js`](arrays/reversearrays.js) — reverse an array in-place
- [`moveZeroes.js`](arrays/moveZeroes.js) — move all zeroes to the end, preserving order
- [`rotateArray.js`](arrays/rotateArray.js) — rotate the array by one position
- [`removeDuplicates.js`](arrays/removeDuplicates.js) — remove duplicates from a sorted array in-place
- [`removeElements.js`](arrays/removeElements.js) — remove every instance of a value in-place with a read/write pointer pair, returning the new length
- [`sortedSquares.js`](arrays/sortedSquares.js) — squares of a sorted array, sorted
- [`arraystests.js`](arrays/arraystests.js) — find max/min in an array
- [`mocktests.js`](arrays/mocktests.js) — sort colors / Dutch National Flag (0s, 1s, 2s)
- [`mockjune19.js`](arrays/mockjune19.js) — mock interview practice
- [`containsduplicates.js`](arrays/containsduplicates.js) — contains nearby duplicate (equal values within k indices), solved twice: a map of every index per value, and a sliding-window `Set` holding only the last k values
- [`majorityelement.js`](arrays/majorityelement.js) — the element appearing more than ⌊n/2⌋ times, via a frequency map
- [`longestCommonPrefix.js`](arrays/longestCommonPrefix.js) — longest common prefix, by horizontal scan (shrink a candidate) and vertical scan (compare column by column)
- [`validparenthesis.js`](arrays/validparenthesis.js) — valid parentheses, matching closers against a stack of unclosed openers
- [`arraymocks.js`](arrays/arraymocks.js) — best time to buy/sell stock, product except self, rotate array, longest substring without repeating characters, move zeroes

### Two Pointers (`two-pointers/`)
- [`movezeroes.js`](two-pointers/movezeroes.js) — move zeroes to the end via a single `nextNonZero` write pointer; the earlier swap-hunting version that took a direction argument is kept commented out above it, with its pointer traces
- [`containerwithwater.js`](two-pointers/containerwithwater.js) — container with most water; always step the pointer at the *shorter* wall inward, since the short wall caps the height and moving the taller one can only lose width
- [`triangle-nums.js`](two-pointers/triangle-nums.js) — count triplets that can form a triangle (sort, then for each largest side sweep a pair inward)

### Binary Search (`binarysearch/`)
- [`badbuild.js`](binarysearch/badbuild.js) — find the first bad build, minimizing `isBad` calls
- [`conflictingAppointments.js`](binarysearch/conflictingAppointments.js) — detect whether any two appointments overlap
- [`findMininRotatedArray.js`](binarysearch/findMininRotatedArray.js) — find the minimum in a rotated sorted array
- [`lonelyelement.js`](binarysearch/lonelyelement.js) — find the single element in a sorted array where every other element appears twice

### Sliding Window (`slidingwindow/`)
- [`maxsum.js`](slidingwindow/maxsum.js) — maximum sum of a subarray of size k
- [`smallestsubarray.js`](slidingwindow/smallestsubarray.js) — smallest subarray with a sum ≥ target
- [`distinctconstraint.js`](slidingwindow/distinctconstraint.js) — longest substring with at most k distinct characters
- [`maxPointsCards.js`](slidingwindow/maxPointsCards.js) — max points from picking k cards off either end, reframed as the *smallest* window of the cards you leave behind
- [`maxSuminDistinct.js`](slidingwindow/maxSuminDistinct.js) — max sum of a length-k subarray whose elements are all distinct

### Maps (`maps/`)
- [`anagrambuckets.js`](maps/anagrambuckets.js) — group anagrams, with both standard map keys: a letter-count signature (O(k) per word) and the sorted word (O(k log k)), checked against each other
- [`duplicatesessiondetector.js`](maps/duplicatesessiondetector.js) — first session ID to repeat, in a single pass
- [`refundmatcher.js`](maps/refundmatcher.js) — count subarrays summing to a target, using prefix-sum counts; includes the write-up of why a grow/shrink window has no valid invariant once values can be negative

### Merge Intervals (`mergeIntervals/`)
- [`insertInIntervals.js`](mergeIntervals/insertInIntervals.js) — insert a new interval into a sorted,
  non-overlapping list and keep it merged
- [`intervalIntersections.js`](mergeIntervals/intervalIntersections.js) — intersections of two sorted
  interval lists, via two pointers
- [`canattendmeetings.js`](mergeIntervals/canattendmeetings.js) — whether any two meetings overlap, after sorting by start
- [`nonoverlapping.js`](mergeIntervals/nonoverlapping.js) — fewest intervals to remove so the rest don't overlap; greedy on earliest end time

### Heaps (`minheapmaxheap/`)
- [`minheap.js`](minheapmaxheap/minheap.js) — min-heap built from scratch (sift-up / sift-down), plus three top-k
  patterns driven entirely by the comparator: kth largest element, top-k frequent tags with alphabetical
  tie-breaking, and k closest points to the origin (max-heap via a flipped comparator)
- [`kth-largest-heapjs.js`](minheapmaxheap/kth-largest-heapjs.js) — the same kth-largest problem using the
  [`heap-js`](https://github.com/ignlg/heap-js) library, with a fuzz test against a sort-based reference

### Trees (`trees/`)
- [`bfstreetraversal.js`](trees/bfstreetraversal.js) — breadth-first (level-order) traversal
- [`dfstreetraversal.js`](trees/dfstreetraversal.js) — depth-first traversal / path sum
- [`iterativetreetraversal.js`](trees/iterativetreetraversal.js) — iterative pre-order traversal
- [`bfs_levelordersum.js`](trees/bfs_levelordersum.js) — sum of each level, processing the queue one level at a time
- [`righmostnode.js`](trees/righmostnode.js) — right side view: the last node of each BFS level
- [`hasTargetinTree.js`](trees/hasTargetinTree.js) — whether some root-to-leaf path sums to a target, subtracting each node's value on the way down
- [`sumofpath.js`](trees/sumofpath.js) — sum of every node value in the tree, with a table of test cases
- [`maxinatree.js`](trees/maxinatree.js) — largest value in the tree, with `-Infinity` for an empty subtree
- [`maxDepth.js`](trees/maxDepth.js) — max depth via recursive DFS
- [`Nodes.js`](trees/Nodes.js) — tree node class definition
- [`mockjune19.js`](trees/mockjune19.js) — max depth of a binary tree
- [`mockjune21.js`](trees/mockjune21.js) — same-tree comparison

### Graphs (`graphs/`)
- [`bfstraversal.js`](graphs/bfstraversal.js) — breadth-first traversal over an adjacency matrix
- [`dfstraversal.js`](graphs/dfstraversal.js) — depth-first (recursive) traversal over an adjacency matrix
- [`connectedcomponent.js`](graphs/connectedcomponent.js) — find connected components via BFS
- [`countIsland.js`](graphs/countIsland.js) — number of islands in a grid, via BFS over 4-directional neighbours
- [`rottenoranges.js`](graphs/rottenoranges.js) — minutes until every fresh orange rots (or -1), via multi-source BFS
  seeded with every rotten orange at once; dequeues with a head index instead of `shift()`
- [`knightmovement.js`](graphs/knightmovement.js) — minimum knight moves from (0, 0) to (x, y) on an infinite board,
  via BFS over the 8 L-shaped moves with a `"x,y"` string visited set

### Dynamic Programming (`dynamic-programming/`)

Fibonacci solved both ways, with a written deep-dive alongside each. The `.md` files work
through the same problem at production scale — cache lifetime and semantics, `Number`
precision limits, V8 allocation behaviour, evaluation order, memory bounds, and the
observability needed to tell whether any of it is earning its keep. Every claim in them is
measured on Node, with the reproducing scripts included.

- [`top-down-memoization/fibonacci.js`](dynamic-programming/top-down-memoization/fibonacci.js) — recursive
  Fibonacci with a memo table
- [`top-down-memoization/fibonacci_expansions.md`](dynamic-programming/top-down-memoization/fibonacci_expansions.md) —
  why the memo must outlive the call, why `if (memo[n])` is a latent bug, `Number` going silently wrong from
  `fib(79)`, V8's ~10,398-frame stack limit, cache eviction and stampedes, and why fast doubling (6.8 ms vs.
  6,000 ms at n = 10⁶) deletes the need for most of it
- [`bottom-up-tabulation/fibonacci.js`](dynamic-programming/bottom-up-tabulation/fibonacci.js) — iterative
  Fibonacci over a DP table
- [`bottom-up-tabulation/fibonacci_expansions.md`](dynamic-programming/bottom-up-tabulation/fibonacci_expansions.md) —
  error contracts vs. in-band sentinels, input validation ordering, V8 elements kinds across four ways to
  allocate an array, rolling-window space optimization (6× faster, 100× less memory), topological order as a
  silent correctness hazard, and when tabulation is asymptotically the wrong choice
- [`bottom-up-tabulation/climiningnstairs.js`](dynamic-programming/bottom-up-tabulation/climiningnstairs.js) — climbing
  stairs in 1- or 2-step moves, kept in three rolling slots indexed `i % 3` instead of a full table
- [`bottom-up-tabulation/countuniqpath.js`](dynamic-programming/bottom-up-tabulation/countuniqpath.js) — unique paths
  through a grid moving only down or right, counted by plain recursive DFS (no memo yet — the obvious next step)

### Sorting (`sorting/`)
- [`SelectionSort.java`](sorting/SelectionSort.java) — selection sort

### Object-Oriented Design (`ood/`)
- [`asciicanvas.js`](ood/asciicanvas.js) — ASCII canvas drawing engine (PUT / LINE / RECT / CLEAR)
- [`asciiprinter_actual.js`](ood/asciiprinter_actual.js) — rectangle canvas with draw order and bring-to-front
- [`script.js`](ood/script.js) — scratch pad for the canvas line-drawing helper
- [`catsandrabbits.js`](ood/catsandrabbits.js) — two-player 7x7 board game with cat / rabbit / snail pieces
- [`game2048.js`](ood/game2048.js) — 2048 slide/merge logic
- [`game2048Mock.js`](ood/game2048Mock.js) — 2048 core game modeled as classes
- [`jiggsawpuzzle.js`](ood/jiggsawpuzzle.js) — jigsaw puzzle model with piece-fit / assemble
- [`parkinglot.js`](ood/parkinglot.js) — parking lot design
- [`elevator.js`](ood/elevator.js) — elevator design worked through from assumptions to a first model
- [`elevator_final.js`](ood/elevator_final.js) — elevator system using the SCAN/LOOK algorithm, with hall vs.
  car requests modeled separately and a controller over the car
- [`toposort.js`](ood/toposort.js) — topological sort (Kahn's algorithm)

## Running

Most files are standalone and run with Node directly:

```bash
node arrays/reversearrays.js
```

Files are ES modules (`"type": "module"` in `package.json`). Only
[`minheapmaxheap/kth-largest-heapjs.js`](minheapmaxheap/kth-largest-heapjs.js) has a dependency, so install
once before running it:

```bash
npm install
node minheapmaxheap/kth-largest-heapjs.js
```

The Java file can be compiled and run with:

```bash
cd sorting && javac SelectionSort.java && java SelectionSort
```
