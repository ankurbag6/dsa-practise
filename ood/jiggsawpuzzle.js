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