function bfs(node) {

    //node is empty --> return []
    if(!node) return [];
    // Declare res = []
    const res = [];
    // Create a queue
    // add root to the queue
    const q = [];
    q.push(node);
    // while Q! empty
        // get no.of elems in the Q
        // for every Q element
            // remove the node --> add to the res[]
            // if node.left --> add to the queue
            // if node.right --> add to the queue
    while(q.length !== 0) {
        for(let qn of q) {

            res.push(q.shift());
            if(qn.left) q.push(qn.left);
            if(qn.right) q.push(qn.right);
        }
    }
    return res;
}

/**
 * // Definition for a _Node.
 * function _Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {_Node|null} root
 * @return {number[][]}
 */
var NAryLevelorder = function(root) {
    if(!root) return [];

    let result = [];
    const q = [root];

    while(q.length != 0) {
        let count = q.length;
        let temp = [];
        for(let i=0; i<count; i++) {

            let currnode = q.shift();
            temp.push(currnode.val);
            let children = currnode.children;
            for(const c of children) q.push(c);
        }
        result.push(temp);
    }
    return result;
};

function zigzag(root) {
    // I will implement BFS
    // q , res, 
    // add node to the q
    // level =0
    // while q not empty
        // declare a varable , level
        // create a temp array
        // for every element in the q
            // remove the qnode
            // add qnode to the temp array
            // if left --> add to the q
            // if right --> add to the q 
        // if(level % 2 == 0) push temparray to res
        // else push reveerse temparray to res 
        //level++
    //return res

    if(!root) return [];

    const result = [];
    const q = [root];
    let  level = 0;

    while(q.length != 0) {
        let qCount = q.length;
        let temp = [];
        for(let i=0; i<qCount; i++){
            let currnode = q.shift();
            temp.push(currnode.val); 
            if(currnode.left) {
                q.push(currnode.left);
            }
            if(currnode.right) {
                q.push(currnode.right);
            }
            
        }
        if (level %2 === 0) result.push(temp);
        else  result.push(temp.reverse());
        level++;
    }

    return result;
}

// print only the right side
/**
 *    1
 *  |  |
 *  2   3
 *     |  |
 *     4  5
 * 
 * output --> [1, 3 , 5]
 */
function binaryTreeRight(root) {
    // BFS Patterm
    // while checking the children of a node from the Q, I will just push the right child 

    // create a q, res
    // add root to the q
    // while q not empty
        // create temp array 
        // for all the qelemts
            // enqueue the element
            // add the qelemt to the temp array
            // get all the childrenof qelemts
            // push to the q
        // push the last element of the temp array to the res
    // return res
    if(!root) return [];

    const res = [];
    const q = [root];

    while(q.length !== 0) {
        let count = q.length;
        let temp = [];
        for(let i=0; i<count; i++) {
            let currnode = q.shift();
            temp.push(currnode.val);
            if(currnode.left) { 
                q.push(currnode.left);
            }
            if(currnode.right) { 
                q.push(currnode.right);
            }
        }
        res.push(temp[temp.length-1]);
    }
    return res;

}

var levelOrderBottom = function(root) {
    if(!root) return [];

    const q = [root];
    const res = [];
    while(q.length !== 0) {
        let qCount = q.length;
        let temp = [];

        for(let i=0; i<qCount; i++) {
            let currnode = q.shift();
            temp.push(currnode.val);

            if(currnode.left) q.push(currnode.left);
            if(currnode.right) q.push(currnode.right);

        }
        res.push(temp);
    }
    let output = [];
    let j=0;
    for(let i=res.length-1; i>=0; i--) {
        output[j++] = res[i];
    }

    return output;
};

// bfs(new Node(), )

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

const leaf = (val) => ({ val, left: null, right: null });
const node = (val, left, right) => ({ val, left, right });
const nary = (val, children = []) => ({ val, children });

//        1
//      /   \
//     2     3
//    / \   / \
//   4   5 6   7
const full = node(1, node(2, leaf(4), leaf(5)), node(3, leaf(6), leaf(7)));

//     1
//    / \
//   2   3
//      / \
//     4   5
const rightHeavy = node(1, leaf(2), node(3, leaf(4), leaf(5)));

//        1
//      / | \
//     3  2  4
//    / \
//   5   6
const naryTree = nary(1, [nary(3, [nary(5), nary(6)]), nary(2), nary(4)]);

// 4 levels, so zigzag has to flip direction more than once
//          1
//        /   \
//       2     3
//      / \     \
//     4   5     6
//    /         / \
//   7         8   9
const deep = node(1, node(2, node(4, leaf(7), null), leaf(5)), node(3, null, node(6, leaf(8), leaf(9))));

// left side runs deeper than the right, so the right side view
// has to pick up nodes from the left subtree
//       1
//      / \
//     2   3
//    /
//   4
//    \
//     5
const leftDeep = node(1, node(2, node(4, null, leaf(5)), null), leaf(3));

// zeros and negatives: values are falsy or below zero, nodes still exist
//       0
//      / \
//    -1   -2
//        /
//       0
const zerosNegs = node(0, leaf(-1), node(-2, leaf(0), null));

// LeetCode 429 example 2
const naryWide = nary(1, [
    nary(2),
    nary(3, [nary(6), nary(7, [nary(11, [nary(14)])])]),
    nary(4, [nary(8, [nary(12)])]),
    nary(5, [nary(9, [nary(13)]), nary(10)]),
]);

const suites = [
    ["bfs", bfs, [
        ["empty tree",       null,                                    []],
        ["single node",      leaf(1),                                 [1]],
        ["root + 2 leaves",  node(1, leaf(2), leaf(3)),               [1, 2, 3]],
        ["right-heavy",      rightHeavy,                              [1, 2, 3, 4, 5]],
        ["full 3 levels",    full,                                    [1, 2, 3, 4, 5, 6, 7]],
        ["left-skewed",      node(1, node(2, leaf(3), null), null),   [1, 2, 3]],
        ["right-skewed",     node(1, null, node(2, null, leaf(3))),   [1, 2, 3]],
        ["4 levels, sparse", deep,                                    [1, 2, 3, 4, 5, 6, 7, 8, 9]],
        ["left runs deeper", leftDeep,                                [1, 2, 3, 4, 5]],
        ["zeros/negatives",  zerosNegs,                               [0, -1, -2, 0]],
    ]],
    ["NAryLevelorder", NAryLevelorder, [
        ["empty tree",       null,                                    []],
        ["single node",      nary(1),                                 [[1]]],
        ["3 levels",         naryTree,                                [[1], [3, 2, 4], [5, 6]]],
        ["chain",            nary(1, [nary(2, [nary(3)])]),           [[1], [2], [3]]],
        ["wide, 5 levels",   naryWide,                                [[1], [2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14]]],
        ["zero values",      nary(0, [nary(0), nary(-1)]),            [[0], [0, -1]]],
    ]],
    ["zigzag", zigzag, [
        ["empty tree",       null,                                    []],
        ["single node",      leaf(1),                                 [[1]]],
        ["full 3 levels",    full,                                    [[1], [3, 2], [4, 5, 6, 7]]],
        ["right-heavy",      rightHeavy,                              [[1], [3, 2], [4, 5]]],
        ["4 levels, sparse", deep,                                    [[1], [3, 2], [4, 5, 6], [9, 8, 7]]],
        ["left runs deeper", leftDeep,                                [[1], [3, 2], [4], [5]]],
        ["zeros/negatives",  zerosNegs,                               [[0], [-2, -1], [0]]],
    ]],
    ["binaryTreeRight", binaryTreeRight, [
        ["empty tree",       null,                                    []],
        ["single node",      leaf(1),                                 [1]],
        ["right-heavy",      rightHeavy,                              [1, 3, 5]],
        ["left-only branch", node(1, node(2, null, leaf(5)), leaf(3)), [1, 3, 5]],
        ["full 3 levels",    full,                                    [1, 3, 7]],
        ["4 levels, sparse", deep,                                    [1, 3, 6, 9]],
        ["left runs deeper", leftDeep,                                [1, 3, 4, 5]],
        ["zeros/negatives",  zerosNegs,                               [0, -2, 0]],
    ]],
    ["levelOrderBottom", levelOrderBottom, [
        ["empty tree",       null,                                    []],
        ["single node",      leaf(1),                                 [[1]]],
        ["root + 2 leaves",  node(1, leaf(2), leaf(3)),               [[2, 3], [1]]],
        ["full 3 levels",    full,                                    [[4, 5, 6, 7], [2, 3], [1]]],
        ["4 levels, sparse", deep,                                    [[7, 8, 9], [4, 5, 6], [2, 3], [1]]],
        ["left runs deeper", leftDeep,                                [[5], [4], [2, 3], [1]]],
        ["zeros/negatives",  zerosNegs,                               [[0], [-1, -2], [0]]],
    ]],
];

// JSON.stringify(NaN) is "null" and undefined vanishes — report them as themselves
const show = (v) => (typeof v === "number" || v === undefined ? String(v) : JSON.stringify(v));

let passed = 0, total = 0;
for (const [fnName, fn, cases] of suites) {
    console.log(`\n${fnName}`);
    for (const [name, tree, expected] of cases) {
        total++;
        let got, threw = null;
        try {
            got = fn(tree);
        } catch (e) {
            threw = `${e.constructor.name}: ${e.message}`;
        }
        const ok = threw === null && JSON.stringify(got) === JSON.stringify(expected);
        if (ok) passed++;
        console.log(
            `  ${ok ? "PASS" : "FAIL"}  ${name.padEnd(18)} expected ${JSON.stringify(expected)}` +
            (ok ? "" : `  got ${threw ?? show(got)}`)
        );
    }
}
console.log(`\n${passed}/${total} passed`);