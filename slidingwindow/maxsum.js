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


console.log(maxSum([-1,2,3,4,5,-9,8,4], 3));


/*
Given an array of integers and k, 
return the maximum sum of any contiguous subarray of length exactly k
[2,1,5,1,3,2], k=3 → 9.

sum = 0
maxSum = 0
l = 0
[2,1,5,1,3,2]
   l   l
sum += arr[l] .. till l<k
if(i==k) {
 maxSum = Math.max(maxSum, sum);
 l++
}
decremment i by k
i-=k;
*/

function findmaxSum(nums, k) { // [2,1,5,1,3,2] , 3
    if(nums.length === 0 || nums === undefined) return -1;
    if(nums.length<=k) {
        return nums.reduce((acc, num) => acc + num, 0);
    }
    let maxSum = -Infinity;
    let l=0, i=0;
    let sum=0;
    while(i<nums.length) { // 0 <6  // 1 <6 2 <6   // 2
        if(i-l<k) { // 0 - 0 // 1 - 0 // 2- 0.  // 1-1 // 2-1 // 3-1 // 4- 1
            sum += nums[i]; // 2 // 3 // 8  // 1 // 6 // 7
            i++; // 1 // 2 // 3 // 2 // 3 // 4
        }
        else if(i-l === k) { 
            maxSum = Math.max(maxSum, sum);  // 8 // 8
            while(i>l) { // 3 >=0  // 2>=0  // 4 >=1 // 3>=1 // 2>=1 // 1>=1
                i--; // 2 //1 // 0 // 3 // 2 // 1
                sum -= nums[i]; // 8-5 = 3 // 2 // 0 // 7-1 = 6 //6-5=1 // 1- 1
                
            }
            l++; // 2
            i=l; // 2
            
        }
        
    }

    return maxSum;

}


console.log(findmaxSum([2,1,5,1,3,2], 3));

console.log(findmaxSum([1,1,1,1], 3));

console.log(findmaxSum([-1,2,3,4,5,-9,8,4], 3));