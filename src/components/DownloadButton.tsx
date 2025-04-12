
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { generatePDF } from "@/utils/generatePDF";
import { useToast } from "@/hooks/use-toast";

export function DownloadButton() {
  const { t, language } = useLanguage();
  const { birthDate, lifeExpectancy, timeUnit, hasGenerated } = useTimeCanvas();
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!birthDate || !hasGenerated) return;

    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your TimeCanvas for download.",
    });

    try {
      await generatePDF("time-canvas", birthDate, lifeExpectancy, timeUnit, language);
      
      toast({
        title: "Download Complete",
        description: "Your TimeCanvas has been downloaded successfully!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was a problem generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!birthDate || !hasGenerated}
      className="flex gap-2 items-center"
    >
      <Download size={16} />
      {t("download")}
    </Button>
  );
}

export default DownloadButton;
