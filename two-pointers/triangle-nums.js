/*

Triangle Numbers
medium
DESCRIPTION (inspired by Leetcode.com)
Write a function to count the number of triplets in an integer array nums that could form the sides of a triangle.

For three sides to form a valid triangle, all three of these conditions must hold: (a + b > c), (a + c > b), and (b + c > a), where (a), (b), and (c) are the side lengths. In other words, the sum of every possible pair must exceed the third side.

a
b
c
Valid triangle requires:
a + b > c AND a + c > b AND b + c > a
(every pair must sum to more than the third side)
The triplets do not need to be unique.

Example:

Input:

nums = [11,4,9,6,15,18]
Output:

10
Explanation: Valid combinations are...

4, 15, 18
6, 15, 18
9, 15, 18
11, 15, 18
9, 11, 18
6, 11, 15
9, 11, 15
4, 9, 11
6, 9, 11
4, 6, 9
*/

function triangleNumber(nums) {
        // Your code goes here
        /*
        1. Sort the nums
        2. Pin one pointer to largest num
        3. keep right = len -1(second highest), left =0
        4. Scan the array from end to start
            for i
              while(l<r)
              nums[r] + nums[l] > nums[i] : Vlid pair
               -> so all the nums with r are valid pair
               count += r - l
               r--
              nums[r] + nums[l] < nums[i] : Not valid
              --> l++
        */

        nums.sort((a,b) => a - b); // 4 6 9 11 15 18
        console.log(nums)
        let count = 0, r=0, l=0;
        for(let i=nums.length-1;i>0;i--) {
            r = i-1; // 5 // 4
            l=0;
            while(l<r) {
                if(nums[r]+nums[l] > nums[i]) { // 4 15 > 15 // 6 11 18 //9 11 18
                    count += r -l; // 4 + 1 // 
                    r--;
                } else if(nums[r]+nums[l] <= nums[i]) { // 4 11 18 // 
                    l++;
                }
            }
        }
        return count;

}

console.log(triangleNumber([11,4,9,6,15,18]))