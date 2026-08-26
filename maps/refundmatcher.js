/*B3. Refund Matcher 🟡

You are given an integer array txns, where txns[i] is a transaction amount — positive for a charge, negative for a refund — and an integer t. Return the number of contiguous subarrays whose elements sum to exactly t.

Example 1

Input:  txns = [1, 1, 1], t = 2
Output: 2
Explanation: [1,1] (indices 0-1) and [1,1] (indices 1-2).

Example 2

Input:  txns = [3, 4, -7, 1, 3, 3], t = 7
Output: 3   <-- the prompt said 4; brute force confirms 3
Explanation: [3,4] (0-1), [3,4,-7,1,3,3] (0-5), [1,3,3] (3-5).

Example 3

Input:  txns = [-1, -1, 1], t = 0
Output: 1

Constraints

1 <= txns.length <= 2 * 10^4
-1000 <= txns[i] <= 1000
-10^7 <= t <= 10^7

Required in your answer: before coding, explain in 2–3 sentences why a grow/shrink sliding window has no valid invariant when negatives are present.

WHY NOT A SLIDING WINDOW:
A window's grow/shrink rule needs the running sum to move monotonically with each
pointer: with all-positive values, extending right always increases it and advancing
left always decreases it, so "too big -> shrink, too small -> grow" provably converges.
Negatives break that monotonicity — extending right can lower the sum and shrinking
left can raise it — so no local comparison against t tells you which pointer to move,
and a window that slid past a match has no way to come back.

Prefix sums sidestep it: subarray (i, j] sums to t exactly when prefix[j] - prefix[i] === t.

/**
 * @param {number[]} txns
 * @param {number} t
 * @return {number}
 */
function countExactRuns(txns, t) {
    // how many times each prefix sum has been seen so far
    // seed with 0 -> 1: the empty prefix, so a subarray starting at index 0 counts
    const seen = new Map([[0, 1]]);

    let prefix = 0;
    let count = 0;

    for (const amount of txns) {
        prefix += amount;
        // every earlier prefix equal to (prefix - t) closes a subarray summing to t
        count += seen.get(prefix - t) ?? 0;
        seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
    }

    return count;
}

// --- O(n^2) reference used to verify the fast version ---
function bruteForce(txns, t) {
    let count = 0;
    for (let i = 0; i < txns.length; i++) {
        let sum = 0;
        for (let j = i; j < txns.length; j++) {
            sum += txns[j];
            if (sum === t) count++;
        }
    }
    return count;
}

const cases = [
    [[1, 1, 1], 2, 2],
    [[3, 4, -7, 1, 3, 3], 7, 3],   // prompt claimed 4
    [[-1, -1, 1], 0, 1],
    [[0, 0, 0], 0, 6],             // zeros: every one of the 6 subarrays qualifies
    [[1, -1, 1, -1], 0, 4],
    [[5], 5, 1],
    [[5], 3, 0],
    [[-1000, 1000], 0, 1],
];

for (const [txns, t, expected] of cases) {
    const got = countExactRuns(txns, t);
    const ref = bruteForce(txns, t);
    const ok = got === expected && got === ref;
    console.log(`${ok ? 'PASS' : 'FAIL'}  [${txns}] t=${t} -> ${got} (brute ${ref}, expected ${expected})`);
}
