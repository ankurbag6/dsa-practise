/*

DESCRIPTION (inspired by Leetcode.com)
You are given a chessboard of infinite size where the coordinates of each cell are defined by integer pairs (x, y). The knight piece moves in an L-shape, either two squares horizontally and one square vertically, or two squares vertically and one square horizontally.

Write a function to determine the minimum number of moves required for the knight to move from the starting position (0, 0) to the target position (x, y). Assume that it is always possible to reach the target position, and that x and y are both integers in the range [-200, 200]

Example 1:

Input:

x = 1
y = 2
Output: 1

Explanation: The knight can move from (0, 0) to (1, 2) in one move.

Example 2:

x = 4
y = 4
Output: 4

Explanation: The knight can move from (0, 0) to (4, 4) in four moves ( [0, 0] -> [2, 1] -> [4, 2] -> [6, 3] -> [4, 4] )

*/

function minimumKnightMoves(x, y) {
        let visited = new Set();
        // up, down, left, right
        const directions = [[2,1], [2,-1], [-2,1], [-2,-1],
                    [1,2], [1,-2], [-1,2], [-1,-2]];
        let queue = [[0, 0, 0]];
        visited.add("0,0");
        while (queue.length > 0) {
            let [row, col, moves] = queue.shift();
            if(row === x && col === y) return moves;
            // enqueue neighbors
            for (let [dr, dc] of directions) {
                let nRow = row + dr;
                let mCol = col + dc;
                // check bounds and if neighbor is visited
                if (!visited.has(`${nRow},${mCol}`)) {
                    queue.push([nRow, mCol, moves+1]);
                    visited.add(`${nRow},${mCol}`);
                    
                }
            }
        }
        
    }