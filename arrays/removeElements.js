/*Q2 — Remove Element (Easy) 🎯 write/read retest

Remove all instances of val from nums in-place. Return the new length k.
First k slots must hold the remaining values (any order).

[3,2,2,3]
[] // On, On

*/

// Two pointers: `write` marks the next slot for a kept value, `read` scans ahead.
// Everything before `write` is already compacted, so `write` doubles as the count.
// O(n) time, O(1) space, single pass.
function removeElement(nums, tgt) {
    let write = 0;
    for (let read = 0; read < nums.length; read++) {
        if (nums[read] !== tgt) {
            nums[write] = nums[read];
            write++;
        }
    }
    return write;
}

function check(nums, tgt) {
    const k = removeElement(nums, tgt);
    // only the first k slots are defined by the problem
    return `${k}  nums[0..k) = [${nums.slice(0, k)}]`;
}

console.log(check([3, 2, 2, 3], 3));            // → 2,  nums starts with [2,2,...]
console.log(check([0, 1, 2, 2, 3, 0, 4, 2], 2)); // → 5,  nums starts with [0,1,3,0,4,...]
console.log(check([], 1));                       // → 0
console.log(check([1], 1));                      // → 0
console.log(check([1, 2, 3], 5));                // → 3,  no matches — the case the old code got wrong
