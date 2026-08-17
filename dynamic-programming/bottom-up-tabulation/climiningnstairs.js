/*
child can clim in 1 + 2 ways

for 4 stairs : 1 1 2 3 
*/
// function climbingstairs(n) {
//     if(n<=0 || !Number.isInteger(n)) return -1;
//     if(n === 1 || n === 2) return 1;
//     const table = new Array(n);
//     table[1] = 1, table[0] = 1;

//     for(let i=2;i<n; i++) {
//         table[i] = table[i-1] + table[i-2];
//     }
//     console.log(table);
//     return table[n-1];
// }

// console.log(climbingstairs(4));
// console.log(climbingstairs(10));
// console.log(climbingstairs(-1));
// console.log(climbingstairs(2.5));



function climbingstairs_efficient(n) {
    if(n<=0 || !Number.isInteger(n)) return -1;
    if(n < 2) return 1;
    const table = [1,1,0];
    for(let i=2;i<=n; i++) {
        //console.log("i%3", i%3);
        table[i%3] = table[(i-1)%3] + table[(i-2)%3];
        console.log(table);
    }
    
    return table[n%3];
}

function climbingStairs(n) {
    if (n < 2) return 1;
    const w = [1, 1, 0];                                    // ways(0), ways(1), scratch
    for (let i = 2; i <= n; i++) w[i % 3] = w[(i-1) % 3] + w[(i-2) % 3];
      console.log(w);
    return w[n % 3];
}
console.log(climbingStairs(4));

console.log(climbingstairs_efficient(4));
// console.log(climbingstairs_efficient(10));
// console.log(climbingstairs_efficient(-1));
// console.log(climbingstairs_efficient(2.5));