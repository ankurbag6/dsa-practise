/**
 * Elevator System — Object-Oriented Design (single elevator, extensible to N)
 * -------------------------------------------------------------------------
 * Algorithm: SCAN / LOOK ("the elevator algorithm")
 *   Commit to a direction, serve every pending stop in that direction in
 *   sorted order, and only reverse when nothing remains ahead. This avoids
 *   the direction "ping-pong" and starvation you get with FIFO / nearest-first.
 *
 * Two kinds of request:
 *   - HallRequest(floor, dir) : pressed OUTSIDE, on a floor. Has a direction,
 *                               no destination yet.
 *   - CarRequest(floor)       : pressed INSIDE the car. Has a destination,
 *                               direction is implied by where the car is.
 *
 * Timing/doors are abstracted: step() advances the car exactly one floor.
 */

const Direction = Object.freeze({ UP: 'UP', DOWN: 'DOWN', IDLE: 'IDLE' });

// ---------------------------------------------------------------------------
// Requests (small value objects — make the "what is a request" explicit)
// ---------------------------------------------------------------------------
class HallRequest {
  constructor(floor, direction) {
    this.floor = floor;          // where the person is standing
    this.direction = direction;  // Direction.UP | Direction.DOWN
  }
}

class CarRequest {
  constructor(floor) {
    this.floor = floor;          // destination the rider selected
  }
}

// ---------------------------------------------------------------------------
// Elevator — owns its OWN physical state + motion. Single source of truth.
// ---------------------------------------------------------------------------
class Elevator {
  constructor(id, minFloor = 0, maxFloor = 9) {
    this.id = id;
    this.minFloor = minFloor;
    this.maxFloor = maxFloor;

    this.currFloor = minFloor;
    this.direction = Direction.IDLE;
    this.doorsOpen = false;

    // Pending stops, split by direction and kept sorted => the structure IS
    // the SCAN algorithm. Using Sets to dedupe presses to the same floor.
    this.upStops = new Set();    // floors ABOVE current, served ascending
    this.downStops = new Set();  // floors BELOW current, served descending
  }

  /** Add a target floor, routing it into the correct directional bucket. */
  addStop(floor) {
    if (floor < this.minFloor || floor > this.maxFloor) return; // ignore invalid
    if (floor === this.currFloor) return;                        // already here
    if (floor > this.currFloor) this.upStops.add(floor);
    else this.downStops.add(floor);

    // If idle, pick a direction to start moving toward the new work.
    if (this.direction === Direction.IDLE) {
      this.direction = floor > this.currFloor ? Direction.UP : Direction.DOWN;
    }
  }

  hasWork() {
    return this.upStops.size > 0 || this.downStops.size > 0;
  }

  /** Advance the simulation by ONE floor. Returns the current status. */
  step() {
    this.doorsOpen = false; // doors close before moving

    if (this.direction === Direction.UP) {
      if (this.upStops.size > 0) {
        this.currFloor++;
        if (this.upStops.has(this.currFloor)) this._openDoorsAt(this.currFloor, this.upStops);
      } else if (this.downStops.size > 0) {
        this.direction = Direction.DOWN;   // flip: nothing left above
      } else {
        this.direction = Direction.IDLE;   // no work at all
      }
    } else if (this.direction === Direction.DOWN) {
      if (this.downStops.size > 0) {
        this.currFloor--;
        if (this.downStops.has(this.currFloor)) this._openDoorsAt(this.currFloor, this.downStops);
      } else if (this.upStops.size > 0) {
        this.direction = Direction.UP;     // flip: nothing left below
      } else {
        this.direction = Direction.IDLE;
      }
    }
    // IDLE: nothing to do until a request arrives.

    return this.getStatus();
  }

  _openDoorsAt(floor, bucket) {
    bucket.delete(floor);
    this.doorsOpen = true;
  }

  getStatus() {
    return {
      id: this.id,
      floor: this.currFloor,
      direction: this.direction,
      doorsOpen: this.doorsOpen,
      pending: [...this.upStops, ...this.downStops].sort((a, b) => a - b),
    };
  }
}

// ---------------------------------------------------------------------------
// Controller / Dispatcher — the BRAIN. Routes requests to elevators.
// For a single elevator this is thin; the seams for N elevators are marked.
// ---------------------------------------------------------------------------
class ElevatorController {
  constructor(elevators) {
    this.elevators = elevators; // Elevator[]
  }

  /** Someone on a floor pressed Up/Down. */
  requestElevator(floor, direction) {
    const elevator = this._chooseElevator(floor, direction);
    elevator.addStop(floor);
    return elevator.id;
  }

  /** Someone inside a car pressed a destination button. */
  requestFloor(elevatorId, destinationFloor) {
    const elevator = this.elevators.find((e) => e.id === elevatorId);
    if (!elevator) throw new Error(`No elevator ${elevatorId}`);
    elevator.addStop(destinationFloor);
    return elevator.id;
  }

  /**
   * Pick which elevator serves a hall request.
   * Single elevator => trivial. For N: score each by direction-compatibility
   * + distance and choose the best (this is the classic follow-up).
   */
  _chooseElevator(floor, direction) {
    if (this.elevators.length === 1) return this.elevators[0];

    let best = null;
    let bestScore = Infinity;
    for (const e of this.elevators) {
      const distance = Math.abs(e.currFloor - floor);
      const movingToward =
        (e.direction === Direction.UP && floor >= e.currFloor) ||
        (e.direction === Direction.DOWN && floor <= e.currFloor);
      // idle is always a fine candidate; moving-away gets a penalty.
      const penalty = e.direction === Direction.IDLE ? 0 : movingToward ? 0 : 100;
      const score = distance + penalty;
      if (score < bestScore) { bestScore = score; best = e; }
    }
    return best;
  }

  /** Advance every elevator one tick. */
  step() {
    return this.elevators.map((e) => e.step());
  }

  anyWork() {
    return this.elevators.some((e) => e.hasWork());
  }
}

// ---------------------------------------------------------------------------
// Building — just holds the physical config + the controller.
// ---------------------------------------------------------------------------
class Building {
  constructor(numFloors = 10, numElevators = 1) {
    this.numFloors = numFloors;
    const elevators = Array.from(
      { length: numElevators },
      (_, i) => new Elevator(i, 0, numFloors - 1)
    );
    this.controller = new ElevatorController(elevators);
  }
}

// ---------------------------------------------------------------------------
// Demo: reproduces the interview example — car at 5, requests for 4, 8, 7.
// SCAN serves 7, 8 (up) then reverses for 4 — NOT nearest-first 4,7,8.
// ---------------------------------------------------------------------------
function demo() {
  const building = new Building(10, 1);
  const { controller } = building;
  const elevator = controller.elevators[0];

  // Put the car at floor 5 to match the interview scenario.
  elevator.currFloor = 5;

  controller.requestFloor(0, 4); // inside: go to 4
  controller.requestFloor(0, 8); // inside: go to 8
  controller.requestFloor(0, 7); // inside: go to 7

  console.log('Start:', elevator.getStatus());

  let tick = 0;
  while (controller.anyWork() && tick < 50) {
    const [status] = controller.step();
    const stopped = status.doorsOpen ? '  <-- STOP, doors open' : '';
    console.log(
      `tick ${String(++tick).padStart(2)} | floor ${status.floor} | ${status.direction}${stopped}`
    );
  }
  console.log('End:', elevator.getStatus());
}

if (require.main === module) demo();

module.exports = { Direction, HallRequest, CarRequest, Elevator, ElevatorController, Building };