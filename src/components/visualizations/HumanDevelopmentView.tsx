
import React, { useMemo } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { TimeUnit } from "@/utils/timeCalculations";
import { ChartContainer } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/context/ThemeProvider";

interface HumanDevelopmentViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: TimeUnit;
  birthDate: Date;
  lifeExpectancy: number;
}

// Define life phases with age ranges
const lifePhasesData = [
  { id: 1, title: "nascer.fisico", age: "0 - 7", description: "corpo.fisico", environment: "familia", crisis: "", goalText: "o.mundo.bom" },
  { id: 2, title: "nascer.emocional", age: "7 - 14", description: "corpo.eterico", environment: "escola", crisis: "", goalText: "vivencia.eu" },
  { id: 3, title: "nascer.identidade", age: "14 - 21", description: "corpo.astral", environment: "amigos", crisis: "crise.identidade", goalText: "afirmacao.eu" },
  { id: 4, title: "preparar.vida", age: "21 - 28", description: "alma.sensacoes", environment: "busca.lugar", crisis: "", goalText: "vivencio.mundo" },
  { id: 5, title: "integracao", age: "28 - 35", description: "alma.intelecto", environment: "conquista.lugar", crisis: "crise.talentos", goalText: "questiono.organizo.mundo" },
  { id: 6, title: "chegar.essencia", age: "35 - 42", description: "alma.consciencia", environment: "consolida.lugar", crisis: "crise.autenticidade", goalText: "questiono.mim.mesmo" },
  { id: 7, title: "nova.visao", age: "42 - 49", description: "alma.imaginativa", environment: "faz.essencial", crisis: "", goalText: "minhas.respostas" },
  { id: 8, title: "fase.sabedoria", age: "49 - 56", description: "alma.inspirativa", environment: "faz.necessario", crisis: "", goalText: "novos.valores" },
  { id: 9, title: "fase.mistica", age: "56 - 63", description: "alma.intuitiva", environment: "faz.bem", crisis: "", goalText: "nova.missao" }
];

// Educational phases
const educationalPhases = [
  { title: "educacao.receptiva", range: "0 - 21" },
  { title: "auto.afirmacao", range: "21 - 42" },
  { title: "auto.desenvolvimento", range: "42 - 63" }
];

export function HumanDevelopmentView({
  birthDate,
  lifeExpectancy,
}: HumanDevelopmentViewProps) {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  
  // Calculate current age and determine current phase
  const currentAge = useMemo(() => {
    if (!birthDate) return 0;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, [birthDate]);
  
  // Get the current phase based on age
  const currentPhase = useMemo(() => {
    if (!currentAge) return null;
    
    return lifePhasesData.find(phase => {
      const [min, max] = phase.age.split(" - ").map(Number);
      return currentAge >= min && currentAge < max;
    }) || null;
  }, [currentAge]);
  
  // Find next phase (if any)
  const nextPhase = useMemo(() => {
    if (!currentPhase) return null;
    const nextPhaseIndex = lifePhasesData.findIndex(p => p.id === currentPhase.id) + 1;
    return nextPhaseIndex < lifePhasesData.length ? lifePhasesData[nextPhaseIndex] : null;
  }, [currentPhase]);
  
  // Calculate time remaining until next phase
  const timeUntilNextPhase = useMemo(() => {
    if (!nextPhase || !currentAge) return null;
    
    const [, currentPhaseEnd] = currentPhase?.age.split(" - ").map(Number) || [0, 0];
    return currentPhaseEnd - currentAge;
  }, [nextPhase, currentAge, currentPhase]);
  
  // Determine phases the person has gone through and those remaining
  const completedPhases = useMemo(() => 
    lifePhasesData.filter(phase => {
      const [, maxAge] = phase.age.split(" - ").map(Number);
      return currentAge >= maxAge;
    }),
  [currentAge]);
  
  const upcomingPhases = useMemo(() => 
    lifePhasesData.filter(phase => {
      const [minAge] = phase.age.split(" - ").map(Number);
      return currentAge < minAge;
    }),
  [currentAge]);
  
  // Get completion percentage of current phase
  const currentPhaseCompletion = useMemo(() => {
    if (!currentPhase) return 0;
    
    const [minAge, maxAge] = currentPhase.age.split(" - ").map(Number);
    const phaseLength = maxAge - minAge;
    const yearsPassed = currentAge - minAge;
    
    return Math.min(100, Math.round((yearsPassed / phaseLength) * 100));
  }, [currentPhase, currentAge]);
  
  // Set colors based on theme
  const getPhaseColor = (phaseId: number, isCompleted: boolean, isCurrent: boolean) => {
    const baseColors = [
      { light: "#E6E6FA", dark: "#2D246B" }, // Phase 1 - Light Lavender / Dark Purple
      { light: "#D4EDDA", dark: "#134620" }, // Phase 2 - Light Green / Dark Green
      { light: "#FFF3CD", dark: "#533F03" }, // Phase 3 - Light Yellow / Dark Gold
      { light: "#D1ECF1", dark: "#0C5460" }, // Phase 4 - Light Blue / Dark Teal
      { light: "#F8D7DA", dark: "#721C24" }, // Phase 5 - Light Red / Dark Red
      { light: "#E2D1F9", dark: "#4B0082" }, // Phase 6 - Light Purple / Dark Indigo
      { light: "#FFE5D9", dark: "#7D2E00" }, // Phase 7 - Light Orange / Dark Orange
      { light: "#D0F0C0", dark: "#3A5F0B" }, // Phase 8 - Light Mint / Dark Forest
      { light: "#F5E6CC", dark: "#5E4B1C" }, // Phase 9 - Light Sand / Dark Brown
    ];
    
    const colorIndex = phaseId - 1;
    let colorObj = baseColors[colorIndex % baseColors.length];
    
    if (isCompleted) {
      return {
        background: theme === 'dark' ? `${colorObj.dark}99` : `${colorObj.light}99`,
        border: theme === 'dark' ? colorObj.dark : colorObj.light,
        text: theme === 'dark' ? "#E0E0E0" : "#333333"
      };
    } else if (isCurrent) {
      return {
        background: theme === 'dark' ? colorObj.dark : colorObj.light,
        border: theme === 'dark' ? "#FFFFFF" : "#000000",
        text: theme === 'dark' ? "#FFFFFF" : "#000000"
      };
    } else {
      return {
        background: theme === 'dark' ? `${colorObj.dark}55` : `${colorObj.light}55`,
        border: theme === 'dark' ? `${colorObj.dark}99` : `${colorObj.light}99`,
        text: theme === 'dark' ? "#999999" : "#666666"
      };
    }
  };
  
  return (
    <ChartContainer className="w-full"> 
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold mb-1">{t("humanDevelopment")}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t("sevenYearsCycle")}</p>
        
        {currentPhase && (
          <div className="mb-6">
            <p className="text-lg font-semibold">
              {t("currentPhase")}: <span className="text-primary">{t(currentPhase.title)}</span> ({currentPhase.age} {t("years")})
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentPhaseCompletion}% {t("completed")}
            </p>
            <div className="w-full bg-secondary h-2 rounded-full mt-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{width: `${currentPhaseCompletion}%`}}
              ></div>
            </div>
            {nextPhase && timeUntilNextPhase !== null && (
              <p className="text-sm mt-2">
                {t("nextPhaseIn")} <strong>{timeUntilNextPhase}</strong> {t("years")}: {t(nextPhase.title)}
              </p>
            )}
          </div>
        )}
      </div>
      
      <ScrollArea className="w-full overflow-auto" orientation="horizontal">
        <div className="w-[900px] md:w-full min-h-[360px] relative">
          {/* Educational periods (top) */}
          <div className="flex w-full mb-6">
            {educationalPhases.map((phase, index) => (
              <div 
                key={index}
                className="flex-1 text-center border-t-2 border-dashed pt-2"
                style={{borderColor: theme === 'dark' ? '#666666' : '#CCCCCC'}}
              >
                <p className="text-xs font-medium">{t(phase.title)}</p>
                <p className="text-[10px] text-muted-foreground">{phase.range}</p>
              </div>
            ))}
          </div>
          
          {/* Main life phases */}
          <div className="flex w-full h-[280px]">
            {lifePhasesData.map((phase, index) => {
              const isCompleted = completedPhases.some(p => p.id === phase.id);
              const isCurrent = currentPhase?.id === phase.id;
              const colors = getPhaseColor(phase.id, isCompleted, isCurrent);
              
              return (
                <div 
                  key={index}
                  className="flex-1 relative rounded-lg border flex flex-col items-center justify-between p-3 transition-all"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.text,
                    transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
                    zIndex: isCurrent ? 10 : isCompleted ? 5 : 1
                  }}
                >
                  <div className="text-center">
                    <h4 className="text-sm font-bold whitespace-nowrap">{t(phase.title)}</h4>
                    <p className="text-xs mt-1">{phase.age} {t("years")}</p>
                    {phase.crisis && (
                      <p className="text-[11px] mt-2 p-1 bg-opacity-50 rounded">
                        {t(phase.crisis)}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-center mt-auto">
                    <p className="text-[11px] opacity-80">{t(phase.description)}</p>
                    <p className="text-[10px] mt-1 font-medium">{t(phase.environment)}</p>
                    <p className="text-[10px] mt-2 italic">"{t(phase.goalText)}"</p>
                  </div>
                  
                  {isCurrent && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background"></div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Bottom arc with setenios */}
          <div className="w-full h-8 mt-6 relative">
            <div className="absolute w-full h-16 -top-12 border-b-2 border-dashed rounded-b-[100%]"
                 style={{borderColor: theme === 'dark' ? '#666666' : '#CCCCCC'}}></div>
            {lifePhasesData.map((phase, index) => (
              <div 
                key={`setenio-${index}`}
                className="absolute text-[10px] italic text-muted-foreground"
                style={{
                  left: `${(index * 100 / 9) + (100 / 18)}%`, 
                  transform: 'translateX(-50%)'
                }}
              >
                {index === 0 ? t("firstSetenio") : index === 1 ? t("secondSetenio") : 
                 `${t("setenio")} ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <div className="mt-4 text-center">
        <p className="text-sm italic">{t("sevenYearCycleMessage")}</p>
      </div>
    </ChartContainer>
  );
}

export default HumanDevelopmentView;
