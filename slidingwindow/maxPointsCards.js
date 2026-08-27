/*
Max Points You Can Obtain From Cards
medium
DESCRIPTION (inspired by Leetcode.com)
Given an array of integers representing card values, write a function to calculate the maximum score you can achieve by picking exactly k cards.

You must pick cards in order from either end. You can take some cards from the beginning, then switch to taking cards from the end, but you cannot skip cards or pick from the middle.

For example, with k = 3:

Take the first 3 cards: valid
Take the last 3 cards: valid
Take the first card, then the last 2 cards: valid
Take the first 2 cards, then the last card: valid
Take card at index 0, skip some, then take card at index 5: not valid (skipping cards)
Constraints: 1 <= k <= cards.length

Example 1: Input:

cards = [2,11,4,5,3,9,2]
k = 3
Output:

17
Explanation:

First 3 cards: 2 + 11 + 4 = 17
Last 3 cards: 3 + 9 + 2 = 14
First 1 + last 2: 2 + 9 + 2 = 13
First 2 + last 1: 2 + 11 + 2 = 15
Maximum score is 17.

Example 2: Input:

cards = [1, 100, 10, 0, 4, 5, 6]
k = 3
Output:

111
Explanation: Take the first three cards: 1 + 100 + 10 = 111. This is better than taking the last 3 cards (4 + 5 + 6 = 15) or any other combination.
*/
class Solution {
    maxScore(cards, k) {
        // Calculate total sum of all cards
        const total = cards.reduce((sum, card) => sum + card, 0);
        if (k === cards.length) {
            return total;
        }
        // Sliding window with fixed length
        let l=0, sum=0, maxSum = -Infinity;
        for(let r =0; r< cards.length; r++) {
            // add
            sum += cards[r];
            // if len meets target
                // record and shrink
            if(r - l + 1 === cards.length - k) {
                maxSum = Math.max(maxSum, total - sum);
                sum -= cards[l];
                l++;
            }
        }
        return maxSum;
    }

    
}