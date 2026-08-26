/*
B2. Anagram Buckets 🟢

Given an array of strings words, group the anagrams together. Two words are anagrams if one can be rearranged to form the other. Return the groups in any order; within a group, preserve original input order.

Example 1

Input:  words = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]

Example 2

Input:  words = [""]
Output: [[""]]

Example 3

Input:  words = ["a"]
Output: [["a"]]

Constraints

1 <= words.length <= 10^4
0 <= words[i].length <= 100
words[i] consists of lowercase English letters.

Follow-up: State your map key and the total complexity it gives you. There are two standard choices — know why they differ when word length k grows.

*/

const ALPHABET = 26;
const A_CODE = 'a'.charCodeAt(0);

// Key = the 26-slot letter-frequency vector, e.g. "eat" -> "1#0#0#0#1#...#1#..."
// Anagrams have identical frequency vectors by definition, so equal key <=> same bucket.
// Building one key is O(k); total O(n*k). No sort anywhere.
function countKey(word) {
    const counts = new Array(ALPHABET).fill(0);
    for (let i = 0; i < word.length; i++) {
        counts[word.charCodeAt(i) - A_CODE]++;
    }
    // '#' separator matters: without it [1,11] and [11,1] both flatten to "111"
    return counts.join('#');
}

/**
 * @param {string[]} words
 * @return {string[][]}
 */
function groupAnagrams(words) {
    const buckets = new Map();

    for (const word of words) {
        const key = countKey(word);
        if (!buckets.has(key)) {
            buckets.set(key, []);
        }
        // pushing in input order preserves within-group order for free
        buckets.get(key).push(word);
    }

    // Map iterates in insertion order, so groups come out in first-seen order
    return [...buckets.values()];
}

// --- alternative: sorted-string key, O(n * k log k) ---
function groupAnagramsSorted(words) {
    const buckets = new Map();
    for (const word of words) {
        const key = [...word].sort().join('');  // "eat" -> "aet"
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(word);
    }
    return [...buckets.values()];
}

// --- tests ---
// order-insensitive across groups, order-sensitive within a group
function normalize(groups) {
    return JSON.stringify(groups.map((g) => g.join(',')).sort());
}

const cases = [
    [['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]],
    [[''], [['']]],
    [['a'], [['a']]],
    [['ab', 'ba', 'abc', 'cab', 'bca'], [['ab', 'ba'], ['abc', 'cab', 'bca']]],
    [['a', 'b', 'c'], [['a'], ['b'], ['c']]],  // no anagrams at all
];

for (const [input, expected] of cases) {
    for (const [name, fn] of [['count', groupAnagrams], ['sort ', groupAnagramsSorted]]) {
        const got = fn(input);
        const ok = normalize(got) === normalize(expected);
        console.log(`${ok ? 'PASS' : 'FAIL'} [${name}] ${JSON.stringify(input)} -> ${JSON.stringify(got)}`);
    }
}
