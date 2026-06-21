
let maxDepth = 0;

function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}
/** Attemp1  
function maxDepthfn(root) {
    // your code
    if(!root) return 0;

    // helperfunction
    maxDepth = maxDepthDfs(root);
    return maxDepth;
}

function maxDepthDfs(node) {
    // base
    // leaf node --> return 1
    if(node.left === null && node.right=== null) return 1;
    // recursion
    let depthLeft = 0, depthRight = 0, myDepth=0;
    if(node.left) {
        depthLeft = maxDepthDfs(node.left)+1;
    } 
    if(node.right) {
        depthRight = maxDepthDfs(node.right)+1;
    } 
    myDepth = Math.max(depthLeft, depthRight)
    if(myDepth > maxDepth) maxDepth = myDepth;
    return myDepth;
}
    */
function maxDepth(root) {
    if (root === null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function isSameTree(p, q) {
    // your code
    if (p === null && q === null) return true;
    if (p === null || q === null) return false;
    if(p.val !== q.val) return false;
    // only node
    if ((p.left == null && p.right === null) 
        && (q.left == null && q.right === null) 
        && (p.val === q.val)) return true;
    
    // Recursion
    return (isSameTree(p.left, q.left) && isSameTree(p.right, q.right));
}
