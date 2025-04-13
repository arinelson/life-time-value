
import React, { useMemo } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface PieChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function PieChartView({
  elapsedUnits,
  totalUnits,
  timeUnit,
}: PieChartViewProps) {
  const { t } = useLanguage();

  const chartData = useMemo(() => {
    const remaining = totalUnits - elapsedUnits;
    return [
      {
        name: t("past"),
        value: elapsedUnits,
        color: "var(--canvas-past)"
      },
      {
        name: t("future"),
        value: remaining,
        color: "var(--canvas-future)"
      }
    ];
  }, [elapsedUnits, totalUnits, t]);

  const chartConfig = {
    past: { color: "var(--canvas-past)" },
    future: { color: "var(--canvas-future)" }
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend />
      </RechartsPieChart>
    </ChartContainer>
  );
}
