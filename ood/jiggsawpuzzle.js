/*
Design a system that models a jigsaw puzzle and can determine whether two pieces fit together.
A jigsaw puzzle piece has four sides: top, right, bottom, left. Each side has a type: either a "tab" (an outward bump) or a "blank" (an inward socket) or "flat" (a straight edge, only found on the border of the puzzle).
A tab and a blank of the same shape fit together. Two tabs do not fit. Two blanks do not fit. Two flat edges do not fit.
Each tab or blank has a shape identifier (a number or string). A tab fits a blank ONLY if their shape identifiers match.
Design the data model and provide these operations:

Piece: represents a puzzle piece with four sides
Side: represents one side of a piece with type and shape
matches(sideA, sideB): returns true if these two sides can connect
assemble(pieces): given a list of pieces, arrange them into a solved puzzle grid. Return the 2D arrangement or throw if unsolvable.

Requirements:

Model as classes
Support the matching operation
Support the full assembly
Handle corner and edge pieces correctly (they have flat sides)
Provide a way to inspect the arrangement (for tests)


4 sides 
- each side has a type : tab / blank / flat

A tab and a blank of the same shape fit together. 
Two tabs do not fit. 
Two blanks do not fit. 
Two flat edges do not fit.
Each tab or blank has a shape identifier (a number or string). 
A tab fits a blank ONLY if their shape identifiers match.
Design the data model and provide these operations:

-- Class Model

Class: Puzzle 
-- attributes
grid: String[][]

-- methods
assemble(pieces: Pieces[]) : String[][]
matches(sideA, sideB): Boolean
getGrid() : String[][]

Class: Piece
-- attributes
sides: String[] // 4 length, 0--> tp, 1-->right, 2-->bottom, 3-->left
                // eg. values will be of side values.

Reference below.

## Jigsaw Puzzle — Reference Design

### Clarifying questions to have ready

1. Are grid dimensions passed in, or derived from piece count?
2. **Can pieces be rotated during assembly?** (Yes = 4x search space)
3. **Unique solution guaranteed, or multiple valid?**
4. Corner/edge/interior counts validated by assemble(), or trusted from caller?
5. Complexity constraint: correctness only, or efficient required?

Rotation and unique-fit are the two you MUST ask. They change the algorithm.

### Class model

```
class Side
  type:  'tab' | 'blank' | 'flat'
  shape: number | null      // null when type is 'flat'

class Piece
  id:    string
  sides: [Side, Side, Side, Side]   // [top, right, bottom, left]
  
  static matches(sideA, sideB): boolean
    // tab-X fits blank-X
    // tab-tab, blank-blank, flat-flat all return false
    // any pair with mismatched shape returns false

class Puzzle
  rows, cols: number
  grid: Piece[][]
  
  constructor(rows, cols)
  assemble(pieces: Piece[]): void
  getGrid(): Piece[][]        // returns copy
```

Two classes plus a static match on Piece. Not three-plus-collection. Side is worth its own class for testability of matches().

### OOD pattern

**Backtracking / constraint satisfaction.** You place pieces into slots. Slots have constraints (which sides must be flat, which must match neighbors). Try a placement, check constraints, backtrack if invalid, repeat. Same family as N-Queens and Sudoku solvers.

Say this word aloud in the interview: **"This is backtracking."** Interviewer immediately knows you have the pattern.

### Assembly algorithm

1. **Classify pieces.** Corners have 2 adjacent flat sides. Edges have exactly 1 flat side. Interior have 0.
2. **Validate composition.** For M x N: exactly 4 corners, exactly 2*(M-2) + 2*(N-2) edges, rest interior. Throw if wrong.
3. **Place corner at (0, 0).** Its flat sides face top and left. There may be up to 4 valid corners; try each on backtrack.
4. **Fill row 0** with edges: top is flat, left matches previous piece's right.
5. **Fill column 0** similarly: left is flat, top matches piece above.
6. **Fill interior** row by row: match left to piece to the left, match top to piece above.
7. **Backtrack** if no valid piece found for a slot.

### Edge cases to flag unprompted

- Rotation multiplies search space by 4^N. Ask before assuming.
- Ambiguous pieces: multiple pieces with identical side signatures. Any valid answer is fine but note it.
- Malformed input: interior piece with a flat side, wrong corner count, etc.
- Border consistency: two flats on adjacent sides = corner. Two flats on opposite sides = malformed.

### Above-and-beyond phrases (memorize)

- **"I separated Side into its own class so matches() is testable without instantiating Pieces."**
- **"For scale, I'd add a side-signature index: hashmap from side profile to list of pieces with that profile. Each slot fill goes from O(N) scan to O(1) lookup."**
- **"Extension: rotation. Add piece.rotate() and try all 4 orientations at each placement. Multiplies search but same algorithm."**

*/
/*
class Side {
    constructor(type, shape = null) {
        this.type = type;      // 'tab' | 'blank' | 'flat'
        this.shape = shape;    // number, null when flat
    }

    static matches(a, b) {
        if (a.type === 'flat' || b.type === 'flat') return false;
        if (a.type === b.type) return false;      // tab-tab, blank-blank
        return a.shape === b.shape;
    }
}

class Piece {
    constructor(id, top, right, bottom, left) {
        this.id = id;
        this.sides = [top, right, bottom, left];
    }
    get top()    { return this.sides[0]; }
    get right()  { return this.sides[1]; }
    get bottom() { return this.sides[2]; }
    get left()   { return this.sides[3]; }
    flatCount()  { return this.sides.filter(s => s.type === 'flat').length; }
}

class Puzzle {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = null;
    }

    assemble(pieces) {
        const grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        const used = new Set();
        if (this._solve(grid, used, pieces, 0)) {
            this.grid = grid;
            return grid;
        }
        throw new Error('Puzzle is unsolvable');
    }

    _solve(grid, used, pieces, slotIndex) {
        if (slotIndex === this.rows * this.cols) return true;   // base case: all slots filled

        const r = Math.floor(slotIndex / this.cols);
        const c = slotIndex % this.cols;

        // Compute what this slot requires
        const topConstraint   = r === 0 ? 'flat' : grid[r - 1][c].bottom;
        const leftConstraint  = c === 0 ? 'flat' : grid[r][c - 1].right;
        const needsBottomFlat = r === this.rows - 1;
        const needsRightFlat  = c === this.cols - 1;

        // Try every unused piece
        for (const piece of pieces) {
            if (used.has(piece.id)) continue;
            if (!this._pieceFits(piece, topConstraint, leftConstraint, needsBottomFlat, needsRightFlat)) continue;

            grid[r][c] = piece;
            used.add(piece.id);

            if (this._solve(grid, used, pieces, slotIndex + 1)) return true;

            // Backtrack
            grid[r][c] = null;
            used.delete(piece.id);
        }
        return false;
    }

    _pieceFits(piece, topC, leftC, needsBottomFlat, needsRightFlat) {
        if (topC === 'flat') {
            if (piece.top.type !== 'flat') return false;
        } else if (!Side.matches(piece.top, topC)) return false;

        if (leftC === 'flat') {
            if (piece.left.type !== 'flat') return false;
        } else if (!Side.matches(piece.left, leftC)) return false;

        if (needsBottomFlat && piece.bottom.type !== 'flat') return false;
        if (needsRightFlat  && piece.right.type  !== 'flat') return false;
        return true;
    }
}
*/
/**
 * Jigsaw Puzzle - Self-contained extended test suite
 * Includes Puzzle/Piece/Side + 7 test cases
 */

class Side {
    constructor(type, shape = null) {
        this.type = type;
        this.shape = shape;
    }
    static matches(a, b) {
        if (a.type === 'flat' || b.type === 'flat') return false;
        if (a.type === b.type) return false;
        return a.shape === b.shape;
    }
}

class Piece {
    constructor(id, top, right, bottom, left) {
        this.id = id;
        this.sides = [top, right, bottom, left];
    }
    get top()    { return this.sides[0]; }
    get right()  { return this.sides[1]; }
    get bottom() { return this.sides[2]; }
    get left()   { return this.sides[3]; }
    flatCount()  { return this.sides.filter(s => s.type === 'flat').length; }
}

class Puzzle {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = null;
    }
    assemble(pieces) {
        const grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        const used = new Set();
        if (this._solve(grid, used, pieces, 0)) {
            this.grid = grid;
            return grid;
        }
        throw new Error('Puzzle is unsolvable');
    }
    _solve(grid, used, pieces, slotIndex) {
        if (slotIndex === this.rows * this.cols) return true;
        const r = Math.floor(slotIndex / this.cols);
        const c = slotIndex % this.cols;
        const topC   = r === 0 ? 'flat' : grid[r - 1][c].bottom;
        const leftC  = c === 0 ? 'flat' : grid[r][c - 1].right;
        const needsBottomFlat = r === this.rows - 1;
        const needsRightFlat  = c === this.cols - 1;
        for (const piece of pieces) {
            if (used.has(piece.id)) continue;
            if (!this._pieceFits(piece, topC, leftC, needsBottomFlat, needsRightFlat)) continue;
            grid[r][c] = piece;
            used.add(piece.id);
            if (this._solve(grid, used, pieces, slotIndex + 1)) return true;
            grid[r][c] = null;
            used.delete(piece.id);
        }
        return false;
    }
    _pieceFits(piece, topC, leftC, needsBottomFlat, needsRightFlat) {
        if (topC === 'flat') {
            if (piece.top.type !== 'flat') return false;
        } else if (!Side.matches(piece.top, topC)) return false;
        if (leftC === 'flat') {
            if (piece.left.type !== 'flat') return false;
        } else if (!Side.matches(piece.left, leftC)) return false;
        if (needsBottomFlat && piece.bottom.type !== 'flat') return false;
        if (needsRightFlat  && piece.right.type  !== 'flat') return false;
        return true;
    }
    getGrid() {
        if (!this.grid) return null;
        return this.grid.map(row => row.slice());
    }
}

// ==================== Tests ====================

function assert(cond, msg) {
    if (cond) console.log('PASS:', msg);
    else { console.error('FAIL:', msg); process.exit(1); }
}

const flat  = ()      => new Side('flat');
const tab   = (shape) => new Side('tab', shape);
const blank = (shape) => new Side('blank', shape);

console.log('\n=== Test 1: 2x2 with ordered input ===');
{
    const A = new Piece('A', flat(),   tab(1),   tab(2),   flat());
    const B = new Piece('B', flat(),   flat(),   tab(3),   blank(1));
    const C = new Piece('C', blank(2), tab(4),   flat(),   flat());
    const D = new Piece('D', blank(3), flat(),   flat(),   blank(4));
    const puzzle = new Puzzle(2, 2);
    const solution = puzzle.assemble([A, B, C, D]);
    assert(solution[0][0].id === 'A', 'ordered: (0,0) is A');
    assert(solution[1][1].id === 'D', 'ordered: (1,1) is D');
}

console.log('\n=== Test 2: 2x2 with scrambled input ===');
{
    const A = new Piece('A', flat(),   tab(1),   tab(2),   flat());
    const B = new Piece('B', flat(),   flat(),   tab(3),   blank(1));
    const C = new Piece('C', blank(2), tab(4),   flat(),   flat());
    const D = new Piece('D', blank(3), flat(),   flat(),   blank(4));
    const puzzle = new Puzzle(2, 2);
    const solution = puzzle.assemble([D, C, B, A]);
    assert(solution[0][0].id === 'A', 'scrambled: (0,0) is A');
    assert(solution[0][1].id === 'B', 'scrambled: (0,1) is B');
    assert(solution[1][0].id === 'C', 'scrambled: (1,0) is C');
    assert(solution[1][1].id === 'D', 'scrambled: (1,1) is D');
}

console.log('\n=== Test 3: Unsolvable throws ===');
{
    const A = new Piece('A', flat(),   tab(1),   tab(2),   flat());
    const B = new Piece('B', flat(),   flat(),   tab(3),   blank(1));
    const C = new Piece('C', blank(2), tab(4),   flat(),   flat());
    const badD = new Piece('badD', blank(99), flat(), flat(), blank(99));
    let threw = false;
    try {
        new Puzzle(2, 2).assemble([A, B, C, badD]);
    } catch (e) { threw = true; }
    assert(threw, 'no valid arrangement: throws');
}

console.log('\n=== Test 4: 3x3 with interior piece ===');
{
    const A = new Piece('A', flat(),   tab(1),   tab(7),   flat());
    const B = new Piece('B', flat(),   tab(2),   tab(9),   blank(1));
    const C = new Piece('C', flat(),   flat(),   tab(11),  blank(2));
    const D = new Piece('D', blank(7), tab(3),   tab(8),   flat());
    const M = new Piece('M', blank(9), tab(4),   tab(10),  blank(3));
    const E = new Piece('E', blank(11),flat(),   tab(12),  blank(4));
    const F = new Piece('F', blank(8), tab(5),   flat(),   flat());
    const G = new Piece('G', blank(10),tab(6),   flat(),   blank(5));
    const H = new Piece('H', blank(12),flat(),   flat(),   blank(6));
    const puzzle = new Puzzle(3, 3);
    const solution = puzzle.assemble([H, G, F, E, M, D, C, B, A]);
    assert(solution[0][0].id === 'A', '3x3: (0,0) is A');
    assert(solution[0][1].id === 'B', '3x3: (0,1) is B');
    assert(solution[1][1].id === 'M', '3x3: (1,1) is M (interior)');
    assert(solution[2][2].id === 'H', '3x3: (2,2) is H');
    assert(M.flatCount() === 0, 'M has zero flat sides');
}

console.log('\n=== Test 5: All-flat piece cannot fit in 2x2 ===');
{
    const impossible = new Piece('X', flat(), flat(), flat(), flat());
    const A = new Piece('A', flat(),   tab(1),   tab(2),   flat());
    const B = new Piece('B', flat(),   flat(),   tab(3),   blank(1));
    const C = new Piece('C', blank(2), tab(4),   flat(),   flat());
    let threw = false;
    try {
        new Puzzle(2, 2).assemble([A, B, C, impossible]);
    } catch (e) { threw = true; }
    assert(threw, 'all-flat piece cannot complete 2x2: throws');
}

console.log('\n=== Test 6: getGrid returns a copy ===');
{
    const A = new Piece('A', flat(),   tab(1),   tab(2),   flat());
    const B = new Piece('B', flat(),   flat(),   tab(3),   blank(1));
    const C = new Piece('C', blank(2), tab(4),   flat(),   flat());
    const D = new Piece('D', blank(3), flat(),   flat(),   blank(4));
    const puzzle = new Puzzle(2, 2);
    puzzle.assemble([A, B, C, D]);
    const copy = puzzle.getGrid();
    copy[0][0] = null;
    assert(puzzle.getGrid()[0][0].id === 'A', 'mutating returned grid does not affect internal');
}

console.log('\n=== Test 7: Side.matches unit tests ===');
{
    assert(Side.matches(tab(5), blank(5))   === true,  'tab-5 fits blank-5');
    assert(Side.matches(blank(5), tab(5))   === true,  'blank-5 fits tab-5 (symmetric)');
    assert(Side.matches(tab(5), tab(5))     === false, 'tab-tab does NOT fit');
    assert(Side.matches(blank(5), blank(5)) === false, 'blank-blank does NOT fit');
    assert(Side.matches(tab(5), blank(6))   === false, 'shape mismatch: no fit');
    assert(Side.matches(flat(), tab(5))     === false, 'flat never fits anything');
    assert(Side.matches(flat(), flat())     === false, 'flat-flat: no fit');
}

console.log('\n=== All Jigsaw tests passed ===');


