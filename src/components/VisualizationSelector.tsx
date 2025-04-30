
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  LineChart,
  PieChart,
  ActivitySquare,
  TrendingUp,
  Layers,
  GitBranchPlus,
  BarChartHorizontal,
  RadarIcon,
  Timer,
  ArrowRightFromLine,
  CircleDot,
  Kanban,
  Users,
  Clock
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export type VisualizationType = 
  | "grid" 
  | "heatmap" 
  | "bar" 
  | "line" 
  | "pie" 
  | "gauge" 
  | "area" 
  | "timeline" 
  | "radar"
  | "timeUnits";

export function VisualizationSelector() {
  const { visualizationType, setVisualizationType } = useTimeCanvas();
  const { t } = useLanguage();

  const visualizationOptions = [
    { type: "grid", label: "grid", icon: <Kanban className="h-4 w-4" /> },
    { type: "heatmap", label: "heatmap", icon: <ActivitySquare className="h-4 w-4" /> },
    { type: "bar", label: "barChart", icon: <BarChart3 className="h-4 w-4" /> },
    { type: "line", label: "lineChart", icon: <LineChart className="h-4 w-4" /> },
    { type: "pie", label: "pieChart", icon: <PieChart className="h-4 w-4" /> },
    { type: "gauge", label: "humanDevelopment", icon: <Users className="h-4 w-4" /> },
    { type: "area", label: "areaChart", icon: <TrendingUp className="h-4 w-4" /> },
    { type: "timeline", label: "timeline", icon: <Timer className="h-4 w-4" /> },
    { type: "radar", label: "radarChart", icon: <RadarIcon className="h-4 w-4" /> },
    { type: "timeUnits", label: "timeUnits", icon: <Clock className="h-4 w-4" /> },
  ] as const;

  return (
    <ScrollArea 
      className="w-full" 
      orientation="horizontal"
    >
      <Tabs
        value={visualizationType}
        onValueChange={(value) => setVisualizationType(value as VisualizationType)}
        className="w-full mb-6"
      >
        <TabsList className="flex w-full h-auto p-1">
          {visualizationOptions.map((option) => (
            <TabsTrigger 
              key={option.type} 
              value={option.type}
              className="flex items-center gap-2 px-3 py-2"
              aria-label={option.label}
            >
              {option.icon}
              <span className="hidden sm:inline">{t(option.label)}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </ScrollArea>
  );
}

export default VisualizationSelector;
