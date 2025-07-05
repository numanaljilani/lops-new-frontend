export function formatDate(timestamp: string): string {
  if (timestamp) {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
      // hour12: true, // To use 12-hour format with AM/PM
      // timeZone: "UTC", // To display in UTC (can be changed to other time zones)
    };

    return date.toLocaleString("en-US", options);
  }
  return timestamp;
}

export function formatDateForApi() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function date(timestamp: any): string {
  if (timestamp) {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "numeric",
      // minute: "numeric",
      // second: "numeric",
      // hour12: true, // To use 12-hour format with AM/PM
      // timeZone: "UTC", // To display in UTC (can be changed to other time zones)
    };

    return date.toLocaleString("en-US", options);
  }
  return "No date found";
}
export function timeFormat(timestamp: string): string {
  if (timestamp) {
    const date = new Date(timestamp);
const readableDate = new Date(timestamp).toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});



    return readableDate;
  }
  return "No date found";
}


export function isDateGreaterThanToday(dateString :string) {
  // Convert the input date string to a Date object
  const givenDate = new Date(dateString);

  // Get today's date (without time)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to 00:00:00 to compare only dates

  // Compare the dates
  return givenDate > today;
}

