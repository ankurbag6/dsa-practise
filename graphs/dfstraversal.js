// Adj Matrix
const graph = [['1', '1', '0', '0'],
['1', '1', '0', '0'],
['0', '0', '1', '0'],
['0', '0', '0', '1']];



// dfs
function dfs(src, visited) {
    console.log(src);
    visited[src] = true;
    // preordrer recursion
    for(let neighbor=0; neighbor<graph.length; neighbor++) {
        if(graph[src][neighbor] === '1' && !visited[neighbor])
            dfs(neighbor, visited);
    }
}

// outer loop
for(let i=0; i<graph.length;i++) {
    const visited = new Array(graph.length).fill(false);
    dfs(i, visited);
    console.log('---');
}