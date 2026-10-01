function rightmostNode(root) {
        if (!root) return [];

        const q = [root];
        const output = [];

        while (q.length != 0) {
            let size = q.length;

            for (let i=0;i<size;i++) {
                let currnode = q.shift();
                if (i === size - 1) output.push(currnode.val);
                if (currnode.left) q.push(currnode.left);
                if (currnode.right) q.push(currnode.right);
            }
        }
        return output;
    }