
import React, { useMemo } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { eachYearOfInterval } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface LineChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function LineChartView({
  birthDate,
  lifeExpectancy,
}: LineChartViewProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();

  const chartData = useMemo(() => {
    if (!birthDate) return [];
    
    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    const years = eachYearOfInterval({
      start: birthDate,
      end: endDate
    });

    // Calculate progress as a percentage
    return years.map(date => {
      const year = date.getFullYear();
      const birthYear = birthDate.getFullYear();
      const totalYears = lifeExpectancy;
      const yearsLived = year - birthYear;
      const percentComplete = Math.min(100, (yearsLived / totalYears) * 100);

      return {
        name: year.toString(),
        progress: year <= currentYear ? percentComplete : null,
        projection: percentComplete,
      };
    });
  }, [birthDate, lifeExpectancy, currentYear]);

  const chartConfig = {
    progress: { color: "var(--canvas-present)" },
    projection: { color: "var(--canvas-future)" }
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={50} 
          interval={isMobile ? Math.ceil(chartData.length / 8) : 0} 
        />
        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
        <ReferenceLine x={currentYear.toString()} stroke="var(--canvas-present)" label={t("present")} />
        <Line 
          type="monotone" 
          dataKey="progress" 
          stroke="var(--canvas-present)" 
          strokeWidth={2} 
          dot={{ stroke: 'var(--canvas-present)', strokeWidth: 2, r: 4 }} 
        />
        <Line 
          type="monotone" 
          dataKey="projection" 
          stroke="var(--canvas-future)" 
          strokeWidth={2} 
          strokeDasharray="5 5" 
          dot={false}
        />
      </RechartsLineChart>
    </ChartContainer>
  );
}
