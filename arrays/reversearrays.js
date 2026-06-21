/*Question 1: Reverse the Array
Write a function that reverses the elements of an array in-place (don't allocate a new array).
function reverseArray(arr) {
    // your code here
    return arr;
}
*/
function swap(arr, p, q){
    let temp = arr[p];
    arr[p] = arr[q];
    arr[q] = temp;
}
function reverseArray(arr) {
    // your code here

    /**
     * 
     * arr - 1 2 3 4
     *       |     |
     *       p     q
     * Scan - From 0 to len -1
     * p,q
     * swap a[p], a[q]
     * .. till p == q
     *      *  
     * 
     * i = 0
     * p = 0
     * q = 3
     * 4 2 3 1
     * 
     * i = 1
     * p = 1
     * q = 2
     * 4 3 2 1
     * 
     * p =2
     * q = 1
     * break
     */
    let p = 0, q = arr.length -1;
    while(p < q) {
        
        swap(arr,p, q);
        p++;
        q--;
    }
        
    return arr;
}
console.log(reverseArray([1, 2, 3, 4, 5]));