function topoSort(nodes, edges) {

    // build map of indegrees
    // order : []
    const order =[], q = [];
    const adgList = new Map(nodes.map(n=>[n,[]]));
    let indegrees = new Map(nodes.map(n=> [n,0]));
    for(const [u,v] of edges) {
        adgList.get(u).push(v);
        indegrees.set(v, indegrees.get(v) + 1);
    }
    // Scan the indegree map and store in the q who's indegree = 0
    for(const [node, cnt] of indegrees) {
        if(cnt === 0) q.push(node);
    }
    // Levelorder traversla
    while(q.length !== 0) {
    // while q is not empty
        // currnode : dequeue and push to order
        // delte from the map,and update all the indegrees
        let currnode = q.shift();
        indegrees.delete(currnode);
        order.push(currnode)
        // get the neigbors
         // if indegree = 0, push to q
        for(const n of adgList.get(currnode)) {
            indegrees.set(n, indegrees.get(n) - 1);
            if(indegrees.get(n) === 0) q.push(n)
        }
    }
    return order.length === nodes.length ? order : null;
}



// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

// A DAG usually has many valid orders, so instead of comparing against one
// answer, check the rules: every node exactly once, and for each edge u -> v,
// u comes before v. A graph with a cycle has no order, so expect null.
function checkOrder(nodes, edges, got) {
    if (!Array.isArray(got)) return `expected an array, got ${JSON.stringify(got)}`;
    if (got.length !== nodes.length) return `expected ${nodes.length} nodes, got ${got.length}: ${JSON.stringify(got)}`;
    const pos = new Map(got.map((n, i) => [n, i]));
    if (pos.size !== got.length) return `duplicate node in ${JSON.stringify(got)}`;
    for (const n of nodes) if (!pos.has(n)) return `missing node ${JSON.stringify(n)} in ${JSON.stringify(got)}`;
    for (const [u, v] of edges) {
        if (pos.get(u) > pos.get(v)) return `edge ${u} -> ${v} broken in ${JSON.stringify(got)}`;
    }
    return null;
}

const DAG = true, CYCLE = false;
const cases = [
    // [name, nodes, edges, has a valid order?]
    ["empty graph",            [],                     [],                                          DAG],
    ["single node",            ['a'],                  [],                                          DAG],
    ["no edges",               ['a','b','c'],          [],                                          DAG],
    ["chain",                  ['a','b','c','d'],      [['a','b'],['b','c'],['c','d']],             DAG],
    ["chain, edges reversed",  ['a','b','c','d'],      [['c','d'],['b','c'],['a','b']],             DAG],
    ["nodes listed backwards", ['d','c','b','a'],      [['a','b'],['b','c'],['c','d']],             DAG],
    ["diamond",                ['a','b','c','d'],      [['a','b'],['a','c'],['b','d'],['c','d']],   DAG],
    ["fan-in",                 ['a','b','c','d'],      [['a','d'],['b','d'],['c','d']],             DAG],
    ["fan-out",                ['a','b','c','d'],      [['a','b'],['a','c'],['a','d']],             DAG],
    ["many sources, one edge", ['x','y','z','w'],      [['z','w']],                                 DAG],
    ["two components",         ['a','b','c','d'],      [['a','b'],['c','d']],                       DAG],
    ["isolated node + chain",  ['a','b','c','lone'],   [['a','b'],['b','c']],                       DAG],
    ["shortcut edge",          ['a','b','c'],          [['a','b'],['b','c'],['a','c']],             DAG],
    ["numeric nodes",          [1, 2, 3, 4],           [[3,1],[1,2],[4,2]],                         DAG],
    ["course schedule",        ['math','physics','cs','ml','ai','stats'],
                               [['math','physics'],['math','cs'],['math','stats'],['cs','ml'],['stats','ml'],['ml','ai']],
                                                                                                    DAG],
    ["3-cycle",                ['a','b','c'],          [['a','b'],['b','c'],['c','a']],             CYCLE],
    ["self-loop",              ['a'],                  [['a','a']],                                 CYCLE],
    ["2-cycle",                ['a','b'],              [['a','b'],['b','a']],                       CYCLE],
    ["cycle after a prefix",   ['a','b','c'],          [['a','b'],['b','c'],['c','b']],             CYCLE],
    ["cycle in one component", ['a','b','c','d'],      [['a','b'],['c','d'],['d','c']],             CYCLE],
];

let passed = 0;
for (const [name, nodes, edges, isDag] of cases) {
    let got, problem;
    try {
        got = topoSort(nodes, edges);
        problem = isDag
            ? checkOrder(nodes, edges, got)
            : (got === null ? null : `expected null (cycle), got ${JSON.stringify(got)}`);
    } catch (e) {
        problem = `${e.constructor.name}: ${e.message}`;
    }
    if (!problem) passed++;
    console.log(`${problem ? "FAIL" : "PASS"}  ${name.padEnd(24)}${problem ? "  " + problem : ""}`);
}
console.log(`\n${passed}/${cases.length} passed`);