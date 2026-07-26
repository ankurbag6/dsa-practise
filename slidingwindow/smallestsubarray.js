function smallestSubArr(nums, target) {

/*
[2,3,1,2,4,3]
         l r
rsum = 2,5,6, 8, 7
best = 4, 3 l++
subarrlen = r-l : 4,3

*/
// let rsum = 0, best = 0, l=0, r=0;
// while(r<nums.length || l<r) {
//     if(rsum<target ) {
//         rsum += nums[r];
//         r++;
//     } else {
//         best = Math.min(best, r-l+1);
//         rsum = rsum - nums[l] ;
//         l++; r++;
//     }
// }
// return best;

    let sum = 0, best = Infinity, l=0;
    for(let r=0; r<nums.length; r++) {
        sum += nums[r];//add 2,5,6,8 // 10 // 7

        while(sum>=target) {
            
            best  = Math.min(best, r-l+1);//record 4,4
            sum -= nums[l++];// shrink 6, 7, 4
        }
    }
    return best;
}


console.log(smallestSubArr([2,3,1,2,4,3], 7));