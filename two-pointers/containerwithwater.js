function max_area(heights) {
    /*
    1. keep pointer l=0, r=heights.length

    heights = [3, 4, 1, 2, 2, 4, 1, 3, 2]
               l                        r
    maxarea = Max(min(l, r) * (r - l), maxarea)

    2 * 8 = 16
    3 * 7 = 21
    3 * 6 

  if(l > r) r--
  else l++

    */
    let l=0, r=heights.length-1, maxarea = -Infinity;
    while(l<r) {
        maxarea = Math.max(maxarea, Math.min(heights[l], heights[r]) * (r - l));
        console.log({maxarea, l, r});
        if(heights[l]>heights[r]) r--;
        else l++;
    }
    return maxarea;
}
// Time complexity : O(n), Space : O(1)
console.log(max_area([3, 4, 1, 2, 2, 4, 1, 3, 2]))