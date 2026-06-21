/**
 * 
 * Question 3: Rotate Array by One
Shift all elements in the array to the right by one position, in-place. The last element wraps around to the front.
javascript

function rotateByOne(arr) {
    // your code here
    return arr;
}
Example:

Input: [1, 2, 3, 4, 5]
Output: [5, 1, 2, 3, 4]

Constraints to aim for:

Time: O(n)
Space: O(1) — in-place

 * 
 *  temp = 1
 *  arr - 2 3 4 5 1
 *        | |
 *        p q
 *  index - 0 --> 4, 1 --> 0, 3 -->2 , 4 -->3
 *         
 *  temp = -1111111111 
 *  2 pointers p, q 
 *  q --> arr.len-1
 *  p --> arr.len-2 
 *  swap(temp , arr[p]) 
 *    --> arr[p] : temp, temp becomes arr[p]
 *  swap(arr[p], arr[q])   
 *  p--, q--
 *  swap(temp, arr[len-1])
 */
function swap(arr, p, q){
    let temp = arr[p];
    arr[p] = arr[q];
    arr[q] = temp;
}
/*
function rotateByOne(arr) {
    // your code here
    let temp = -1111111;
    let p = arr.length - 2;
    for(let i = arr.length - 1; i > 0; i--) {
        temp = arr[p];
        swap(arr, p, i);
        p--;
    }
    return arr;
}
    */

function rotateByOne(arr) {
    if (arr.length <= 1) return arr;
    const last = arr[arr.length - 1];        // save the wrap-around element
    for (let i = arr.length - 1; i > 0; i--) {
        arr[i] = arr[i - 1];                  // shift each element right
    }
    arr[0] = last;                            // drop the saved one at the front
    return arr;
}
console.log(rotateByOne([1,2,3,4,5]));
