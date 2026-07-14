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
/*
class Game{
    constructor(m, n, rng = Math.random) {
        this.grid = Array.from({ length: m }, () => Array(n).fill(0));
        
        this._spawn(rng, m, n);
        this._spawn(rng, m, n);
        this.score = 0;
    }

    move(dir) {
        const before = this._clone();
        switch(dir) {
            case 'left':  this.slideLeft();
            break;
            case 'up': 
            // transpose
            this._transposeMatrix();
            // slideLeft
            this.slideLeft();
            // transpose back
            this._transposeMatrix();
            break; 
            case 'down': 
            // transpose
            this._transposeMatrix();
            // reverse
            this._reverseMatrix();
            // slideLeft
            this.slideLeft();
            // reverse back
            this._reverseMatrix();
            // transpose back
            this._transposeMatrix();
            break;
            case 'right': 
            // reverse
            this._reverseMatrix();
            // slideLeft
            this.slideLeft();
            // reverse back
            this._reverseMatrix();
            break; 
        }
        return this._compare2DArrays(before, this.grid);
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
    slideLeft() {
        // dropZeroes
        const tempArr = [];
        for(let r=0; r<this.grid.length; r++) {
            tempArr.push(this._dropZeroes(this.grid[r]));
        }
        //console.log("dropZeroes---");
        //console.log(tempArr);
        // mergeAdjacent if legal
        for(let r=0; r<tempArr.length; r++) {
            tempArr[r] = this._mergeAdjacent(tempArr[r]);
        }

        // dropZeroes
        for(let r=0; r<tempArr.length; r++) {
            tempArr[r] = this._dropZeroes(tempArr[r]);
        }
        //console.log("mergeAdjacent---");
        //console.log(tempArr);
        // pad with zeroes
        for(let r=0; r<tempArr.length; r++) {
            tempArr[r] = this._padZeroes(tempArr[r]);
        }
        console.log("After Slide Left---");
        console.log(tempArr);
        this.grid = tempArr;
    }

    _clone() {
        return this.grid.map(row => row.slice());
    }

    _compare2DArrays(arr1, arr2){
        // Check outer array lengths first
        if (arr1.length !== arr2.length) return false;

        return arr1.every((row, i) => {
            // Check inner array lengths
            if (row.length !== arr2[i].length) return false;
            
            // Check each element in the row
            return row.every((val, j) => val === arr2[i][j]);
        });
    };

    _dropZeroes(row) {
        //console.log("row--",row)
        return row.filter( r => r!== 0 );
    }

    _mergeAdjacent(row) {
        let i =0;
        const result = Array(row.length).fill(0);
        for(let r=1; r<row.length; r++) {
            if(row[i] === row[r] || row[i] === 0 || row[r] === 0) {
                result[i] = row[i] + row[r];
                result[r] = 0;
                this.score += result[i];
            }
            i++;
        }
        return result;
    }

    _padZeroes(row) {

        // Place the zero array first, then spread the original array
        return [...row, ...Array(this.grid.length - row.length).fill(0)];
    }

    _spawn(rng, m, n) {
        // Generate random coordinates
        let randomRow = Math.floor(rng() * m);
        let randomCol = Math.floor(rng() * n);
        
        // Populate that single random index with either 2 or 4
        this.grid[randomRow][randomCol] = rng() < 0.9 ? 2 : 4;
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

    _transposeMatrix() {
        const rows = this.grid.length;
        const cols = this.grid[0].length;
        const result = Array(cols).fill(0).map(() => Array(rows));

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
            result[c][r] = this.grid[r][c];
            }
        }
        console.log("After Transpose---");
        console.log(result);
        this.grid = result;
    }

    _reverseMatrix() {
        const rows = this.grid.length;
        const cols = this.grid[0].length;
        const result = Array(cols).fill(0).map(() => Array(rows));

        for (let r = 0; r < this.grid.length; r++) {
            this._reverse(this.grid[r])
        }
        console.log("After Reverse---");
        console.log(this.grid);
    }

    _reverse(row) {
        const temp = row.reverse();
        //console.log("After Reverse---");
        //console.log(temp);
        return temp;
    }

}
*/
/**
 class model
 ---------------

 class Game
 -----------
 attributes->
 rows, cols: number
 grid: numbers[][]
 constructor(rows, cols, RNG)

 methods->
 move(direction): boolean // returns true if the grid changes
 _slideleft(): void
 _transpose(): void
 _reverse(): void
 _hasLegalMove(): boolean
 _mergeAdjacent(): void
 getGrid(): numbers[][]

 */



const g = new Game(4, 4);

//g.grid = [ [ 0, 2, 0, 2 ], [ 0, 2, 2, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ];
g.grid = [ [2, 2, 4, 4], [ 0, 2, 2, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ];

//console.log(g._mergeAdjacent([2, 2, 4, 4]));
// console.log(g.grid);
let isGridSame = g.move('left');
console.log("isGridSame::", isGridSame);


// 1. Assert the boolean return flag
console.assert(isGridSame === false, "Expected isGridSame to be false");

// 2. Assert the deep grid state
let expectedGridString = JSON.stringify([ [ 4, 8, 0, 0 ], [ 4, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ]);

console.assert(
  JSON.stringify(g.grid) === expectedGridString, 
  "Grid state mismatch!", 
  g.grid
);

isGridSame = g.move('up');
console.log("isGridSame::", isGridSame);


// 1. Assert the boolean return flag
console.assert(isGridSame === false, "Expected isGridSame to be false");

// 2. Assert the deep grid state
expectedGridString = JSON.stringify([ [ 8, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ]);

console.assert(
  JSON.stringify(g.grid) === expectedGridString, 
  "Grid state mismatch!", 
  g.grid
);
