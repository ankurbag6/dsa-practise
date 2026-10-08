function findOrder(numCourses, prerequisites) {
  // Khan's Algorithm, to find order
  // order, q, adjList, indegrees
  const order = [],
    q = [];
  const adjList = new Map(
    Array.from({ length: numCourses }, (_, i) => [i, []]),
  );
  const indegrees = new Map(
    Array.from({ length: numCourses }, (_, i) => [i, 0]),
  );
  // Step 1. Build Adjlist, indegress array
  for (const [v, u] of prerequisites) {
    adjList.get(u).push(v);
    indegrees.set(v, indegrees.get(v) + 1);
  }
  // Step 2. Push all the courses which have 0 indegrees into q
  for (const [course, degree] of indegrees) {
    if (degree === 0) q.push(course);
  }
  // Step 3. Apply BFS traversal
  let head = 0;
  while (head < q.length) {
    // while q is not empty
    // dequeue, and add to order
    // get the courses to folow for a current course
    // update the indegrees
    const currCourse = q[head++];
    order.push(currCourse);
    const coursesToFollow = adjList.get(currCourse);
    for (const course of coursesToFollow) {
      indegrees.set(course, indegrees.get(course) - 1);
      if (indegrees.get(course) === 0) q.push(course);
    }
  }
  // return order if order.length === numCourses else [] means there is a Cycle
  return order.length === numCourses ? order : [];
}

// ---------------------------------------------------------------------------
// tests
// ---------------------------------------------------------------------------

// Many inputs have several valid orders, so check the rules instead of one answer:
// every course 0..n-1 exactly once, and for each [a, b], b comes before a.
// A cycle means no order exists, so the answer must be [].
function check(numCourses, prerequisites, possible) {
  const order = findOrder(numCourses, prerequisites);
  let ok;
  if (!possible) {
    ok = Array.isArray(order) && order.length === 0;
  } else {
    const pos = new Map(order.map((c, i) => [c, i]));
    ok =
      order.length === numCourses &&
      pos.size === numCourses &&
      Array.from({ length: numCourses }, (_, i) => i).every((c) =>
        pos.has(c),
      ) &&
      prerequisites.every(([a, b]) => pos.get(b) < pos.get(a));
  }
  console.log(
    ok ? "PASS  " : "FAIL",
    JSON.stringify(order),
    possible ? "" : "expected []",
  );
}

check(2, [[1, 0]], true); // 0 -> 1, only answer [0,1]
check(
  4,
  [
    [1, 0],
    [2, 0],
    [3, 1],
    [3, 2],
  ],
  true,
); // diamond: [0,1,2,3] or [0,2,1,3]
check(1, [], true); // single course
check(3, [], true); // no prerequisites, any order
check(
  4,
  [
    [1, 0],
    [2, 1],
    [3, 2],
  ],
  true,
); // chain, only answer [0,1,2,3]
check(
  4,
  [
    [3, 2],
    [2, 1],
    [1, 0],
  ],
  true,
); // same chain, edges listed backwards
check(
  3,
  [
    [0, 1],
    [0, 2],
    [1, 2],
  ],
  true,
); // shortcut edge, only answer [2,1,0]
check(
  5,
  [
    [1, 4],
    [2, 4],
    [3, 1],
    [3, 2],
  ],
  true,
); // course 0 has no edges
check(
  4,
  [
    [1, 0],
    [3, 2],
  ],
  true,
); // two separate chains
check(
  2,
  [
    [1, 0],
    [0, 1],
  ],
  false,
); // 0 <-> 1 cycle
check(1, [[0, 0]], false); // self-loop
check(
  3,
  [
    [1, 0],
    [2, 1],
    [0, 2],
  ],
  false,
); // 3-cycle
check(
  4,
  [
    [1, 0],
    [2, 1],
    [1, 2],
  ],
  false,
); // cycle after a valid start
check(
  4,
  [
    [1, 0],
    [3, 2],
    [2, 3],
  ],
  false,
); // cycle in one component only
