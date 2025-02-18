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
  return "No date found";
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

    const options: Intl.DateTimeFormatOptions = {
      // year: "numeric",
      // month: "long",
      // day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // To use 12-hour format with AM/PM
      timeZone: "UTC", // To display in UTC (can be changed to other time zones)
    };

    return date.toLocaleString("en-US", options);
  }
  return "No date found";
}
