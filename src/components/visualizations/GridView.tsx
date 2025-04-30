
import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getGridDimensions, getDateFromIndex, TimeUnit } from "@/utils/timeCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import { Clock } from "lucide-react";

interface GridViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function GridView({ 
  elapsedUnits,
  totalUnits,
  timeUnit,
  birthDate,
  lifeExpectancy
}: GridViewProps) {
  const isMobile = useIsMobile();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);
  
  // State for the real-time countdown for small time units
  const [countdown, setCountdown] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Check if we're using a small time unit (hours, minutes, seconds)
  const isSmallTimeUnit = useMemo(() => {
    return timeUnit === "hours" || timeUnit === "minutes" || timeUnit === "seconds";
  }, [timeUnit]);

  const grid = useMemo(() => {
    return getGridDimensions(totalUnits, timeUnit);
  }, [totalUnits, timeUnit]);

  const currentYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  // Calculate the total remaining time units based on the countdown
  const calculateTotalRemaining = useCallback(() => {
    const { years, days, hours, minutes, seconds } = countdown;

    switch(timeUnit) {
      case "hours":
        return years * 365.25 * 24 + days * 24 + hours;
      case "minutes":
        return (years * 365.25 * 24 + days * 24 + hours) * 60 + minutes;
      case "seconds":
        return ((years * 365.25 * 24 + days * 24 + hours) * 60 + minutes) * 60 + seconds;
      default:
        return 0;
    }
  }, [countdown, timeUnit]);

  // Calculate the remaining time in real-time for hours, minutes, seconds
  useEffect(() => {
    // Only run this effect for small time units
    if (!isSmallTimeUnit) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      const birthYear = birthDate.getFullYear();
      const targetDate = new Date(
        birthYear + lifeExpectancy, 
        birthDate.getMonth(), 
        birthDate.getDate(), 
        birthDate.getHours(), 
        birthDate.getMinutes(), 
        birthDate.getSeconds()
      );
      
      const timeDiff = targetDate.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setCountdown({
          years: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      // Calculate the time components
      const secondsInMinute = 60;
      const secondsInHour = 60 * 60;
      const secondsInDay = 24 * 60 * 60;
      const secondsInYear = 365.25 * 24 * 60 * 60;
      
      const secondsTotal = Math.floor(timeDiff / 1000);
      
      const years = Math.floor(secondsTotal / secondsInYear);
      const days = Math.floor((secondsTotal % secondsInYear) / secondsInDay);
      const hours = Math.floor((secondsTotal % secondsInDay) / secondsInHour);
      const minutes = Math.floor((secondsTotal % secondsInHour) / secondsInMinute);
      const seconds = Math.floor(secondsTotal % secondsInMinute);
      
      setCountdown({
        years,
        days,
        hours,
        minutes,
        seconds
      });
    };
    
    // Initial calculation
    calculateRemainingTime();
    
    // Update every second for small time units
    const intervalId = setInterval(calculateRemainingTime, 1000);
    
    // Cleanup interval on component unmount or when time unit changes
    return () => clearInterval(intervalId);
  }, [birthDate, lifeExpectancy, isSmallTimeUnit]);

  const getCellClass = useCallback((index: number) => {
    // For years, we need to ensure the current year is marked as present
    if (timeUnit === "years") {
      const date = getDateFromIndex(birthDate, index, timeUnit);
      const year = date.getFullYear();
      
      if (year === currentYear) {
        return "canvas-present";
      }
      if (year < currentYear) {
        return "canvas-past";
      }
      return "canvas-future";
    } else {
      // For other time units, use the elapsed units for comparison
      if (index === elapsedUnits) {
        return "canvas-present";
      }
      if (index < elapsedUnits) {
        return "canvas-past";
      }
      return "canvas-future";
    }
  }, [elapsedUnits, birthDate, timeUnit, currentYear]);

  const getCellContent = useCallback((index: number) => {
    if (!birthDate) return null;

    if (timeUnit === "years") {
      const date = getDateFromIndex(birthDate, index, timeUnit);
      return date.getFullYear();
    }
    
    return null;
  }, [birthDate, timeUnit]);

  const getCellTooltip = useCallback((index: number) => {
    if (!birthDate) return "";
    
    const date = getDateFromIndex(birthDate, index, timeUnit);
    return format(date, "PP");
  }, [birthDate, timeUnit]);

  // Memoize cells to prevent re-renders
  const renderAllCells = useMemo(() => {
    // For performance reasons, limit the number of cells we render for small time units
    if (isSmallTimeUnit && totalUnits > 1000) {
      return null;
    }
    
    const cells = [];
    
    for (let i = 0; i < totalUnits; i++) {
      const content = getCellContent(i);
      const cellClass = getCellClass(i);
      
      cells.push(
        <div
          key={i}
          className={`canvas-cell ${cellClass}`}
          title={getCellTooltip(i)}
          data-index={i}
        >
          {content}
        </div>
      );
    }
    return cells;
  }, [totalUnits, getCellClass, getCellContent, getCellTooltip, isSmallTimeUnit]);

  // For small time units (hours, minutes, seconds), show real-time countdown
  const renderTimeUnitDisplay = () => {
    if (!isSmallTimeUnit) return null;

    const totalRemaining = calculateTotalRemaining();
    
    let displayElement;
    
    switch(timeUnit) {
      case "hours": {
        const hours = Math.floor(totalRemaining);
        const minutes = Math.floor((totalRemaining - hours) * 60);
        const seconds = Math.floor(((totalRemaining - hours) * 60 - minutes) * 60);
        
        displayElement = (
          <>
            <div className="text-4xl font-bold mb-2">
              {hours.toLocaleString()}
            </div>
            <p className="text-muted-foreground mb-4">hours remaining</p>
            
            <div className="flex justify-center items-center gap-4">
              <div className="bg-card p-3 rounded-lg border">
                <div className="text-2xl font-bold">{countdown.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">hours</div>
              </div>
              <div className="text-xl">:</div>
              <div className="bg-card p-3 rounded-lg border">
                <div className="text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">min</div>
              </div>
              <div className="text-xl">:</div>
              <div className="bg-card p-3 rounded-lg border animate-pulse">
                <div className="text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">sec</div>
              </div>
            </div>
          </>
        );
        break;
      }
      
      case "minutes": {
        const minutes = Math.floor(totalRemaining);
        const seconds = Math.floor((totalRemaining - minutes) * 60);
        
        displayElement = (
          <>
            <div className="text-4xl font-bold mb-2">
              {minutes.toLocaleString()}
            </div>
            <p className="text-muted-foreground mb-4">minutes remaining</p>
            
            <div className="flex justify-center items-center gap-4">
              <div className="bg-card p-3 rounded-lg border">
                <div className="text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">minutes</div>
              </div>
              <div className="text-xl">:</div>
              <div className="bg-card p-3 rounded-lg border animate-pulse">
                <div className="text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-muted-foreground">seconds</div>
              </div>
            </div>
          </>
        );
        break;
      }
      
      case "seconds":
        displayElement = (
          <>
            <div className="text-4xl font-bold mb-2 animate-pulse">
              {Math.floor(totalRemaining).toLocaleString()}
            </div>
            <p className="text-muted-foreground mb-4">seconds remaining</p>
            
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000" 
                style={{ width: `${(countdown.seconds / 60) * 100}%` }}
              ></div>
            </div>
          </>
        );
        break;
      
      default:
        displayElement = null;
    }
    
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8 bg-card shadow-sm rounded-lg border p-6 mb-6">
        <div className="flex justify-center mb-4">
          <Clock className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold">Time Remaining</h3>
        {displayElement}
      </div>
    );
  };

  // Scroll to present element but debounce it to prevent performance issues
  useEffect(() => {
    if (isSmallTimeUnit) return; // Don't attempt scrolling for small time units
    
    const scrollToPresent = () => {
      if (!gridContainerRef.current) return;
      
      const presentCell = gridContainerRef.current.querySelector(".canvas-present");
      if (presentCell) {
        const scrollAreaViewport = gridContainerRef.current.closest("[data-radix-scroll-area-viewport]") as HTMLElement;
        
        if (scrollAreaViewport) {
          const cellRect = (presentCell as HTMLElement).getBoundingClientRect();
          const viewportRect = scrollAreaViewport.getBoundingClientRect();
          
          const scrollLeft = (presentCell as HTMLElement).offsetLeft - (viewportRect.width / 2) + (cellRect.width / 2);
          
          scrollAreaViewport.scrollTo({
            left: scrollLeft,
            behavior: isInitialRender.current ? 'auto' : 'smooth'
          });
        }
      }
      isInitialRender.current = false;
    };

    // Use a delay to ensure the DOM is ready
    const timer = setTimeout(scrollToPresent, 100);
    return () => clearTimeout(timer);
  }, [elapsedUnits, totalUnits, isSmallTimeUnit]);

  return (
    <>
      {/* Always show the time unit display for small units */}
      {isSmallTimeUnit && renderTimeUnitDisplay()}
      
      {/* Only render the grid for non-small time units or if there aren't too many units */}
      {(!isSmallTimeUnit || (isSmallTimeUnit && totalUnits <= 1000)) && (
        <ScrollArea 
          className="border rounded-lg p-4" 
          style={{ height: timeUnit === "years" ? "auto" : "500px" }}
          orientation="both"
          ref={gridContainerRef}
        >
          <div 
            className="canvas-grid"
            style={{ 
              gridTemplateRows: `repeat(${grid.rows}, minmax(20px, 1fr))`,
              gridTemplateColumns: `repeat(${grid.cols}, minmax(20px, 1fr))`,
              width: isMobile ? `${grid.cols * 25}px` : '100%',
              minWidth: '100%',
              minHeight: timeUnit === "years" ? "auto" : "450px"
            }}
          >
            {renderAllCells}
          </div>
        </ScrollArea>
      )}
    </>
  );
}

export default GridView;
