
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, Clock2, Clock3 } from "lucide-react";
import { formatTimeRemaining } from "@/utils/timeCalculations";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  
  const timeMessage = `${years} years, ${days} days, ${hours}h ${minutes}m ${seconds}s`;
  
  const handleWhatsAppShare = () => {
    const message = `Life Time Value: ${timeMessage}. Check out Life Time Value: ${window.location.href}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    try {
      window.open(whatsappUrl, '_blank');
      toast({
        title: "Shared",
        description: "Successfully shared to WhatsApp",
      });
    } catch (error) {
      toast({
        title: "Share Error",
        description: "Error sharing to WhatsApp",
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
        
        <h3 className="text-2xl font-bold">Time Remaining</h3>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <Clock2 className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{years.toLocaleString()}</h4>
            <p className="text-muted-foreground">Years</p>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <Clock3 className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{days.toLocaleString()}</h4>
            <p className="text-muted-foreground">Days</p>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
            <div className="flex justify-center mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-1">{hours.toLocaleString()}h {minutes}m {seconds}s</h4>
            <p className="text-muted-foreground">Hours, Minutes, Seconds</p>
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleWhatsAppShare}
            className="bg-green-500 hover:bg-green-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5 mr-2" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
            Share on WhatsApp
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Share your remaining time with friends and family
          </p>
        </div>
      </div>
    </div>
  );
}

export default TimeUnitsView;
