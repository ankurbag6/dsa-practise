// Creating a 2D matrix (3x3)
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
let rows = grid.length;
let cols = grid[0].length;
function countuniq_rec() {
    let pathcnt = 0;
    pathcnt = dfs([0,0]);
    return pathcnt;
}

function dfs([r,c]) {
    // base case

    if(r === rows-1 && c === cols-1)
        return 1;
    // recurring
    if (r >= rows || c >= cols) return 0;   // walked off the grid — contributes no paths
       return dfs([r+1, c]) + dfs([r, c+1]);
}

console.log(countuniq_rec());