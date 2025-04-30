
import { useState } from "react";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { useLanguage } from "@/hooks/useLanguage";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, CalendarRange, CalendarIcon, Calendar as CalendarFull, Clock } from "lucide-react";
import type { TimeUnit } from "@/utils/timeCalculations";

export function TimeUnitSelector() {
  const { timeUnit, setTimeUnit } = useTimeCanvas();
  const { t } = useLanguage();

  const timeUnits = [
    { 
      value: "years", 
      label: "years", 
      icon: <CalendarFull className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "months", 
      label: "months", 
      icon: <CalendarIcon className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "weeks", 
      label: "weeks", 
      icon: <CalendarRange className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "days", 
      label: "days", 
      icon: <CalendarDays className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "hours", 
      label: "hours", 
      icon: <Clock className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "minutes", 
      label: "minutes", 
      icon: <Clock className="mr-2 h-4 w-4" /> 
    },
    { 
      value: "seconds", 
      label: "seconds", 
      icon: <Clock className="mr-2 h-4 w-4" /> 
    }
  ];

  const handleSelectTimeUnit = (value: string) => {
    setTimeUnit(value as TimeUnit);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="time-unit">{t("timeUnit")}</Label>
      <Select value={timeUnit} onValueChange={handleSelectTimeUnit}>
        <SelectTrigger id="time-unit">
          <SelectValue placeholder="Select Time Unit" />
        </SelectTrigger>
        <SelectContent>
          {timeUnits.map((unit) => (
            <SelectItem key={unit.value} value={unit.value}>
              <div className="flex items-center">
                {unit.icon}
                {unit.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default TimeUnitSelector;
