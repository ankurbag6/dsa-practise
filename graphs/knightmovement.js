minimumKnightMoves(x, y) {
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