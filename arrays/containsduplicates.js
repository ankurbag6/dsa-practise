/*
Given nums and integer k, return true
if there are two distinct indices i and j such that nums[i] === nums[j] and abs(i - j) <= k.
*/
function containsNearbyDuplicate(nums, k) {
  // value -> list of indices where it appears, e.g. [1,0,1,1] => 1 -> [0, 2, 3]
  const indicesByValue = new Map();

  for (let i = 0; i < nums.length; i++) {
    if (!indicesByValue.has(nums[i])) {
      indicesByValue.set(nums[i], []);
    }
    indicesByValue.get(nums[i]).push(i);
  }

  for (const indices of indicesByValue.values()) {
    // indices go in increasing order, so the closest pair for this
    // value is always two neighbours in the list
    for (let j = 1; j < indices.length; j++) {
      if (indices[j] - indices[j - 1] <= k) {
        return true;
      }
    }
  }

  return false;
}

function containsNearbyDuplicate_slidingwindow(nums, k) {
  
  const set = new Set();
  for(let i=0; i<nums.length; i++) {
    console.log({set, numsat: nums[i]});
    if(set.has(nums[i])) return true;
    set.add(nums[i]);
    if(set.size > k) set.delete(nums[i - k]);
  }

  return false;
}

console.log(containsNearbyDuplicate_slidingwindow([1, 2, 3, 1], 3));        // → true   (1 at 0, 1 at 3, |3-0|=3)
console.log(containsNearbyDuplicate([1, 0, 1, 1], 1));        // → true   (1 at 2, 1 at 3, |3-2|=1)
console.log(containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2));  // → false
console.log(containsNearbyDuplicate([99, 99], 2));            // → true
console.log(containsNearbyDuplicate([1], 1));                 // → false
