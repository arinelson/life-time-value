
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label
} from "recharts";
import { TimeUnit } from "@/utils/timeCalculations";
import { useLanguage } from "@/hooks/useLanguage";
import { ChartContainer } from "@/components/ui/chart";

interface GaugeChartViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

export function GaugeChartView({
  elapsedUnits,
  totalUnits,
  timeUnit,
}: GaugeChartViewProps) {
  const { t } = useLanguage();

  // Calculate percentage of life elapsed
  const percentElapsed = useMemo(() => 
    Math.min(100, Math.round((elapsedUnits / totalUnits) * 100)) || 0
  , [elapsedUnits, totalUnits]);

  // Data for gauge chart
  const data = useMemo(() => [
    { name: 'elapsed', value: percentElapsed, color: 'var(--canvas-present)' },
    { name: 'remaining', value: 100 - percentElapsed, color: 'var(--canvas-future)' }
  ], [percentElapsed]);

  const chartConfig = {
    elapsed: { color: "var(--canvas-present)" },
    remaining: { color: "var(--canvas-future)" }
  };

  return (
    <ChartContainer className="w-full h-[400px]" config={chartConfig}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          startAngle={180}
          endAngle={0}
          innerRadius={80}
          outerRadius={120}
          paddingAngle={0}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <Label
            content={({ viewBox }) => {
              const { cx, cy } = viewBox as { cx: number; cy: number };
              return (
                <g>
                  <text 
                    x={cx} 
                    y={cy - 10} 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="text-3xl font-bold"
                  >
                    {percentElapsed}%
                  </text>
                  <text 
                    x={cx} 
                    y={cy + 20} 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    className="text-sm text-muted-foreground"
                  >
                    {t(timeUnit)} {t("completed")}
                  </text>
                </g>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
