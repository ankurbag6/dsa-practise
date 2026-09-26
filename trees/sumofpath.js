/*
Sum of all node values in a binary tree.

  sum(node) = node.val + sum(node.left) + sum(node.right)

Note: this is NOT Leetcode's "Path Sum" (which asks whether some root-to-leaf
path hits a target). Consider renaming the file if you meant that one.
*/

function pathsum(node) {
    if(node === null)
        return 0;

    if(node.left === null && node.right === null)
        return node.value;

    const left = pathsum(node.left);
    const right = pathsum(node.right);
    return node.value + left + right;
}

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

const leaf = (value) => ({ value, left: null, right: null });
const node = (value, left, right) => ({ value, left, right });

const cases = [
    ["empty tree",        null,                                          0],
    ["single leaf",       leaf(5),                                       5],
    ["root + 2 leaves",   node(1, leaf(2), leaf(3)),                     6],
    ["left child only",   node(1, leaf(2), null),                        3],
    ["right child only",  node(1, null, leaf(3)),                        4],
    ["three levels",      node(1, node(2, leaf(4), leaf(5)), leaf(3)),  15],
    ["negatives",         node(-1, leaf(-2), leaf(5)),                   2],
    ["zeros",             node(0, leaf(0), leaf(0)),                     0],
    ["left-skewed chain", node(1, node(2, node(3, leaf(4), null), null), null), 10],
];

// JSON.stringify(NaN) is "null" and undefined vanishes — report them as themselves
const show = (v) => (typeof v === "number" || v === undefined ? String(v) : JSON.stringify(v));

let passed = 0;
for (const [name, tree, expected] of cases) {
    let got, threw = null;
    try {
        got = pathsum(tree);
    } catch (e) {
        threw = `${e.constructor.name}: ${e.message}`;
    }
    const ok = threw === null && got === expected;
    if (ok) passed++;
    console.log(
        `${ok ? "PASS" : "FAIL"}  ${name.padEnd(18)} expected ${String(expected).padStart(3)}` +
        (ok ? "" : `  got ${threw ?? show(got)}`)
    );
}
console.log(`\n${passed}/${cases.length} passed`);
