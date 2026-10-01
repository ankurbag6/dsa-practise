function level_order_sum(root) {
    if (!root) return [];

    const queue = [root];
    const output = [];

    while (queue.length !== 0) {
        const currLength = queue.length; // nodes in this level
        let sum = 0;

        for (let i = 0; i < currLength; i++) {
            const currnode = queue.shift();
            sum += currnode.val;

            if (currnode.left) queue.push(currnode.left);
            if (currnode.right) queue.push(currnode.right);
        }

        output.push(sum); // push even if sum is 0
    }

    return output;
}