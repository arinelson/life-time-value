
import { useLanguage } from "@/hooks/useLanguage";
import { Clock, Clock2, Clock3, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback } from "react";

interface TimeUnitsViewProps {
  elapsedUnits: number;
  totalUnits: number;
  timeUnit: string;
  birthDate: Date;
  lifeExpectancy: number;
}

export function TimeUnitsView({
  birthDate,
  lifeExpectancy,
  timeUnit
}: TimeUnitsViewProps) {
  const { toast } = useToast();
  
  // State for the real-time countdown
  const [countdown, setCountdown] = useState({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Get total units based on the selected time unit
  const getTotalUnits = useCallback(() => {
    switch(timeUnit) {
      case "hours":
        return countdown.years * 365.25 * 24 + countdown.days * 24 + countdown.hours;
      case "minutes":
        return (countdown.years * 365.25 * 24 + countdown.days * 24 + countdown.hours) * 60 + countdown.minutes;
      case "seconds":
        return ((countdown.years * 365.25 * 24 + countdown.days * 24 + countdown.hours) * 60 + countdown.minutes) * 60 + countdown.seconds;
      default:
        return 0;
    }
  }, [countdown, timeUnit]);
  
  // Calculate remaining time in different units
  const calculateRemainingTime = useCallback(() => {
    const now = new Date();
    const birthYear = birthDate.getFullYear();
    const targetDate = new Date(
      birthYear + lifeExpectancy, 
      birthDate.getMonth(), 
      birthDate.getDate(), 
      birthDate.getHours(), 
      birthDate.getMinutes(), 
      birthDate.getSeconds()
    );
    
    const timeDiff = targetDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) {
      setCountdown({
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
      return;
    }
    
    // Calculate the time components
    const secondsInMinute = 60;
    const secondsInHour = 60 * 60;
    const secondsInDay = 24 * 60 * 60;
    const secondsInWeek = 7 * 24 * 60 * 60;
    const secondsInMonth = 30.44 * 24 * 60 * 60; // average month
    const secondsInYear = 365.25 * 24 * 60 * 60;
    
    const secondsTotal = Math.floor(timeDiff / 1000);
    
    const years = Math.floor(secondsTotal / secondsInYear);
    const months = Math.floor((secondsTotal % secondsInYear) / secondsInMonth);
    const weeks = Math.floor(((secondsTotal % secondsInYear) % secondsInMonth) / secondsInWeek);
    const remainingSeconds = secondsTotal - (years * secondsInYear + months * secondsInMonth + weeks * secondsInWeek);
    const days = Math.floor(remainingSeconds / secondsInDay);
    const hours = Math.floor((remainingSeconds % secondsInDay) / secondsInHour);
    const minutes = Math.floor((remainingSeconds % secondsInHour) / secondsInMinute);
    const seconds = Math.floor(remainingSeconds % secondsInMinute);
    
    setCountdown({
      years,
      months,
      weeks,
      days,
      hours,
      minutes,
      seconds
    });
  }, [birthDate, lifeExpectancy]);
  
  useEffect(() => {
    // Initial calculation
    calculateRemainingTime();
    
    // Update every second
    const intervalId = setInterval(calculateRemainingTime, 1000);
    
    // Cleanup interval on component unmount or when props change
    return () => clearInterval(intervalId);
  }, [calculateRemainingTime]);
  
  const handleWhatsAppShare = () => {
    const message = `Life Time Value: ${countdown.years} years, ${countdown.months} months, ${countdown.weeks} weeks, ${countdown.days} days, ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s remaining. Check out Life Time Value: ${window.location.href}`;
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

  // Render different displays based on time unit
  const renderTimeUnitDisplay = () => {
    // Always show the complete time display regardless of timeUnit
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card shadow-sm rounded-lg p-6 text-center border">
          <div className="flex justify-center mb-4">
            <Clock2 className="h-8 w-8 text-primary" />
          </div>
          <h4 className="text-3xl font-semibold mb-1">Time Remaining</h4>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-primary/10 p-3 rounded-lg">
              <h5 className="text-lg font-semibold mb-1">{countdown.years}</h5>
              <p className="text-xs text-muted-foreground">Years</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <h5 className="text-lg font-semibold mb-1">{countdown.months}</h5>
              <p className="text-xs text-muted-foreground">Months</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <h5 className="text-lg font-semibold mb-1">{countdown.weeks}</h5>
              <p className="text-xs text-muted-foreground">Weeks</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <h5 className="text-lg font-semibold mb-1">{countdown.days}</h5>
              <p className="text-xs text-muted-foreground">Days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card shadow-sm rounded-lg p-6 text-center border relative overflow-hidden">
          <div className="flex justify-center mb-4">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <h4 className="text-2xl font-semibold mb-4">Countdown</h4>
          
          <div className="flex justify-center items-center space-x-1 mb-4">
            <div className="bg-primary/10 p-2 rounded min-w-[50px]">
              <h4 className="text-xl font-semibold">{countdown.hours.toString().padStart(2, '0')}</h4>
              <p className="text-xs text-muted-foreground">Hours</p>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-primary/10 p-2 rounded min-w-[50px]">
              <h4 className="text-xl font-semibold">{countdown.minutes.toString().padStart(2, '0')}</h4>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-primary/10 p-2 rounded min-w-[50px] animate-pulse">
              <h4 className="text-xl font-semibold">{countdown.seconds.toString().padStart(2, '0')}</h4>
              <p className="text-xs text-muted-foreground">Seconds</p>
            </div>
          </div>
          
          {/* Unit-specific display */}
          {timeUnit === "hours" && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <h5 className="text-lg font-semibold">{Math.floor(getTotalUnits()).toLocaleString()}</h5>
              <p className="text-xs text-muted-foreground">Total Hours Remaining</p>
            </div>
          )}
          
          {timeUnit === "minutes" && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <h5 className="text-lg font-semibold">{Math.floor(getTotalUnits()).toLocaleString()}</h5>
              <p className="text-xs text-muted-foreground">Total Minutes Remaining</p>
            </div>
          )}
          
          {timeUnit === "seconds" && (
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <h5 className="text-lg font-semibold animate-pulse">{Math.floor(getTotalUnits()).toLocaleString()}</h5>
              <p className="text-xs text-muted-foreground">Total Seconds Remaining</p>
            </div>
          )}
          
          {/* Animated bar to show seconds passing */}
          <div className="absolute bottom-0 left-0 h-1 bg-primary" 
               style={{ width: `${(countdown.seconds / 60) * 100}%`, transition: 'width 1s linear' }}></div>
        </div>
      </div>
    );
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
        
        {renderTimeUnitDisplay()}
        
        <div className="pt-4">
          <Button 
            onClick={handleWhatsAppShare}
            className="bg-green-500 hover:bg-green-600"
          >
            <Share className="h-5 w-5 mr-2" />
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
