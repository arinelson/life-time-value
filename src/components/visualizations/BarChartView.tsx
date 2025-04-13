
import React, { useMemo } from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { eachYearOfInterval } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface BarChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function BarChartView({
  elapsedUnits,
  totalUnits,
  birthDate,
  lifeExpectancy,
}: BarChartViewProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const chartData = useMemo(() => {
    if (!birthDate) return [];

    const endDate = new Date(birthDate);
    endDate.setFullYear(birthDate.getFullYear() + lifeExpectancy);
    
    const currentYear = new Date().getFullYear();
    const years = eachYearOfInterval({
      start: birthDate,
      end: endDate
    });

    // Calculate data for each time period
    return years.map(date => {
      const year = date.getFullYear();
      const isCurrentYear = year === currentYear;
      const isPast = year < currentYear;
      const progressValue = isPast ? 100 : isCurrentYear ? (elapsedUnits / totalUnits) * 100 : 0;
      const remainingValue = isPast ? 0 : isCurrentYear ? 100 - progressValue : 100;

      return {
        name: year.toString(),
        past: isPast ? 100 : isCurrentYear ? progressValue : 0,
        future: remainingValue,
        current: isCurrentYear ? 5 : 0, // Add a marker for current year
        isPast,
        isCurrent: isCurrentYear,
        isFuture: year > currentYear
      };
    });
  }, [birthDate, lifeExpectancy, elapsedUnits, totalUnits]);

  const chartConfig = {
    past: { color: "var(--canvas-past)" },
    future: { color: "var(--canvas-future)" },
    current: { color: "var(--canvas-present)" },
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={50}
          interval={isMobile ? Math.ceil(chartData.length / 10) : 0} 
        />
        <YAxis hide />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="past" stackId="stack" fill="var(--canvas-past)" />
        <Bar dataKey="future" stackId="stack" fill="var(--canvas-future)" />
        <Bar dataKey="current" fill="var(--canvas-present)" />
      </RechartsBarChart>
    </ChartContainer>
  );
}
