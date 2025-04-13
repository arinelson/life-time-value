
import React, { useMemo } from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";
import { eachYearOfInterval } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface AreaChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function AreaChartView({
  birthDate,
  lifeExpectancy,
}: AreaChartViewProps) {
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

    // Calculate life percentage for each year
    return years.map(date => {
      const year = date.getFullYear();
      const birthYear = birthDate.getFullYear();
      const endYear = birthYear + lifeExpectancy;
      const percentComplete = ((year - birthYear) / lifeExpectancy) * 100;
      
      return {
        name: year.toString(),
        past: year <= currentYear ? percentComplete : 0,
        future: year > currentYear ? percentComplete : 0,
      };
    });
  }, [birthDate, lifeExpectancy, currentYear]);

  const chartConfig = {
    past: { color: "var(--canvas-past)" },
    future: { color: "var(--canvas-future)" }
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <RechartsAreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
        <ReferenceLine x={currentYear.toString()} stroke="var(--canvas-present)" />
        <defs>
          <linearGradient id="pastGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--canvas-present)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--canvas-past)" stopOpacity={0.2}/>
          </linearGradient>
          <linearGradient id="futureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--canvas-future)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--canvas-future)" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="past" 
          stroke="var(--canvas-present)"
          fill="url(#pastGradient)"
        />
        <Area 
          type="monotone" 
          dataKey="future" 
          stroke="var(--canvas-future)" 
          fill="url(#futureGradient)" 
          strokeDasharray="5 5"
        />
      </RechartsAreaChart>
    </ChartContainer>
  );
}
