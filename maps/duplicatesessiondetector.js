/*

You are given an array of strings sessions, where each element is a session ID. Return the first session ID that appears more than once — "first" meaning the ID whose second occurrence has the lowest index. If no ID repeats, return null.

You must solve it in one pass.



Example 1

Input:  sessions = ["a9", "b3", "c1", "b3", "a9"]
Output: "b3"
Explanation: "b3" repeats at index 3, "a9" repeats at index 4. Index 3 < 4.

Example 2

Input:  sessions = ["x1", "x2", "x3"]
Output: null

Example 3

Input:  sessions = ["s", "s"]
Output: "s"

Constraints

0 <= sessions.length <= 10^5
1 <= sessions[i].length <= 36

*/



/**
 * @param {string[]} sessions
 * @return {string | null}
 */
function firstDuplicate(sessions) {

    const seen = new Set();
    for(const s of sessions) {
        if(seen.has(s)) return s;
        seen.add(s);
    }
    return null;
}

console.log(firstDuplicate(["a9", "b3", "c1", "b3", "a9"]));
console.log(firstDuplicate(["s", "s"]));
console.log(firstDuplicate(["x1", "x2", "x3"]));


// Time complexity : O(n), Space complexity O(n)