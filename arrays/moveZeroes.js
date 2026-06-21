/**
 * Question 2: Move Zeroes to End
Move all 0s to the end of the array while keeping the relative order of the non-zero elements. Do it in-place.
javascriptfunction moveZeroes(arr) {
    // your code here
    return arr;
}
Example:

Input: [0, 1, 0, 3, 12]
Output: [1, 3, 12, 0, 0]

Note the order matters: 1, 3, 12 must stay in that sequence — you can't just sort or swap blindly.
Constraints to aim for:

Time: O(n)
Space: O(1) — in-place

Say "done" when you've got it, or "solution" to see the walkthrough.
 */



function swap(arr, p, q){
    let temp = arr[p];
    arr[p] = arr[q];
    arr[q] = temp;
}

function moveZeroes(arr) {
    // your code here
    /**
     *                 q
     *                 |
     * [1, 3, 12, 0,0 ]
     *            |
     *            p
     * Scan the array
     * p = index to be swapped(Zeros)
     * q = index that is non zero
     * if(arr[q] !== 0) {
     *   swap(arr, p, q)
     *   p++;
     * }
     */
    let p = 0;
    for(let q = 0; q< arr.length; q++){
        if(arr[q] !== 0) {
            swap(arr, p, q)
            p++;
        }
    }
    return arr;
}

console.log(moveZeroes([
  0, 0, 1, 2, 3, 4,
  5, 0, 0
]));

