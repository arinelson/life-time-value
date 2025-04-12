
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { useLanguage } from "@/hooks/useLanguage";
import { TimeUnit } from "@/utils/timeCalculations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TimeUnitSelector() {
  const { t } = useLanguage();
  const { timeUnit, setTimeUnit } = useTimeCanvas();

  const handleChange = (value: string) => {
    setTimeUnit(value as TimeUnit);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{t("timeUnit")}</label>
      <Select value={timeUnit} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("timeUnit")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="days">{t("days")}</SelectItem>
          <SelectItem value="weeks">{t("weeks")}</SelectItem>
          <SelectItem value="months">{t("months")}</SelectItem>
          <SelectItem value="years">{t("years")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default TimeUnitSelector;
