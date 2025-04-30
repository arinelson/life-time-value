
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, ClockHour3, Clock3 } from "lucide-react";
import { formatTimeRemaining } from "@/utils/timeCalculations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { WhatsApp } from "lucide-react";

interface TimeUnitsViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: string;
  birthDate: Date;
  lifeExpectancy: number;
}

export function TimeUnitsView({
  elapsedUnits,
  totalUnits,
  timeUnit,
  birthDate,
  lifeExpectancy
}: TimeUnitsViewProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const remainingUnits = Math.max(0, totalUnits - elapsedUnits);
  const formattedTime = formatTimeRemaining(totalUnits, elapsedUnits, timeUnit as any);
  
  // Calculate remaining time in different units
  const now = new Date();
  const secondsInYear = 365.25 * 24 * 60 * 60;
  const secondsRemaining = (lifeExpectancy - (now.getFullYear() - birthDate.getFullYear())) * secondsInYear;
  
  const years = Math.floor(secondsRemaining / (secondsInYear));
  const days = Math.floor((secondsRemaining % secondsInYear) / (24 * 60 * 60));
  const hours = Math.floor((secondsRemaining % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsRemaining % (60 * 60)) / 60);
  const seconds = Math.floor(secondsRemaining % 60);
  
  const timeMessage = `${years} ${t("years")}, ${days} ${t("days")}, ${hours}h ${minutes}m ${seconds}s`;
  
  const handleWhatsAppShare = () => {
    const message = `${t("lifeTimeValueMessage")}: ${timeMessage}. ${t("checkOutLifeTimeValue")}: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    try {
      window.open(whatsappUrl, '_blank');
      toast({
        title: t("shared"),
        description: t("whatsAppShareSuccess"),
      });
    } catch (error) {
      toast({
        title: t("shareError"),
        description: t("whatsAppShareError"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full space-y-8 py-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-primary/10 p-4 rounded-full">
            <Clock className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold">{t("timeRemaining")}</h3>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <ClockHour3 className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{years.toLocaleString()}</h4>
            <p className="text-muted-foreground">{t("years")}</p>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <Clock3 className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{days.toLocaleString()}</h4>
            <p className="text-muted-foreground">{t("days")}</p>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{hours.toLocaleString()}h {minutes}m {seconds}s</h4>
            <p className="text-muted-foreground">{t("hoursMinutesSeconds")}</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleWhatsAppShare}
            className="bg-green-500 hover:bg-green-600"
          >
            <WhatsApp className="h-5 w-5 mr-2" />
            {t("shareOnWhatsApp")}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            {t("shareYourTimeRemaining")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TimeUnitsView;
