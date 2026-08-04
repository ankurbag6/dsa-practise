// Adj Matrix
const graph = 
[['1', '1', '0', '0','0'],
['1', '1', '0', '0','0'],
['0', '0', '1', '0','0'],
['0', '0', '0', '1','1']];
const graph2 = [
  ['1', '0', '1'],
  ['0', '0', '0'],
];

const graph3 = [
  ['0', '1'],
  ['1', '0'],
];
/*

  0-->1
  1-->0

*/
let visited = Array(graph.length).fill(0); 
const connectedComponents = [];
const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
const rows = graph.length;
const cols = graph[0].length;
function countIsland() {
    // res
    let count = 0;
    
    // for every node in the graph
        // if not visited(node)
        // bfs(node)
        // count++;
    for(let r=0; r<rows; r++) {
        for(let c=0;c<cols; c++) {
            if(graph[r][c] === '1') {
                count++;
                bfs([r,c])
            }
        }
    }
    return count;
}

function bfs(src) {
    let q = [];
    q.push(src);
    const [r, c] = src;
    graph[r][c] = "0"; // mark it visited
    while(q.length != 0) {
        let [x, y] = q.pop();
        // get neighbors
        // scan the graph and find 1
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y+dy; // neighbour coordinate
            if (nx >=0 && nx < rows && ny >=0 && ny <cols && graph[nx][ny] === "1") {
                console.log("neighbour, graph[nx][ny]", nx, ny, graph[nx][ny]);
                graph[nx][ny] = "0" // mark neighbor visited
                q.push([nx, ny]);
            }
        }
    }
}


console.log(countIsland());


