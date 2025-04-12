
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="w-full mb-8">
      <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-1 md:gap-2 md:items-start">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
