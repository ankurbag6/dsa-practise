/*

Problem. You're given a list of intervals that's already sorted by start and has no overlaps among themselves. 
You get one newInterval. Insert it and return the list still merged and sorted.

intervals = [[1,3],[2,9]],  newInterval = [2,5]   →  [[1,5],[6,9]]
*/

function insert(intervals, newInterval) {
  const out = [];
  let i = 0;
  const n = intervals.length;
  let [newStart, newEnd] = newInterval;

  // Phase 1: everything that ends before newInterval starts → copy as-is
  while (i < n && intervals[i][1] < newStart) {
    out.push(intervals[i]);
    i++;
  }

  // Phase 2: everything that overlaps → swallow into newInterval
  // overlap = this interval starts at or before newInterval's (growing) end
  while (i < n && intervals[i][0] <= newEnd) {
    newStart = Math.min(newStart, intervals[i][0]);
    newEnd   = Math.max(newEnd,   intervals[i][1]);
    i++;
  }
  out.push([newStart, newEnd]);   // push the merged interval once, after absorbing all

  // Phase 3: the rest → copy as-is
  while (i < n) {
    out.push(intervals[i]);
    i++;
  }

  return out;
}