/**
 * 
 * 
 * The lonely element  — Sorted array where every element appears exactly twice except one, which appears once.
 *  Find it in O(log n), O(1) space. [1,1,2,3,3,4,4] → 2. 
 * The twist: what's the monotonic yes/no property here? (Hint: think about pair alignment — before the single element, 
 * pairs start at even indices; after it...)
 * 
 * 
 
Brute force

1. Scan and store in th hashmap : val-->cnt
2. Scan the map, return key whose cnt == 1

[1,1,2,3,3,4,4] 
     l m h 
eq(l,l+1) ==> move l+2, eq(hi,hi-1) ==> move h-2
eq(l,l+1) !
 */
function lonelyElement(nums) {
  let lo = 0, hi = nums.length - 1;   // n is always odd
  while (lo < hi) {
    let mid = lo + Math.floor((hi - lo) / 2);
    if (mid % 2 === 1) mid--;         // oracle only defined on even indices

    if (nums[mid] === nums[mid + 1]) {
      lo = mid + 2;                    // pair intact → lonely is strictly right, skip the pair
    } else {
      hi = mid;                        // alignment broken → lonely is at mid or left
    }
  }
  return nums[lo];                     // lo === hi, pinched onto it
}