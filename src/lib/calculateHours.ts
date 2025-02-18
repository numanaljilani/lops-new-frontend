export function calculateHours(startTime : any, endTime : any) {
    // Convert time strings to Date objects
    if(startTime && endTime){
        const start : any = new Date(`1970-01-01T${startTime}:00Z`);
        const end : any = new Date(`1970-01-01T${endTime}:00Z`);
      
        // Calculate the difference in milliseconds
        const differenceInMilliseconds = end - start;
      
        // Convert milliseconds to hours
        const hours = differenceInMilliseconds / (1000 * 60 * 60);
      
        return hours.toFixed(3);
    }
    return "-"

  }