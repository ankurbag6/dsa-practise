/**
 * 
 * Smart. Warm-up OOD instead of a full 2-hour cold mock. Same skill, lower cognitive load. Builds the pattern without burning you out.

**Setup:**
- ~30-40 min total
- I'll give a small, self-contained OOD problem
- You clarify, sketch, code, test
- I'll debrief at the end with a mini-scorecard

**The rules stay the same:**
- Write JS ES6+ in fenced code blocks in the chat
- No Google, no Copilot, no AI
- Pen and paper for sketching is fine
- Narrate design decisions as you go

---

## The Prompt

**Design a `ParkingLot`.**

A parking lot has a fixed number of spots. Cars arrive, park, and leave.

Implement:
- `park(car)` — put a car in the next available spot. Return the spot number, or `-1` if full.
- `leave(spotNumber)` — free a spot. Return `true` if it was occupied, `false` if it was already empty.
- `isFull()` — return boolean.
- `availableSpots()` — return count of empty spots.

A car has an `id` (string) and a `plate` (string).

---

Questions : 
1. Can the cars be parked in any order ? Should it be lowest integer
2. Do we need to consder the - if a same car can be parked twice within a day?
3. I am assumining 1 parking lot, fixed number of spots


Here is my HL Class models

ParkingLot
------------
constructor(capacity): ParkingLot
spots: Integer

park(car) : Integer
leave(spotNumber) : Boolean
isFull(): Boolean
availableSpots() : Integer


Car
-----------
constructor(id, plate): Car

id: String
plate: String


*/


// class ParkingLot {
//     constructor(capacity) {
//         this.spots = Array(capacity).fill(null);
//     }
    
//     // park(car) : Integer
//     park(car) {
//         for(let i=0; i<this.spots.length; i++) {
//             if(this.spots[i] === null) { // try finding the first empty spot
//                 this.spots[i] = car;
//                 return i;
//             }
//         }
        
//         return -1; // if spots no found
//     }
    
//     // leave(spotNumber) : Boolean
//     leave(spotNumber) {
//         if(spotNumber <0 || spotNumber >=this.spots.length || this.spots[spotNumber] === null) return false;
//         this.spots[spotNumber] = null;
//         return true;
//     }

//     // isFull(): Boolean
//     isFull() {
//         return this.availableSpots() === 0;
//     }

//     // availableSpots() : Integer
//     availableSpots() {
//         let count = 0;
//         for(let i=0; i<this.spots.length; i++) {
//             if(this.spots[i] === null) { // try finding the first empty spot
//                 count++;
//             }
//         }
//         return count;
//     }

// }


class ParkingLot {
    constructor(capacity) {
        this.spots = Array(capacity).fill(null);
    }

    park(car) {
        for(let i=0; i< this.spots.length; i++) {
            if(this.spots[i] === null) {
                this.spots[i] = car;
                return i;
            }
        }
        return -1;
    }

    leave(spotNum) {
        if(spotNum<0 ||  spotNum>=this.spots.length || this.spots[spotNum] === null) return false;
        this.spots[spotNum] = null;
        return true;
    }

    isFull(){
        return this.availableSpots() === 0;
    }

    availableSpots() {
        let cnt = 0;
        for(let i=0; i< this.spots.length; i++) {
            if(this.spots[i] === null) {
                cnt++;
            }
        }
        return cnt;
    }
}


class Car {
    constructor(id, plate) {
        this.id = id;
        this.plate = plate;
    }
}

//// Test
const c1 = new Car("1", "MH05");
const c2 = new Car("2", "MH04");
const c3 = new Car("3", "MH04");
const c4 = new Car("4", "MH04");

const p = new ParkingLot(10);

// Assertions
console.assert(p.park(c1) === 0, "Error: Car 1 should be parked at slot 0");
console.assert(p.park(c2) === 1, "Error: Car 2 should be parked at slot 1");
console.assert(p.park(c3) === 2, "Error: Car 3 should be parked at slot 2");

console.assert(p.leave(1) === true, "Error: Leaving slot 1 should return true");

// Car 4 should take the lowest available slot (slot 1)
console.assert(p.park(c4) === 1, "Error: Car 4 should reuse slot 1");

// 4 cars parked total, 1 left, 1 arrived -> 3 slots filled out of 10
console.assert(p.availableSpots() === 7, `Error: Available spots should be 7, got ${p.availableSpots()}`);

// Assuming slots 9 and 10 are currently empty
console.assert(p.leave(9) === false, "Error: Leaving an empty slot (9) should return false");
console.assert(p.leave(10) === false, "Error: Leaving an empty slot (10) should return false");


