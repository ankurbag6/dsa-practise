/*
Design and implement a two-player turn-based board game called Cats and Rabbits.
The board is a 7x7 grid. Each player has three types of pieces:

Cat: moves ONE square per turn in any of the 8 directions (like a chess king). A Cat captures an opponent's Cat or Rabbit by moving onto its square.
Rabbit: moves TWO squares per turn, but only in the 4 cardinal directions (up, down, left, right). Cannot move diagonally. A Rabbit captures an opponent's Cat or Rabbit by landing on its square. Rabbit CANNOT jump over pieces; the intermediate square must be empty.
Snail: does not move. Purely defensive. Blocks squares.

Each player starts with 2 Cats, 2 Rabbits, and 1 Snail. Starting positions are given at construction.
Players alternate turns. On each turn, a player selects one of their pieces and moves it (Snails cannot be selected).
Loss condition (called "danger"): if a player has zero Cats AND zero Rabbits remaining (only Snails left, or nothing left), they lose. The other player wins.
Draw condition: if a player has no legal move on their turn (all their movable pieces are blocked), the game is a draw.
Provide:

move(player, pieceId, targetX, targetY): attempt a move. Return true if legal, false otherwise.
winner(): return 'player1', 'player2', 'draw', or null (game ongoing).
getBoard(): for tests.

Questions:
------------
1. Can the grid row, columns be changed? if yes is the requirement is to have a square matrix?
2. Is there a identifier for each player
3. Can cat jump a opponent?
4. Does the starting positions of all the pieces be random? What if all the pieces are blocked to move?


2 players
3 types of pieces
- cat: moves 1 square in 8 dir, captures cat or rabbit
- rabbit: moves 2 sqare, 4 directions, no diagonal, captures cat or rabbit
- snail : no moves. block

Class Model
-------

```
class Piece
  id:       string
  type:     'cat' | 'rabbit' | 'snail'
  playerId: 'player1' | 'player2'

class Game
  rows, cols:    number
  grid:          (Piece | null)[][]
  currentTurn:   'player1' | 'player2'
  winnerFlag:    'player1' | 'player2' | 'draw' | null
  
  constructor(rows=7, cols=7, initialPieces)
  move(playerId, pieceId, targetX, targetY): boolean
  winner(): 'player1' | 'player2' | 'draw' | null
  getBoard(): (Piece | null)[][]        // returns copy
  
  // Private
  _findPiece(pieceId): {piece, x, y} | null
  _isLegalMove(piece, fromX, fromY, toX, toY): boolean
  _getMovesForType(type, fromX, fromY): [(x, y), ...]
  _isPathClear(fromX, fromY, toX, toY): boolean      // for rabbit
  _capture(x, y): void                                // remove target piece
  _hasAnyLegalMove(playerId): boolean
  _playerInDanger(playerId): boolean                  // 0 cats AND 0 rabbits
  _switchTurn(): void
```
MOve Algoraithm

move(playerId, pieceId, targetX, targetY):
  1. reject if not currentTurn
  2. reject if game already over
  3. find piece by pieceId
  4. reject if piece.playerId !== playerId
  5. reject if piece.type === 'snail'
  6. compute legal moves for piece.type
  7. reject if (targetX, targetY) not in legal moves
  8. if target square occupied:
     - reject if own piece
     - capture if opponent piece
  9. for rabbit: reject if path not clear
  10. update grid: remove from old position, place at new position
  11. check opponent's danger. if in danger, currentPlayer wins.
  12. else switch turn
  13. after switch, check if new currentTurn has any legal move. if not, draw.
  14. return true

Above-and-beyond phrases

"I put move-rule logic in _getMovesForType, keyed on piece type. Extending to a new piece type (e.g. Fox) is one new case in a switch, not changes across the codebase."
"Danger check happens after every move, not just at end-of-game. This handles the case where Player 1's last Cat gets captured by Player 2's move."
"Draw is checked at the START of a player's turn, before they move. If they have no legal move, they lose their turn and the game ends."
"For scale: the board is 7x7, but the algorithm generalizes to N x N. Legal-move computation is O(1) per piece with fixed move patterns."


*/

/**
 * Cats and Rabbits - Full reference solution
 * Pattern: turn-based state machine with polymorphic move rules per piece type
 */

class Piece {
    constructor(id, type, playerId) {
        // type: 'cat' | 'rabbit' | 'snail'
        // playerId: 'player1' | 'player2'
        this.id = id;
        this.type = type;
        this.playerId = playerId;
    }
}

class Game {
    /**
     * @param {number} rows
     * @param {number} cols
     * @param {Array} initialPieces - [{playerId, pieceId, type, x, y}, ...]
     */
    constructor(rows = 7, cols = 7, initialPieces = []) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({ length: rows }, () => Array(cols).fill(null));
        this.currentTurn = 'player1';
        this.winnerFlag = null;

        for (const spec of initialPieces) {
            if (this._inBounds(spec.x, spec.y) === false) {
                throw new Error(`Initial piece out of bounds: (${spec.x}, ${spec.y})`);
            }
            if (this.grid[spec.x][spec.y] !== null) {
                throw new Error(`Two pieces on same cell: (${spec.x}, ${spec.y})`);
            }
            this.grid[spec.x][spec.y] = new Piece(spec.pieceId, spec.type, spec.playerId);
        }

        // Draw check at very start (edge case: someone constructed a locked position)
        this._checkDrawForCurrentTurn();
    }

    // ---------- Public API ----------

    /**
     * Attempt a move. Return true if legal, false otherwise.
     */
    move(playerId, pieceId, targetX, targetY) {
        if (this.winnerFlag !== null) return false;
        if (playerId !== this.currentTurn) return false;

        const found = this._findPiece(pieceId);
        if (!found) return false;
        const { piece, x: fromX, y: fromY } = found;

        if (piece.playerId !== playerId) return false;
        if (piece.type === 'snail') return false;
        if (!this._inBounds(targetX, targetY)) return false;

        const legalMoves = this._getMovesForType(piece.type, fromX, fromY);
        if (!legalMoves.some(([x, y]) => x === targetX && y === targetY)) return false;

        // Target cell rules
        const target = this.grid[targetX][targetY];
        if (target !== null && target.playerId === playerId) return false;   // own piece
        // opponent piece: this is a capture
        // empty cell: normal move

        // Rabbit path check
        if (piece.type === 'rabbit' && !this._isPathClearForRabbit(fromX, fromY, targetX, targetY)) {
            return false;
        }

        // Execute move (capture if target occupied)
        this.grid[targetX][targetY] = piece;
        this.grid[fromX][fromY] = null;

        // Check if opponent is in danger AFTER the move
        const opponent = this._opponentOf(playerId);
        if (this._playerInDanger(opponent)) {
            this.winnerFlag = playerId;
            return true;
        }

        // Switch turn, then check for draw at new player's turn start
        this.currentTurn = opponent;
        this._checkDrawForCurrentTurn();
        return true;
    }

    winner() {
        return this.winnerFlag;
    }

    getBoard() {
        return this.grid.map(row => row.slice());   // shallow copy of rows
    }

    // ---------- Private helpers ----------

    _inBounds(x, y) {
        return x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    }

    _opponentOf(playerId) {
        return playerId === 'player1' ? 'player2' : 'player1';
    }

    _findPiece(pieceId) {
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const p = this.grid[x][y];
                if (p && p.id === pieceId) return { piece: p, x, y };
            }
        }
        return null;
    }

    /**
     * Legal (possibly blocked) destinations for a piece of the given type
     * starting from (x, y). Returns [[x, y], ...].
     */
    _getMovesForType(type, x, y) {
        if (type === 'cat') {
            // 8 directions, 1 step
            const dirs = [
                [-1, -1], [-1, 0], [-1, 1],
                [ 0, -1],          [ 0, 1],
                [ 1, -1], [ 1, 0], [ 1, 1],
            ];
            return dirs
                .map(([dx, dy]) => [x + dx, y + dy])
                .filter(([nx, ny]) => this._inBounds(nx, ny));
        }
        if (type === 'rabbit') {
            // 4 cardinal directions, exactly 2 steps
            const dirs = [[-2, 0], [2, 0], [0, -2], [0, 2]];
            return dirs
                .map(([dx, dy]) => [x + dx, y + dy])
                .filter(([nx, ny]) => this._inBounds(nx, ny));
        }
        return [];   // snail: no moves
    }

    /**
     * For a rabbit moving exactly 2 squares in a cardinal direction,
     * the intermediate square must be empty.
     */
    _isPathClearForRabbit(fromX, fromY, toX, toY) {
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        return this.grid[midX][midY] === null;
    }

    /**
     * Player is in danger (has lost) when they have zero Cats AND zero Rabbits.
     */
    _playerInDanger(playerId) {
        let cats = 0, rabbits = 0;
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const p = this.grid[x][y];
                if (!p || p.playerId !== playerId) continue;
                if (p.type === 'cat') cats++;
                else if (p.type === 'rabbit') rabbits++;
            }
        }
        return cats === 0 && rabbits === 0;
    }

    /**
     * Does the given player have any legal move on their turn?
     */
    _hasAnyLegalMove(playerId) {
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                const p = this.grid[x][y];
                if (!p || p.playerId !== playerId) continue;
                if (p.type === 'snail') continue;

                const candidates = this._getMovesForType(p.type, x, y);
                for (const [tx, ty] of candidates) {
                    const target = this.grid[tx][ty];
                    if (target && target.playerId === playerId) continue;
                    if (p.type === 'rabbit' && !this._isPathClearForRabbit(x, y, tx, ty)) continue;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * At the start of currentTurn's turn: if they have no legal move, game is a draw.
     */
    _checkDrawForCurrentTurn() {
        if (this.winnerFlag !== null) return;
        if (!this._hasAnyLegalMove(this.currentTurn)) {
            this.winnerFlag = 'draw';
        }
    }
}

// ==================== Tests ====================

function assert(cond, msg) {
    if (cond) console.log('PASS:', msg);
    else { console.error('FAIL:', msg); process.exit(1); }
}

console.log('\n=== Test 1: Cat moves diagonally, captures opponent ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat',    x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat',    x: 4, y: 4 },
        { playerId: 'player1', pieceId: 'P1_RAB_1', type: 'rabbit', x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_RAB_1', type: 'rabbit', x: 6, y: 6 },
    ]);
    assert(g.move('player1', 'P1_CAT_1', 4, 4) === true, 'P1 cat captures P2 cat diagonally');
    assert(g.getBoard()[4][4].id === 'P1_CAT_1', 'P1 cat now at (4, 4)');
    assert(g.getBoard()[3][3] === null,        'P1 cat left (3, 3) empty');
    assert(g.winner() === null,                 'game continues, P2 still has rabbit');
}

console.log('\n=== Test 2: Rabbit moves 2 cardinal, path must be clear ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_RAB_1', type: 'rabbit', x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat',    x: 3, y: 4 },  // blocker
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat',    x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_RAB_1', type: 'rabbit', x: 6, y: 6 },
    ]);
    assert(g.move('player1', 'P1_RAB_1', 3, 5) === false, 'rabbit blocked by piece at (3,4)');
    assert(g.getBoard()[3][3].id === 'P1_RAB_1', 'rabbit did not move');
}

console.log('\n=== Test 3: Rabbit captures at 2 squares if intermediate empty ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_RAB_1', type: 'rabbit', x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat',    x: 3, y: 5 },  // capture target
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat',    x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_RAB_1', type: 'rabbit', x: 6, y: 6 },
    ]);
    assert(g.move('player1', 'P1_RAB_1', 3, 5) === true, 'rabbit captures across empty intermediate');
    assert(g.getBoard()[3][5].id === 'P1_RAB_1', 'rabbit landed at capture site');
    assert(g.getBoard()[3][3] === null, 'rabbit left origin');
}

console.log('\n=== Test 4: Cannot capture own piece ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat',    x: 3, y: 3 },
        { playerId: 'player1', pieceId: 'P1_CAT_2', type: 'cat',    x: 3, y: 4 },
        { playerId: 'player1', pieceId: 'P1_RAB_1', type: 'rabbit', x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat',    x: 6, y: 6 },
    ]);
    assert(g.move('player1', 'P1_CAT_1', 3, 4) === false, 'cannot move onto own piece');
}

console.log('\n=== Test 5: Snail cannot be moved ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_SNAIL_1', type: 'snail', x: 3, y: 3 },
        { playerId: 'player1', pieceId: 'P1_CAT_1',   type: 'cat',   x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_CAT_1',   type: 'cat',   x: 6, y: 6 },
    ]);
    assert(g.move('player1', 'P1_SNAIL_1', 3, 4) === false, 'snail rejects move');
}

console.log('\n=== Test 6: Wrong turn rejected ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat',    x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat',    x: 5, y: 5 },
    ]);
    assert(g.move('player2', 'P2_CAT_1', 5, 6) === false, 'P2 cannot move first (P1 goes first)');
    assert(g.move('player1', 'P1_CAT_1', 3, 4) === true,  'P1 moves');
    assert(g.move('player1', 'P1_CAT_1', 3, 5) === false, 'P1 cannot move again immediately');
}

console.log('\n=== Test 7: Win by capturing opponent last cat/rabbit ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1',   type: 'cat',   x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1',   type: 'cat',   x: 4, y: 4 },
        { playerId: 'player2', pieceId: 'P2_SNAIL_1', type: 'snail', x: 6, y: 6 },  // does not save P2
    ]);
    assert(g.winner() === null, 'game ongoing before capture');
    assert(g.move('player1', 'P1_CAT_1', 4, 4) === true, 'P1 captures P2 last cat');
    assert(g.winner() === 'player1', 'P1 wins: P2 has only snail left');
}

console.log('\n=== Test 8: Draw when current player has no legal moves ===');
{
    // Contrive a locked state: P1 has just captured P2's last non-snail
    // and P2 only has a snail, but the danger check fires first, so this
    // scenario ends in win, not draw. Use a different construction:
    // P2 has a rabbit blocked in all four cardinals, at corner (0,0), with
    // own pieces on (2,0) and (0,2). Not exactly a snail-lock but demonstrates.
    // Simpler: use small board.
    const g = new Game(3, 3, [
        { playerId: 'player1', pieceId: 'P1_CAT_1',   type: 'cat',   x: 2, y: 2 },
        { playerId: 'player2', pieceId: 'P2_RAB_1',   type: 'rabbit', x: 0, y: 0 },
        { playerId: 'player2', pieceId: 'P2_SNAIL_1', type: 'snail',  x: 0, y: 2 },
        { playerId: 'player2', pieceId: 'P2_SNAIL_2', type: 'snail',  x: 2, y: 0 },
    ]);
    // P1's move: cat moves to (1, 1)
    assert(g.move('player1', 'P1_CAT_1', 1, 1) === true, 'P1 cat moves to center');
    // Now it's P2's turn. P2's rabbit at (0,0) can go to (2,0) [own snail], (0,2) [own snail],
    // or if it could move, but it's a rabbit with only 2-cardinal moves. Both destinations
    // are own pieces. Rabbit cannot move. Snails cannot move. So no legal move → draw.
    assert(g.winner() === 'draw', 'P2 has no legal moves: draw');
}

console.log('\n=== Test 9: Winner locked, further moves rejected ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat', x: 3, y: 3 },
        { playerId: 'player2', pieceId: 'P2_CAT_1', type: 'cat', x: 4, y: 4 },
    ]);
    g.move('player1', 'P1_CAT_1', 4, 4);   // captures, P1 wins
    assert(g.winner() === 'player1', 'P1 wins');
    // Any subsequent move is rejected
    assert(g.move('player2', 'nonexistent', 0, 0) === false, 'no moves accepted after game over');
}

console.log('\n=== Test 10: getBoard returns a copy of rows ===');
{
    const g = new Game(7, 7, [
        { playerId: 'player1', pieceId: 'P1_CAT_1', type: 'cat', x: 3, y: 3 },
    ]);
    const copy = g.getBoard();
    copy[0][0] = 'mutated';
    assert(g.getBoard()[0][0] === null, 'mutating returned board does not affect internal');
}

console.log('\n=== All Cats and Rabbits tests passed ===');