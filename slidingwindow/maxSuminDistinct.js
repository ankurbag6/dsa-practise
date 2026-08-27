/*
DESCRIPTION (inspired by Leetcode.com)
Given an integer array nums and an integer k, write a function to identify the highest possible sum of a subarray within nums, where the subarray meets the following criteria: its length is k, and all of its elements are unique. If no such subarray exists, return 0.

Example 1: Input:

nums = [3, 2, 2, 3, 4, 6, 7, 7, -1]
k = 4
Output:

20
Explanation: The subarrays of nums with length 4 are:

[3, 2, 2, 3] # elements 3 and 2 are repeated.
[2, 2, 3, 4] # element 2 is repeated.
[2, 3, 4, 6] # meets the requirements and has a sum of 15.
[3, 4, 6, 7] # meets the requirements and has a sum of 20.
[4, 6, 7, 7] # element 7 is repeated.
[6, 7, 7, -1] # element 7 is repeated.
We return 20 because it is the maximum subarray sum of all the subarrays that meet the conditions.

Example 2: Input:

nums = [5, 5, 5, 5, 5]
k = 3
Output:

0
Explanation: Every subarray of length 3 contains duplicate elements, so no valid subarray exists. Return 0.
*/


function maxSum(nums, k) {
        let best = 0;
        const seen = new Set();
        let l = 0, sum = 0;
        for(let r=0; r<nums.length;r++) {
            if(!seen.has(nums[r])) {
                sum += nums[r];
                seen.add(nums[r]);

                if(r-l + 1 === k) {
                    best = Math.max(best, sum);
                    sum -= nums[l];
                    seen.delete(nums[l]);
                    l++;
                }
            } else {
               while (seen.has(nums[r])){
                    sum -= nums[l];
                    seen.delete(nums[l]);
                    l++;
                }
            }
        }

        return best;
    }

    // maxSum(nums, k) {
    //     // Sliding window with frequency map to track distinct elements
    //     let maxSum = -Infinity;
    //     let start = 0;
    //     let freqMap = new Map();
    //     let currentSum = 0;
    //     for (let end = 0; end < nums.length; end++) {
    //         currentSum += nums[end];
    //         freqMap.set(nums[end], (freqMap.get(nums[end]) || 0) + 1);
    //         if (end - start + 1 === k) {
    //             // Check if all elements in window are distinct
    //             if (freqMap.size === k) {
    //                 maxSum = Math.max(maxSum, currentSum);
    //             }
    //             // Shrink window from left
    //             currentSum -= nums[start];
    //             freqMap.set(nums[start], freqMap.get(nums[start]) - 1);
    //             if (freqMap.get(nums[start]) === 0) {
    //                 freqMap.delete(nums[start]);
    //             }
    //             start++;
    //         }
    //     }
    //     return maxSum === -Infinity ? 0 : maxSum;
    // }