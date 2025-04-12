
export type Language = "pt" | "en" | "es" | "it" | "de";

export const languages = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "de", name: "Deutsch" },
];

export type Translations = {
  title: string;
  subtitle: string;
  birthday: string;
  lifeExpectancy: string;
  timeUnit: string;
  days: string;
  weeks: string;
  months: string;
  years: string;
  generate: string;
  download: string;
  share: string;
  past: string;
  present: string;
  future: string;
  footer: string;
  inspiration: string;
};

const translations: Record<Language, Translations> = {
  en: {
    title: "TimeCanvas",
    subtitle: "Redesign your perception of time",
    birthday: "Date of birth",
    lifeExpectancy: "Life expectancy (years)",
    timeUnit: "Time unit",
    days: "Days",
    weeks: "Weeks",
    months: "Months",
    years: "Years",
    generate: "Generate",
    download: "Download PDF",
    share: "Share with friends",
    past: "Past",
    present: "Present",
    future: "Future",
    footer: "TimeCanvas - Created by Lovable",
    inspiration: "Inspired by",
  },
  pt: {
    title: "TimeCanvas",
    subtitle: "Redesenhe sua percepção do tempo",
    birthday: "Data de nascimento",
    lifeExpectancy: "Expectativa de vida (anos)",
    timeUnit: "Unidade de tempo",
    days: "Dias",
    weeks: "Semanas",
    months: "Meses",
    years: "Anos",
    generate: "Gerar",
    download: "Baixar PDF",
    share: "Compartilhar",
    past: "Passado",
    present: "Presente",
    future: "Futuro",
    footer: "TimeCanvas - Criado por Lovable",
    inspiration: "Inspirado por",
  },
  es: {
    title: "TimeCanvas",
    subtitle: "Rediseña tu percepción del tiempo",
    birthday: "Fecha de nacimiento",
    lifeExpectancy: "Esperanza de vida (años)",
    timeUnit: "Unidad de tiempo",
    days: "Días",
    weeks: "Semanas",
    months: "Meses",
    years: "Años",
    generate: "Generar",
    download: "Descargar PDF",
    share: "Compartir",
    past: "Pasado",
    present: "Presente",
    future: "Futuro",
    footer: "TimeCanvas - Creado por Lovable",
    inspiration: "Inspirado en",
  },
  it: {
    title: "TimeCanvas",
    subtitle: "Ridisegna la tua percezione del tempo",
    birthday: "Data di nascita",
    lifeExpectancy: "Aspettativa di vita (anni)",
    timeUnit: "Unità di tempo",
    days: "Giorni",
    weeks: "Settimane",
    months: "Mesi",
    years: "Anni",
    generate: "Genera",
    download: "Scarica PDF",
    share: "Condividi",
    past: "Passato",
    present: "Presente",
    future: "Futuro",
    footer: "TimeCanvas - Creato da Lovable",
    inspiration: "Ispirato da",
  },
  de: {
    title: "TimeCanvas",
    subtitle: "Gestalte deine Zeitwahrnehmung neu",
    birthday: "Geburtsdatum",
    lifeExpectancy: "Lebenserwartung (Jahre)",
    timeUnit: "Zeiteinheit",
    days: "Tage",
    weeks: "Wochen",
    months: "Monate",
    years: "Jahre",
    generate: "Generieren",
    download: "PDF herunterladen",
    share: "Teilen",
    past: "Vergangenheit",
    present: "Gegenwart",
    future: "Zukunft",
    footer: "TimeCanvas - Erstellt von Lovable",
    inspiration: "Inspiriert von",
  },
};

export default translations;
