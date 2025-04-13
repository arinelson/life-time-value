
import React, { useMemo, useCallback } from "react";
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

  // Memoize grid dimensions calculation
  const grid = useMemo(() => {
    return getGridDimensions(totalUnits);
  }, [totalUnits]);

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

  // Calculate if we need scroll based on time unit
  const needsScroll = useMemo(() => {
    if (timeUnit === "days" || 
       (isMobile && (timeUnit === "weeks" || timeUnit === "months")) || 
       totalUnits > 100) {
      return true;
    }
    return false;
  }, [timeUnit, isMobile, totalUnits]);
  
  // Calculate dynamic height based on time unit
  const getCanvasHeight = useMemo(() => {
    if (timeUnit === "years") return "auto";
    if (timeUnit === "months") return isMobile ? "500px" : "auto";
    if (timeUnit === "weeks") return isMobile ? "500px" : "auto";
    return "500px"; // For days, always use fixed height with scroll
  }, [timeUnit, isMobile]);

  // Ensure the present cell is visible on mobile
  const scrollToPresent = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    
    // Find the present element
    const presentElement = container.querySelector(".canvas-present");
    if (presentElement && isMobile) {
      // Calculate the position to scroll to
      const gridWidth = container.scrollWidth;
      const elementPosition = (presentElement as HTMLElement).offsetLeft;
      const containerWidth = container.clientWidth;
      
      // Center the present element in the view
      container.scrollLeft = elementPosition - (containerWidth / 2);
    }
  }, [isMobile]);

  // For mobile optimization, only render a subset of cells around the current position
  const getCellsToRender = useMemo(() => {
    const cells = [];
    const buffer = isMobile ? 500 : totalUnits; // On mobile, only render cells near the viewport
    const startIndex = Math.max(0, elapsedUnits - buffer);
    const endIndex = Math.min(totalUnits, elapsedUnits + buffer);
    
    for (let i = startIndex; i < endIndex; i++) {
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
  }, [elapsedUnits, totalUnits, getCellClass, getCellContent, getCellTooltip, isMobile]);

  if (needsScroll) {
    return (
      <ScrollArea 
        className="border rounded-lg p-4" 
        style={{ height: getCanvasHeight }}
        orientation={isMobile ? "horizontal" : "vertical"}
        onLoadCapture={(e) => scrollToPresent(e.currentTarget)}
      >
        <div 
          className="canvas-grid"
          style={{ 
            gridTemplateRows: `repeat(${grid.rows}, minmax(20px, 1fr))`,
            gridTemplateColumns: `repeat(${grid.cols}, minmax(20px, 1fr))`,
            width: isMobile ? `${grid.cols * 25}px` : '100%'
          }}
        >
          {getCellsToRender}
        </div>
      </ScrollArea>
    );
  }

  return (
    <div 
      className="canvas-grid border rounded-lg p-4"
      style={{ 
        gridTemplateRows: `repeat(${grid.rows}, minmax(20px, 1fr))`,
        gridTemplateColumns: `repeat(${grid.cols}, minmax(20px, 1fr))`,
        width: '100%'
      }}
    >
      {getCellsToRender}
    </div>
  );
}
