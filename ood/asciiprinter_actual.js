// 10:17 -> 11:27 return
// 10.30 --> all the class model
// 10.30 --> 10.45 Coding & testing
/*
Rewuirements
-- 10rows 6 columns
-- No parsing needed for the CMD
-- grid[y][x] --> coordinate eq
-- Draw order is preserved, meaning this does not bring the rectangle to the front.
---BRING_TO_FRONT : Bring the top most rectangle





class model::
--------------

class Rectangle
-----------------
x1,y1,x2,y2 : numbers
order: number
constructor(x1,y1,x2,y2)
 // generates the order

class Canvas
--------------
r, c : numbers
rectangles : Rectangles[] //  
grid : numbers[6][10]
constructor(r,c) // fill grid with empty

// public Api
execute({cmd, ch, leftx, topy, rightx, bottomy}) :void
 --> call helper methods for all the functions
printCanvas(): numbers[][]
 --> Iterate thtough rectangles from highest index  to lowest index

// private methods
_drawRectangle(x1,y1, x2,y2, ch) : void 
 --> fill in the grid with characters
 ---> Create a rectangle Object
 --> store this as order
_eraseArea(x1,y1, x2,y2) : void 
 --> remove the area, fill by empty
_dragAndDrop(x1,y1, x2,y2): void
  --> _findrectangle(x,y)
  --> order is preserved
  --> move the all the rectangle
  --> from(x1,y1) --> (x2,y2)
_bringtofront(x1,y1): void
  --> _findrectangle(x,y)
  --> order is updated to the highest
_findrectangle(x,y)
 --> retrieve the rectangle // look up the array and get the associated rectangle
_validate(x1,y1, x2,y2, ch)
*/

// (x1 ---> column y1---> row)

class Rectangle {
    constructor(x1,y1,x2,y2 ) {
       this.x1 = x1;
       this.y1 =y1;
       this.x2=x2;
       this.y2 =y2; 
       this.erasedCoordinates = []; // array of unfilled coordinates
    }
}

class Canvas {
    constructor(r=6, c=10) {
       this.r=r;
       this.c=c;
       this.grid = Array.from({ length: r }, () => Array(c).fill("#")); // By default every thing will be filled by space
       this.rectangles = []; // array of rectangles
       // map of rectagles with with grid as key
       
    }
    
    // public API
    execute({cmd, ch, leftx, topy, rightx, bottomy}) {
        // console.log(cmd);
        // validate inputs
        /*if(!this._isValidInput(leftx, topy, rightx , bottomy, ch)) { 
            console.error("INVALID: Bounds"); 
            return;
        }*/
        
        // Commands
        switch(cmd) {
            case "DRAW_RECTANGLE":
                this._drawRectangle(leftx, topy, rightx, bottomy, ch);
            break;
            case "ERASE_AREA":
                this._eraseArea(leftx, topy, rightx, bottomy);
            break;
            case "DRAG_AND_DROP":
                this._dragAndDrop(leftx, topy, rightx, bottomy);
            break;
            case "BRING_TO_FRONT":
            break;
            default:
                console.error("INVALID COMMAND"); 
            break;
        }

    }
    
    /*_drawRectangle(x1,y1, x2,y2, ch) : void 
        --> fill in the grid with characters
        ---> Create a rectangle Object
        --> store this as order */ 
    _drawRectangle(x1, y1, x2, y2, ch) {
        // Determine the edge // if there is a edge then draw line
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        const rectangle = new Rectangle(x1, y1, x2, y2);
        this.rectangles.push(rectangle);
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                this.grid[y][x] = ch;
            }
        }
    }
    
    /**
     * LLLLL
     * LLLLLR
     *    RRR
     */
    
    /**
     * LLLLL
     * LLLLL
     *      R
     *    RRR
     */
    
    
    /*_eraseArea(x1,y1, x2,y2) : void 
    --> remove the area, fill by empty
    */
    _eraseArea(x1, y1, x2, y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        //const rectangle = new Rectangle(x1, y1, x2, y2);
        //this.rectangles.push(rectangle);
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                this.grid[y][x] = " ";
                // update the rectangles with the erased coordinate
            }
        }
    }
    /**
     * _dragAndDrop(x1,y1, x2,y2): void
        --> _findrectangle(x,y)
        --> order is preserved
        --> move the all the rectangle
        --> from(x1,y1) --> (x2,y2)
     * 
     * 
     */
    _dragAndDrop(x1, y1, x2, y2) {
        // find the rectangle 
        // lookup arrays
        

        // Your array of rectangles
        const rectangles = this.rectangles;
        
        const pointsInsideAnyRect = rectangles.filter(rect => {
            return x1 >= rect.x1 && 
                x2 <= rect.x2 && 
                y1 >= rect.y1 && 
                y2 <= rect.y2;
        });
        console.log(pointsInsideAnyRect);
        // Select the highest Indexed
        const selRect = pointsInsideAnyRect[pointsInsideAnyRect.length -1];
        console.log(selRect);
        // Determine the edge // if there is a edge then draw line
        /*const minX = Math.min(selRect.x1, selRect.x2);
        const maxX = Math.max(selRect.x1, selRect.x2);
        const minY = Math.min(selRect.y1, selRect.y2);
        const maxY = Math.max(selRect.y1, selRect.y2);
        const rectangle = new Rectangle(x1, y1, x2, y2);
        this.rectangles.push(rectangle);
        for (let x = minX; x <= maxX; x++) {
            for (let y = minY; y <= maxY; y++) {
                // check the previously erased coordinates
                this.grid[y][x] = ch;
            }
        }*/
    }
    
    // helpers
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

    // For testing
        
    printCanvas() {
        return this.grid.map(row => row.join('')).join('\n');
    }
    
    
}



// Test 
const c = new Canvas();

c.execute({cmd: "DRAW_RECTANGLE", ch:"L", leftx: 1, topy: 1, rightx: 4, bottomy:4 });
//console.log(c._render());
c.execute({cmd: "DRAW_RECTANGLE", ch:"R", leftx: 2, topy: 1, rightx: 5, bottomy:5 });

c.execute({cmd: "ERASE_AREA",  leftx: 1, topy: 1, rightx: 2, bottomy:2 });


c.execute({cmd: "DRAG_AND_DROP", leftx: 2, topy: 1, rightx: 3, bottomy:3 });
console.log(c.printCanvas());
