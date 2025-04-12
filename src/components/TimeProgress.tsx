
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export function TimeProgress() {
  const { t } = useLanguage();
  const { birthDate, lifeExpectancy, elapsedUnits, totalUnits } = useTimeCanvas();

  // Calcular porcentagem do tempo vivido
  const percentElapsed = Math.min(100, Math.round((elapsedUnits / totalUnits) * 100)) || 0;
  const percentRemaining = 100 - percentElapsed;

  if (!birthDate) return null;

  // Calcular datas importantes
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
    </div>
  );
}

export default TimeProgress;
