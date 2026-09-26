function maxValue(node) {
    if (node === null) {
        return -Infinity;
    }

    const left = maxValue(node.left);
    const right = maxValue(node.right);
    return Math.max(left, right, node.value);
}