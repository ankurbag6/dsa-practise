# Bottom-Up Tabulation — Graded Answers & Expansions

Companion to [top-down-memoization/fibonacci_expansions.md](../top-down-memoization/fibonacci_expansions.md).
Grades on the answers given, then the remaining questions worked through. Every claim was
executed on Node v24.18.1; scripts in Appendix C.

---

# Part 1 — Graded

## Q1. The docblock/code divergence — ✗ **Wrong bug found**

### What was submitted

> Fixed the pseudocode — `for i=2 ... n+1` / `table[n] = table[n-1] + table[n-2]`
>
> Yes, a test would catch this: for `i=2 ... n` we would not get `table[n]`, it will be `undefined`.

### The actual divergence

```
docblock (line 16):   table[n] = table[n-1] + table[n-2]      ← writes to n, every iteration
code     (line 27):   table[i] = table[i-1] + table[i-2]      ← writes to i
```

The bug is **`table[n]` where it should be `table[i]`**. The loop bound was never wrong —
`for (let i = 2; i <= n; i++)` is correct and inclusive.

**The proposed fix does not fix it.** Changing the bound to `n+1` while leaving `table[n]`
leaves the defect fully intact, and adds a wasted iteration. Measured:

```
original docblock, implemented literally:  fib(10) -> NaN
proposed  docblock, implemented literally:  fib(10) -> NaN
```

### What the buggy version actually returns: NaN, not `undefined`

Trace `n = 10`. Every iteration writes to the same cell and reads cells that are never
filled:

```
i=2:  table[10] = table[9] + table[8]  =  undefined + undefined  =  NaN
i=3:  table[10] = table[9] + table[8]  =  undefined + undefined  =  NaN
...   (nine identical iterations, i is never used)
return table[10]  ->  NaN
```

`undefined + undefined` is **`NaN`**, not `undefined` — arithmetic on `undefined` coerces
to `NaN` rather than propagating `undefined`. The distinction matters, because:

```
typeof fib(10)          -> 'number'      ← passes a typeof check
fib(10) !== undefined   -> true          ← passes a null-check assertion
fib(10) === 55          -> false         ← only an exact-value test catches it
```

**A defensive test written as `expect(fib(10)).toBeDefined()` passes on the broken code.**
That is the real lesson: `NaN` is a `number`, it survives every "is it there?" check, and
only exact-value assertions catch it. The diagnostic instinct — "a test would catch this"
— was right; the reasoning about *which* test was not.

Also note the bug is invisible below `n = 3`:

```
fib(2) -> 1    ← correct, by accident: table[1] and table[0] are seeded
fib(3) -> NaN
```

A test suite whose largest case is `fib(2)` passes on completely broken code. Same failure
mode as the memoized version, where `fib_dp(10)` returned 55 from an exponential
algorithm.

### The general point

The pseudocode was the **specification**, and the specification was wrong while the
implementation was right. Anyone who "fixes" the code to match the comment breaks it.

A comment that restates the code in prose has one job — to be checked when the code
changes — and nothing enforces it. This one drifted before the file was ever committed.
Either delete the pseudocode or make it a doctest that actually runs. Prose adjacent to
code is unversioned, untested, and trusted anyway.

---

## Q2, Q3, Q4. The input-validation fix — ◐ **Right instinct, wrong contract**

### What was submitted

```js
function fib(n) {
  if (n < 0 || !Number.isInteger(n)) return -1;   // invalid array length
  if (n <= 1) return n;
  let table = [...new Array(n + 1)];
  ((table[0] = 0), (table[1] = 1));
  for (let i = 2; i <= n; i++) table[i] = table[i - 1] + table[i - 2];
  console.log(table);
  return table[n];
}
```

### What this genuinely fixes — credit where due

Measured across the whole hostile input set:

```
fib(0)         =  0      ← was: table corrupted to length 2
fib(1)         =  1
fib(2)         =  1
fib(10)        = 55
fib(-1)        = -1      ← was: undefined
fib(-5)        = -1      ← was: RangeError from V8's internals
fib(2.5)       = -1      ← was: RangeError
fib("10")      = -1      ← was: 55, accidentally correct via three cancelling coercions
fib(null)      = -1
fib(undefined) = -1
fib(NaN)       = -1
fib(Infinity)  = -1
fib("abc")     = -1
```

`Number.isInteger` is the right predicate and it is doing a lot of work in one call: it is
`false` for non-numbers (so no coercion path), `false` for `NaN`, `false` for `±Infinity`,
`false` for non-integral floats. **This is the correct choice** — `typeof n === 'number'`
would let `NaN` through, and `n % 1 === 0` coerces strings.

`if (n <= 1) return n` correctly fixes the `fib(0)` defect, where `table[1] = 1` was
writing past the end of a length-1 array and silently extending it.

Four separate failure modes collapsed into one uniform response. That is the right shape.

### Defect 1 — `return -1` is an in-band sentinel

**This is the same class of bug as `if (memo[n])` in the memoization file**: a value doing
double duty as data and as a signal.

`-1` is a `number`. It is arithmetically valid. It propagates silently. Measured:

```js
fib(-1) + fib(10)        // -> 54          no error, no warning, wrong
[5, -2, 10].map(fib)     // -> [5, -1, 55] poison in the middle of a results array
```

The caller cannot distinguish "the answer is −1" from "your input was bad" without
comparing against a magic constant they have to know about. Every call site now needs
`if (result === -1)`, and every call site that forgets is a silent wrong answer — which is
precisely the failure mode the validation was added to prevent. **The guard moved the bug
from inside the function to inside every caller.**

The comment `// invalid array length` reveals the reasoning: the guard was written to stop
V8 from throwing. But V8 throwing was not the problem — V8 throwing *the wrong error, from
the wrong place, with a message about arrays when the caller passed a bad integer* was the
problem. The fix is a better exception, not the absence of one:

```js
if (!Number.isInteger(n)) throw new TypeError(`fib: n must be an integer, got ${typeof n} ${String(n)}`);
if (n < 0)                throw new RangeError(`fib: n must be >= 0, got ${n}`);
```

Now the stack trace points at the caller, the message names the parameter, and no result
can be mistaken for a value. Errors are out-of-band by construction; that is the entire
reason they exist.

**When a sentinel is defensible:** hot loops where throwing is measurably too slow, or a
protocol boundary that cannot carry exceptions. Then return `null`/`undefined` (not a
number), or a tagged result `{ok: false, error}`. Never a value from the function's own
return type. `indexOf` returns `-1` and gets away with it only because `-1` is not a valid
index — the type system of the domain excludes it. Fibonacci's codomain does not exclude
integers.

### Defect 2 — no upper bound, and the guard hands the failure back to V8

`Number.isInteger(1e10)` is `true`. So `1e10` passes validation, reaches line 5, and:

```
fib(1e10)  ->  RangeError: Invalid array length
```

**Exactly the error the guard was written to prevent, from exactly the place it was meant
to stop.** The maximum array length is `2³² − 1 = 4,294,967,295`; anything above it throws
from V8's allocator, with no mention of `n` or `fib`.

Below that ceiling it is worse, because it *succeeds*: `fib(1e8)` allocates roughly 800 MB
and returns. The guard validates the *type* of `n` but not its *consequences*, and for
this function the consequence of `n` is a linear memory allocation.

```js
const N_MAX = 100_000;  // or wherever the product actually needs
if (n > N_MAX) throw new RangeError(`fib: n must be <= ${N_MAX}, got ${n}`);
```

This is the **admission control** point from the memoization file, Q8 — and it lands
harder here, because tabulation allocates the whole table *up front*, before computing
anything. Top-down at least fails partway through.

### Defect 3 — guard ordering leaks a coercion

```js
if (n < 0 || !Number.isInteger(n))
//  ^^^^^ relational comparison runs FIRST, on unvalidated input
```

`n < 0` invokes `ToPrimitive` then `ToNumber` on whatever was passed. `fib("-5")` returns
`-1` because `"-5" < 0` coerced to `true` — right outcome, reached through a coercion that
was not intended and is not covered by any test.

Worse, an object with a `valueOf` runs **arbitrary user code** inside the guard:

```js
fib({ valueOf() { /* anything at all */ return -1; } })
```

**Validate type before value.** The type check is total and coercion-free; the range check
is only meaningful once you know you have a number:

```js
if (!Number.isInteger(n)) throw new TypeError(...);   // total, no coercion
if (n < 0 || n > N_MAX)   throw new RangeError(...);  // safe: n is definitely a number
```

Short-circuit order in a validation chain is part of the validation.

### Defect 4 — `Number` still silently wrong from n = 79

Unchanged from the memoized version, and unaddressed:
`fib(79)` returns `14472334024676220`; the true value is `14472334024676221`. See Q13
below for what changes when you migrate this version to `BigInt` — the answer is
different here than it was for the `Map`-backed memo.

### Minor

`((table[0] = 0), (table[1] = 1))` — the comma operator in expression-statement position,
double-parenthesized by the formatter. It works. It is two assignments pretending to be
one, it will trip `no-sequences` in any standard ESLint config, and it saves nothing. Two
lines.

Corrected version in Appendix A.

---

## Q7. O(1) space — ✓ **Correct, generalizes better than needed, half the question unanswered**

### What was submitted

> We can have array of size 3, and store the result in the 3rd place. This way we will
> achieve O(1) space.

**Correct.** The rolling buffer with modular indexing:

```js
function fib(n) {
  if (n <= 1) return n;
  const w = [0, 1, 0];
  for (let i = 2; i <= n; i++) w[i % 3] = w[(i - 1) % 3] + w[(i - 2) % 3];
  return w[n % 3];
}
```

Verified to agree with the full-table version for `n ∈ {0,1,2,3,10,40,70}`. Measured at
`n = 5×10⁶`:

| Version | Time | Heap delta |
|---|---:|---:|
| Full table | 138.9 ms | 152.4 MB |
| Rolling window (size 3) | **24.1 ms** | **1.5 MB** |
| Two scalars | 26.8 ms | ~0 |

**6× faster, 100× less memory.** The speedup is not from doing less arithmetic — it's the
same `n` additions. It's from not allocating 5 million cells, not paying the GC to trace
them, and keeping the working set in L1 instead of streaming 152 MB through the cache
hierarchy. Worth internalizing: **the space optimization was also the time optimization,**
and that is the common case for DP, not the exception.

### The refinement: for Fibonacci you need 2, not 3

The general rule is **width = the maximum lag in the recurrence.** `f(i)` depends on
`f(i-1)` and `f(i-2)`, so lag 2, so 2 slots suffice:

```js
let a = 0, b = 1;
for (let i = 2; i <= n; i++) { const c = a + b; a = b; b = c; }
return b;
```

Size 3 is what you'd need for a tribonacci-style `f(i) = f(i-1) + f(i-2) + f(i-3)`. The
instinct generalized to the right rule; it just overshot by one for this recurrence.

There is a real argument for keeping the modular-index form even at width 2: it's the
shape that survives when the recurrence changes, and `w[i % k]` scales to any `k` without
rewriting the swap chain. There's an argument against: `%` is a division, the swap version
is branchless register traffic, and at width 2 the two-scalar version is clearer. Both
defensible — the two-scalar version is the standard because at width 2 there's nothing to
generalize.

### The half that wasn't answered: two things the O(n) table can do that O(1) cannot

**1. Answer every `fib(k)` for `k ≤ n`, not just `fib(n)`.** One O(n) pass makes all `n+1`
values available in O(1) each. Under a query workload — a service, a batch of lookups —
that turns `q` queries from O(q·n) into O(n + q). The rolling window discards every
intermediate result, so query 2 pays full price again.

**2. Reconstruct the *solution*, not just its *value*. This is the important one.**

For Fibonacci this sounds academic, because the answer is a number and there's nothing to
trace back. For real DP it is the entire point:

| Problem | O(1)-space version gives you | Only the table gives you |
|---|---|---|
| Edit distance | the number 7 | *which* 7 edits |
| LCS | length 12 | the actual subsequence |
| 0/1 knapsack | max value 940 | *which items* to take |
| Shortest path | distance 31 | the route |

You cannot backtrack a path through cells you overwrote. **Space optimization destroys the
ability to answer "why."** Nobody ships a route planner that reports the distance and not
the route.

Standard resolutions: keep the table when you need the path; keep a separate O(n) *choice*
array recording only the decision at each cell (cheaper than the full DP table when values
are wide); or use Hirschberg's algorithm, which recovers an LCS path in O(min(m,n)) space
at 2× the time via divide-and-conquer. That trade — 2× time to drop a dimension of space —
is worth knowing by name.

**The criterion:** optimize space when the answer is the *value*. Keep the table when the
answer is the *decision sequence*. For Fibonacci, the value is all there is — so ship the
two-scalar version.

---

## Q8. The `console.log` — ✓ **Right action, and it exposes an overstatement in my earlier doc**

> I will be removing the `console.log`.

Correct — debug output inside a pure computational function is not something you gate, it's
something you delete. Diagnostics belong at the call site, which owns the I/O decision.

### The correction I owe you

In [the memoization doc, Q11](../top-down-memoization/fibonacci_expansions.md), the
argument was that logging in the hot path produces O(n) volume. **That claim is correct for
the case it was made about** — `console.log(i++)` executing per invocation genuinely emits
n lines.

But my *question 8 here* implied that `console.log(table)` on a 10⁶-element array is a
volume disaster, and **that part is wrong.** Node's `util.inspect` truncates arrays at
`maxArrayLength = 100`. Measured:

```
util.inspect(new Array(1e6).fill(7)).length  ->  345 characters
tail: "7, 7, 7, 7,\n  ... 999900 more items\n]"
```

345 bytes, not megabytes. The truncation makes the volume argument moot for a single array
log. Correcting it because the difference is the difference between "this will page
someone at 3am" and "this is untidy."

### What is still true, and why deleting it is right anyway

**1. `process.stdout` is synchronous to files and POSIX TTYs.** A blocking `write(2)` on
the event loop. It's one write instead of a million, so it's a bounded cost rather than an
unbounded one — but under a full disk or a stalled log shipper it still blocks, and it is
on the return path of every single call.

**2. The truncation makes it useless.** 100 of 10⁶ entries is not a debugging aid; it's
noise that looks like a debugging aid. Reading the tail requires either changing
`inspect` options or a debugger — so you'd have to modify the line anyway to learn
anything from it.

**3. Formatting cost is not zero.** `util.inspect` walks the array, checks for holes and
getters, and builds the string. Small, real, on every call.

**4. It makes a pure function impure.** `fib` is now unusable in a worker thread, a hot
loop, or a library, because it writes to a stream it does not own. That is the actual
argument, and it holds regardless of volume: **a pure computational function should not
perform I/O, at any size.**

**The generalizable rule** — and the reason the earlier doc's conclusion survives its own
overstatement: *diagnostics inside a pure function are a layering violation before they
are a performance problem.* The performance argument is contingent on the payload; the
layering argument always holds. Lead with the one that always holds.

---

# Part 2 — The remaining questions

## Q5. Why `[...new Array(n+1)]` and not the alternatives?

The spread does one specific thing: **it converts holes into real `undefined` values.**

```js
const a = new Array(3);        // [ <3 empty items> ]   — holes
0 in a                         // false
const b = [...new Array(3)];   // [ undefined, undefined, undefined ]  — packed
0 in b                         // true
```

`new Array(n+1)` creates a **holey** array. Holes are not `undefined`-valued cells; they
are absent properties. Reading one is spec-required to walk the prototype chain (to check
whether `Array.prototype[5]` exists), which disables several V8 fast paths. Holey arrays
also can't be iterated by `map`/`forEach` — those skip holes entirely, which is a common
source of "my `.map` did nothing" bugs.

So the spread is a real technique for a real problem. **It is the wrong tool here**,
because this code never reads an uninitialized cell — every cell from 2 to n is written
before it's read, and 0 and 1 are seeded. The packing buys nothing and costs a full extra
pass over n+1 elements plus a second allocation (spread builds a new array; the original
is garbage immediately).

The four options:

| Expression | Result | Elements kind | Cost |
|---|---|---|---|
| `new Array(n+1)` | holes | `HOLEY_SMI` | 1 alloc, no fill |
| `[...new Array(n+1)]` | `undefined` × (n+1) | **`PACKED_ELEMENTS`** | 2 allocs + iteration |
| `Array.from({length: n+1})` | `undefined` × (n+1) | `PACKED_ELEMENTS` | 1 alloc + fill |
| `new Array(n+1).fill(0)` | `0` × (n+1) | **`PACKED_SMI_ELEMENTS`** | 1 alloc + memset-ish fill |
| `new Float64Array(n+1)` | `0` × (n+1) | typed, off-heap | 1 calloc |

`.fill(0)` is the right answer for this code: single allocation, and it lands in the
fastest elements kind — see Q6.

## Q6. Elements kinds, and the 50× measurement

```
n = 5×10⁶:   [...new Array(n)]  15.7 ms
             new Array(n).fill(0)  10.7 ms
             new Float64Array(n)    0.3 ms
```

### Why the ranking

V8 tracks the *elements kind* of every array — a static-ish type for the backing store —
and transitions are **one-way**. You can never move back toward a faster kind without
reallocating:

```
PACKED_SMI  →  PACKED_DOUBLE  →  PACKED_ELEMENTS
     ↓               ↓                  ↓
HOLEY_SMI   →  HOLEY_DOUBLE   →  HOLEY_ELEMENTS  →  DICTIONARY_ELEMENTS
```

- **`Float64Array` (0.3 ms).** Off-heap, contiguous, `calloc`'d — the kernel can hand back
  zero pages lazily, so the allocation is nearly free and the cost is deferred to first
  touch. No boxing, no GC tracing, 8 bytes per element flat. This is why it's 50× faster
  than the spread despite doing the "same" work.
- **`.fill(0)` (10.7 ms).** Lands in **`PACKED_SMI_ELEMENTS`** — the fastest on-heap kind.
  Small integers are stored unboxed as tagged SMIs. One allocation, one linear fill.
- **The spread (15.7 ms).** Allocates the holey array, then allocates a second array while
  iterating the first, and the result is **`PACKED_ELEMENTS`** — the *generic* kind,
  because it holds `undefined`, which is neither an SMI nor a double. Every element is a
  boxed pointer the GC must trace. Slowest, and it poisons the array's kind for everything
  that follows.

### The transition this code forces

That last point is the answer to "which write forces a transition," and it's a trick
question: **none of them do, because the spread already forced the worst one before the
first write.**

```js
let table = [...new Array(n+1)];   // PACKED_ELEMENTS  ← already generic, holds undefined
table[0] = 0;                      // still PACKED_ELEMENTS (one-way; can't go back to SMI)
table[1] = 1;                      // still PACKED_ELEMENTS
table[i] = table[i-1] + table[i-2];// still PACKED_ELEMENTS — boxed, GC-traced
```

Had it been `new Array(n+1).fill(0)`, the array would be `PACKED_SMI_ELEMENTS` and stay
there until a value exceeded the SMI range (2³¹ on 64-bit V8, so around `fib(46)`), at
which point it transitions once to `PACKED_DOUBLE_ELEMENTS` and stays.

**The spread chose the slowest representation to solve a problem this code doesn't have.**

Caveat worth stating: this is V8-specific, undocumented in the language spec, and
observable only through timing or `--allow-natives-syntax`. Reason about it when you have a
measured hot loop. Do not write code that looks strange in order to court an elements
kind — write `.fill(0)`, which is both faster *and* the more obvious code, and take the
win for free.

## Q9. Topological order

### For this recurrence

The dependency DAG has an edge `i → i−1` and `i → i−2`. The natural topological order is
just the integers ascending, and `for (i = 2; i <= n; i++)` is a valid linearization
because it guarantees the invariant: **when cell `i` is written, cells `i−1` and `i−2` are
already final.**

How many other valid orders exist? For a *total* order on this DAG, only one — the chain
`0 → 1 → 2 → … → n` is fully constrained, since `i` depends on its immediate predecessor.
Fibonacci's dependency graph is a path, and a path has exactly one topological sort. That
is why bottom-up Fibonacci looks trivially obvious and teaches you nothing about the hard
part.

### Where the order stops being obvious

**0/1 knapsack, space-optimized to 1-D.** The 2-D recurrence is
`dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])`. Collapsed to one row:

```js
for (let i = 0; i < items.length; i++)
    for (let w = W; w >= items[i].wt; w--)      // ← DESCENDING. Not a style choice.
        dp[w] = Math.max(dp[w], dp[w - items[i].wt] + items[i].val);
```

Iterate `w` **ascending** and `dp[w - wt]` has already been updated *in this same
iteration of `i`* — so you read the current row where the recurrence requires the previous
row. That means item `i` can be taken more than once.

**You have silently converted 0/1 knapsack into unbounded knapsack.** It doesn't crash, it
doesn't warn, and it returns a plausible larger number. The only way to notice is to know
the right answer in advance. (And the inverse is a real algorithm: unbounded knapsack is
*exactly* this loop, ascending. One character of difference between two different
problems.)

**Other cases where the order is the algorithm:**
- **Interval / matrix-chain DP** — must iterate by increasing *interval length*, not by
  `i` or `j`, because `dp[i][j]` depends on shorter intervals strictly inside it. Loop over
  `i` and `j` naively and you read cells that are still zero.
- **Bitmask DP over subsets** — must go in increasing popcount, or increasing mask value
  (which happens to work, since a submask is always numerically smaller). The correctness
  depends on a numeric coincidence most people never notice they're relying on.
- **DP on a tree** — post-order traversal; the topological order *is* the traversal, and
  it's a DAG-shaped constraint you can't express as nested `for` loops at all.

### Why this is the strongest argument for top-down

**The topological order is a proof obligation that bottom-up makes you discharge by hand,
and encodes only implicitly, in loop nesting and direction.** Get it wrong and you read an
unfilled cell — usually `0`, usually plausible, always silent.

Top-down derives the order from the recursion itself and **cannot get it wrong**. If `f(i)`
needs `f(j)`, it calls `f(j)`. That's it.

So the honest framing of the trade-off:

| | Bottom-up | Top-down |
|---|---|---|
| Evaluation order | your job, encoded in loop structure | free, derived from recursion |
| Failure mode if wrong | **silent wrong answer** | impossible |
| Space optimization | easy (rolling window) | hard |
| Stack depth | none | O(depth), ~10⁴ limit in V8 |
| Computes | every state | only reachable states |

**Prototype top-down, ship bottom-up once the recurrence is proven.** The top-down version
then remains as the oracle in a property test — it can't have an ordering bug, so any
disagreement is the tabulated version's fault. That's a genuinely useful testing strategy
and the reason to keep both files in this repo.

## Q10. The discarded table

`fib(50)` then `fib(51)` does **~101 additions**, where the memoized version does ~51 —
because the table is a local, allocated and garbage-collected per call. Tabulation as
written has **no cross-call reuse**. It's O(n) per call, forever.

You can get it back without becoming top-down: hoist the table to a closure and **extend**
it rather than rebuilding.

```js
function makeFib() {
    const table = [0n, 1n];
    return function fib(n) {
        for (let i = table.length; i <= n; i++)     // extend only past the high-water mark
            table[i] = table[i-1] + table[i-2];
        return table[n];
    };
}
```

`fib(50)` fills 51 cells; `fib(51)` adds one. Total 52 additions. The loop bound
`table.length` is the whole trick — it *is* the memo check, expressed as a range rather
than a per-key lookup, which is why it needs no `has()` and can't have the falsy-sentinel
bug from the memoization file.

The costs are the ones from that file's Q4: process-lifetime memory that is never
collected, unbounded growth without an `N_MAX`, and shared mutable state across every
caller. Closure-scoped rather than module-scoped, and bounded. This is the version in
Appendix A.

## Q11. When tabulation is asymptotically wrong

**Coin change with sparse denominations.** Amount `A = 1{,}000{,}000`, coins
`{100, 500, 1000}`.

- **Bottom-up** fills all 1,000,001 cells. 99% of them are amounts not divisible by 100 —
  unreachable, permanently `Infinity`, computed anyway.
- **Top-down** touches only reachable amounts: `10⁴` states. **100× less work**, and the
  gap widens with the coin GCD.

Other instances of the same shape: grid paths where obstacles wall off most of the grid;
banded sequence alignment; game-tree DP where most board positions are unreachable from
the opening.

**The distinguishing property:**

> **reachable states / total states**

Fibonacci's ratio is 1 — reaching `fib(n)` requires literally every predecessor, which is
why it cannot demonstrate this and is a misleading teaching example for it. When the ratio
is near 1, tabulate: better constants, no stack, easy space optimization. When it's small,
memoize: you skip the dead states entirely, and no loop can do that, because a `for` loop
doesn't know which cells are reachable.

Second-order: even at ratio 1, tabulation's cells are contiguous and prefetchable while
top-down's are pointer-chased through a `Map`. Tabulation can win on constants by 5–10×
even when it does more total work — so "small ratio" needs to mean *substantially* small,
not 0.9.

## Q12. API for "all `fib(k)`, `k ≤ n`"

Returning the internal array directly is the bug:

```js
function fibTable(n) { const t = [...]; /* fill */ return t; }   // ← caller now owns your state
const t = fibTable(10);
t[5] = 999;                     // if the table is cached (Q10), the cache is now corrupt
```

You have **aliased mutable internal state into the caller's hands.** With a per-call table
it's merely surprising; combined with the cross-call cache from Q10, one careless caller
poisons every future result, and the corruption surfaces arbitrarily far from its cause.

Three options, in ascending order of correctness:

1. **Return a copy** — `return table.slice(0, n+1)`. O(n) per call, which for a batch API
   is fine (you were already O(n)). Simple, obviously safe. Default to this.
2. **Return a frozen view** — `Object.freeze(table.slice(...))`. Fails loudly on write in
   strict mode instead of silently succeeding. Note `Object.freeze` on the *live* table
   would break your own writes.
3. **Return an accessor, not a container** — `{ get(k) {...}, get length() {...} }`. No
   copy, no aliasing, and it hides the representation, so you can switch to a typed array
   later without breaking callers. Best if this is a real library boundary.

The general principle: **a function that returns a reference to its own mutable state has
extended its API surface to include that state's entire mutation history.** Copy, freeze,
or hide.

## Q13. `BigInt` here vs. in the memoized version

The `Number` overflow at `fib(79)` is identical. What's different is the interaction with
line 23, and the difference cuts both ways.

**What breaks with `[...new Array(n+1)]`:** nothing new, but nothing helps either. The
array is already `PACKED_ELEMENTS` (Q6), so every cell is a boxed pointer — which is what
`BigInt` needs anyway, since BigInts are heap objects of *variable* size. The elements-kind
argument evaporates: you were going to pay boxing regardless. The `.fill(0)` optimization
also stops applying — you'd need `.fill(0n)`, and `PACKED_SMI_ELEMENTS` is unreachable for
BigInt.

**The correct typed backing store, and its trap:** `BigInt64Array` exists — and it is
**wrong for this**. It stores *fixed-width 64-bit* integers, so it silently **wraps** on
overflow rather than growing:

```js
const a = new BigInt64Array(1);
a[0] = 2n ** 63n;     // wraps to -9223372036854775808n  — no error
```

`fib(93) = 12200160415121876738` exceeds 2⁶³. So `BigInt64Array` buys you exactly 14 more
terms past `Number`'s limit (79 → 92) and then fails the *same silent way* — which is the
trap: it looks like the "correct BigInt typed array" and reintroduces the precise bug you
migrated to fix, just further out where your tests are even less likely to reach.

**The real answer: there is no typed array for arbitrary-precision integers**, because
typed arrays are fixed-stride and BigInts are variable-width. `fib(n)` needs `0.694n` bits,
so cell `n` is physically larger than cell `n−1`. A plain `Array` of BigInt references is
the only option — the indirection is not overhead you can optimize away, it's the
representation the problem requires.

**Which is the strongest possible argument for Q7's rolling window.** The full table isn't
just O(n) *cells*, it's Σ 0.694k/8 bytes — **quadratic in memory** (~108 MB at n = 50,000).
The two-scalar version holds two BigInts. For BigInt Fibonacci, space optimization stops
being a nicety and becomes the difference between running and OOM.

## Q14. Which file survives

**Neither, as written. Keep both directories, delete both implementations, and ship one
corrected version — but they are not redundant, and the reviewer's premise is wrong.**

They encode different lessons and both are load-bearing in a practice repo:
- Top-down teaches: cache lifetime, cache-hit semantics, laziness, stack depth.
- Bottom-up teaches: evaluation order, space optimization, allocation strategy.

The `top-down-memoization/` version's bugs were *fatal* (exponential, cache never read).
The `bottom-up-tabulation/` version's bugs are *cosmetic and contractual* (wrong docblock,
bad error contract, wasteful allocation). Bottom-up is also strictly better on the merits
for this problem: no stack limit, trivial O(1) space, better constants, ratio-1 state
space (Q11).

**The criterion I'd give the reviewer — not speed:**

> **Which one fails loudly when it's wrong?**

Bottom-up's ordering bugs are silent (Q9's knapsack). Top-down's ordering bugs are
impossible. That's the axis that matters, because *performance problems announce themselves
and correctness problems do not.* For Fibonacci the recurrence is a one-line path graph,
so there is nothing to get wrong, and the argument collapses to "ship the simpler, faster
one" — bottom-up, two scalars.

For anything harder, the answer flips, and **that's the point worth carrying out of this
exercise.**

## Q15. Fix ordering

**The criterion: order by (probability of a silent wrong answer reaching a caller) ×
(cost of not noticing). Loud failures go last, no matter how ugly.**

1. **`fib(-1)` returning `-1`** — an in-band sentinel that participates in arithmetic
   (`fib(-1) + fib(10) === 54`, measured). Silent, propagating, corrupts callers, and every
   call site is a new opportunity to forget the check. Highest probability of a wrong
   answer reaching production, and it was introduced *by the fix*, which makes it fresh
   and unexamined.
2. **`Number` overflow at 79** — silent and unfixable after the fact, but requires
   `n ≥ 79` to trigger. Lower probability than #1, equal or worse consequence. Ranked
   second only because #1 fires on inputs that occur far more often. If this code touched
   money, it moves to #1.
3. **Docblock/code divergence** — no runtime effect *today*. It is a booby trap for the
   next person, who "fixes" the code to match the comment and ships `NaN`. Ranked third
   because the failure requires a future edit, but it's above the performance items
   because the failure it causes is silent.
4. **O(n) space** — loud. At worst it OOMs, which is a crash with a stack trace and a
   metric. Genuinely a bug (quadratic memory once BigInt lands, Q13) but it *announces
   itself*. A crash you can see beats a wrong answer you can't.
5. **`console.log`** — a layering violation with a measured cost of 345 bytes and one
   syscall. Real, and last. It's a one-line delete, so do it in passing with #4, but it
   should never displace anything above it in a triage queue.

The ordering isn't the point — a defensible different one exists (someone whose service is
memory-constrained puts O(n) space at #2 and is right). **The point is having a criterion
that's about consequences rather than effort.** The most common triage failure is sorting
by how easy something is to fix, which reliably ships the cheap fixes and leaves the silent
wrong answers in place — because silent wrong answers are, by construction, the hard ones.

---

## Appendix A — Corrected implementations

**Ship this** (O(1) space, the general case for Fibonacci):

```js
const N_MAX = 100_000;

/** Fibonacci by bottom-up tabulation, space-optimized to O(1).
 *  Θ(n) additions; Θ(n²) bit ops, since fib(n) has ~0.694n bits. */
export function fib(n) {
    if (!Number.isInteger(n))      throw new TypeError(`fib: n must be an integer, got ${typeof n} ${String(n)}`);
    if (n < 0 || n > N_MAX)        throw new RangeError(`fib: n must be in [0, ${N_MAX}], got ${n}`);
    if (n <= 1)                    return BigInt(n);

    let a = 0n, b = 1n;                                  // width = max lag = 2
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
}
```

**Or this**, if callers need the whole table or repeated queries (Q10 + Q12):

```js
export function makeFibTable({ maxN = N_MAX } = {}) {
    const table = [0n, 1n];                              // closure-scoped: collectible, isolated

    function fib(n) {
        if (!Number.isInteger(n)) throw new TypeError(`fib: n must be an integer, got ${typeof n} ${String(n)}`);
        if (n < 0 || n > maxN)    throw new RangeError(`fib: n must be in [0, ${maxN}], got ${n}`);
        for (let i = table.length; i <= n; i++)          // extend past high-water mark only
            table[i] = table[i - 1] + table[i - 2];
        return table[n];
    }

    fib.upTo = n => (fib(n), table.slice(0, n + 1));     // copy — never alias internal state
    return fib;
}
```

Choices, with the question each answers:

- **Throw, don't sentinel** — `-1` is arithmetically valid and propagates silently (Q2).
- **Type check before range check** — `n < 0` coerces unvalidated input and can run
  user `valueOf` (Q4).
- **`N_MAX`** — admission control; without it `Number.isInteger` passes `1e10` straight
  into V8's allocator (Q3).
- **`BigInt`** — `Number` is silently wrong from `fib(79)` (Q13).
- **Two scalars, no array** — 6× faster, 100× less memory; quadratic memory with BigInt
  otherwise (Q7, Q13).
- **No `[...new Array()]`** — costs a second allocation and forces `PACKED_ELEMENTS`
  to pack cells that are always written before read (Q5, Q6).
- **`.slice()` in `upTo`** — returning the live table aliases mutable internal state into
  the caller (Q12).
- **No `console.log`** — a pure function performing I/O is a layering violation (Q8).

## Appendix B — Measured results

Node v24.18.1, darwin arm64.

```
--- original docblock implemented literally ---
n=2 -> 1  (correct by accident)     n=3 -> NaN      n=10 -> NaN
typeof fib(10) === 'number'   -> true    ← passes a typeof check
fib(10) !== undefined         -> true    ← passes a defined-check assertion
fib(10) === 55                -> false   ← only exact-value tests catch it

--- proposed docblock fix (i=2..n+1, table[n]) ---
n=10 -> NaN   (unchanged; the bug was table[n], not the bound)

--- submitted function, hostile inputs ---
fib(0)=0  fib(1)=1  fib(2)=1  fib(10)=55
fib(-1)=-1  fib(-5)=-1  fib(2.5)=-1  fib("10")=-1  fib(null)=-1
fib(undefined)=-1  fib(NaN)=-1  fib(Infinity)=-1  fib("abc")=-1
Number.isInteger(1e10) === true  ->  passes guard  ->  RangeError: Invalid array length
max array length = 2**32-1 = 4294967295

--- in-band sentinel ---
fib(-1) + fib(10)     -> 54              (silent, no error)
[5,-2,10].map(fib)    -> [5, -1, 55]

--- allocation, n = 5e6 ---
[...new Array(n)]      15.7 ms      PACKED_ELEMENTS   (2 allocs)
new Array(n).fill(0)   10.7 ms      PACKED_SMI        (1 alloc)
new Float64Array(n)     0.3 ms      typed, off-heap   (calloc)

--- space optimization, n = 5e6 ---
full table         138.9 ms    152.4 MB heap
rolling window(3)   24.1 ms      1.5 MB heap      (6x faster, 100x less memory)
two scalars         26.8 ms      ~0
correctness: roll3 === two-scalar === table for n in {0,1,2,3,10,40,70}

--- console.log volume ---
util.inspect(new Array(1e6).fill(7)).length = 345 chars
tail: "7, 7, 7, 7,\n  ... 999900 more items\n]"
util.inspect.defaultOptions.maxArrayLength = 100
```

## Appendix C — Reproducing

```js
// docblock implemented literally
function fromComment(n){ const t=[...new Array(n+1)]; t[0]=0,t[1]=1;
  if(n>1) for(let i=2;i<=n;i++) t[n]=t[n-1]+t[n-2];
  return t[n]; }
console.log(fromComment(10));                 // NaN

// hostile inputs
const cases=[0,1,2,10,-1,-5,2.5,'10',null,undefined,NaN,Infinity,'abc',1e10];
for (const v of cases) { try { console.log(v, '->', fib(v)); }
                         catch(e){ console.log(v, 'THROWS', e.message); } }

// allocation timing
const N=5e6, hr=()=>process.hrtime.bigint();
let t=hr(); [...new Array(N)];        console.log('spread ', Number(hr()-t)/1e6);
t=hr();     new Array(N).fill(0);     console.log('fill   ', Number(hr()-t)/1e6);
t=hr();     new Float64Array(N);      console.log('typed  ', Number(hr()-t)/1e6);

// console.log truncation
console.log(require('util').inspect(new Array(1e6).fill(7)).length);   // 345
```

---

## Scorecard

| Q | Topic | Grade |
|---|---|---|
| 1 | Docblock divergence | ✗ Wrong bug identified; proposed fix leaves it intact; result is `NaN`, not `undefined` |
| 2–4 | Input validation | ◐ `Number.isInteger` is the right predicate and four failure modes collapsed to one — but `-1` is an in-band sentinel, there's no upper bound, and the guard order leaks a coercion |
| 7 | O(1) space | ✓ Correct, and generalized to the right rule (width = max lag); overshot by one for lag-2; second half of the question unanswered |
| 8 | `console.log` | ✓ Right call; the layering argument is the durable one, not volume |

**The pattern across all four:** every answer correctly identified *that* something was
wrong and then reached for the smallest change that made the symptom disappear — a loop
bound instead of the index, a sentinel instead of an exception. That's the instinct to
watch. The senior move is to ask *what class of bug is this* before fixing it, because the
class tells you where else it lives. Two of these (`if (memo[n])` in the previous file,
`return -1` in this one) are the **same bug** — a value doing double duty as data and as a
signal — found in two files, on two different days, and fixed neither time.
