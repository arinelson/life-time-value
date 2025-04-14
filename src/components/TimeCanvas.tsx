
import { useEffect, useState, useRef, useMemo } from "react";
import { format } from "date-fns";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { getGridDimensions, getDateFromIndex } from "@/utils/timeCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarDays, 
  CalendarRange, 
  CalendarIcon, 
  Calendar as CalendarFull 
} from "lucide-react";
import { GridView } from "./visualizations/GridView";
import { HeatmapView } from "./visualizations/HeatmapView";
import { BarChartView } from "./visualizations/BarChartView";
import { LineChartView } from "./visualizations/LineChartView";
import { PieChartView } from "./visualizations/PieChartView";
import { HumanDevelopmentView } from "./visualizations/HumanDevelopmentView";
import { AreaChartView } from "./visualizations/AreaChartView";
import { TimelineView } from "./visualizations/TimelineView";
import { RadarChartView } from "./visualizations/RadarChartView";
import { Card } from "@/components/ui/card";

export function TimeCanvas() {
  const { t } = useLanguage();
  const { 
    birthDate, 
    lifeExpectancy, 
    timeUnit, 
    totalUnits, 
    elapsedUnits,
    hasGenerated,
    setHasGenerated,
    visualizationType
  } = useTimeCanvas();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (birthDate && totalUnits > 0) {
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

  const renderVisualization = () => {
    if (!birthDate) return null;

    const commonProps = {
      elapsedUnits,
      totalUnits,
      timeUnit,
      birthDate,
      lifeExpectancy
    };

    switch (visualizationType) {
      case "grid":
        return <GridView {...commonProps} />;
      case "heatmap":
        return <HeatmapView {...commonProps} />;
      case "bar":
        return <BarChartView {...commonProps} />;
      case "line":
        return <LineChartView {...commonProps} />;
      case "pie":
        return <PieChartView {...commonProps} />;
      case "gauge": // We're replacing this with human development view
        return <HumanDevelopmentView {...commonProps} />;
      case "area":
        return <AreaChartView {...commonProps} />;
      case "timeline":
        return <TimelineView {...commonProps} />;
      case "radar":
        return <RadarChartView {...commonProps} />;
      default:
        return <GridView {...commonProps} />;
    }
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

      <Card className="p-4 w-full overflow-hidden">
        {renderVisualization()}
      </Card>
      
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
