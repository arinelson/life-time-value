
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeProvider";
import { LanguageProvider } from "@/hooks/useLanguage";
import { TimeCanvasProvider } from "@/hooks/useTimeCanvas";
import { useIpLanguageDetection } from "@/hooks/useIpLanguageDetection";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to initialize the IP-based language detection
const IpLanguageDetector = () => {
  useIpLanguageDetection();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TimeCanvasProvider>
          <TooltipProvider>
            <IpLanguageDetector />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TimeCanvasProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
