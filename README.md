# dsa-practise

Data structures and algorithms practice — a collection of solutions to common
interview-style problems, organized by topic. Most solutions are in JavaScript,
with some in Java.

## Structure

| Topic | Folder | Contents |
| --- | --- | --- |
| Arrays | [`arrays/`](arrays) | Reverse, move zeroes, rotate, remove duplicates, sorted squares, find max/min, sort colors |
| Trees | [`trees/`](trees) | BFS, DFS, iterative traversal, path sum, max depth, same-tree, node definitions |
| Graphs | [`graphs/`](graphs) | BFS, DFS, connected components (adjacency matrix) |
| Sorting | [`sorting/`](sorting) | Selection sort (Java) |
| OOD | [`ood/`](ood) | ASCII canvas, 2048, jigsaw puzzle, parking lot, min-heap, topological sort |

## Files

### Arrays (`arrays/`)
- [`reversearrays.js`](arrays/reversearrays.js) — reverse an array in-place
- [`moveZeroes.js`](arrays/moveZeroes.js) — move all zeroes to the end, preserving order
- [`rotateArray.js`](arrays/rotateArray.js) — rotate the array by one position
- [`removeDuplicates.js`](arrays/removeDuplicates.js) — remove duplicates from a sorted array in-place
- [`sortedSquares.js`](arrays/sortedSquares.js) — squares of a sorted array, sorted
- [`arraystests.js`](arrays/arraystests.js) — find max/min in an array
- [`mocktests.js`](arrays/mocktests.js) — sort colors / Dutch National Flag (0s, 1s, 2s)
- [`mockjune19.js`](arrays/mockjune19.js) — mock interview practice

### Trees (`trees/`)
- [`bfstreetraversal.js`](trees/bfstreetraversal.js) — breadth-first (level-order) traversal
- [`dfstreetraversal.js`](trees/dfstreetraversal.js) — depth-first traversal / path sum
- [`iterativetreetraversal.js`](trees/iterativetreetraversal.js) — iterative pre-order traversal
- [`Nodes.js`](trees/Nodes.js) — tree node class definition
- [`mockjune19.js`](trees/mockjune19.js) — max depth of a binary tree
- [`mockjune21.js`](trees/mockjune21.js) — same-tree comparison

### Graphs (`graphs/`)
- [`bfstraversal.js`](graphs/bfstraversal.js) — breadth-first traversal over an adjacency matrix
- [`dfstraversal.js`](graphs/dfstraversal.js) — depth-first (recursive) traversal over an adjacency matrix
- [`connectedcomponent.js`](graphs/connectedcomponent.js) — find connected components via BFS

### Sorting (`sorting/`)
- [`SelectionSort.java`](sorting/SelectionSort.java) — selection sort

### Object-Oriented Design (`ood/`)
- [`asciicanvas.js`](ood/asciicanvas.js) — ASCII canvas drawing engine (PUT / LINE / RECT / CLEAR)
- [`game2048.js`](ood/game2048.js) — 2048 slide/merge logic
- [`game2048Mock.js`](ood/game2048Mock.js) — 2048 core game modeled as classes
- [`jiggsawpuzzle.js`](ood/jiggsawpuzzle.js) — jigsaw puzzle model with piece-fit / assemble
- [`parkinglot.js`](ood/parkinglot.js) — parking lot design
- [`minheap.js`](ood/minheap.js) — min-heap implementation
- [`toposort.js`](ood/toposort.js) — topological sort (Kahn's algorithm)

## Running

JavaScript files run with Node:

```bash
node arrays/reversearrays.js
```

The Java file can be compiled and run with:

```bash
cd sorting && javac SelectionSort.java && java SelectionSort
```
