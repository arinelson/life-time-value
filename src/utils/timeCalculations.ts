
import {
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  startOfDay,
  getDaysInMonth
} from "date-fns";

export type TimeUnit = "days" | "weeks" | "months" | "years";

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
  } else { // days
    return { rows: Math.ceil(totalUnits / 30), cols: 30 };
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
  }
  
  return date;
}
