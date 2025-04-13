
import React, { useMemo } from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface RadarChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function RadarChartView({
  elapsedUnits,
  totalUnits,
  timeUnit,
  birthDate,
  lifeExpectancy,
}: RadarChartViewProps) {
  const { t } = useLanguage();
  
  // Create lifecycle stages for the radar chart
  const chartData = useMemo(() => {
    if (!birthDate) return [];
    
    const currentYear = new Date().getFullYear();
    const birthYear = birthDate.getFullYear();
    const currentAge = currentYear - birthYear;
    
    // Define life stages with expected percentages at each stage
    const stages = [
      { name: t("childhood"), max: 100, expected: 18 },
      { name: t("youngAdult"), max: 100, expected: 30 },
      { name: t("adult"), max: 100, expected: 50 },
      { name: t("midlife"), max: 100, expected: 65 },
      { name: t("senior"), max: 100, expected: lifeExpectancy }
    ];
    
    // Calculate percentage completed for each stage
    return stages.map(stage => {
      const percentComplete = currentAge >= stage.expected 
        ? 100 
        : Math.round((currentAge / stage.expected) * 100);
      
      return {
        subject: stage.name,
        completed: percentComplete,
        full: 100
      };
    });
  }, [birthDate, lifeExpectancy, t]);

  const chartConfig = {
    completed: { color: "var(--canvas-present)" },
    full: { color: "var(--canvas-future)" }
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <RechartsRadarChart data={chartData} outerRadius={150}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
        <Radar 
          name={t("lifeProgress")} 
          dataKey="completed" 
          stroke="var(--canvas-present)" 
          fill="var(--canvas-present)" 
          fillOpacity={0.6}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </RechartsRadarChart>
    </ChartContainer>
  );
}
