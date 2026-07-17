function maxProfit(prices) {
    // if fewer than 2 elements return 0
    if (!prices || prices.length < 2) return 0;

    let minVal = Infinity;
    let profit = 0;

    for (let i = 1; i < prices.length; i++) {
        minVal = Math.min(minVal, prices[i - 1]);          // cheapest buy so far (before today)
        profit = Math.max(profit, prices[i] - minVal);     // sell today?
    }

    return profit;
}

// console.log(maxProfit([7, 1, 5, 3, 6, 4]));  // → 5  (buy at 1, sell at 6)
// console.log(maxProfit([7, 6, 4, 3, 1]));     // → 0  (only decreasing → no profit)
// console.log(maxProfit([1, 2]));              // → 1
// console.log(maxProfit([5]));                 // → 0


function productExceptSelf(nums) {
    const n = nums.length;
    const arr1 = new Array(n); // arr1[i] = product of everything BEFORE i
    const arr2 = new Array(n); // arr2[i] = product of everything AFTER i

    // scan left → right, exclusive prefix
    // [1, 1, 1*2, 1*2*3] --> arr1
    let prod = 1;
    for (let i = 0; i < n; i++) {
        arr1[i] = prod;
        prod *= nums[i];
    }

    // scan right → left, exclusive suffix
    // [2*3*4, 3*4, 4, 1] --> arr2
    prod = 1;
    for (let i = n - 1; i >= 0; i--) {
        arr2[i] = prod;
        prod *= nums[i];
    }

    // multiply (not divide!) — each position skips itself
    return nums.map((_, i) => arr1[i] * arr2[i]);
}

// console.log(productExceptSelf([1, 2, 3, 4]));   // → [24, 12, 8, 6]
// console.log(productExceptSelf([2, 3, 4, 5]));   // → [60, 40, 30, 24]
// console.log(productExceptSelf([0, 1, 2, 3]));   // → [6, 0, 0, 0]
// console.log(productExceptSelf([1, 0]));         // → [0, 1]

function rotate(nums, k) {
  const len = nums.length;
  const res = new Array(len);

  // place each element k spots to the right (wrapping around)
  // 1+3 % 7 = 3, 1+3 % 7 = 4 ... 6+3 % 7
  for (let i = 0; i < len; i++) {
    res[(i + k) % len] = nums[i];
  }

  // copy back so nums is rotated in place
  for (let i = 0; i < len; i++) {
    nums[i] = res[i];
  }
}

// const a = [1,2,3,4,5,6,7];
// rotate(a, 3);
// console.log(a); // → [5,6,7,1,2,3,4]

// const b = [-1,-100,3,99];
// rotate(b, 2);
// console.log(b); // → [3,99,-1,-100]

// const c = [1,2,3];
// rotate(c, 4);   // k > length is allowed
// console.log(c); // → [3,1,2]  (rotate by 4 % 3 = 1)

function lengthOfLongestSubstring(s) {
  const seen = new Set();
  let maxLen = 0;
  let left = 0; // left edge of the current window

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // shrink from the left until the window has no duplicate of ch
    while (seen.has(ch)) {
      seen.delete(s[left]);
      left++;
    }
    seen.add(ch);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// console.log(lengthOfLongestSubstring("abcabcbb")); // → 3   ("abc")
// console.log(lengthOfLongestSubstring("bbbbb"));    // → 1
// console.log(lengthOfLongestSubstring("pwwkew"));   // → 3   ("wke")
// console.log(lengthOfLongestSubstring("dvdf"));     // → 3   ("vdf")
// console.log(lengthOfLongestSubstring(""));         // → 0
// console.log(lengthOfLongestSubstring(" "));        // → 1

// O(n)
function moveZeroes(nums) {
  const res = [];
  // collect non-zero values in order
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) res.push(nums[i]);
  }
  // pad the remainder with zeroes
  while (res.length < nums.length) res.push(0);
  // copy back into nums (in place)
  for (let i = 0; i < nums.length; i++) nums[i] = res[i];
}

// 
function moveZeroes2(nums) {
  let write = 0; // next slot to place a non-zero value

  // pass 1: pull all non-zero values to the front, in order
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      nums[write] = nums[read];
      write++;
    }
  }

  // pass 2: everything from `write` onward must be zero
  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }
}


const a = [0, 1, 0, 3, 12];
moveZeroes(a);
console.log(a); // → [1, 3, 12, 0, 0]

const b = [0];
moveZeroes(b);
console.log(b); // → [0]

const c = [1, 2, 3];
moveZeroes(c);
console.log(c); // → [1, 2, 3]

const d = [0, 0, 1];
moveZeroes(d);
console.log(d); // → [1, 0, 0]