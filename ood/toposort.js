// function topoSort(nodes, edges) {
//   const adj = new Map(nodes.map(n => [n, []]));
//   const indeg = new Map(nodes.map(n => [n, 0]));
//   for (const [u, v] of edges) {
//     adj.get(u).push(v);
//     indeg.set(v, indeg.get(v) + 1);
//   }
//   const q = nodes.filter(n => indeg.get(n) === 0);
//   const order = [];
//   while (q.length) {
//     const u = q.shift();
//     order.push(u);
//     for (const v of adj.get(u)) {
//       indeg.set(v, indeg.get(v) - 1);
//       if (indeg.get(v) === 0) q.push(v);
//     }
//   }
//   return order.length === nodes.length ? order : null; // null means cycle
// }

// function topoSort(nodes, edges) {
//   // nodes: array of node ids, e.g. ['a', 'b', 'c']
//   // edges: array of [from, to] pairs meaning "from must come before to"
//   // returns: array of nodes in valid order, or null if there is a cycle

//   // create adj list
//   const adj = new Map(nodes.map(n => [n, []]));
  
//   // calculate indegree
//   const indeg = new Map(nodes.map(n => [n, 0]));
//   for( const [u,v] of edges) {
//     adj.get(u).push(v);
//     indeg.set(v, indeg.get(v) + 1);
//   }
//   // filterout the nodes with indegree = 0
//   const q = nodes.filter(n => indeg.get(n) === 0);
//   const output = [];
//   while(q.length != 0) {
//   // while the filtered nodes not empty
//     // push tthe node to result arr
//     const node = q.shift();
//     output.push(node);
//     // dequeue from the list
//     // re-eval the indegree
//     for( const v of adj.get(node)) {
//       indeg.set(v, indeg.get(v) - 1);
//       if(indeg.get(v) === 0) q.push(v)
//     }
//     // if the indegree == 0 push to the filter list
//   }
//   // return res array
//   return output;
// }

// function topoSort(nodes, edges) {
//   // nodes: array of node ids, e.g. ['a', 'b', 'c']
//   // edges: array of [from, to] pairs meaning "from must come before to"
//   // returns: array of nodes in valid order, or null if there is a cycle
//   // create adj list
//   const adj = new Map(nodes.map(n => [n, []]));
//   const indeg = new Map(nodes.map(n=>[n, 0]));
//   // calculate indeg
//   for(const [u,v] of edges) {
//     adj.get(u).push(v);
//     indeg.set(v, indeg.get(v) + 1);
//   }

//   // Filterout the nodes with indegree == 0
//   const q = nodes.filter(n => indeg.get(n) === 0);
//   const output = [];
//   while(q.length !== 0) {
//   // while the filterelist is not empty
//     // pop the node and push to the output
//     const node = q.shift();
//     // re-eval the indegree
//     output.push(node); 
//     // push to the filteredlist whose indegre == 0
//     for(const v of adj.get(node)) {
//       indeg.set(v, indeg.get(v) - 1);
//       if(indeg.get(v) === 0) q.push(v);
//     }
//   }
//   // return output arr if the nodes.len == output.len
//   return nodes.length === output.length ? output : null;

// }
function topoSort(nodes, edges) {
  // crete adj list, indeg
  const adj = new Map(nodes.map(n=>[n,[]]));
  const indeg = new Map(nodes.map(n=> [n,0]));
  for(const [u,v] of edges) {
    adj.get(u).push(v);
    indeg.set(v, indeg.get(v)+1);
  }

  // q : filter out the nodes indeg with 0
  const q = nodes.filter(n=>indeg.get(n) === 0);
  const output = [];

  while(q.length !== 0){
  // wile q is not empty
    // pop the q, push to putput
    const node = q.shift();
    output.push(node);
    // re-eval the indeg
    // push the node with indeg == 0 into the q
    for(const v of adj.get(node)) {
      indeg.set(v, indeg.get(v)-1);
      if(indeg.get(v) === 0) q.push(v);
    }
  }
  // return output if output.len === nodes.len
  return output.length === nodes.length ? output : null;
}



console.log(topoSort(['a','b','c','d'], [['a','b'],['a','c'],['b','d'],['c','d']]));
// Valid answers: ['a','b','c','d'] or ['a','c','b','d']

console.log(topoSort(['a','b','c'], [['a','b'],['b','c'],['c','a']]));
// Returns null (cycle: a -> b -> c -> a)