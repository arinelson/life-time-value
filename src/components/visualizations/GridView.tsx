import React, { useMemo, useCallback, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getGridDimensions, getDateFromIndex, TimeUnit } from "@/utils/timeCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

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
  birthDate 
}: GridViewProps) {
  const isMobile = useIsMobile();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const isInitialRender = useRef(true);

  // Memoize grid dimensions calculation with better settings for visibility
  const grid = useMemo(() => {
    if (timeUnit === "years") {
      // For years, keep a square-ish grid
      const squareSide = Math.ceil(Math.sqrt(totalUnits));
      return { rows: squareSide, cols: Math.ceil(totalUnits / squareSide) };
    } else if (timeUnit === "months") {
      // For months, create a grid that shows more columns
      return { rows: Math.min(12, Math.ceil(totalUnits / 12)), cols: 12 };
    } else if (timeUnit === "weeks") {
      // For weeks, create a grid with 52 weeks per row (year)
      return { rows: Math.ceil(totalUnits / 52), cols: 52 };
    } else {
      // For days, create a scrollable grid with months as rows
      return { rows: Math.ceil(totalUnits / 30), cols: 30 };
    }
  }, [totalUnits, timeUnit]);

  // Memoize cell class determination
  const getCellClass = useCallback((index: number) => {
    if (index === elapsedUnits) {
      return "canvas-present";
    } else if (index < elapsedUnits) {
      return "canvas-past";
    } else {
      return "canvas-future";
    }
  }, [elapsedUnits]);

  const getCellContent = useCallback((index: number) => {
    if (!birthDate) return null;

    // Only show content for specific units
    if (timeUnit === "years") {
      const date = getDateFromIndex(birthDate, index, timeUnit);
      return date.getFullYear();
    }
    
    return null;
  }, [birthDate, timeUnit]);

  // Generate tooltip text for cell
  const getCellTooltip = useCallback((index: number) => {
    if (!birthDate) return "";
    
    const date = getDateFromIndex(birthDate, index, timeUnit);
    return format(date, "PP");
  }, [birthDate, timeUnit]);

  // Render all cells for completeness
  const renderAllCells = useMemo(() => {
    const cells = [];
    
    for (let i = 0; i < totalUnits; i++) {
      cells.push(
        <div
          key={i}
          className={`canvas-cell ${getCellClass(i)}`}
          title={getCellTooltip(i)}
          data-index={i}
        >
          {getCellContent(i)}
        </div>
      );
    }
    return cells;
  }, [totalUnits, getCellClass, getCellContent, getCellTooltip]);

  // Auto-scroll to present cell on mount and when elapsedUnits changes
  useEffect(() => {
    const scrollToPresent = () => {
      if (!gridContainerRef.current) return;
      
      const presentCell = gridContainerRef.current.querySelector(".canvas-present");
      if (presentCell) {
        // Find the containing scroll area
        const scrollAreaViewport = gridContainerRef.current.closest("[data-radix-scroll-area-viewport]") as HTMLElement;
        
        if (scrollAreaViewport) {
          const cellRect = (presentCell as HTMLElement).getBoundingClientRect();
          const viewportRect = scrollAreaViewport.getBoundingClientRect();
          
          // Calculate scroll position to center the present cell
          const scrollLeft = (presentCell as HTMLElement).offsetLeft - (viewportRect.width / 2) + (cellRect.width / 2);
          
          // Smooth scroll to the present cell
          scrollAreaViewport.scrollTo({
            left: scrollLeft,
            behavior: isInitialRender.current ? 'auto' : 'smooth'
          });
        }
      }
      isInitialRender.current = false;
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(scrollToPresent, 100);
    return () => clearTimeout(timer);
  }, [elapsedUnits, totalUnits]);

  return (
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
  );
}
