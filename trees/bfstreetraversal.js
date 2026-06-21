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
    while(q.length === 0) {
        for(let qn of q) {

            res.push(q.shift());
            if(qn.left) q.push(qn.left);
            if(qn.right) q.push(qn.right);
        }
    }
    return res;
}

function naryBfs(node) {
    // BFS pattern
    // create a q, res
    // add root to the q
    // while q not empty
        // for all the qelemts
            //enqueue the element
            // add the qelemt to res
            // get all the childrenof qelemts
            // push to the q

    // return res
}

function zigzag(node) {
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
function binaryTreeRight() {
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

}

// bfs(new Node(), )