function findMaxDepth(node) {
    if(node === null)
        return 0;

    if(node.left === null && node.right === null)
        return 1;

    const left = findMaxDepth(node.left);
    const right = findMaxDepth(node.right);
    return 1 + Math.max(left , right);
}