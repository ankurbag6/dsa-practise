/*

Our customers are home-service businesses, and each service pro has a list of appointments for the day. 
Each appointment is a pair [start, end] in minutes-from-midnight — for example [540, 600] is 9:00 to 10:00 AM. 
The list is not sorted.

Write a function hasConflict(appointments) that returns true if any two appointments overlap, false otherwise.

Example: [[540, 600], [630, 690], [585, 645]] → true, because the 9:45–10:45 job collides with the 9:00–10:00 one.

The floor's yours — what do you want to ask me before you start?

logic - 
[540, 600] [630, 690]
[630, 690] [585, 645]


1.Sort the lists based on the start times
[[540, 600], [630, 690], [585, 645]] --> [[540, 600], [585, 645], [630, 690]]

2. To detect overlap, we need to compare 2 neighbours
   for(i=1 to list.length-1)
    isOverlap(appt[i-1], appt[]) --> if true --> return true
    else continue

    // [540, 585], [585, 645] 
3. COndition of isOverLap(appt1, appt2) :app1.end>appt2.start 
 */

function isOverLap(appt1, appt2) {
    console.log({appt1, appt2, res : (appt1[1] > appt2[0]) });
    return appt1[1] > appt2[0];
}
function hasConflict(appointments){
    if(appointments === undefined || appointments.length === 0) return undefined;
    
    if(appointments.length === 1) return false;

    // sort
    appointments.sort((a, b) => a[0] - b[0]);
    console.log(appointments);
    // scan and comapre
    for(let i=1; i<appointments.length; i++) {
        if(isOverLap(appointments[i-1], appointments[i])) return true;
    }

    return false;
}

console.log(hasConflict([[540, 584], [630, 690], [585, 630]]));

