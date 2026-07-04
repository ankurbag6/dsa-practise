/**
 * Implement the core logic of the 2048 game in JavaScript ES6+.
Square board of tiles. Each tile holds a power of 2, or is empty. Players move in four directions. Tiles slide as far as possible. Two adjacent same-value tiles merge into one doubled tile. After a move that changes the board, a new tile spawns in a random empty cell (2 with 90% probability, 4 with 10%). Game ends when the board is full and no legal move remains.
Requirements:

Model the game state as classes
Support all four move directions
Detect when the game is over
Provide a way to inspect the board (for tests)

Focus on correctness. UI rendering is out of scope.


Game
--------
constructor(m,n,RNG) : Game
grid: 2DArray
score: Integer

-methods
move(direction): Boolean
isGameOver(): Boolean
getScore(): Integer
slideLeft(): Array
slideUp(): Array
slideRight(): Array
slideDown(): Array
mergeAdjacent(): Array



Game
  fields:
    grid: 2D array
    m, n: dimensions
    rng: injectable random function
    score: integer

  public:
    constructor(m, n, rng = Math.random) // done
    move(direction): boolean         // true if grid changed
    isGameOver(): boolean // done
    getScore(): integer
    getGrid(): 2D array              // for testing // done

  private:
    compressLine(line): line         // the drop-merge-drop-pad algorithm
    spawn(): void                    // place a random tile in a random empty cell // done
    hasLegalMove(): boolean          // any adjacent pair equal, in any direction // done
    gridsEqual(a, b): boolean        // to detect if move changed the board

 */

class Game{
    constructor(m, n, rng = Math.random) {
        this.grid = Array.from({ length: m }, () => Array(n).fill(0));
        
        this._spawn(rng);
        this.score = 0;
    }

    move(dir) {
        let isGridChanged = false;
        switch(dir) {
            case 'left': // slideLeft();
            break;
            case 'up': 
            // transpose
            // slideLeft
            // transpose back
            break; 
            case 'down': 
            // transpose
            // slideLeft
            // transpose back
            break;
            case 'right': 
            // transpose
            // slideLeft
            // transpose back
            break; 
        }
        return isGridChanged;
    }

    getGrid() {
        return this.grid;
    }

    getScore() {
        return this.score;
    }

    isGameOver() {
        // If there is '0' --> game is not over yet  
        return !this.grid.flat().includes(0);
        
        // adjacent elements are not same
        for (let r = 0; r < this.grid.length; r++) {
            for (let c = 0; c < this.grid[0].length; c++) {
                if(_hasLegalMove(this.grid, r, c)) return false;
            }
        }
        return true;
    }
    
    // Private methods
    _spawn(rng) {
        // Generate random coordinates
        let randomRow = Math.floor(rng() * m);
        let randomCol = Math.floor(rng() * n);
        
        // Populate that single random index with either 2 or 4
        this.grid[randomRow][randomCol] = rng() < 0.5 ? 2 : 4;
    }

    _hasLegalMove(grid, r, c) {
        const val = grid[r][c];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        return directions.some(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;
            
            // Ensure neighbor is inside the grid boundaries
            const isInside = nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length;
            
            return isInside && grid[nr][nc] === val;
        });
    }

}

