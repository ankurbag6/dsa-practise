/*

Problem — Interval List Intersections. Two lists, A and B, each already sorted and internally non-overlapping. 
Return the list of intervals where they intersect (overlap).

A = [[0,2],[5,10]]
B = [[1,5],[8,12]]
→ [[1,2],[5,5],[8,10]]

*/

function findIntervals(A,B) {
    const overlap = [];
    let i=0, j=0;
    while(i<A.length && j<B.length) {
        if(B[j][0] < A[i][1]) {
            overlap.push([Math.max(B[j][0], A[i][0]), Math.min(B[j][1], A[i][1])]);
            //i++;
        } else if(B[j][1] === A[i][0])  {
            overlap.push([B[j][1], B[j][1]]);
            //j++;
        }
        if(A[i][1] < B[j][1]) i++;
        else j++;
    }

    return overlap;
}

console.log(findIntervals([[0,2],[5,10]],[[1,5],[8,12]]));

// Perfect Solution
/*

function intervalIntersection(A, B) {
  const out = [];
  let i = 0, j = 0;

  while (i < A.length && j < B.length) {
    // the overlap of A[i] and B[j], if any
    const lo = Math.max(A[i][0], B[j][0]);
    const hi = Math.min(A[i][1], B[j][1]);
    if (lo <= hi) out.push([lo, hi]);   // <= so touch-points like [5,5] count

    // retire whichever interval ends first — it can't meet anything else
    if (A[i][1] < B[j][1]) i++;
    else j++;
  }
  return out;
}

*/
