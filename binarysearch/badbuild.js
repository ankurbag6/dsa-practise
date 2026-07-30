/*
You're on a team whose product had a bad release. Builds are numbered 1 through n, and each build is based on the previous one — so once a build is bad, every build after it is also bad. 
You have access to an API, isBad(version), which returns whether a build is bad. 
Unfortunately, each call hits a slow CI system, so calls are expensive.

Write a function firstBadBuild(n) that returns the number of the first bad build, minimizing calls to isBad.

Strategy - 
1. Since all the build versions are incrementatl in nature, I assume it tobe sorted, Hence search strategy binary search
O(log n)
2. Logic - 
lo=1, hi=n, mid = lo + ((hi-lo)/2)

while(lo<hi) {

    // if isBad(mid) === true --> first bad build will be on the left
      --> hi=mid
    // else search on the right --> lo=mid+1

}

return lo

*/

function firstBadBuild(n) {

    if(n<1) return -1 // invalid buid version
    let lo = 1, hi=n;
    // if(n === 1 && !isBad(n)) return -1; // No bad version found 
    while(lo<hi) {
        let mid = lo +  Math.floor(((hi-lo)/2));
        if(isBad(mid)) hi=mid;
        else lo=mid+1;
    }
    return lo;
}