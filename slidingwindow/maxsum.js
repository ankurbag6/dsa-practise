// function maxSum(nums, k) {
//     let l=0, maxSum = -Infinity;
//     let temparr = [], sum=0;
//     for(let r=0; r<nums.length; r++) { // 0, 4, 5
//         if(r-l <k) {
//             sum += nums[r]; // 2, 3, 8
//         } else {
//             sum = sum - nums[l] + nums[r]; // (8-2) + 1, (7-1) +3, (9-5) + 2
//             l++;
//         }
//         maxSum = Math.max(sum, maxSum); // 2 3 8 9
//     }
//     return maxSum;
// }

// function maxSum(nums, k) {
//     if (k <= 0 || k > nums.length) return -Infinity;

//     let sum = 0;
//     for (let i = 0; i < k; i++) sum += nums[i];

//     let best = sum;
//     for (let r = k; r < nums.length; r++) {
//         sum += nums[r] - nums[r - k];   // add entering, drop leaving
//         best = Math.max(best, sum);
//     }
//     return best;
// }


function maxSum(nums, k) {
    let sum=0, maxSum = -Infinity;
    for(let r=0; r<nums.length; r++) { // 0, 4, 5
        
        sum += nums[r]; // 2, 3, 8, 9
        if(r >= k)  {
            sum -= nums[r-k]; // (8-2) + 1, (7-1) +3, (9-5) + 2
        }
        if(r >= k-1) {
           maxSum = Math.max(sum, maxSum); // 2 3 8
        }  
        
    }
    return maxSum;
}


console.log(maxSum([2,1,5,1,3,2], 3));