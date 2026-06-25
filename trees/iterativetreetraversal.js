function preOrderTraversal(root) {
    // if root--> null return []
    // create result arr, stack
    // while (node!=null && stack.length !==0)
        // Boundary walk
        // while(node!=null)
            // add node tp the result
            // push to the stack
            // node = node.left
        // pop node
        // node = node.right
    // return result 
}


function postOrderTraversal(root) {
    // if root--> null return []
    // create result arr, stack
    // while (node!=null && stack.length !==0)
        // Boundary walk
        // while(node!=null)
            // push to the stack
            // node = node.right
            // add node to the result
        // pop node
        // node = node.left
    // return result 
}



/*
For your reference:
const BinaryTreeNode = class {
    constructor(valueue) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
};
*/
/**
 * @param {BinaryTreeNode_int32} root
 * @return {list_list_int32}
 */
function all_paths_of_a_binary_tree(root) {
    // Write your code here.
    if(root == null) return []
    // create a stack
    const stack = [], res =[];
        // node = root
    const node = root;    
        // add root to the stack
    stack.push(node);
    while(node!== null && stack.length !== 0) {
        // while node not empty and stack not empty
            // declare temp list
        const temp = [];
        while(node!==null){
            // while node not empty
                // push node to templist
                // push node.left to the stack
                // node = node.left
            temp.push(node.value);
            stack.push(node.left);
            node = node.left;
            
        }
        stack.pop();
        res.push(temp);
        node = node.right;
    }
    return res;
}
