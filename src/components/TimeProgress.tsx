
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { getRandomQuote } from "@/utils/lifeQuotes";

export function TimeProgress() {
  const { t, language } = useLanguage();
  const { birthDate, lifeExpectancy, elapsedUnits, totalUnits } = useTimeCanvas();
  const [quote, setQuote] = useState<string>("");
  
  // Update quote when data or language changes
  useEffect(() => {
    if (birthDate) {
      setQuote(getRandomQuote(language));
    }
  }, [birthDate, lifeExpectancy, totalUnits, language]);

  // Calculate percentage of time lived
  const percentElapsed = Math.min(100, Math.round((elapsedUnits / totalUnits) * 100)) || 0;
  const percentRemaining = 100 - percentElapsed;

  if (!birthDate) return null;

  // Calculate important dates
  const now = new Date();
  const birthYear = birthDate.getFullYear();
  const expectedEndYear = birthYear + lifeExpectancy;
  const yearsElapsed = now.getFullYear() - birthYear;
  const yearsRemaining = lifeExpectancy - yearsElapsed;

  return (
    <div className="grid gap-6 p-6 border rounded-lg bg-card mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("timeElapsed")}</span>
            <span className="text-sm font-semibold">{percentElapsed}%</span>
          </div>
          <Progress value={percentElapsed} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("born")}: {format(birthDate, "PP")} ({yearsElapsed} {t("yearsOld")})
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("timeRemaining")}</span>
            <span className="text-sm font-semibold">{percentRemaining}%</span>
          </div>
          <Progress value={percentRemaining} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("lifeExpectancy")}: {expectedEndYear} ({yearsRemaining} {t("yearsOld")})
          </p>
        </div>
      </div>
      
      {/* Philosophical quote */}
      {quote && (
        <div className="mt-2 border-t pt-4">
          <blockquote className="italic text-center text-muted-foreground px-4">
            "{quote}"
          </blockquote>
        </div>
      )}
    </div>
  );
}

export default TimeProgress;
