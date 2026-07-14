
const grid = Array.from({ length: 4 }, () => Array(4).fill("$"));
function drawLine(x1, y1, x2, y2, ch) {
        const dx = x2 - x1;
       
        const dy = y2 - y1;
        if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) {
            throw new Error('Line must be horizontal, vertical, or 45-degree diagonal');
        }
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const stepX = steps === 0 ? 0 : dx / steps;
        const stepY = steps === 0 ? 0 : dy / steps;
        
         console.log({dx, dy,absx: Math.abs(dx),absy: Math.abs(dy), steps , stepX, stepY})
let x = x1, y = y1;
        for (let i = 0; i <= steps; i++) {
            x = x1 + i * stepX;
            y = y1 + i * stepY;
            grid[x][y] = ch;
        }

    }
// for(let i=0; i<grid.length; i++) {
//      // console.log(grid[i]);
//     // for(let j=0; j<grid[0].length; j++) {
//     //     console.log(grid[i][j]+" a ");
//     // }
//     //console.log("\n");
//     console.log(grid[i].join(" ")); 
// }
console.log("+++++++++++++++++++++")
drawLine(0,0,2,2,"X");
for(let i=0; i<grid.length; i++) {
     // console.log(grid[i]);
    // for(let j=0; j<grid[0].length; j++) {
    //     console.log(grid[i][j]+" a ");
    // }
    //console.log("\n");
    console.log(grid[i].join(" ")); 
}