
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, addDays, addWeeks, addMonths, addYears } from "date-fns";

export type TimeUnit = "days" | "weeks" | "months" | "years";

export function calculateTotalUnits(birthDate: Date, lifeExpectancy: number, unit: TimeUnit): number {
  const endDate = new Date(birthDate);
  
  switch (unit) {
    case "days":
      endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
      return differenceInDays(endDate, birthDate);
    case "weeks":
      endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
      return differenceInWeeks(endDate, birthDate);
    case "months":
      endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
      return differenceInMonths(endDate, birthDate);
    case "years":
      return lifeExpectancy;
    default:
      return 0;
  }
}

export function calculateElapsedUnits(birthDate: Date, unit: TimeUnit): number {
  const today = new Date();
  
  switch (unit) {
    case "days":
      return differenceInDays(today, birthDate);
    case "weeks":
      return differenceInWeeks(today, birthDate);
    case "months":
      return differenceInMonths(today, birthDate);
    case "years":
      return differenceInYears(today, birthDate);
    default:
      return 0;
  }
}

export function getUnitIndex(birthDate: Date, date: Date, unit: TimeUnit): number {
  switch (unit) {
    case "days":
      return differenceInDays(date, birthDate);
    case "weeks":
      return differenceInWeeks(date, birthDate);
    case "months":
      return differenceInMonths(date, birthDate);
    case "years":
      return differenceInYears(date, birthDate);
    default:
      return 0;
  }
}

export function getDateFromIndex(birthDate: Date, index: number, unit: TimeUnit): Date {
  switch (unit) {
    case "days":
      return addDays(birthDate, index);
    case "weeks":
      return addWeeks(birthDate, index);
    case "months":
      return addMonths(birthDate, index);
    case "years":
      return addYears(birthDate, index);
    default:
      return new Date(birthDate);
  }
}

export function getGridDimensions(totalUnits: number): { rows: number; cols: number } {
  // Determine a reasonable grid layout based on total units
  if (totalUnits <= 100) {
    return { rows: 10, cols: 10 }; // 10x10 for years
  } else if (totalUnits <= 1200) {
    return { rows: 30, cols: Math.ceil(totalUnits / 30) }; // For months
  } else if (totalUnits <= 5200) {
    return { rows: 52, cols: Math.ceil(totalUnits / 52) }; // For weeks
  } else {
    return { rows: 73, cols: Math.ceil(totalUnits / 73) }; // For days
  }
}
