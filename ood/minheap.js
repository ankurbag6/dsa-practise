class MinHeap {
  constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }

  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) { this.a.push(x); this._up(this.a.length - 1); }
  pop() {
    const top = this.a[0], last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this._down(0); }
    return top;
  }

  _up(i) {
    while (i && this.cmp(this.a[i], this.a[(i-1)>>1]) < 0) {
      [this.a[i], this.a[(i-1)>>1]] = [this.a[(i-1)>>1], this.a[i]];
      i = (i-1)>>1;
    }
  }

  _down(i) {
    const n = this.a.length;
    while (true) {
      let s = i, l = 2*i+1, r = 2*i+2;
      if (l < n && this.cmp(this.a[l], this.a[s]) < 0) s = l;
      if (r < n && this.cmp(this.a[r], this.a[s]) < 0) s = r;
      if (s === i) break;
      [this.a[i], this.a[s]] = [this.a[s], this.a[i]];
      i = s;
    }
  }
  
}