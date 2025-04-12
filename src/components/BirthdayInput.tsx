
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";

export function BirthdayInput() {
  const { t } = useLanguage();
  const { birthDate, setBirthDate } = useTimeCanvas();
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Update the context when the date changes
  useEffect(() => {
    if (date) {
      setBirthDate(date);
    }
  }, [date, setBirthDate]);

  // Make sure birthDate gets updated if it's set from outside
  useEffect(() => {
    if (birthDate && (!date || birthDate.getTime() !== date.getTime())) {
      setDate(birthDate);
    }
  }, [birthDate, date]);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{t("birthday")}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PP") : t("birthday")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={(date) => date > new Date()}
            captionLayout="dropdown-buttons"
            fromYear={1900}
            toYear={new Date().getFullYear()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default BirthdayInput;
