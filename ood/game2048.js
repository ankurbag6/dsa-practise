class Game2048 {
  constructor(size = 4) {
    this.size = size;
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(0)
    );
    this.score = 0;
    this.won = false;
    this.over = false;
    this._spawnTile();
    this._spawnTile();
  }

  // --- Public API ---

  move(direction) {
    if (this.over) return false;

    const before = this._serialize(this.board);

    // Transform so that "direction" becomes "left"
    this.board = this._transform(direction, false);

    let gained = 0;
    this.board = this.board.map(row => {
      const { row: newRow, points } = this._slideAndMergeLeft(row);
      gained += points;
      return newRow;
    });

    // Undo the transform
    this.board = this._transform(direction, true);

    const changed = this._serialize(this.board) !== before;
    if (changed) {
      this.score += gained;
      this._spawnTile();
      if (!this._hasAnyMove()) this.over = true;
    }
    return changed;
  }

  // --- Core algorithm: slide + merge one row to the left ---

  _slideAndMergeLeft(row) {
    const compacted = row.filter(v => v !== 0);
    const merged = [];
    let points = 0;

    for (let i = 0; i < compacted.length; i++) {
      if (compacted[i] === compacted[i + 1]) {
        const val = compacted[i] * 2;
        merged.push(val);
        points += val;
        if (val === 2048) this.won = true;
        i++; // skip the tile we just merged with
      } else {
        merged.push(compacted[i]);
      }
    }
    while (merged.length < this.size) merged.push(0);
    return { row: merged, points };
  }

  // --- Reduce four directions to one operation ---

  _transform(direction, inverse) {
    const clone = this.board.map(r => r.slice());
    switch (direction) {
      case 'left':  return clone;
      case 'right': return clone.map(r => r.reverse());
      case 'up':    return this._transpose(clone);
      case 'down':
        return inverse
          ? this._transpose(clone.map(r => r.reverse()))
          : this._transpose(clone).map(r => r.reverse());
    }
  }

  _transpose(m) {
    return m[0].map((_, c) => m.map(r => r[c]));
  }

  // --- Spawning and end-state detection ---

  _spawnTile() {
    const empties = [];
    for (let r = 0; r < this.size; r++)
      for (let c = 0; c < this.size; c++)
        if (this.board[r][c] === 0) empties.push([r, c]);
    if (empties.length === 0) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  _hasAnyMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) return true;
        const v = this.board[r][c];
        if (c + 1 < this.size && this.board[r][c + 1] === v) return true;
        if (r + 1 < this.size && this.board[r + 1][c] === v) return true;
      }
    }
    return false;
  }

  _serialize(b) { return b.map(r => r.join(',')).join('|'); }

  // --- Accessors ---
  getBoard() { return this.board.map(r => r.slice()); }
  getScore() { return this.score; }
  isOver()   { return this.over; }
  hasWon()   { return this.won; }
}


const g = new Game2048();
console.log(g.getBoard()); // 4x4 with two random tiles
g.move('left');
console.log(g.getScore());
console.log(g.isOver());