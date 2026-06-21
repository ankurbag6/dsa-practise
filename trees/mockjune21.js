/***
 * 
 * 
 * 
 * 
 */
// 6 min
function isSameTree(p, q) {
    // your code
    if(p === null && q === null) return true;
    
    if(p === null || q === null) return false;
    // comapre proot.val to qroor.val
    // compare p.left.val and q.left val
    // compare p.right.val = q.right.val
    if (p.val !== q.val) return false;          // ← this line replaces the whole leaf block

    
    // recurse
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)
}