
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { calculateTotalUnits, calculateElapsedUnits, TimeUnit } from "@/utils/timeCalculations";

type TimeCanvasContextType = {
  birthDate: Date | null;
  setBirthDate: (date: Date | null) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (years: number) => void;
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  totalUnits: number;
  elapsedUnits: number;
  hasGenerated: boolean;
  setHasGenerated: (generated: boolean) => void;
};

const TimeCanvasContext = createContext<TimeCanvasContextType | undefined>(undefined);

export function TimeCanvasProvider({ children }: { children: ReactNode }) {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("weeks");
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [elapsedUnits, setElapsedUnits] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  useEffect(() => {
    if (birthDate) {
      const total = calculateTotalUnits(birthDate, lifeExpectancy, timeUnit);
      setTotalUnits(total);
      
      const elapsed = calculateElapsedUnits(birthDate, timeUnit);
      setElapsedUnits(elapsed);
    }
  }, [birthDate, lifeExpectancy, timeUnit]);

  return (
    <TimeCanvasContext.Provider
      value={{
        birthDate,
        setBirthDate,
        lifeExpectancy,
        setLifeExpectancy,
        timeUnit,
        setTimeUnit,
        totalUnits,
        elapsedUnits,
        hasGenerated,
        setHasGenerated
      }}
    >
      {children}
    </TimeCanvasContext.Provider>
  );
}

export function useTimeCanvas() {
  const context = useContext(TimeCanvasContext);
  if (context === undefined) {
    throw new Error("useTimeCanvas must be used within a TimeCanvasProvider");
  }
  return context;
}
