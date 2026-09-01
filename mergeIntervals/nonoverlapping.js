
/*

DESCRIPTION (inspired by Leetcode.com)
Write a function to return the minimum number of intervals that must be removed from a given array intervals, where intervals[i] consists of a starting point starti and an ending point endi, to ensure that the remaining intervals do not overlap. Intervals that only touch at their endpoints are not considered overlapping (e.g., [2,5] and [5,7] do not overlap).

Input:

intervals = [[1,3],[5,8],[4,10],[11,13]]
Output:

1
Explanation: Removing the interval [4,10] leaves all other intervals non-overlapping.

*/

function nonOverlappingIntervals(intervals) {
    if (intervals.length === 0) {
        return 0;
    }
    intervals.sort((a, b) => a[1] - b[1]);
    let end = intervals[0][1];
    let count = 1;
    for (let i = 1; i < intervals.length; i++) {
        // Non-overlapping interval found
        if (intervals[i][0] >= end) {
            end = intervals[i][1];
            count++;
        }
    }
    return intervals.length - count;
}