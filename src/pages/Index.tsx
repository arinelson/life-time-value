
import { lazy, Suspense } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BirthdayInput from "@/components/BirthdayInput";
import LifeExpectancyInput from "@/components/LifeExpectancyInput";
import TimeUnitSelector from "@/components/TimeUnitSelector";
import TimeProgress from "@/components/TimeProgress";
import VisualizationSelector from "@/components/VisualizationSelector";

// Lazy load components that aren't needed immediately
const TimeCanvas = lazy(() => import("@/components/TimeCanvas"));
const DownloadButton = lazy(() => import("@/components/DownloadButton"));
const ShareButton = lazy(() => import("@/components/ShareButton"));

const Index = () => {
  const { t } = useLanguage();
  const { birthDate } = useTimeCanvas();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container px-4 md:px-6 pb-8 animate-fade-in">
        <div className="w-full mx-auto">
          <div className="grid gap-6 p-6 md:p-8 border rounded-lg bg-card animate-slide-up mb-6">
            <div className="grid gap-4 md:grid-cols-3">
              <BirthdayInput />
              <LifeExpectancyInput />
              <TimeUnitSelector />
            </div>
          </div>

          {birthDate && (
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold">{t("results")}</h2>
                <div className="flex gap-2 w-full md:w-auto">
                  <Suspense fallback={<div className="h-9 w-24 bg-muted rounded animate-pulse"></div>}>
                    <DownloadButton />
                  </Suspense>
                  <Suspense fallback={<div className="h-9 w-24 bg-muted rounded animate-pulse"></div>}>
                    <ShareButton />
                  </Suspense>
                </div>
              </div>
              
              <TimeProgress />
              
              <VisualizationSelector />
              
              <div className="w-full">
                <Suspense fallback={<div className="w-full h-64 bg-muted rounded animate-pulse"></div>}>
                  <TimeCanvas />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
