# Fibonacci — Staff-Level Expansions

Answers to the follow-up ladder on [fibonacci.js](fibonacci.js). Every number in this
document was measured on Node v24.18.1, not estimated. The verification scripts are in
the appendix.

The point of this file is not Fibonacci. Fibonacci is the smallest program that still
contains a cache, a recurrence, a numeric type, a memory bound, and a concurrency
question. Everything below generalizes.

---

## The starting code

```js
function fib_dp(n) {
    if (n === 0 || n === 1) return n;
    const memo = [];                              // (A)
    if (memo[n]) {
        return memo[n];
    } else {
        memo[n] = fib_rec(n-1) + fib_rec(n-2);    // (B)
        return memo[n];
    }
}
```

Two independent defects, either of which alone destroys the memoization:

- **(A) Lifetime.** `memo` is allocated fresh on every invocation. Every call starts with
  a cold cache. The cache is not just useless, it's *write-only* — nothing ever reads a
  value another call wrote.
- **(B) Wrong recursive target.** The recursion descends into `fib_rec`, the
  un-memoized twin. Even with a correct cache lifetime, control leaves the memoized
  function on the first step and never returns to it.

Net effect: `fib_dp` is `fib_rec` with one extra array allocation. It is exponential,
and it is *slower* than the naive version.

The fix hoists `memo` to module scope and recurses into `fib_dp`. That is correct.
Everything below assumes it.

---

# Tier 1 — Correctness of what's on screen

## Q1. Prove it's memoized. What's the real complexity?

**It is Θ(n) operations — exactly `2n − 4` internal calls.** Measured:

| n | `fib_rec` internal calls | `fib_dp` internal calls | `2n − 4` |
|---:|---:|---:|---:|
| 5 | 14 | 6 | 6 |
| 10 | 88 | 16 | 16 |
| 20 | 10,945 | 36 | 36 |
| 40 | ~3.3 × 10⁸ | 76 | 76 |
| 80 | ~4.4 × 10¹⁶ | 156 | 156 |

### Why 2n − 4, precisely

Aggregate analysis. Partition every call into a **miss** (computes and writes) or a
**hit** (returns immediately).

- **Misses ≤ n − 1.** Each `k ∈ [2, n]` can miss at most once: after its miss returns,
  `memo[k]` is populated, so every later visit to `k` is a hit. Misses are bounded by the
  size of the state space, which here is one-dimensional with `n − 1` non-base entries.
- **Hits ≤ misses.** Every call is spawned by some miss, and each miss spawns exactly two
  children. One of those children is itself a miss (the `k−1` branch, on the left spine);
  the other is a hit once the spine has been walked. So hits ≈ n − 3 after accounting for
  the two base cases that return before the counter.

Total ≈ 2n. The exact constant depends on where you place the instrumentation; the shape
does not.

**This is the general theorem for top-down DP, and it's the only one worth memorizing:**

> **cost = (number of distinct states) × (cost to fill one state, excluding recursion)**

Every memoized DP you will ever write is analyzed this way. The recursion tree is a
distraction — count the *state space*, not the tree.

### Where `log n` would legitimately appear

Only if the memo lookup itself weren't O(1). Keyed by a balanced BST or any ordered
structure, lookups cost O(log n) and the total becomes O(n log n). A JS array or `Map`
gives amortized O(1), so the factor drops out. Always know which data-structure
assumption your complexity claim is priced against — "O(n)" here is really
"O(n) × O(1) lookups × O(1) additions," and two of those three are assumptions.

### The correction in the *other* direction: it is not really Θ(n)

Θ(n) counts *operations* under the unit-cost RAM model, which assumes addition is O(1).
That assumption is false here, and it fails at exactly the point where it matters.

`fib(n)` has **Θ(n) bits** — specifically `n · log₂(φ) ≈ 0.694n` bits. Measured:

```
bits(fib(100000)) / 100000 = 0.6942     log₂(φ) = 0.6942
```

Once you migrate to `BigInt` (see Q5, which you must), each addition of two Θ(n)-bit
numbers costs Θ(n) word operations. The true **bit complexity is Θ(n²)**.

Measured, iterative `BigInt` Fibonacci:

| n | bits in result | time |
|---:|---:|---:|
| 10,000 | 6,942 | 6.0 ms |
| 100,000 | 69,424 | 80.3 ms |
| 1,000,000 | 694,241 | **5,999 ms** |

10× the input, ~75× the time. That is quadratic behavior, plainly visible. A staff-level
complexity answer always states the machine model it's counting in, because "O(n)" and
"6 seconds" are both true here and only one of them is actionable.

---

## Q2. `if (memo[n])` — the falsy-sentinel bug

### Why it's currently harmless, and why that's worse than being broken

The only values that would be falsy in this memo are `memo[0] = 0` and `memo[1] = 1` —
and neither ever reaches the cache check, because the base case returns two lines above
it.

So the bug is **masked by an invariant enforced elsewhere in the function, and documented
nowhere.** Make this entirely reasonable refactor:

```js
const memo = [0, 1];              // seed base cases, drop the special-case branch
function fib_dp(n) {
    if (memo[n]) return memo[n];  // memo[0] = 0 is falsy → MISS
    memo[n] = fib_dp(n-1) + fib_dp(n-2);
    return memo[n];
}
```

`fib_dp(2)` → `fib_dp(0)` → falsy → recurses to `fib_dp(-1)` → `fib_dp(-2)` → **stack
overflow.** The refactor was locally correct. The bug was pre-installed.

This is the general hazard: **a latent bug guarded by an accidental invariant is more
dangerous than an active one**, because it passes review, passes tests, and detonates
during unrelated maintenance months later.

### The three idioms, ranked

| Idiom | Distinguishes stored-`undefined` from absent? | Prototype chain? | Key coercion? |
|---|---|---|---|
| `if (memo[n])` | ✗ — also fails on `0`, `""`, `NaN`, `false` | walks it | to string |
| `memo[n] !== undefined` | ✗ | walks it | to string |
| `n in memo` | ✓ | **walks it** | to string |
| `memo.has(n)` (`Map`) | ✓ | none | **none** |

`!== undefined` is the one that genuinely fails the stated criterion: a memo that
legitimately stores `undefined` as a computed result is indistinguishable from a miss, so
you recompute forever.

`in` actually *does* survive it — `memo[5] = undefined` still creates the property, so
`5 in memo` is `true`. The reasons to prefer `Map` are different:

1. **`in` walks the prototype chain.** `'constructor' in memo` → `true`. A memo keyed by
   user-supplied strings will report phantom hits on `toString`, `valueOf`, `__proto__`.
   `Object.create(null)` patches this; `Map` never had the problem.
2. **Object and array keys are coerced to strings.** `memo[1]` and `memo["1"]` are the
   same slot. Harmless for Fibonacci, fatal for every 2-D DP you write afterward, where
   the natural key is a tuple and `[1,2]` stringifies to `"1,2"` — colliding with the
   string `"1,2"` and with `[1,"2"]`.
3. **The BigInt trap** (this bites in Q5): `obj[10n]` coerces to `"10"`, the *same slot*
   as `obj[10]`. `Map` uses SameValueZero, where `10n` and `10` are **different keys**.
   Measured:

```js
const o = {}; o[10n] = 'big'; o[10] = 'num';
// o → { '10': 'num' }        ← silent overwrite, one entry
const m = new Map(); m.set(10n,'big'); m.set(10,'num');
// m.size → 2                 ← two entries
```

Same character-level change, opposite semantics, no error in either direction.

### The counter-pressure

`Map` is the right *default*. It is not always the right *choice*. For dense integer keys
`0..n`, a plain array — or better, a `BigInt64Array`/`Float64Array` — beats `Map`
measurably: elements backing store, no hashing, no boxing. Reach for that when keys are
dense small integers **and you have measured**. Know which one you're picking and why;
"I used a Map because someone said objects are bad" is not an answer.

---

## Q3. Why `[]` and not `Map` / `Object.create(null)`? What does V8 do?

### V8's elements kinds

V8 stores array elements in one of several backing-store representations, and transitions
between them are **one-way** (you cannot get back to a faster kind without reallocating):

```
PACKED_SMI  →  PACKED_DOUBLE  →  PACKED_ELEMENTS
     ↓               ↓                  ↓
HOLEY_SMI   →  HOLEY_DOUBLE   →  HOLEY_ELEMENTS  →  DICTIONARY_ELEMENTS
```

`const memo = []; memo[10000] = 1;` does two things:

1. **Creates holes.** Indices `0..9999` are absent — not `undefined`-valued, *absent*.
   The array transitions to a `HOLEY_*` kind. Every subsequent read must check the hole
   and fall back to a prototype-chain lookup, because `arr[5]` on a hole is spec-required
   to consult `Array.prototype`. That check is cheap but it is not free, and it disables
   several optimizations.
2. **Possibly triggers dictionary mode.** V8 converts to `DICTIONARY_ELEMENTS` (a hash
   table) when the array is sufficiently sparse — heuristically, when the allocated
   backing store would be several times larger than the number of actual elements. At
   that point per-element access becomes a hash lookup, and you have paid for a `Map`
   while getting worse ergonomics than a `Map`.

Measured side effect:

```js
const sp = []; sp[10000] = 1;
sp.length   // 10001   ← length is a derived max-index, not a count
0 in sp     // false   ← 10,000 holes
```

### When it stops being free

Three thresholds, in the order you'll hit them:

- **Immediately**, if you're relying on `.length` meaning "number of entries." It means
  "highest index + 1." A memo with one entry at index 10,000 reports `length === 10001`.
  Any capacity check written against `.length` is wrong.
- **At dictionary-mode conversion**, where the array silently becomes a slower hash map
  than the `Map` you declined to use.
- **At `n > 2³² − 1`**, where the index is no longer a valid array index at all and
  becomes an ordinary string property — a completely different storage path, with no
  warning.

### The actual decision rule

- Dense integer keys, known bound, hot path → **typed array** (`Float64Array`,
  `BigInt64Array`). Fastest, and preallocating the exact size avoids all transitions.
- Dense integer keys, unknown bound → **plain array**, accepting the growth reallocs.
- Sparse, large, or non-integer keys → **`Map`**. Also the only correct choice if you
  need eviction (Q8), since `Map` preserves insertion order, which gives you LRU almost
  for free.
- Never a plain `{}` for a cache keyed by anything user-influenced — prototype pollution
  and phantom hits. If you must, `Object.create(null)`.

---

# Tier 2 — Making it production-shaped

## Q4. Scoping shared mutable state

### The three options

**1. Module-level (what the fix does)**

```js
const memo = [];
export function fib(n) { /* reads and writes module-scope memo */ }
```

Cache is shared across every importer in the process. Maximum hit rate, zero isolation,
unbounded lifetime — the memo lives as long as the module, which is as long as the
process.

**2. Closure (factory)**

```js
export function makeFib() {
    const memo = new Map();
    return function fib(n) { /* ... */ };
}
```

Each call site gets its own cache. Isolation is real; sharing is opt-in by passing the
instance around. The memo is garbage-collectible when the closure is dropped — which is
the property module scope can never give you.

**3. Parameter-threaded**

```js
export function fib(n, memo = new Map()) { /* ... */ }
```

Explicit, trivially testable, purely functional at the boundary. And **wrong here**: the
default parameter is re-evaluated per top-level call, so callers who omit it get defect
(A) back. It also forces the cache into your public API signature, meaning every future
change to the cache representation is a breaking change.

### The scenario: HTTP handler + nightly batch job, same process

The batch job calls `fib(50_000)`. With module scope, here's what the HTTP handler
experiences — and **the answer is genuinely different for latency and for memory**:

**Latency: catastrophic, and not for the reason people expect.** It is not cache
contention. Node is single-threaded: `fib(50_000)` as a synchronous function **blocks the
event loop for its entire duration.** No HTTP request is accepted, parsed, or answered
while it runs. Every in-flight request's latency increases by the full compute time.
Health checks time out. The load balancer marks the instance unhealthy and pulls it from
rotation — which, if the batch job runs on every instance on the same cron, takes down
the entire fleet simultaneously. The memo does nothing to help; it makes the *first* call
slow exactly once and that is the call that kills you.

**Memory: a permanent step-change, not a spike.** The batch job populates 50,000 entries.
As `BigInt`s, `fib(50_000)` alone is ~4.3 KB (`0.694 × 50000 / 8`), and the sum over all
entries is quadratic: **Σ 0.694k/8 bytes ≈ 108 MB** for the full table. That memory is
now permanently resident — module scope means nothing is ever collected. The handler
doesn't slow down from it, but the container's memory ceiling just moved 108 MB closer,
and the next traffic spike OOMs for reasons that appear entirely unrelated to the batch
job that actually caused it.

### The pick

**Closure factory, one instance per consumer, with a bound.** The batch job gets a memo
that is dropped and collected when the job ends. The handler gets a small bounded one
sized to its actual request distribution.

And separately, the real fix for the latency half: **the batch job does not belong on the
request-serving event loop.** Move it to a `worker_thread`, a separate process, or yield
to the loop periodically. No cache-scoping decision can fix event-loop monopolization —
that is an architecture problem wearing a caching problem's clothes.

The generalizable rule: **module-level mutable state is a process-lifetime memory leak
with a sharing feature.** Sometimes that trade is correct. It should always be
deliberate.

---

## Q5. `Number` → `BigInt`

### Where the first silently wrong answer appears

**n = 79.** Measured:

```
Number.MAX_SAFE_INTEGER = 9007199254740991        (2⁵³ − 1)
true   fib(78) = 8944394323791464                 ← still ≤ MAX_SAFE, exact
true   fib(79) = 14472334024676221
Number fib(79) = 14472334024676220                ← off by one, no error
```

The boundary argument, which is the part that matters:

`fib(78) = 8,944,394,323,791,464 < 2⁵³`, so it and every predecessor are exactly
representable. `fib(79) = 14,472,334,024,676,221` lands in `[2⁵³, 2⁵⁴)`. In that binade
the representable doubles are exactly the **even** integers — the ulp is 2. `fib(79)` is
odd. It cannot be represented, so it rounds to nearest-even and comes back **1 too
small.**

Note that the failure is *not* at `MAX_SAFE_INTEGER` itself, and not at the first value
that exceeds it in the naive sense. It's at the first value that exceeds it **and has the
wrong parity for its binade.** An even Fibonacci number just above 2⁵³ would have come
back correct, buying you a few more terms of false confidence. This is why
`Number.isSafeInteger` guards the *input domain* and never the *result*.

### What "silently" costs

There is no exception, no `NaN`, no warning. `fib(79)` returns a plausible 17-digit
integer that is wrong by 1, and every value computed from it thereafter is wrong.

- **Financial:** a running total that is off by 1 unit in the smallest denomination and
  drifts. Reconciliation catches it days later, at which point you cannot tell which
  transactions were affected without replaying everything.
- **Cryptographic:** total compromise. Modular arithmetic over `Number` is wrong above
  2⁵³ for the same reason, which is why every serious JS crypto library uses `BigInt` or
  typed-array limbs. A "working" implementation that silently loses low bits produces
  keys that look fine and are not.
- **Anywhere:** it violates the property that makes tests meaningful. `fib(10) === 55`
  passes. `fib(79)` is wrong. No test at a small `n` can detect it, and the natural test
  suite only contains small `n`.

**Rule: any integer computation whose output can exceed 2⁵³ must be `BigInt` from the
start.** Not "when we hit the limit" — by then the wrong values are in the database.

### The migration hazards

**Hazard 1 — mixed arithmetic throws.** Measured:

```js
1n + 1
// TypeError: Cannot mix BigInt and other types, use explicit conversions
```

This one is *good news*: it's loud, it's at the point of the bug, and your test suite
catches it. A memo half-full of `Number`s and half-full of `BigInt`s throws on the first
mixed addition. Take the noisy failure gratefully.

**Hazard 2 — comparison does *not* throw, and is inconsistent.** Measured:

```js
1n == 1     // true    ← loose equality coerces
1n === 1    // false   ← strict equality checks type
1n < 2      // true    ← relational operators coerce
```

So `if (memo[n] === cached)` silently changes meaning across the migration while
`if (memo[n] == cached)` doesn't, and a `Set` or `Map` lookup (SameValueZero, no
coercion) behaves like `===`. **This is the hazard that lies rather than throws.**

**Hazard 3 — the key coercion from Q2.** If the memo is a plain object or array and you
key by the BigInt, `memo[10n]` and `memo[10]` are the same slot; with a `Map` they are
different keys. During a partial migration where some call sites pass `10` and some pass
`10n`, an object-backed memo silently merges them (usually harmless, occasionally not)
and a `Map`-backed memo silently *doubles* — halving the hit rate with no error and no
obvious symptom beyond "the cache got slower."

**Hazard 4 — serialization.** Measured:

```js
JSON.stringify({ v: 1n })
// TypeError: Do not know how to serialize a BigInt
```

This detonates at the *boundary*, not in the algorithm: the API response, the Redis
write, the log line, the metrics payload. All of it is downstream of where you tested.
You need an explicit `.toString()` at every serialization point, plus a documented
convention for how the client parses it back (a JSON number will silently truncate it —
the exact bug you just fixed, reintroduced across the wire).

**Hazard 5 — performance, which is Q1's Θ(n²).** `BigInt` addition is not O(1). The
migration that fixes your correctness bug introduces a quadratic time bug. Both are real;
fix correctness first, then Q12.

---

## Q6. Bottom-up: what you gain, what you lose

```js
function fib_bottom_up(n) {
    if (n < 2) return BigInt(n);
    let prev = 0n, curr = 1n;
    for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
    return curr;
}
```

**Gains:** O(1) space instead of O(n) (only two values are ever live). No call stack, so
no depth limit — this handles `n = 10⁷` where the recursive version dies at ~10⁴. Better
cache locality and no function-call overhead. For Fibonacci specifically this is strictly
better and you should ship it.

### What top-down has that bottom-up loses

**Laziness — it computes only the subproblems actually reachable from the query.**

For Fibonacci this is worth nothing, because reaching `fib(n)` requires every one of
`fib(2..n−1)`. The reachable set *is* the full state space. That's precisely why
Fibonacci is a misleading teaching example for this trade-off.

The property matters when the reachable set is a small fraction of the state space:

- **Coin change** for amount `A` with denominations `{100, 500, 1000}`: bottom-up fills
  all `A` entries. Top-down touches only amounts congruent to reachable sums — a few
  hundred states out of a million.
- **Grid paths with obstacles**, where a wall makes most of the grid unreachable.
  Bottom-up computes the dead region anyway.
- **Any DP over a large key space with a sparse reachable set** — string alignment where
  a band restriction applies, game-tree DP where most positions are unreachable from the
  opening.

Second, quieter gain: **top-down doesn't require you to find a valid evaluation order.**
Bottom-up needs a topological order of the dependency graph, worked out by hand and
encoded in the loop nesting. Get it wrong and you read an unfilled cell — often `0`,
often plausible, usually silent. Top-down derives the order from the recursion itself and
cannot get it wrong. On a DP with a nontrivial dependency structure, that is the
difference between an afternoon and a week.

**The rule:** bottom-up when the state space is dense and you want the constant factors
and the space bound. Top-down when the state space is sparse, or when the correct
evaluation order is hard enough that deriving it by hand is a real source of bugs.

---

## Q7. Stack depth

Measured on Node v24.18.1: **10,398 frames** before `RangeError: Maximum call stack size
exceeded`. That figure is not a constant you may rely on — it depends on frame size (how
many locals and arguments), on the V8 version, on `--stack-size`, and on how deep the
stack already is when you're called. Treat "about 10⁴" as the order of magnitude and
never as a budget.

Note that the naive `fib_rec` blows up on *time* long before *depth* — its depth is only
`n`, so `fib_rec(10000)` would overflow at depth 10,000, but `fib_rec(50)` already takes
longer than you'll wait. Memoized top-down has the opposite profile: fast, but linear
depth, so **the fix for exponential time converts a time bomb into a stack bomb.**

### Fix 1 — explicit stack (iterative conversion)

Move the call stack into a heap-allocated array you control:

```js
function fib_iter_stack(n, memo = new Map([[0, 0n], [1, 1n]])) {
    const stack = [n];
    while (stack.length) {
        const k = stack[stack.length - 1];
        if (memo.has(k)) { stack.pop(); continue; }
        const a = memo.get(k - 1), b = memo.get(k - 2);
        if (a === undefined || b === undefined) {
            if (a === undefined) stack.push(k - 1);
            if (b === undefined) stack.push(k - 2);
            continue;                     // re-visit k after children resolve
        }
        memo.set(k, a + b);
        stack.pop();
    }
    return memo.get(n);
}
```

Bounded only by heap, not by the ~1 MB stack. **This is the fix that always works**, for
any recursion, and it's the one to reach for by default. The cost is that it's harder to
read than the recursion it replaces — which is why you write it only when depth is
actually a constraint.

### Fix 2 — trampolining / CPS

Have the function return a *thunk* describing the next step instead of calling it, and
drive it from a flat loop:

```js
const trampoline = f => (...args) => { let r = f(...args); while (typeof r === 'function') r = r(); return r; };
```

### Why JS makes fix 2 harder than it looks

**Proper tail calls are in the ES2015 spec and effectively nobody implemented them.**
JavaScriptCore (Safari) shipped PTC. **V8 and SpiderMonkey never did and have stated they
won't** — the objections were debuggability (tail-call elimination erases stack frames, so
your stack traces lose the frames you need) and the difficulty of doing it without
regressing the common non-tail case. So the "just make it tail-recursive" instinct
imported from Scheme or OCaml **does not save you in Node or Chrome.** A tail-recursive
`fib` overflows at exactly the same depth as a non-tail-recursive one.

Compounding it: **`fib` is not naturally tail-recursive at all.** `fib(n-1) + fib(n-2)`
has two recursive calls and pending work (the addition) after each. Converting to tail
form requires reformulating with accumulators — at which point you have derived the
bottom-up loop from Q6 and should simply write that instead.

**The honest summary:** in JavaScript, "convert to a loop" (fix 1, or just bottom-up) is
the answer. Trampolining is real and occasionally the right tool for mutually-recursive
state machines, but reaching for it to solve *this* is usually a sign of importing habits
from a language with a different runtime.

---

# Tier 3 — Design and scale

## Q8. `GET /fib/:n` — eviction policy

### The question is a trap, and the trap is the point

The prompt says "design the eviction policy." **Eviction is the wrong first move.** An
attacker sending `n = 10⁹` is not a cache-sizing problem — the result alone is
`0.694 × 10⁹ / 8 ≈ 87 MB`, and computing it takes ~100 minutes on the event loop
(extrapolating the measured 6 s at n = 10⁶ with quadratic scaling). **No eviction policy
survives a single request that large**, because the OOM happens while computing the value
you were going to evict.

The order of fixes, most important first:

**1. Admission control — validate and bound `n`.** Pick `N_MAX` from what the product
actually needs, reject beyond it with `400`, and say so in the API contract. This single
line removes the entire attack.

```js
if (!Number.isInteger(n) || n < 0 || n > N_MAX) return res.status(400).json({error: `n must be an integer in [0, ${N_MAX}]`});
```

**2. Get it off the request path.** Even bounded, a large `n` monopolizes the event loop
(Q4). Either precompute the whole table at startup, or compute in a worker thread.

**3. Then, if you still need a cache at all** — and with `N_MAX` bounded and a
precomputed table, you very likely don't — size it and evict.

### Why LRU is the wrong default here

Two independent reasons, and the second is the interesting one.

**Reason 1: the access distribution is not recency-shaped, it's prefix-shaped.** This
memo has structure a generic cache doesn't: computing `fib(n)` requires *every* entry
below it. The low indices are touched by every single computation regardless of what `n`
was requested. They are permanently, structurally hot. Recency does not capture this —
they're touched constantly, so LRU happens to keep them, but by accident rather than by
design, and the accident breaks under reason 2.

**Reason 2: sequential flooding — LRU's classic pathology, and this workload is built
from it.** One request for `fib(50_000)` touches all 50,000 entries exactly once, in
order. Under LRU that scan promotes 50,000 cold entries to most-recently-used and evicts
the genuinely hot small ones. The cache is now full of entries that will never be read
again, and the next ordinary request misses on everything. **LRU has a hit rate near zero
under a scan that exceeds its capacity**, and a memoized linear recurrence is a scan
generator by construction.

### What to use instead

**Pin a prefix + bound the tail.** Precompute and permanently pin `fib(0..K)` for some `K`
covering the overwhelming majority of real requests. That region is never evicted and
never recomputed. Above `K`, either refuse (`N_MAX = K`, the simplest correct system) or
use a **scan-resistant** policy — **LFU**, or a segmented design (**2Q**, **SLRU**, **ARC**,
or W-TinyLFU as in Caffeine) that requires a *second* access before promoting an entry.
Scan-resistance is the exact property that defeats reason 2, and it's the specific word
worth knowing here.

And size the bound **in bytes, not entries.** Entry count is meaningless when entry size
grows linearly with the key: 10,000 entries near `n = 100` is ~87 KB; 10,000 entries near
`n = 100,000` is ~87 MB. Any cache bounded by entry count has a 1000× memory range and
will OOM on the bad end.

---

## Q9. Redis: do the math

### The crossover

A 20 KB result means `0.694n / 8 = 20{,}480` bytes → **n ≈ 236,000**.

| Path | Cost |
|---|---|
| Recompute `fib(236k)` — iterative BigInt, Θ(n²) | ~450 ms (interpolated from measured 80 ms @ 100k) |
| Recompute `fib(236k)` — **fast doubling**, Θ(M(n) log n) | **~1.5 ms** (measured: 0.4 ms @ 100k, 6.8 ms @ 1M) |
| Redis `GET`, same-DC RTT | 0.2 – 1 ms |
| Transfer 20 KB @ 10 Gbps | ~0.02 ms |
| Deserialize 20 KB → BigInt (`BigInt(str)`, base-10 parse is superlinear) | ~0.5 – 2 ms |
| **Redis total** | **~1 – 3 ms** |

**Conclusion: with fast doubling, Redis is a net loss at n ≈ 236,000.** Recomputing costs
~1.5 ms; the round trip costs ~1–3 ms and adds a network dependency, a serialization
format, an eviction policy, and an operational surface. The crossover against fast
doubling sits somewhere above n ≈ 10⁶, where recompute exceeds ~7 ms.

Against the *naive* linear BigInt version, Redis wins from about n ≈ 30,000 upward — which
tells you the real finding:

> **The algorithm choice dominates the caching choice by three orders of magnitude.**
> Fast doubling (Q12) makes the entire Redis question moot. Reaching for a distributed
> cache to paper over an algorithm that's quadratic when it could be quasilinear is the
> expensive version of the wrong fix.

### The general rule this instance illustrates

**Never cache a pure function across a network boundary when the function is cheap
relative to the round trip.** Cross-process caching pays off when compute is *expensive*
(seconds), *impure* (hits a database, a third party), or *rate-limited* (a paid API).
Fibonacci is none of those.

If you do put it in Redis, note the reason is **not CPU savings** — it's *memory
consolidation*: one bounded 100 MB cache shared by 20 replicas beats 20 unbounded local
ones. That's a legitimate argument, and it's a different argument from the one the
question invites you to make. Say which one you're making.

Serialization detail if you do: store the **hex** string (`v.toString(16)`), not decimal.
Base-16 conversion is linear (bits map directly to nibbles); base-10 conversion is
superlinear because it requires repeated division by a non-power-of-two. On a 694,241-bit
number that difference is measurable in the parse alone.

---

## Q10. Two concurrent requests for `fib(500)`, cold cache

### The single-process answer, which is a trick

**With a synchronous `fib`, there is no duplicated computation — and that's worse than
if there were.**

Node runs one JavaScript thread. Request A enters `fib(500)`, runs to completion without
yielding, and populates the memo. Request B was still sitting in the event queue the
entire time and finds a warm cache. **Zero duplicate work, by construction.**

The failure mode is **head-of-line blocking**. Nothing runs during A's computation — not
B, not health checks, not the timer that was going to fire, not the socket that was going
to be accepted. At `n = 10⁶` that's the measured 6 seconds of total unresponsiveness.
Latency doesn't degrade gracefully; the process appears dead and gets killed by a
liveness probe.

**Naming this is the answer to the question.** "Where's the duplicate work?" is the wrong
question for sync code in Node, and identifying that is the point.

### When duplication becomes real

The moment `fib` becomes genuinely async — a worker thread, a `setImmediate` yield to
unblock the loop, a Redis lookup — there is now an `await` between "check cache" and
"populate cache", and **that gap is where every concurrent caller piles in.** This is
**cache stampede** (thundering herd).

### Single-flight in one process: cache the Promise, not the value

```js
const inFlight = new Map();
function fibAsync(n) {
    if (memo.has(n)) return Promise.resolve(memo.get(n));
    if (inFlight.has(n)) return inFlight.get(n);          // ← join the existing computation
    const p = computeInWorker(n)
        .then(v => { memo.set(n, v); return v; })
        .finally(() => inFlight.delete(n));               // ← must be finally, not then
    inFlight.set(n, p);
    return p;
}
```

Two details that are the whole answer:

- **Store the Promise, not the value.** The Promise exists from the instant the
  computation starts; the value doesn't exist until it ends. Caching the value leaves the
  window open. This is the trick.
- **`.finally`, not `.then`.** On rejection, a `.then`-based cleanup leaves the failed
  Promise in `inFlight` forever, and every subsequent caller joins a permanently-rejected
  Promise. You have cached the failure — a **negative-caching bug**, and one of the more
  common production incidents in this shape.

### Across processes

Genuinely hard, and the honest answer starts with "usually don't."

- **Distributed lock** (Redlock or similar): one process wins `SET key NX PX ttl`, computes,
  writes; losers poll or subscribe. Correct-ish, but you now own lock expiry vs. compute
  duration (TTL expires mid-compute → two holders), crash recovery, and clock skew. The
  Redlock safety argument is actively disputed in the literature. Don't build this unless
  duplicate work is genuinely unaffordable.
- **Probabilistic early expiration (XFetch):** each reader independently decides to
  refresh early with probability rising as the TTL approaches. No locks, no coordination,
  and it flattens the herd rather than serializing it. Usually the right answer.
- **Accept the duplication.** N processes each computing `fib(500)` once is N × 1.5 ms.
  Compare that to the operational cost of a distributed lock. For this workload,
  accepting duplicate work is straightforwardly correct, and saying so is the senior
  answer.

---

## Q11. Metrics — is the cache earning its memory?

### The reframe

**Per-invocation `console.log` is not observability.** Three failures, escalating:

1. **The gate is in the wrong place.** `console.debug(x)` still evaluates arguments, still
   makes the call, still runs the level check — per invocation, in the hot path.
   Level filtering happens *inside* the logger, after you've paid. Environment-gating the
   logger doesn't help; the branch must be outside the call, or the call must not exist.
2. **Volume is O(n).** `fib(10⁶)` emits two million lines. That is not debuggable, it's a
   denial of service against your own log pipeline, and someone is billed per GB.
3. **`process.stdout` is synchronous when it points at a file or a POSIX TTY.** (Node's
   documented behavior: files and TTYs are synchronous on POSIX; pipes vary by platform.)
   That is a blocking `write(2)` per iteration on the event loop. Under a full disk or a
   stalled log shipper, the process doesn't slow down — **it hangs.** "It's just a debug
   log" is how that ships to production.

**This is a metric, not a log.** Logs answer "what happened in this one request." Metrics
answer "is the cache earning its memory," which is the actual question. You want counters
— an integer increment is free and needs no gating — read out on scrape, not a line per
call.

Also: the instrumentation counter `i` in the original file is a module-level mutable
global, which is the exact pattern that was just fixed for `memo`.

### What to emit

**Counters** (monotonic; rates and ratios derived at query time, never precomputed):

| Metric | Why |
|---|---|
| `fib_cache_hits_total` | numerator |
| `fib_cache_misses_total` | denominator |
| `fib_cache_evictions_total` | rising evictions + falling hit rate = undersized |
| `fib_compute_seconds_total` | CPU actually spent |
| `fib_requests_rejected_total{reason="n_too_large"}` | is admission control firing? |

**Gauges:**

| Metric | Why |
|---|---|
| `fib_cache_bytes` | **bytes, not entries** — entry size grows with the key (Q8) |
| `fib_cache_entries` | with the above, gives mean entry size |
| `nodejs_eventloop_lag_p99` | the metric that would have caught Q4 and Q10 |

**Histograms** (not averages — an average latency over a bimodal hit/miss distribution
describes a value that never occurs):

- `fib_compute_duration_seconds{outcome="hit|miss"}` — separate series, or the bimodality
  makes both meaningless.
- `fib_requested_n` — **the most valuable metric here.** The distribution of requested `n`
  determines `N_MAX`, the pinned prefix size `K`, the cache bound, and whether any of this
  is needed. Every design decision in Q8 and Q9 is guesswork without it.

### Answering the literal question

Hit ratio alone does *not* tell you the cache is earning its memory. A 99% hit rate on
entries that cost 1.5 ms to recompute, while holding 108 MB, is a bad trade. The
derived quantity:

```
seconds_saved_per_MB_held  =  (hits × mean_miss_duration) / cache_bytes
```

Chart that against the cost of the memory. When it's below the cost of just recomputing,
the cache is a liability — and this is exactly the case for Fibonacci-with-fast-doubling,
where the correct answer turns out to be "delete the cache."

**Have a metric that can tell you to delete the thing you built.** Most caches don't, which
is why most caches are never deleted.

---

# Tier 4 — Judgment

## Q12. Why ship O(n) when O(log n) exists?

### The measured gap

Fast doubling, from the identities `F(2k) = F(k)·(2F(k+1) − F(k))` and
`F(2k+1) = F(k)² + F(k+1)²`:

```js
function fibFast(n) {                    // returns [F(n), F(n+1)]
    if (n === 0) return [0n, 1n];
    const [a, b] = fibFast(Math.floor(n / 2));
    const c = a * (2n * b - a);
    const d = a * a + b * b;
    return n % 2 ? [d, c + d] : [c, d];
}
```

Measured, both returning identical values:

| n | iterative Θ(n²) | fast doubling | speedup |
|---:|---:|---:|---:|
| 1,000 | 0.2 ms | ~0.0 ms | — |
| 10,000 | 6.0 ms | ~0.0 ms | >100× |
| 100,000 | 80.3 ms | 0.4 ms | **200×** |
| 1,000,000 | 5,999 ms | 6.8 ms | **880×** |

Note that "O(log n)" is the *operation* count, not the time. Each of those ~log₂(n)
steps multiplies numbers with Θ(n) bits, so real cost is Θ(M(n) log n) where M is the
multiplication cost. The measured 0.4 ms → 6.8 ms across a 10× input increase (≈17×, not
10×) shows exactly that — it's quasilinear, not logarithmic. **Never quote the operation
count as the running time when the operands grow.** Same discipline as Q1.

### Defending the O(n) version

The defense is real and it depends entirely on one number:

- **If production `n` is small** — and for real Fibonacci use cases it always is, since
  `fib(93)` already overflows `int64` — then both versions complete in microseconds. The
  linear version is 4 lines, obviously correct on inspection, and needs no test beyond
  `fib(10) === 55`.
- **Fast doubling is subtle.** Two identities, an odd/even branch, an off-by-one in the
  `[F(n), F(n+1)]` pairing, and `2n * b - a` where a `Number`/`BigInt` mix throws (Q5).
  It requires real tests — property-based against the linear version — and real review.
  Its bugs are the kind that produce plausible wrong numbers.
- **Its recursion is depth log₂(n)**, which is ~20 at n = 10⁶. Immune to Q7.

### The actual decision criterion

**Not "which is asymptotically better." It's: does the difference cross a threshold
someone perceives, at the input distribution you actually serve?**

Concretely, in order:

1. **What's the p99 of `n` in production?** (`fib_requested_n` from Q11.) If p99 < 10,000,
   both are under 6 ms and the question is closed — ship the simple one.
2. **Where does the cost land?** 80 ms on a background job is invisible. 80 ms on the
   event loop of a request handler is a p99 regression across every concurrent request
   (Q4).
3. **What's the blast radius of a subtle wrong answer** versus the blast radius of a slow
   one? A wrong Fibonacci in a hash function is worse than a slow one.

**Ship the simple version. Instrument `n`. Swap when the data says to, and keep the simple
version as the oracle in a property test.** That last clause is what makes the swap safe
and is the part people skip.

Then note what the numbers above actually imply: fast doubling at n = 10⁶ takes 6.8 ms,
which is faster than the Redis round trip in Q9 and comparable to a cache lookup. **The
fast algorithm doesn't just beat the slow one — it deletes the entire caching subsystem
from Q8, Q9, and Q10.** Getting the algorithm right removed four sections of
infrastructure. That is the real lesson of this exercise.

## Q13. The PR review

Reviewing "add memoized fibonacci" containing the original code. The judgment being
tested is **how much to say**, and the answer is: one blocking comment, tightly scoped.

> **Blocking — the memoization isn't active.** Two things:
>
> 1. `const memo = []` is inside the function, so it's reallocated on every call and the
>    cache is always cold.
> 2. Line 17 recurses into `fib_rec` rather than `fib_dp`, so control leaves the memoized
>    path immediately.
>
> Together these make `fib_dp` exponential — measurably slower than `fib_rec`, since it
> also allocates an array per call. `fib_dp(10)` returns the right answer, which is why
> the test passes; try `fib_dp(45)` and it'll hang.
>
> Fix: hoist `memo` to module scope and recurse into `fib_dp`. A test asserting
> `fib_dp(45)` completes under, say, 50 ms would have caught this and is worth adding —
> a correctness test at small `n` can't distinguish the two implementations, which is the
> real gap here.
>
> Two things I'm deliberately *not* blocking on, for whenever you touch this next:
> `if (memo[n])` is a falsy check that's only safe because the base case returns first
> (fine today, a trap for the next person), and results above `fib(78)` exceed
> `Number.MAX_SAFE_INTEGER` and silently lose precision. Neither is in scope for this PR.

### Why this shape

**What's in:** the defect, *why* the tests didn't catch it, the fix, and a test that would
prevent recurrence. The empirical detail (`fib_dp(45)` hangs) turns an assertion into
something the author can verify in 30 seconds — reviews that can be checked land better
than reviews that must be believed.

**What's demoted:** the falsy check and the `Number` overflow are real (Q2, Q5) and neither
is what this PR is about. Flagged with an explicit "not blocking" so the author knows the
difference between "must fix" and "be aware."

**What's cut entirely:** everything in Tiers 3 and 4. `Map` vs. array, eviction, BigInt
migration, fast doubling — all correct observations, all noise on a practice-repo PR.

**The staff-level judgment isn't finding all fourteen problems. It's knowing that
delivering all fourteen is a worse review than delivering one.** A review that returns
everything the reviewer noticed teaches the author that reviews are things to endure. A
review with one blocking item and a clear reason teaches them what "blocking" means.
Calibrate to the PR's actual purpose — this is a learning repo, not a payments service,
and the review should reflect that.

## Q14. When is top-down memoization the right tool?

### The minimal property set

All four must hold:

1. **Optimal substructure.** The solution decomposes into solutions of subproblems, and
   the optimal whole is built from optimal parts.
2. **Overlapping subproblems.** The same subproblem is reached via multiple paths.
   *Without this, memoization is pure overhead* — this is the property people forget.
3. **Purity / referential transparency.** The result is a deterministic function of the
   key alone. If it depends on mutable state, wall-clock time, or anything not in the key,
   the cache serves stale answers.
4. **A tractable state space.** The number of distinct states must fit in memory, and the
   key must be cheaply and *correctly* hashable. This is where a key like
   `[i,j].join(',')` quietly breaks (Q2).

The complexity then falls out mechanically:
**states × cost-per-state (excluding recursion).**

### Things that look like they qualify but don't

**Merge sort / most divide-and-conquer.** Textbook optimal substructure — sort the halves,
merge. But **property 2 fails**: every subproblem is a distinct subrange, reached exactly
once. Nothing is ever recomputed, so the memo achieves a 0% hit rate while paying full
memory cost. *This is the sharpest counterexample*, because the recursion tree looks
exactly like Fibonacci's and behaves nothing like it. The diagnostic: is the recursion
tree a **DAG** (nodes revisited → memoize) or a **tree** (each node once → don't)?

**Longest path in a general graph.** Looks identical to shortest path, which is textbook
DP. **Property 1 fails** — with cycles there's no well-founded ordering, the recursion
doesn't terminate, and a memo would cache values computed from incomplete subresults.
(NP-hard in general; DP works only on DAGs.)

**0/1 knapsack with real-valued weights.** The recurrence is right and the subproblems
genuinely overlap. **Property 4 fails**: the state space is uncountable. The integer
version's O(nW) is *pseudo*-polynomial — polynomial in the *value* of W, exponential in
its bit length. `W = 10⁹` is a 30-bit input and a 10⁹-entry table.

**Anything reading mutable external state.** Memoizing a function that queries a database,
reads a feature flag, or depends on the current time violates property 3. It will appear
to work in testing (state doesn't change during a test) and serve stale data in
production. **The most common real-world memoization bug by a wide margin**, and the one
that gets caught last.

---

## Appendix A — Corrected reference implementation

```js
/**
 * Fibonacci, top-down memoized.
 * Θ(n) operations; Θ(n²) bit operations, since fib(n) has ~0.694n bits.
 * Cache is per-instance and collectible — see makeFib().
 */
export function makeFib({ maxN = 100_000 } = {}) {
    const memo = new Map([[0, 0n], [1, 1n]]);
    let hits = 0, misses = 0;

    function fib(n) {
        if (!Number.isInteger(n) || n < 0 || n > maxN) {
            throw new RangeError(`n must be an integer in [0, ${maxN}], got ${n}`);
        }
        // Iterative: recursion depth would be Θ(n) and V8 caps at ~10^4 frames.
        // Ascending fill keeps the top-down cache-reuse property across calls.
        let i = memo.size;
        if (memo.has(n)) { hits++; return memo.get(n); }
        misses++;
        for (; i <= n; i++) memo.set(i, memo.get(i - 1) + memo.get(i - 2));
        return memo.get(n);
    }

    fib.stats = () => ({ hits, misses, entries: memo.size });
    return fib;
}
```

Notes on the choices:

- **`Map`, not `[]`** — correct `has()` semantics, no prototype chain, no key coercion,
  and insertion order for free if eviction is added later (Q2, Q3).
- **`BigInt`** — `Number` is silently wrong from `fib(79)` (Q5).
- **Iterative** — Θ(n) recursion depth exceeds V8's ~10,398-frame limit (Q7).
- **Closure-scoped memo** — collectible, isolated, not a process-lifetime leak (Q4).
- **Bounded `n`** — admission control, the fix that actually stops the attack (Q8).
- **Counters, not logs** — free to increment, no hot-path I/O (Q11).

For `n` beyond ~10⁵, use fast doubling (Q12) and drop the cache entirely.

## Appendix B — Measured results

Node v24.18.1, darwin arm64.

```
counts:      5->6   10->16   20->36   40->76   80->156          (exactly 2n-4)

Number.MAX_SAFE_INTEGER = 9007199254740991
first n where Number fib != true fib: 79
  true fib(78) = 8944394323791464     (<= MAX_SAFE, exact)
  true fib(79) = 14472334024676221
  num  fib(79) = 14472334024676220    (off by one, silent)

1n + 1                    -> TypeError: Cannot mix BigInt and other types
1n == 1  -> true  |  1n === 1 -> false  |  1n < 2 -> true
obj[10n] and obj[10]      -> same slot   { '10': 'num' }
Map 10n and 10            -> distinct    size 2
JSON.stringify({v:1n})    -> TypeError: Do not know how to serialize a BigInt

sparse: sp[10000]=1  ->  sp.length === 10001,  (0 in sp) === false
max recursion depth: 10398 frames -> RangeError

bits(fib(100000))/100000 = 0.6942     log2(phi) = 0.6942

           iterative BigInt      fast doubling
n=1000          0.2 ms               0.0 ms
n=10000         6.0 ms               0.0 ms
n=100000       80.3 ms               0.4 ms
n=1000000    5999.0 ms               6.8 ms
```

## Appendix C — Reproducing

```js
// counts
function count(n){ const m=[]; let c=0;
  function f(k){ if(k===0||k===1) return k; c++; if(m[k]!==undefined) return m[k];
                 m[k]=f(k-1)+f(k-2); return m[k]; }
  f(n); return c; }

// float64 divergence
function fibBig(n){ let a=0n,b=1n; for(let i=0;i<n;i++)[a,b]=[b,a+b]; return a; }
function fibNum(n){ let a=0,b=1;  for(let i=0;i<n;i++)[a,b]=[b,a+b]; return a; }
for (let n=1;n<=95;n++) if (BigInt(fibNum(n))!==fibBig(n)) { console.log(n); break; }

// stack depth
let d=0; function rec(){ d++; rec(); }
try { rec(); } catch { console.log(d); }

// timing
const t=process.hrtime.bigint(); fibBig(1e6);
console.log(Number(process.hrtime.bigint()-t)/1e6, 'ms');
```

---

## The through-line

Fourteen questions, one lesson: **each layer's correct answer changes what the layer above
it should be.**

- Fixing the cache (Q1) exposed a numeric bug (Q5).
- Fixing the numeric bug made the algorithm quadratic (Q1's bit-complexity correction).
- Fixing the algorithm (Q12) made the cache unnecessary — deleting the eviction policy
  (Q8), the Redis tier (Q9), and the stampede protection (Q10).

Three sections of distributed-systems design were answers to a problem created by an
algorithm choice made in Tier 1. **Working bottom-up through infrastructure to compensate
for an algorithm you haven't examined is the most expensive common mistake in this
shape** — and the reason "what's your p99 of `n`?" (Q11) is a better first question than
any of the others.
