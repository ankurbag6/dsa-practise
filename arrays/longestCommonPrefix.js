/*

Q5 — Longest Common Prefix (Easy)

Return the longest common prefix string among an array of strings. Return "" if no common prefix.
*/

// horizontal scan: start with the first string as the candidate prefix,
// then shrink it against every other string until it fits them all
function longestCommonPrefix(arrs) {
    if (!arrs || arrs.length === 0) return "";

    let cmprefix = arrs[0];

    for (let str of arrs) {
        // trim the candidate one char at a time until str starts with it
        // "flower" vs "flight" → "flowe" → "flow" → "flo" → "fl" ✓
        while (!str.startsWith(cmprefix)) {
            cmprefix = cmprefix.slice(0, -1);
            if (cmprefix === "") return "";   // nothing left in common
        }
    }

    return cmprefix;
}

// vertical scan: walk column by column instead, comparing char i of every
// string before moving to i + 1. Bails at the first mismatch or short string.
function longestCommonPrefix_vertical(arrs) {
    if (!arrs || arrs.length === 0) return "";

    for (let i = 0; i < arrs[0].length; i++) {
        const ch = arrs[0][i];

        for (let j = 1; j < arrs.length; j++) {
            // ran off the end of a shorter string, or chars differ
            if (i === arrs[j].length || arrs[j][i] !== ch) {
                return arrs[0].slice(0, i);
            }
        }
    }

    return arrs[0];   // first string is a prefix of every other one
}

console.log(longestCommonPrefix(["flower","flow","flight"]));  // → "fl"
console.log(longestCommonPrefix(["dog","racecar","car"]));      // → ""
console.log(longestCommonPrefix(["a"]));                        // → "a"
console.log(longestCommonPrefix([""]));                         // → ""
console.log(longestCommonPrefix([]));                           // → ""
console.log(longestCommonPrefix(["ab","ab"]));                  // → "ab"
console.log(longestCommonPrefix(["ab","abc"]));                 // → "ab"

console.log(longestCommonPrefix_vertical(["flower","flow","flight"]));  // → "fl"
console.log(longestCommonPrefix_vertical(["dog","racecar","car"]));      // → ""
console.log(longestCommonPrefix_vertical(["a"]));                        // → "a"
console.log(longestCommonPrefix_vertical([""]));                         // → ""
console.log(longestCommonPrefix_vertical([]));                           // → ""
console.log(longestCommonPrefix_vertical(["ab","ab"]));                  // → "ab"
console.log(longestCommonPrefix_vertical(["ab","abc"]));                 // → "ab"
