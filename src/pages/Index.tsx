
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
import TimeProgress from "@/components/TimeProgress";

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
                  <DownloadButton />
                  <ShareButton />
                </div>
              </div>
              
              <TimeProgress />
              
              <div className="w-full">
                <TimeCanvas />
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
