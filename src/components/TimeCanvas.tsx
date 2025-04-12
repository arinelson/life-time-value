
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { getGridDimensions, getDateFromIndex } from "@/utils/timeCalculations";
import { 
  CalendarDays, 
  CalendarRange, 
  CalendarIcon, 
  Calendar as CalendarFull 
} from "lucide-react";

export function TimeCanvas() {
  const { t } = useLanguage();
  const { 
    birthDate, 
    lifeExpectancy, 
    timeUnit, 
    totalUnits, 
    elapsedUnits,
    hasGenerated,
    setHasGenerated
  } = useTimeCanvas();
  
  const [grid, setGrid] = useState<{ rows: number, cols: number }>({ rows: 0, cols: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (birthDate && totalUnits > 0) {
      const dimensions = getGridDimensions(totalUnits);
      setGrid(dimensions);
      setHasGenerated(true);
    }
  }, [birthDate, totalUnits, setHasGenerated]);

  // Get the appropriate icon based on time unit
  const getUnitIcon = () => {
    switch (timeUnit) {
      case "days":
        return <CalendarDays className="h-5 w-5" />;
      case "weeks":
        return <CalendarRange className="h-5 w-5" />;
      case "months":
        return <CalendarIcon className="h-5 w-5" />;
      case "years":
        return <CalendarFull className="h-5 w-5" />;
      default:
        return <CalendarDays className="h-5 w-5" />;
    }
  };

  const getCellClass = (index: number) => {
    if (index === elapsedUnits) {
      return "canvas-present";
    } else if (index < elapsedUnits) {
      return "canvas-past";
    } else {
      return "canvas-future";
    }
  };

  const getCellContent = (index: number) => {
    if (!birthDate) return null;

    // Only show content for specific units
    if (timeUnit === "years") {
      const date = getDateFromIndex(birthDate, index, timeUnit);
      return date.getFullYear();
    }
    
    return null;
  };

  // Generate tooltip text for cell
  const getCellTooltip = (index: number) => {
    if (!birthDate) return "";
    
    const date = getDateFromIndex(birthDate, index, timeUnit);
    return format(date, "PP");
  };

  if (!birthDate) {
    return null;
  }

  return (
    <div className="w-full h-full" id="time-canvas" ref={canvasRef}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getUnitIcon()}
          <h3 className="text-xl font-bold">{t(timeUnit)}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("past")}: {elapsedUnits} / {totalUnits} {t(timeUnit)}
        </div>
      </div>

      <div 
        className="canvas-grid border rounded-lg p-4 overflow-y-auto"
        style={{ 
          gridTemplateRows: `repeat(${grid.rows}, minmax(8px, 1fr))`,
          gridTemplateColumns: `repeat(${grid.cols}, minmax(8px, 1fr))`,
          maxWidth: '100%',
          height: 'auto',
          maxHeight: '70vh',
          overflowX: 'hidden'
        }}
      >
        {Array.from({ length: totalUnits }).map((_, index) => (
          <div
            key={index}
            className={`canvas-cell ${getCellClass(index)}`}
            title={getCellTooltip(index)}
            data-index={index}
          >
            {getCellContent(index)}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex gap-2 items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm canvas-past"></div>
          <span>{t("past")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm canvas-present"></div>
          <span>{t("present")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm canvas-future"></div>
          <span>{t("future")}</span>
        </div>
      </div>
    </div>
  );
}

export default TimeCanvas;
