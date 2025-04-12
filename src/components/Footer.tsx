
import { useLanguage } from "@/hooks/useLanguage";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="border-t py-6 md:py-8 mt-8">
      <div className="container flex flex-col items-center justify-center gap-4 md:gap-2">
        <p className="text-sm text-muted-foreground text-center">
          {t("footer")}
        </p>
        <p className="text-sm text-muted-foreground text-center">
          {t("inspiration")}{" "}
          <a 
            href="https://www.bryanbraun.com/your-life/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            bryanbraun.com/your-life
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
