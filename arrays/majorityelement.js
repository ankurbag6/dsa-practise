/*

Q4 — Majority Element (Easy)

Given an array of size n, return the element that appears more than ⌊n/2⌋ times. You may assume it always exists.
*/

function majorityElement(nums) {
    if (nums.length === 1) return nums[0];

    const counts = new Map();
    for (const n of nums) {
        counts.set(n, (counts.get(n) ?? 0) + 1);
    }

    const threshold = Math.floor(nums.length / 2);
    // for...of over a Map yields [key, value] pairs; for...in would yield nothing
    for (const [value, count] of counts) {
        if (count > threshold) return value;
    }

    return -1;
}

const cases = [
    [[3, 2, 3], 3],
    [[2, 2, 1, 1, 1, 2, 2], 2],
    [[1], 1],
    [[7], 7],              // single element that isn't 1
    [[6, 6, 6, 7, 7], 6],
];

for (const [input, expected] of cases) {
    const got = majorityElement(input);
    console.log(`${got === expected ? 'PASS' : 'FAIL'}  [${input}] -> ${got}`);
}
