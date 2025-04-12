
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useTimeCanvas } from "@/hooks/useTimeCanvas";
import { useToast } from "@/hooks/use-toast";

export function ShareButton() {
  const { t } = useLanguage();
  const { birthDate, hasGenerated } = useTimeCanvas();
  const { toast } = useToast();

  const handleShare = async () => {
    if (!birthDate || !hasGenerated) return;

    const shareData = {
      title: 'TimeCanvas',
      text: t('subtitle'),
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Your TimeCanvas has been shared!",
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "The link has been copied to your clipboard. You can now share it manually.",
        });
      }
    } catch (error) {
      toast({
        title: "Sharing Failed",
        description: "There was a problem sharing your TimeCanvas.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={!birthDate || !hasGenerated}
      variant="outline"
      className="flex gap-2 items-center"
    >
      <Share2 size={16} />
      {t("share")}
    </Button>
  );
}

export default ShareButton;
