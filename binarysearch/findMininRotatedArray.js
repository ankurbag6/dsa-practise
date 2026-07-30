/*

We keep a day's worth of request-latency checkpoints in a circular buffer. 
The values were written in ascending order, but the buffer wrapped at some unknown point 
so what you get handed is a sorted array that's been rotated.

For example, [4,5,6,7,0,1,2] --> it was [0,1,2,4,5,6,7], rotated so it starts partway through. 
It may also not be rotated at all.

Write a function that returns the minimum value in the array. 
All values are distinct. 
The buffer can hold tens of millions of entries, so a linear scan won't fly --> I need better than O(n).

Before you touch code: what would you like to ask me, and then what's your read on the approach?

Strategy:
1. Since there can be millions of ellements, I would do earl returns
2. Invalid checks : empty array, 1 element, 
3. Also if nums[0]<nums[len-1] --> already sorted / not rotated since array is meant to be in ascending
3. I need to find the min num: let min = Infinity
4. Bnary search : 

[4,5,6,7,0,1,2]
 lo    mid   hi
val at : lo<hi lo is incorrect, lo = mid
[4,5,6,7,0,1,2]
      lo  m  hi
val at : lo<hi lo is incorrect, lo = mid
[4,5,6,7,0,1,2]
         lo  hi 
val at : lo<hi lo is correct, lo is the min value          



[5,6,7,0,1,2,3,4]
       lo  m    hi

[2 3 4 5 6 7 0 1]
             lohi
*/

function findMininRotatedArray(nums) {

    if(nums===undefined || nums.length ===0) return undefined;
    if(nums.length === 1 || (nums[0] < nums[nums.length-1])) return nums[0];
    
    let lo = 0, hi = nums.length-1;
    while(lo < hi) {
        let mid = lo + Math.floor((hi - lo)/2);
        if(nums[mid] > nums[hi]) 
            lo = mid+1;
        else
            hi = mid;
    }
    return nums[lo];
}

console.log(findMininRotatedArray([5,6,7,0,1,2,3,4]));


console.log(findMininRotatedArray([7,0,1,2,3,4,5,6]));