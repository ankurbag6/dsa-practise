// Adj Matrix
const graph = [['1', '1', '0', '0'],
['1', '1', '0', '0'],
['0', '0', '1', '0'],
['0', '0', '0', '1']];


function bfs(src) {
    // create Q
    //console.log("graph::", graph[0][0], graph.length);

    // Initiate Visited array
    const visited = new Array(4);
    for (let i = 0; i < visited.length; i++) {
        visited[i] = -1;
    }
    console.log("visited::", visited);
    console.log("graph::", graph[0][0], graph.length);
    const q = [];
    q.push(src);
    visited[src] = 1;
    const order = [];
    while (q.length != 0) {
        const node = q.shift();
        console.log("node::", node);
        order.push(node);
        // get neighbours of src
        for (let neighbour = 0; neighbour < graph.length; neighbour++) {
            console.log("node, neighbour, graph[node][neighbour]", node, neighbour, graph[node][neighbour]);
            if (graph[node][neighbour] === '1' && visited[neighbour] === -1) {
                visited[neighbour] = 1;
                q.push(neighbour)
            }
        }

    }
    return order;


}

// Outer loop
// Single loop — one BFS per starting node
for (let i = 0; i < graph.length; i++) {
    console.log(`bfs(${i}) →`, bfs(i));
}