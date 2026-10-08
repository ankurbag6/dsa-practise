/*
DESCRIPTION (inspired by Leetcode.com)
You are given an m x n binary matrix grid where each cell contains either a 0 or a 1.

Write a function that returns a matrix of the same dimensions where each cell contains the distance to the nearest 0 in the original matrix. The distance between two adjacent cells is 1. If there is no 0 in the grid, return -1 for each cell.

Example 1:

mat = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 1, 1],
]
Output:

[
  [1, 0, 1],
  [0, 1, 0],
  [1, 2, 1],
]
*/

class Solution {
    updateMatrix(mat) {
        const rows = mat.length;
        const cols = mat[0].length;
        const output = Array(rows).fill().map(() => Array(cols).fill(-1));
        const queue = [];

        // Step 1: Initialize the queue with all the 0 cells
        // set their distance to 0 in the output grid
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (mat[r][c] === 0) {
                    queue.push([r, c]);
                    output[r][c] = 0;
                }
            }
        }

        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        // Step 2: Perform BFS traversal
        let distance = 1;
        while (queue.length > 0) {
            const levelSize = queue.length;
            for (let i = 0; i < levelSize; i++) {
                const [r, c] = queue.shift();

                for (const [dr, dc] of directions) {
                    const nr = r + dr;
                    const nc = c + dc;

                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                        if (output[nr][nc] === -1) {
                            output[nr][nc] = distance;
                            queue.push([nr, nc]);
                        }
                    }
                }
            }
            distance++;
        }

        // Step 5: Return the output grid
        return output;
    }
}