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

**Your turn.** Start with clarifying questions. Take 3 to 5 min on questions, then sketch the class model on paper, then code. Post questions first.
 
MY Questions -
1. I assume there will be capacity for the parking lot?
2. I am assuming 1 parking lot for this exercise

MY OOD consists of 2 entities -
ParkingLot : will have all the methods described above to implemnet
------------
Car: I will keep it simple - id, plate


Please let me know my asumtipns are correct / or in the right directions

My Class model:
-----------------
ParkingLot
----------
attributes
 + capacity : integer
 + arr : Car[]

methods
 + park(car)
 + leave(spotNumber)
 + isFull()
 + availableSpots()

Car
-------
attributes
id: number
plate: string
*/

class ParkingLot {
    constructor(capacity) {
        this.capacity = capacity;
        this.spots = new Array(capacity).fill(null);
    }

    park(car) {
        // find the lowest index and add to the spot
        for (let i = 0; i < this.spots.length; i++) {
            if(this.spots[i] === null) {
                this.spots[i] = car;
                return i+1;
            }
        }
        return -1;
        
    }

    leave(spotNum) {
        //const op = this.spots.splice(spotNum, 1)
        // return op.length === 1;
        // for (let i = 0; i < this.spots.length; i++) {
        //     if(i === spotNum) {
        //         this.spots[i] = null;
        //         return true;
        //     }
        // }
        spotNum -= 1;
        if(spotNum < this.capacity && spotNum >=0){
            this.spots[spotNum] = null;
            return true;
        }
        return false;
    }

    isFull() {
        return this.availableSpots() === 0;
    }

    availableSpots() {
        let availableSpots = 0;
        for (let i = 0; i < this.spots.length; i++) {
            if(this.spots[i] === null)
                availableSpots++;
        }
        return availableSpots;
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
console.log(p.park(c1));
console.log(p.park(c2));
console.log(p.park(c3));
console.log(p.leave(1));
console.log(p.park(c4));
console.log(p.availableSpots());


// for(let i=0; i<10; i++) {
//     const c3 = new Car(`${i}`, `MH${i}`);
//     console.log("----------------");
//     console.log(`Car ${i} parked at :: ${p.park(c3)}`);
//     console.log("Is Parking lot Full ::",p.isFull());
//     //console.log("Leave  ::",p.leave());

//     console.log("availableSpots ::",p.availableSpots());
// }


// const c3 = new Car("C3", `MHC3`);
//     console.log("----------------");
//     console.log(`Car ${i} parked at :: ${p.park(c3)}`);
//     console.log("Is Parking lot Full ::",p.isFull());

