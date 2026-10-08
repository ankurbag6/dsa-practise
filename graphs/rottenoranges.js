/*

DESCRIPTION (inspired by Leetcode.com)
You are given an m x n grid representing a box of oranges. Each cell in the grid can have one of three values:

"E" representing an empty cell
"F" representing a fresh orange
"R" representing a rotten orange
Every minute, any fresh orange that is adjacent (4-directionally: up, down, left, right) to a rotten orange becomes rotten.

Write a function that takes this grid as input and returns the minimum number of minutes that must elapse until no cell has a fresh orange. If it is impossible to rot every fresh orange, return -1.

Example 1:

Input:

grid = [
["R", "F"],
["F", "F"],
]
Output: 2

Explanation:

After Minute 1: The rotting orange at grid[0][0] rots the fresh oranges at grid[0][1] and grid[1][0]. After Minute 2: The rotting orange at grid[1][0] (or grid[0][1]) rots the fresh orange at grid[1][1].

So after 2 minutes, all the fresh oranges are rotten.

Example 2:

Input:

grid = [
["R", "E"],
["E", "F"],
]
Output: -1

Explanation:

The two adjacent oranges to the rotten orange at grid[0][0] are empty, so after 1 minute, there are no fresh oranges to rot. So it is impossible to rot every fresh orange.

Example 3:

Input:

grid = [
["R", "F", "F", "F"],
["F", "F", "F", "R"],
["E", "E", "F", "F"],
]
Output: 2
*/

function rotting_oranges(grid) {
        if(!grid || grid.length === 0) return -1
        // BFS -->As I m trying to find shortest path
        // dirs - []
        const dirs = [[1,0], [-1,0], [0,-1], [0,1]];
        const row = grid.length, col = grid[0].length; // 2,2
        const queue = []; // [r, c, min]

        let fresh_oranges = 0, minutes = 0;
        // Step 1: Initialize BFS Queue and Count Fresh Oranges
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                if (grid[r][c] === "R") {
                    queue.push([r, c, 0]);
                } else if (grid[r][c] === "F") {
                    fresh_oranges++;
                }
            }
        }

        let head = 0;
       while (head < queue.length) {
            // while q not empty
            // [r,c,min] = dequeue
            const [r, c, min] = queue[head++]; // [0,0,0] // [1,0,1]
            minutes = Math.max(minutes, min);
            for (const [dr, dc] of dirs) {
                // move in all the dirs
                // Boundarycheck && grid[r][c] !=R && !=E
                // push to quue, incrment the min
                // mark the grid = R
                let newPosR = r + dr, newPosC = c + dc; // 0 1 
                if ((newPosR >= 0 && newPosR < row && newPosC >= 0 && newPosC < col) && grid[newPosR][newPosC] === 'F' ) {
                    grid[newPosR][newPosC] = 'R';
                    fresh_oranges--;
                    queue.push([newPosR,newPosC, min+1]); // [1,0,1] //  [0,1,1]
                }
            }
            
        }
        return fresh_oranges === 0 ? minutes : -1;
        

    }