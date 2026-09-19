/*
Move Zeroes

DESCRIPTION (inspired by Leetcode.com)
Given an integer array nums, write a function to rearrange the array by moving all zeros to the end while keeping the order of non-zero elements unchanged. Perform this operation in-place without creating a copy of the array.

Input:

nums = [2,0,4,0,9]
Output:

[2,4,9,0,0]




*/

// function moveZeroes(nums, moveDirection = "right") {
//   // Your code goes here
//   /*
//      [2,0,4,0,9]
//         l r
//      [2,4,0,0,9]
//           l   r
//        [2,4,9,0,0]
//             l   r
//       if(nums[l] === 0) 
//        swap with next nonzero
//        if nums[r] != 0 swap
//        else r++
//       else l++ r++
//     */
//   let l = 0,
//     r = 1;
//   if (moveDirection === "right") {
//     while (r < nums.length) {
//       if (nums[l] === 0) {
//         if (nums[r] !== 0) {
//           //swap
//           [nums[l], nums[r]] = [nums[r], nums[l]];
//         } else r++;
//       } else {
//         l++;
//         r++;
//       }
//     }
//     console.log({ nums, l, r });
//   } else {
//     ((l = nums.length - 1), (r = nums.length - 2));
//     while (r >= 0) {
//       // [ 2, 0, 4, 0, 9 ]
//       /*
//          [ 2, 0, 4, 0, 9 ]
//                     r  l
//         [ 2, 0, 4, 0, 9 ]
//                 r  l
//         [ 2, 0, 0, 4, 9 ]
//          r      l
//      */
//       if (nums[l] === 0) {
//         if (nums[r] !== 0) {
//           //swap
//           [nums[l], nums[r]] = [nums[r], nums[l]];
//         } else r--;
//       } else {
//         l--;
//         r--;
//       }
//       console.log({ nums, l, r });
//     }
//   }
//   return nums;
// }

// console.log(moveZeroes([2, 0, 4, 0, 9]));
// console.log(moveZeroes([2, 0, 4, 0, 9], "left"));


function moveZeroesVaraint(nums) {
    let nextNonZero = 0;
    for (let i = 0; i < nums.length; i++) {
        console.log({ nums, i: i+":"+nums[i], nextNonZero: nextNonZero+":"+nums[nextNonZero] });
        if (nums[i] !== 0) {
            [nums[nextNonZero], nums[i]] = [nums[i], nums[nextNonZero]];
            nextNonZero++;
        }

        //console.log({ nums, i, nextNonZero });
    }
    return nums;
}

console.log(moveZeroesVaraint([2, 0, 4, 0, 9]));