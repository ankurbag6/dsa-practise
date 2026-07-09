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