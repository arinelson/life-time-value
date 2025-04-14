import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, addDays, addWeeks, addMonths, addYears, isSameDay, isBefore } from "date-fns";

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
    case "years": {
      // Get the raw difference in years
      const yearsDiff = differenceInYears(today, birthDate);
      
      // Create a date with the same month/day as birth but in the current year
      const anniversaryThisYear = new Date(today.getFullYear(), 
                                          birthDate.getMonth(), 
                                          birthDate.getDate());
      
      // Check if the birthday hasn't happened yet this year
      // If today is before the anniversary this year, subtract one year
      if (isBefore(today, anniversaryThisYear)) {
        return yearsDiff - 1;
      }
      
      return yearsDiff;
    }
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
    // For years - optimize for better display, square-ish grid
    const squareSide = Math.ceil(Math.sqrt(totalUnits));
    return { rows: squareSide, cols: Math.ceil(totalUnits / squareSide) };
  } else if (totalUnits <= 1200) {
    // For months - create a grid with more columns than rows
    return { rows: 20, cols: Math.ceil(totalUnits / 20) }; 
  } else if (totalUnits <= 5200) {
    // For weeks - create a grid with more columns than rows
    return { rows: 40, cols: Math.ceil(totalUnits / 40) };
  } else {
    // For days - create a scrollable grid
    return { rows: 50, cols: Math.ceil(totalUnits / 50) };
  }
}
