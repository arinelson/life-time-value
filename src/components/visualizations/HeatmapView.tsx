
import React, { useMemo } from "react";
import { format, startOfYear, eachYearOfInterval, getYear } from "date-fns";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeatmapViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function HeatmapView({ 
  elapsedUnits, 
  totalUnits, 
  birthDate, 
  lifeExpectancy 
}: HeatmapViewProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Calculate years array
  const years = useMemo(() => {
    if (!birthDate) return [];
    
    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    return eachYearOfInterval({
      start: startOfYear(birthDate),
      end: endDate
    });
  }, [birthDate, lifeExpectancy]);

  // Calculate percentage elapsed
  const percentElapsed = useMemo(() => {
    return (elapsedUnits / totalUnits) * 100;
  }, [elapsedUnits, totalUnits]);

  // Calculate color intensity for each year
  const getIntensity = (year: number) => {
    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();
    const endYear = birthYear + lifeExpectancy;
    
    // Past years
    if (year < currentYear) {
      return 100; // Full intensity for past
    }
    
    // Future years
    if (year > currentYear) {
      // Calculate decreasing intensity based on distance from current year
      const yearsRemaining = endYear - year;
      const totalFutureYears = endYear - currentYear;
      return Math.max(0, Math.round((yearsRemaining / totalFutureYears) * 60) + 20);
    }
    
    // Current year
    return 80;
  };

  const getSquareColor = (year: number) => {
    const intensity = getIntensity(year);
    const birthYear = birthDate.getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (year < currentYear) {
      return `hsl(220, 15%, ${intensity}%)`; // Past
    } else if (year === currentYear) {
      return `hsl(221.2, 83%, ${intensity}%)`; // Present
    } else {
      return `hsl(220, 15%, ${100 - intensity}%)`; // Future
    }
  };

  return (
    <ScrollArea className="h-[400px]" orientation={isMobile ? "horizontal" : "vertical"}>
      <div className={`grid ${isMobile ? "grid-flow-col" : "grid-cols-12"} gap-2 p-2`}>
        {years.map((date) => {
          const year = getYear(date);
          const currentYear = new Date().getFullYear();
          const isCurrentYear = year === currentYear;
          const isPastYear = year < currentYear;
          
          return (
            <div 
              key={year} 
              className={`flex ${isMobile ? "flex-col" : "flex-row"} items-center gap-1`}
            >
              <div 
                className={`
                  h-12 w-12 rounded-md flex items-center justify-center text-xs 
                  ${isCurrentYear ? "text-white font-bold" : isPastYear ? "text-gray-800" : "text-gray-600"}
                `} 
                style={{ 
                  backgroundColor: getSquareColor(year),
                  transition: "all 0.2s ease-out"
                }}
                title={`${year}: ${isPastYear ? t("past") : isCurrentYear ? t("present") : t("future")}`}
              >
                {year}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
