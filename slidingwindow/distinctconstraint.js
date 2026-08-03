/*
 Longest substring containing at most k distinct characters. "eceba", k=2 → 3 ("ece").

 "aaabbbac"
 cnt=0
 seen [ab] ---> cnt++;

*/

function longestSubstring(str, k) {
    if (k === 0) return 0;

    let maxLen = 0;
    let l = 0;
    const counts = new Map(); // char -> how many times it appears in the window

    for (let r = 0; r < str.length; r++) {
        const ch = str[r];
        counts.set(ch, (counts.get(ch) || 0) + 1);

        // too many distinct chars -> shrink from the left until we're back to k
        while (counts.size > k) {
            const left = str[l];
            const remaining = counts.get(left) - 1;
            if (remaining === 0) counts.delete(left);
            else counts.set(left, remaining);
            l++;
        }

        maxLen = Math.max(maxLen, r - l + 1);
    }

    return maxLen;
}

console.log(longestSubstring("eceba", 2)); // 3
console.log(longestSubstring("aaabbbac", 2)); // 7 -> "aaabbba"
