
import React, { useMemo } from "react";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { format, eachYearOfInterval } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimelineViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function TimelineView({
  birthDate,
  lifeExpectancy,
}: TimelineViewProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const years = useMemo(() => {
    if (!birthDate) return [];
    
    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    return eachYearOfInterval({
      start: birthDate,
      end: endDate
    });
  }, [birthDate, lifeExpectancy]);

  const currentYear = new Date().getFullYear();

  // Calculate actual item height based on number of years
  const itemHeight = useMemo(() => Math.max(30, Math.min(80, 400 / years.length)), [years.length]);

  return (
    <ScrollArea className="h-[400px]">
      <div className="relative pl-8 py-4">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        {/* Timeline items */}
        {years.map((date, index) => {
          const year = date.getFullYear();
          const isCurrentYear = year === currentYear;
          const isPast = year < currentYear;
          
          return (
            <div 
              key={year} 
              className="relative mb-2"
              style={{ minHeight: `${itemHeight}px` }}
            >
              {/* Timeline dot */}
              <div 
                className={`absolute left-4 w-4 h-4 rounded-full -translate-x-1.5 ${
                  isPast 
                    ? "bg-canvas-past" 
                    : isCurrentYear 
                    ? "bg-canvas-present" 
                    : "bg-canvas-future border border-border"
                }`}
              />
              
              {/* Year label */}
              <div 
                className={`ml-8 ${
                  isCurrentYear 
                    ? "font-bold text-canvas-present" 
                    : isPast 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}
              >
                <div className="text-base">{year}</div>
                {isCurrentYear && (
                  <div className="text-sm text-canvas-present">
                    {t("presentYear")}
                  </div>
                )}
                {index === 0 && (
                  <div className="text-sm text-muted-foreground">
                    {t("birthYear")}
                  </div>
                )}
                {index === years.length - 1 && (
                  <div className="text-sm text-muted-foreground">
                    {t("lifeExpectancyEnd")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
