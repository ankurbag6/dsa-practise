/**
// Bottom up approach
convert the tree into Directed Acycle Graph
Apply topo sort
- meaning
f(5) -- depends on f(4)
f(4) -- depends on f(3)

table = [size n+1]
table[0] = 0;
table[1] = 1;

compute the result in a bootom up fasion
if(n>1) -->
for i=2 ... n+1
  table[i] = table[i-1] + table[i-2]

return table[n] 
*/

function fib(n) {
  if (n < 0 || !Number.isInteger(n)) return -1; // invalid array length
  if (n <= 1) return n;
  
  let table = [...new Array(n + 1)];
  ((table[0] = 0), (table[1] = 1));
  for (let i = 2; i <= n; i++) {
    table[i] = table[i - 1] + table[i - 2];
  }
  console.log(table);
  return table[n];
}

console.log(fib(10));
console.log(fib(0));
console.log(fib(2));
console.log(fib(2.5));
