
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BirthdayInput from "@/components/BirthdayInput";
import LifeExpectancyInput from "@/components/LifeExpectancyInput";
import TimeUnitSelector from "@/components/TimeUnitSelector";
import TimeCanvas from "@/components/TimeCanvas";
import DownloadButton from "@/components/DownloadButton";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t } = useLanguage();
  const { birthDate, hasGenerated, setHasGenerated } = useTimeCanvas();
  const [showInputs, setShowInputs] = useState(true);

  const handleGenerate = () => {
    if (!birthDate) return;
    
    setShowInputs(false);
    setHasGenerated(true);
  };

  const handleReset = () => {
    setShowInputs(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 md:px-6 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {showInputs ? (
            <div className="grid gap-6 p-6 md:p-8 border rounded-lg bg-card animate-slide-up">
              <div className="grid gap-4 md:grid-cols-3">
                <BirthdayInput />
                <LifeExpectancyInput />
                <TimeUnitSelector />
              </div>
              
              <Button 
                onClick={handleGenerate}
                disabled={!birthDate}
                size="lg"
                className="w-full md:w-auto md:self-end"
              >
                {t("generate")}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" onClick={handleReset}>
                  ← {t("birthday")}: {birthDate?.toLocaleDateString()}
                </Button>
                <div className="flex gap-2">
                  <DownloadButton />
                  <ShareButton />
                </div>
              </div>
              <TimeCanvas />
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
