
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { calculateTotalUnits, calculateElapsedUnits, TimeUnit } from "@/utils/timeCalculations";
import type { VisualizationType } from "@/components/VisualizationSelector";

type TimeCanvasContextType = {
  birthDate: Date | null;
  setBirthDate: (date: Date | null) => void;
  lifeExpectancy: number;
  setLifeExpectancy: (years: number) => void;
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  visualizationType: VisualizationType;
  setVisualizationType: (type: VisualizationType) => void;
  totalUnits: number;
  elapsedUnits: number;
  hasGenerated: boolean;
  setHasGenerated: (generated: boolean) => void;
};

const TimeCanvasContext = createContext<TimeCanvasContextType | undefined>(undefined);

export function TimeCanvasProvider({ children }: { children: ReactNode }) {
  const [birthDate, setBirthDateRaw] = useState<Date | null>(null);
  const [lifeExpectancy, setLifeExpectancyRaw] = useState<number>(80);
  const [timeUnit, setTimeUnitRaw] = useState<TimeUnit>("weeks");
  const [visualizationType, setVisualizationTypeRaw] = useState<VisualizationType>("grid");
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [elapsedUnits, setElapsedUnits] = useState<number>(0);
  const [hasGenerated, setHasGeneratedRaw] = useState<boolean>(false);

  // Simple wrapper functions without localStorage
  const setBirthDate = useCallback((date: Date | null) => {
    setBirthDateRaw(date);
  }, []);

  const setLifeExpectancy = useCallback((years: number) => {
    setLifeExpectancyRaw(years);
  }, []);

  const setTimeUnit = useCallback((unit: TimeUnit) => {
    setTimeUnitRaw(unit);
  }, []);
  
  const setVisualizationType = useCallback((type: VisualizationType) => {
    setVisualizationTypeRaw(type);
  }, []);

  const setHasGenerated = useCallback((generated: boolean) => {
    setHasGeneratedRaw(generated);
  }, []);

  useEffect(() => {
    if (birthDate) {
      // Use a timeout to prevent UI blocking when recalculating
      const timeoutId = setTimeout(() => {
        const total = calculateTotalUnits(birthDate, lifeExpectancy, timeUnit);
        setTotalUnits(total);
        
        const elapsed = calculateElapsedUnits(birthDate, timeUnit);
        setElapsedUnits(elapsed);
      }, 0);
      
      return () => clearTimeout(timeoutId);
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
        visualizationType,
        setVisualizationType,
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
