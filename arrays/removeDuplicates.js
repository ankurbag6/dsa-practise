/***
 * 
 * 
 * Question 4: Remove Duplicates from Sorted Array
Given a sorted array, remove the duplicates in-place so each unique element appears only once. Return the count of unique elements (k), with the first k positions of the array holding those unique values in order.
Example:

Input: [1, 1, 2, 2, 2, 3, 4, 4]
Output: k = 4, with arr starting [1, 2, 3, 4, ...] (whatever's past index k doesn't matter)

The "sorted" part is the key hint — duplicates are always adjacent, so you never have to look far.
Constraints to aim for:

Time: O(n)
Space: O(1) — in-place

Say "done" when you've got it, or "solution" for the walkthrough.
 * 
[1, 1, 2, 2, 2, 3, 4, 4]
 |                 |
                   p   q 
cnt = 0 / 1 / 2 / 3 / 4
*/

// function removeDuplicates(arr) {
//     // your code here
//     let p = 0, cnt =1; 
//     for(let q=0; q<arr.length; q++) {
//         if(arr[p] != arr[q]) {
//             cnt++;
//             arr[p] = arr[q];
//             p = q;
//         } 
//     }
//     return cnt;  // number of unique elements
// }


// Correct 

function removeDuplicates(arr) {
    if (arr.length === 0) return 0;
    let write = 1;                          // write cursor AND count
    for (let q = 1; q < arr.length; q++) {
        if (arr[q] !== arr[write - 1]) {     // compare to last KEPT value
            arr[write] = arr[q];             // place into next compaction slot
            write++;                         // advance by exactly one
        }
    }
    return write;
}
console.log( removeDuplicates([1, 1, 2, 2, 2, 3, 4, 4]));