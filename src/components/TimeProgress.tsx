
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { Progress } from "@/components/ui/progress";
import { format, differenceInMonths, differenceInDays } from "date-fns";
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
  
  // Calculate exact age
  const yearsElapsed = Math.floor((now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  const nextBirthday = new Date(birthDate);
  nextBirthday.setFullYear(now.getFullYear());
  
  // If birthday already happened this year, set to next year
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }
  
  // Calculate months and days until next birthday
  const monthsUntilNextBirthday = differenceInMonths(nextBirthday, now);
  let daysUntilNextBirthday = differenceInDays(nextBirthday, now) % 30; // Approximate
  
  // Format the age display string
  let ageDisplay = `${yearsElapsed} ${t("yearsOld")}`;
  if (monthsUntilNextBirthday > 0 || daysUntilNextBirthday > 0) {
    ageDisplay += ` (${monthsUntilNextBirthday > 0 ? `${monthsUntilNextBirthday} ${t("months")} ` : ''}${daysUntilNextBirthday > 0 ? `${daysUntilNextBirthday} ${t("days")}` : ''} ${t("untilNextBirthday")})`;
  }
  
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
            {t("born")}: {format(birthDate, "PP")} ({ageDisplay})
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t("timeRemaining")}</span>
            <span className="text-sm font-semibold">{percentRemaining}%</span>
          </div>
          <Progress value={percentRemaining} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {t("lifeExpectancy")}: {expectedEndYear} ({yearsRemaining} {t("yearsRemaining")})
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
