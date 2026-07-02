/*Given an array arr[] consisting of only 0s, 1s, and 2s. 
The objective is to sort the array, i.e., put all 0s first, then all 1s and all 2s in last.


Input: arr[] = [0, 1, 2, 0, 1, 2]
Output: [0, 0, 1, 1, 2, 2]
Explanation: [0, 0, 1, 1, 2, 2] has all 0s first, then all 1s and all 2s in last.

Input: arr[] = [0, 1, 1, 0, 1, 2, 1, 2, 0, 0, 0, 1]
Output: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2]
Explanation: {0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2} has all 0s first, then all 1s and all 2s in last.


// Solution 1
// Edge case
[] ==> []
arr[] = [0, 1, 2, 0, 1, 2] .. 0,1,2
map --> [k,v] 


// Solution 2
arr[] = [0, 1, 2, 0, 1, 2] .. 0,1,2
               p0        P2
        [0, 1, 1, 0, 2, 2]
            p0    p1 p2
        [0, 0, 1, 1, 2, 2]
        
        [0 0 0 0 0 1 1 1 2 2 2]
        p0 p1                p2
*/
function sort(arr) { // [0, 1, 2, 0, 1, 2]

    if (!arr || arr.length === 0) return [];
    let p0 = 0, p1 = 0, p2 = arr.length - 1; // 0,0, 5
    while (p1 < p2 && p1 >= p0) {
        console.log("p0,p1,p2 ::: ", p0, p1,p2);
        if (arr[p1] === 0) {
            // check the p0's value
            // if p0 == 0 p0++
            // if p0's values != 0
            // swap(p1, p0) p1 ++
            if (arr[p0] === 0) p0++;
            else {
                [arr[p0], arr[p1]] = [arr[p1], arr[p0]];
                p1++;
            }
        } else if (arr[p1] === 1) {
            // check the p0's value
            // if p0 == 0 p0++
            // if p0's values != 0
            // swap(p1, p0) p1 ++
            if (arr[p0] === 0) p0++;
            else {
                [arr[p0], arr[p1]] = [arr[p1], arr[p0]];
                p1++;
            }
        }
        else if (arr[p2] === 2) {
            // check p2's value
            // if p2 == 2 p2--
            // if p2's values != 2
            // swap(p1, p2) p1 ++ 
            if (arr[p2] === 2) p2--;
            else {
                [arr[p1], arr[p2]] = [arr[p2], arr[p1]];
                p1++;
            }
        }

    }
    return arr;
}

console.log(sort([0, 1, 2, 0, 1, 2]));



/*  
  
  --------------
  
  
  Delete a Node from linked list without head pointer

1->2-3-4->5



temp = crr --> next
3-->empty
1->2 4->5

// Datastructure
Node {
  int value;
  Node next;
}

1->2-3-4->5
     c
     

deleteNode(Node ptr)
{
	
}


printList(Node Head)
{
1-2-4-5
}



main()
{
deleteNode

printNode()
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}
*/