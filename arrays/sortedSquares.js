/***
 * 
 * **Question 5: Squares of a Sorted Array**

Given an array sorted in **non-decreasing** order, return an array of the **squares** of each number, also sorted in non-decreasing order.

```javascript
function sortedSquares(arr) {
    // your code here
    return result;
}
```

Example:
- Input: `[-4, -1, 0, 3, 10]`
- Output: `[0, 1, 9, 16, 100]`

The catch: the input can have **negatives**. Squaring `-4` gives `16`, which is larger than `3² = 9` — so the squared values aren't sorted just because the inputs were. The largest squares live at the *two ends* of the array (most negative and most positive), not in the middle.

Constraints to aim for:
- **Time:** O(n) — the naive "square then sort" is O(n log n); can you beat it?
- **Space:** O(n) for the output (that's allowed here, since they want a returned array)
 * 
 * 
 */

/**
 * `[-4, -1, 0, 3, 10]`
 *           |
 *          lo,hi
 * res - [ 0   1  9  16   100]
 *             |
 *             w  
 * 
 */
function sortedSquares(arr) {
    const n = arr.length;
    const result = new Array(n);
    let lo = 0, hi = n - 1;
    let write = n - 1;  // fill result from the BACK (largest first)

    while (lo <= hi) {
        const loSq = arr[lo] * arr[lo];
        const hiSq = arr[hi] * arr[hi];
        if (loSq > hiSq) {
            result[write] = loSq;   // big negative wins
            lo++;
        } else {
            result[write] = hiSq;   // big positive wins
            hi--;
        }
        write--;
    }
    return result;
}