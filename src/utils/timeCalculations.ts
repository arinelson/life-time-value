
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  startOfDay,
  getDaysInMonth
} from "date-fns";

export type TimeUnit = "days" | "weeks" | "months" | "years" | "hours" | "minutes" | "seconds";

export function calculateTotalUnits(birthDate: Date, lifeExpectancy: number, unit: TimeUnit): number {
  switch (unit) {
    case "days":
      return lifeExpectancy * 365.25;
    case "weeks":
      return lifeExpectancy * 52;
    case "months":
      return lifeExpectancy * 12;
    case "years":
      return lifeExpectancy;
    case "hours":
      return lifeExpectancy * 365.25 * 24;
    case "minutes":
      return lifeExpectancy * 365.25 * 24 * 60;
    case "seconds":
      return lifeExpectancy * 365.25 * 24 * 60 * 60;
    default:
      return 0;
  }
}

export function calculateElapsedUnits(birthDate: Date, unit: TimeUnit): number {
  const now = new Date();
  
  // Start of the current day for consistent calculations
  const todayStart = startOfDay(now);
  const birthStart = startOfDay(birthDate);
  
  switch (unit) {
    case "days":
      return differenceInDays(todayStart, birthStart);
    case "weeks":
      return differenceInWeeks(todayStart, birthStart);
    case "months":
      return differenceInMonths(todayStart, birthStart);
    case "years":
      // For years, we want the current year to be highlighted as present
      // even if the birthday hasn't occurred yet this year
      return now.getFullYear() - birthDate.getFullYear();
    case "hours":
      return differenceInHours(now, birthDate);
    case "minutes":
      return differenceInMinutes(now, birthDate);
    case "seconds":
      return differenceInSeconds(now, birthDate);
    default:
      return 0;
  }
}

export function getGridDimensions(totalUnits: number, unit: TimeUnit): { rows: number; cols: number } {
  if (unit === "years") {
    const squareSide = Math.ceil(Math.sqrt(totalUnits));
    return { rows: squareSide, cols: Math.ceil(totalUnits / squareSide) };
  } else if (unit === "months") {
    return { rows: Math.min(12, Math.ceil(totalUnits / 12)), cols: 12 };
  } else if (unit === "weeks") {
    return { rows: Math.ceil(totalUnits / 52), cols: 52 };
  } else if (unit === "days") {
    return { rows: Math.ceil(totalUnits / 30), cols: 30 };
  } else {
    // For hours, minutes, seconds just use a reasonable grid size
    return { rows: 10, cols: 10 };
  }
}

export function getDateFromIndex(birthDate: Date, index: number, unit: TimeUnit): Date {
  const date = new Date(birthDate);
  
  switch (unit) {
    case "days":
      date.setDate(date.getDate() + index);
      break;
    case "weeks":
      date.setDate(date.getDate() + index * 7);
      break;
    case "months":
      date.setMonth(date.getMonth() + index);
      break;
    case "years":
      date.setFullYear(date.getFullYear() + index);
      break;
    case "hours":
      date.setHours(date.getHours() + index);
      break;
    case "minutes":
      date.setMinutes(date.getMinutes() + index);
      break;
    case "seconds":
      date.setSeconds(date.getSeconds() + index);
      break;
  }
  
  return date;
}

export function formatTimeRemaining(totalUnits: number, elapsedUnits: number, unit: TimeUnit): string {
  const remainingUnits = totalUnits - elapsedUnits;
  
  if (unit === "hours" || unit === "minutes" || unit === "seconds") {
    const secondsRemaining = unit === "seconds" ? remainingUnits : 
                            unit === "minutes" ? remainingUnits * 60 : 
                            remainingUnits * 3600;
    
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = Math.floor(secondsRemaining % 60);
    
    return `${hours.toLocaleString()}h ${minutes}m ${seconds}s`;
  }
  
  return remainingUnits.toLocaleString();
}
