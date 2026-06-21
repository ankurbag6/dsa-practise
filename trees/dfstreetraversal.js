function getPathSum(node, target, rsum) {
    // Use DFS pattern
    // runningSum
    // Traverse every node, and add the value to the runningSum

    rsum += target;
    // base case
    if(rsum === target) return true;

    // recursive case
    if(node.left) getPathSum(node.left, target, rsum);

    if(node.right) getPathSum(node.right, target, rsum);

    return false;
}

function getPathSum2(node, target, rsum, runningList) {
    
    // base case
    if(rsum === target) return runningList;
    
    rsum += node.value;
    runningList.push(node.value);

    // recursive case
    if(node.left) getPathSum(node.left, target, rsum, runningList);

    if(node.right) getPathSum(node.right, target, rsum, runningList);
    runningList.delete(node.value);
    return;
    
}

// Bottom up appraoch
// Find the diameter of a tree
let maxDiameter = 0;

function getDiameter(node){
    //int
    //edge case
    if(!node) return 0;
    // recursive code
    maxDiameter = getSubTreeDiameter(node);
    return maxDiameter;
}

function getSubTreeDiameter(node) {

    //base case : leaf return 0
    if(node.left == null && node.right == null) return 0;
    let lmax=0, rmax=0, myD =0;
    
    if(node.left) lmax = getSubTreeDiameter(node.left) + 1;
    if(node.right) lmax = getSubTreeDiameter(node.right) + 1;

    myD = lmax + lmax;
    
    if(myD > maxDiameter) maxDiameter = myD;
    return Math.max(lmax, lmax);
}

let uValCount = 0;
function getUnivalSubtreecount(root) {
    if(!root) return uValCount;

    getSubtreeUval(root);
    return uValCount;
}

function getSubtreeUval(node) {
    // base case
    if(node.left == null && node.right == null) {
        uValCount++;
        return true;
    }
    let islUVal = false, isRUVal = false, isMyUVal = false;
    // recursive case
    islUVal = getSubtreeUval(node.left);
    isRUVal = getSubtreeUval(node.right);

    isMyUVal = islUVal && isRUVal && node.left.value === node.right.value && node.left.value === node.value ;
    if(isMyUVal){
    uValCount++;
    }
    return isMyUVal;
}