function findMaxMin(nums) {
  // your code
  // sort the array and get the first--> min, last --> max
  // Time complexity - T(nlogn)
  nums.sort((a,b) => b - a)
  return [nums[0], nums[nums.length - 1]];
}
// recommended 
/**
 * 
 * let max = nums[0], min = nums[0];
for (const n of nums) {
  if (n > max) max = n;
  if (n < min) min = n;
}
 * 
 */

// Example
findMaxMin([3, 7, 1, 9, 4]); // → { max: 9, min: 1 }


function sumArray(nums) {
  // your code
  //if(!nums) return 0;
   let sum = 0;
  for(const n of nums) {
    sum += n;
  }
  return sum;
}

sumArray([1, 2, 3, 4, 5]); // → 15
sumArray([]);              // → 0


function average(nums) {
  // your code
  if(!nums || nums.length === 0) throw new Error("Average cannot be calculated");
  let sum = 0;
  for(const n of nums) {
    sum += n;
  }
  return sum / nums.length;
}

average([2, 4, 6, 8]); // → 5
average([]);           // → ?  ← decide and justify

function countEvenOdd(nums) {
  // your code
  if(!nums || nums.length === 0) return {even :0, odd: 0 };
  let evenCnt = 0;
  for(const n of nums) {
    if(n % 2 === 0 ) evenCnt++
  }

  return {even :evenCnt, odd: nums.length - evenCnt }
}

countEvenOdd([1, 2, 3, 4, 5]); // → { even: 2, odd: 3 }


function linearSearch(nums, target) {
  // your code
  if(!nums || nums.length === 0) return -1;
  
  for(let i=0; i<= nums.length-1; i++) {
    if(nums[i] === target) return i;
  }
  return -1;
}

linearSearch([1, 2, 3, 4, 5], 3); // → 2
linearSearch([1, 2, 3, 4, 5], 9); // → -1

function isSorted(nums) {
  if (!nums || nums.length <= 1) return true;
  let asc = true, desc = true;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < nums[i - 1]) asc = false;
    if (nums[i] > nums[i - 1]) desc = false;
  }
  return asc || desc;
}

isSorted([1, 2, 3, 4]); // → true
isSorted([4, 3, 2, 1]); // → true
isSorted([1, 3, 2]);    // → false
isSorted([5]);          // → true


function missingNumber(nums) {
  // your code
//   let actual = 0, expected = 0;
//   for (let i = 0; i < nums.length; i++) {
//     actual += nums[i]; expected += nums[i];
//   }
//   return actual - expected;


  const n = nums.length;
  let expected = n * (n + 1) / 2;   // formula for 0+1+...+n
  let actual = 0;
  for (const x of nums) actual += x;
  return expected - actual;

}

missingNumber([3, 0, 1]);          // → 2  (n=3, range [0,3])
missingNumber([0, 1]);             // → 2  (n=2, range [0,2])
missingNumber([9,6,4,2,3,5,7,0,1]); // → 8


function secondLargest(nums) {
  // your code
  let max = -Infinity, secondLargest = -1;
  for(const n of nums) {
    if(n> max) {
        secondLargest = max;
        max = n;
    }
  }
  return secondLargest;
}

secondLargest([3, 1, 4, 1, 5, 9, 2, 6]); // → 6
secondLargest([5, 5, 5]);                 // → -1  (no distinct second)
secondLargest([1, 2]);                    // → 1
secondLargest([7]);                       // → -1