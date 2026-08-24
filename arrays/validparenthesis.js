/*
Q3 — Valid Parentheses (Easy)

Given a string with only '()[]{}',
determine if it's valid — every open bracket closed by the same type, in correct order.
*/

// Stack of unclosed openers. A closer is only valid if it matches the most
// recent opener — that "most recent" is exactly what a stack gives you.
// O(n) time, O(n) space (worst case "(((((" pushes everything).
const CLOSER_TO_OPENER = {
    ')': '(',
    ']': '[',
    '}': '{',
};

function isValid(str) {
    if (str === undefined || str === null) return false;

    const stack = [];
    for (const ch of str) {
        if (ch in CLOSER_TO_OPENER) {
            // must match the top; an empty stack means a closer with no opener
            if (stack.pop() !== CLOSER_TO_OPENER[ch]) return false;
        } else {
            stack.push(ch);
        }
    }

    // anything left over is an opener that was never closed
    return stack.length === 0;
}

const cases = [
    ['()', true],
    ['()[]{}', true],
    ['(]', false],           // right count, wrong type
    ['([)]', false],         // interleaved, not nested
    ['{[]}', true],
    [')', false],            // closer with nothing open
    ['(', false],            // opener never closed
    ['', true],              // vacuously valid
];

for (const [input, expected] of cases) {
    const got = isValid(input);
    console.log(`${got === expected ? 'PASS' : 'FAIL'}  isValid("${input}") -> ${got}`);
}
