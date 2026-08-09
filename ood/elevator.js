/*

Design the object-oriented model for an elevator system in a building. Think classes, responsibilities, relationships, and the core control logic that decides how elevators serve requests.

assumptions/questions
----------------------
1. Desiging for 1 building and 1 elevator for now
2. What will be the basic functionalities in control system of an elavator for this example ?
3. What are the conditions to stop a elevtor ?

Functionalities
-------------------
1. A person inside the elevator presses a floor button (an internal request for a specific destination floor). --> press(floorNum) from inside lift
2. A person on a floor presses Up or Down (an external / hall request — they have a direction but not yet a destination). --> callElevator(dir)
The elevator moves, stops to open doors, and serves requests. 
You should be able to ask the elevator for its current state (floor, direction, doors).
--> elevator Status (floor, direction, doors)

model
----------
building
floors

elevator
- id : num
- updestinationFloors: array
- downdestinationFloors: array
- status: Object // {floorNum:, dir, isDoorsOpen}
- requestFloorDestination(to) : boolean

controller
- requestElevator(dir, currFloor): boolean // updates the status of the  elevator

So you actually have two distinct kinds of request. Name them for me and tell me what data each one carries. (Hint: one has a direction but no destination; the other has a destination but no direction.)
- up
- down button
*/

class Elevator {

    insertSorted(arr, item = undefined) {
        let low = 0;
        let high = arr.length;
        if(item === undefined) return arr;
        if(high === 0) return arr; 
        // Binary search to find the correct insertion index
        while (low < high) {
            const mid = (low + high) >> 1; // Faster Math.floor((low + high) / 2)
            if (arr[mid] < item) {
            low = mid + 1;
            } else {
            high = mid;
            }
        }

        // Insert the item at the correct position
        arr.splice(low, 0, item);
        return arr;
    }
    constructor(id) {
        this.id =  id;
        this.status = {floorNum:0, dir:'IDLE', isDoorOpen: false}
        this.updestinationFloors = []
        this.downdestinationFloors = [];
    }
    requestFloorDestination(to) {
        return false;
    }

    step() {
        // scan the updestinationFloors, downdestinationFloors
        // if Dir - IDDLE
         // Randmly pick  updestinationFloors or downdestinationFloors
        // if Dir - UP 
        // visit one updestinationFloors --> update the updestinationFloors arr
          // Updatethis.status 
        // if Dir - DOWN
        // visit one downdestinationFloors --> update the downdestinationFloors arr
          // Update this.status
        // return this.status
    }

    step() {
    if (this.direction === 'UP') {
        if (this.upStops.size) {
        this.currFloor++;
        if (this.upStops.has(this.currFloor)) this.openDoors(this.currFloor);
        } else if (this.downStops.size) {
        this.direction = 'DOWN';
        } else {
        this.direction = 'IDLE';
        }
    }
    // symmetric for DOWN; IDLE waits for a request
    }
}

class Controller {
    requestElevator(dir, currFloor) {

    }
}