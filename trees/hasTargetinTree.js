function hasTarget(root, target) {
    if(root === null)
        return false;

    if(!root.left && !root.right)
        return root.value === target;

    target -= root.value;
    const left = hasTarget(root.left, target);
    const right = hasTarget(root.right, target);
    return left || right;
}