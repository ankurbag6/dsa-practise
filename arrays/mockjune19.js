function removeDuplicates_(nums) {
  // your code
  if(nums.length === 0 || nums.length === 1 )return 0;

  let i=0; j=1, removeCnt=0;
  while(i<j && j<nums.length){
    if(nums[i] === nums[j]) {
        removeCnt++;
    } else {
        i=j;
    }
    j++;
  }
  return nums.length - removeCnt;
}
// Another approach 

function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[read - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}
const a = [1, 1, 2];
console.log(removeDuplicates(a));     // → 2,  a starts with [1, 2, ...]

const b = [0,0,1,1,1,2,2,3,3,4];
console.log(removeDuplicates(b));     // → 5,  b starts with [0,1,2,3,4, ...]

console.log(removeDuplicates([]));    // → 0

function sortedSquares(nums) {
  const n = nums.length;
  const result = new Array(n);
  let left = 0, right = n - 1, write = n - 1;
  
  while (left <= right) {
    const ls = nums[left] * nums[left];
    const rs = nums[right] * nums[right];
    if (ls > rs) {
      result[write--] = ls;
      left++;
    } else {
      result[write--] = rs;
      right--;
    }
  }
  return result;
}

sortedSquares([-4, -1, 0, 3, 10]);  // → [0, 1, 9, 16, 100]
sortedSquares([-7, -3, 2, 3, 11]);  // → [4, 9, 9, 49, 121]


function twoSum(nums, target) {
  // your code
  const map = new Map();
  for(let i=0; i<nums.length; i++) {
    let comp = target - nums[i];
    if(!map.has(comp)) map.set(nums[i], i);
    else {
        return [map.get(comp), i];
    }
  }
}

twoSum([2, 7, 11, 15], 9);   // → [0, 1]
twoSum([3, 2, 4], 6);         // → [1, 2]
twoSum([3, 3], 6);            // → [0, 1]


function isPalindrome(nums) {
  // your code
  if(nums.length === 1 || nums.length === 0) return true;
  let i=0, j=nums.length-1;
  while(i<j) {
    if(nums[i] === nums[j]) {
        i++;j--;
    } else {
        return false;
    }
  }
  return true;
}

isPalindrome([1, 2, 3, 2, 1]); // → true
isPalindrome([1, 2, 3]);       // → false
isPalindrome([1, 1]);          // → true
isPalindrome([7]);             // → true
isPalindrome([]);              // → true


function findMaxConsecutiveOnes(nums) {
  // your code
  if(nums.length === 0) return 0;
  let i=0, j=1;
  let maxcnt = 0;
  let cnt = 1;
  while(i<j && j<nums.length) {
    if(nums[i] === nums[j] && nums[i] === 1) {
        cnt++;
        j++;
        maxcnt = Math.max(cnt, maxcnt);
    } else {
        
        // resett
        i=j;
        j++;
        cnt=1;
    }
  }

  return maxcnt;

}

console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1]));     // → 3
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1]));     // → 2
console.log(findMaxConsecutiveOnes([0, 0, 0]));              // → 0
console.log(findMaxConsecutiveOnes([1, 1, 1]));              // → 3
findMaxConsecutiveOnes([]);                      // → 0