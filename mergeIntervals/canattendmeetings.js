    function canAttendMeetings(intervals) {
        if(intervals === undefined || intervals.length === 0) 
            return true;
        // sort
        intervals.sort((a,b) => a[0] - b[0]);
        console.log(intervals);
        // compare 2 pairs
        for(let i=1; i<intervals.length;i++) {
            if(intervals[i][0] < intervals[i-1][1])
                return false;
        }
        return true;
    }

    console.log(canAttendMeetings([[0,30],[5,10],[15,20]]));