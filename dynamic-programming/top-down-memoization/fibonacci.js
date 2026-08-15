function fib_rec(n) {
  if (n === 0 || n === 1) return n;
  else {
    return fib_rec(n - 1) + fib_rec(n - 2);
  }
}

console.log(fib_rec(10));

const memo = [];
function fib_dp(n) {
  if (n === 0 || n === 1) return n;
  // Check in memo first
  if (memo[n]) {
    return memo[n];
  } else {
    memo[n] = fib_dp(n - 1) + fib_dp(n - 2);
    return memo[n];
  }
}
console.log(fib_dp(10));

/*

Tier 1 — Correctness of what's on screen
fib_dp(10) and fib_rec(10) both print 55. Prove to me that fib_dp is actually memoized. Instrument it: count invocations. What's the real asymptotic complexity of fib_dp as written, and which two lines cause that?
if (memo[n]) — name an input value for which this cache-hit check is wrong even after you fix the lifetime of memo. What's the general rule for sentinel-based cache checks in JS?
Why const memo = [] rather than new Map() or Object.create(null)? What does V8 do to an array when you write memo[10000] before memo[0], and when does that stop being free?

Tier 2 — Making it production-shaped
Move the memo out of the function. Now you have shared mutable state across calls. What are the three ways to scope it (closure, module-level, parameter-passed), and which one do you pick if this module is imported by both a request handler and a background job in the same process?
fib(100) = 354224848179261915075. Number.MAX_SAFE_INTEGER is 2^53−1. At what n does this function start returning silently wrong answers, and what does "silently" cost you in a financial or crypto context? Rewrite the return type. What breaks in the memo when you switch to BigInt?
Convert to bottom-up. You now have O(1) space instead of O(n). But the top-down version has a property bottom-up loses — what is it, and when does it matter? (Hint: think about the call pattern, not the algorithm.)
Naive recursion blows the stack around n≈10⁴ in V8. Give me two structurally different fixes and explain why JS engines make one of them harder than it looks.

Tier 3 — Design and scale
This is now a service: GET /fib/:n. Unbounded memo = unbounded memory = an attacker sends n=10^9. Design the eviction policy. Why is LRU the wrong default here, and what's the right one given the access distribution?
Multiple processes, each with its own memo. Do you move the cache to Redis? Walk me through the math: serialization cost of a 20KB BigInt vs. recomputing it. Where's the crossover point?
Two concurrent requests for fib(500) on a cold cache. What's the failure mode, and how do you dedupe in-flight computation in a single-threaded event loop? Now do it across processes.
What do you emit as metrics? I want to know from a dashboard whether the cache is earning its memory.

Tier 4 — Judgment
Fibonacci is computable in O(log n) via matrix exponentiation or fast doubling. Your team lead asks why you shipped the O(n) DP version. Defend it — or don't. What's the actual decision criterion?
A junior submits the exact code in this file as a PR titled "add memoized fibonacci." Write the review comment. How much do you say?
Generalize: what's the minimal set of properties a problem needs for top-down memoization to be the right tool, and give me a problem that looks like it qualifies but doesn't.
*/
