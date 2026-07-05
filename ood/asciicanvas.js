/***
 Design and implement an ASCII Canvas drawing engine.
A canvas is a fixed-size 2D grid of characters. Empty cells display as space characters. Users draw on the canvas by issuing commands.
Support these commands:

PUT x y ch — set a single character ch at coordinate (x, y)
LINE x1 y1 x2 y2 ch — draw a straight line from (x1, y1) to (x2, y2) using character ch. Lines are horizontal, vertical, or 45-degree diagonal only. No arbitrary angles.
RECT x1 y1 x2 y2 ch — draw a rectangle OUTLINE (four sides only, not filled) with corners (x1, y1) and (x2, y2) using character ch.
CLEAR — reset the canvas to all spaces.

Also provide:

render() — return the current canvas state as a string. Rows separated by newlines.

Requirements:

Model as classes
Support all commands above
Validate inputs (out-of-bounds coordinates, invalid rectangles, etc.)
Provide a way to inspect canvas state (for tests)

Focus on correctness. Console printing is out of scope. Return strings.



Questions / Assumtions
1. what should be the size of the grid ?
2. By default the cells of the grid filled with space cahr
3. Validation of inputs : invalid rectangles,
4. Can I assume Coordinates to be possitives for the sake of the test?

[  0 1 2 3
 0[       ]
 1[       ]
 2[       ]
]

Canvas
--------
properties:
    grid: Array[m][n]

methods
    constructor(m, n)
    render() : String
    execute( command ) : void
    clear() : void
        // command --> obj {CMD, x1, y1, x2, y2, ch}
    _getGrid(): String
    _drawLine(x1, y1, x2, y2, ch) : void
    _drawRectangle(x1, y1, x2, y2, ch): void
    _putSingleChar(x1, y1, ch): void
 
Ideas :::
PUT -
when we put a char, we update the 2d Array with the char

LINE - 
we update the 2d Array with the char, inside the 2 location 

Rectangle -
we update the 2d Array with the char, inside the 4 location 
 00   03

 30   33

 12     
      23
 In valid
 00
 
 10
 
 

*/
/**
 * 
 for(let r=0; r<this.grid.length; r++) {
            for(let c=0; c<this.grid[0].length; r++) {
            
            }
        } 
 */


class Canvas{
    constructor(m, n) {
        this.grid = Array.from({ length: m }, () => Array(n).fill(" ")); // By default every thing will be filled by space
    }

    // Public Api
    render() {
        return this.grid.map(row => row.join('')).join('\n');
    }

    clear() {
        for(let r=0; r<this.grid.length; r++) {
            for(let c=0; c<this.grid[0].length; c++) {
                this.grid[r][c] = " ";
            }
        } 
    }

    execute({cmd, ch = 'X', x1, y1, x2 = 0, y2 =0, }) {
        // validate inputs
        if(!this._isValidInput(x1, y1, x2 , y2, ch)) return;

        // Parse the input
        switch(cmd) {
            case "PUT" : 
                this._putSingleChar(x1, y1, ch);
            break;
            case "LINE" : 
                this._drawLine(x1, y1, x2, y2, ch);
            break;
            case "RECT" : 
                this._drawRectangle(x1, y1, x2, y2, ch);
            break;
            case "CLEAR":
                this.clear();
            break;
            default:
                console.error("INVALID COMMAND")
                break;
        }
    }

    _putSingleChar(x, y, ch) {
        this.grid[x][y] = ch;
    }

    _drawLine(x1, y1, x2, y2, ch) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) {
            throw new Error('Line must be horizontal, vertical, or 45-degree diagonal');
        }
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        const stepX = steps === 0 ? 0 : dx / steps;
        const stepY = steps === 0 ? 0 : dy / steps;
        for (let i = 0; i <= steps; i++) {
            const x = x1 + i * stepX;
            const y = y1 + i * stepY;
            this.grid[x][y] = ch;
        }

    }

    _drawRectangle(x1, y1, x2, y2, ch) {
        // Determine the edge // if there is a edge then draw line

        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);

        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                // Only draw if we are on one of the outer edges
                const isEdge = (x === minX || x === maxX || y === minY || y === maxY);
                
                if (isEdge) {
                    this.grid[x][y] = ch;
                }
            }
        }
    }

    _isValidInput(x1, y1, x2, y2, ch) {
        // Check out of bounds 
        // Check Single character only
        return this._isSingleChar(ch) && !this._isOutOfBounds(x1, y1) && !this._isOutOfBounds(x2, y2);
    }

    _isSingleChar(ch) {
        return typeof ch === 'string' && ch.length === 1;
    }

    _isOutOfBounds(x, y) {
        return x < 0 || x >= this.grid.length || y < 0 || y >= this.grid[0].length;
    }

    _getGrid() {
        return this.grid;
    }


}


// Test 
//const c = new Canvas(10, 10);

// c.execute({cmd: "PUT", ch:"#", x1:0, y1:5 });
// console.log(c.render());

// c.execute({cmd: "LINE", ch:"#", x1:0, y1:0, x2:6, y2:6 });
// console.log(c.render());

// c.execute({cmd: "RECT", ch:"#", x1:0, y1:5, x2:6, y2:4 });
// console.log(c.render());

// c.clear();
// console.log(c.render());

const c = new Canvas(5, 5);
c.execute({cmd: "PUT", x1: 999, y1: 999, ch: "X"});
console.assert(c._getGrid()[0][0] === " ", "out-of-bounds PUT should not write");


const c1 = new Canvas(5, 5);
c1.execute({cmd: "LINE", x1: 0, y1: 0, x2: 3, y2: 3, ch: "*"});
// Trace by hand: expect * at (0,0), (1,1), (2,2), (3,3)
console.assert(c1._getGrid()[0][0] === "*" && c1._getGrid()[3][3] === "*", 
    "diagonal line endpoints marked");

const c2 = new Canvas(5, 5);
let threw = false;
try { c2.execute({cmd: "LINE", x1: 0, y1: 0, x2: 3, y2: 5, ch: "*"}); }
catch (e) { threw = true; }
console.assert(threw, "non-45 diagonal should throw");

const c3 = new Canvas(3, 3);
c3.execute({cmd: "PUT", x1: 0, y1: 0, ch: "X"});
console.assert(c3.render() === "X  \n   \n   ", "3x3 canvas with X at (0,0) renders correctly");