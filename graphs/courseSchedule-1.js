function canFinish(numCourses, prerequisites) {
  // implement using Kahn's algo
  // order, adjlist, indegrees
  const order = [];
  const adjList = new Map(
    Array.from({ length: numCourses }, (_, i) => [i, []]),
  );
  const indegrees = new Map(
    Array.from({ length: numCourses }, (_, i) => [i, 0]),
  );
  // Step 1. Build adjList and store indegrees
  for (const [u, v] of prerequisites) {
    adjList.get(u).push(v);
    indegrees.set(v, indegrees.get(v) + 1);
  }
  // Step 2. Push the first element from indeggress to Q
  const q = [];
  for (const [course, cnt] of indegrees) {
    if (cnt === 0) q.push(course);
  }
  // Step 3. BFS traversal
  while (q.length != 0) {
    // while q not empty
    // deque and push to the order array
    let currCourse = q.shift();
    order.push(currCourse);
    // dlete the the node from indegree
    // get the neigbours of the node
    const coursesToFollow = adjList.get(currCourse);
    for (const course of coursesToFollow) {
      // update the indegree map
      indegrees.set(course, indegrees.get(course) - 1);
      if (indegrees.get(course) === 0) q.push(course);
    }
  }
  return order.length === numCourses; //if eq means possible to finish, else not
}

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

console.log(canFinish(2, [[1, 0]]), "expected true"); // 0 -> 1
console.log(
  canFinish(2, [
    [1, 0],
    [0, 1],
  ]),
  "expected false",
); // 0 <-> 1 cycle
console.log(canFinish(1, []), "expected true"); // single course
console.log(canFinish(3, []), "expected true"); // no prerequisites
console.log(
  canFinish(4, [
    [1, 0],
    [2, 1],
    [3, 2],
  ]),
  "expected true",
); // chain 0->1->2->3
console.log(
  canFinish(4, [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ]),
  "expected true",
); // diamond
console.log(
  canFinish(3, [
    [0, 1],
    [0, 2],
    [1, 2],
  ]),
  "expected true",
); // shortcut edge
console.log(canFinish(1, [[0, 0]]), "expected false"); // self-loop
console.log(
  canFinish(3, [
    [1, 0],
    [2, 1],
    [0, 2],
  ]),
  "expected false",
); // 3-cycle
console.log(
  canFinish(4, [
    [1, 0],
    [2, 1],
    [1, 2],
  ]),
  "expected false",
); // cycle after a valid start
console.log(
  canFinish(4, [
    [1, 0],
    [3, 2],
    [2, 3],
  ]),
  "expected false",
); // cycle in one component only
console.log(
  canFinish(5, [
    [1, 4],
    [2, 4],
    [3, 1],
    [3, 2],
  ]),
  "expected true",
); // course 0 has no edges
