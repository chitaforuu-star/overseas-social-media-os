"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { localeLabel } from "@/lib/translations";
import type { BilingualText } from "@/lib/translations";
import type { Locale } from "@/lib/os-types";

const STORAGE_KEY = "os_locale_v1";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (value: Locale) => void;
  pick: (value: BilingualText) => string;
  dual: (value: BilingualText) => { primary: string; secondary: string };
  labels: typeof localeLabel;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") {
      return "zh";
    }
    const cached = window.localStorage.getItem(STORAGE_KEY);
    return cached === "zh" || cached === "en" ? cached : "zh";
  });

  const setLocale = (value: Locale) => {
    setLocaleState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  const value = useMemo<LanguageContextValue>(() => {
    return {
      locale,
      setLocale,
      pick: (text) => (locale === "zh" ? text.zh : text.en),
      dual: (text) =>
        locale === "zh"
          ? { primary: text.zh, secondary: text.en }
          : { primary: text.en, secondary: text.zh },
      labels: localeLabel,
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
