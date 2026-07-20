"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export type Lang = "en" | "he";

const STORAGE_KEY = "lang";

type LanguageContextValue = {
  lang: Lang;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentAttrs(lang: Lang) {
  document.documentElement.lang = lang === "he" ? "he" : "en";
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
}

function readStoredLang(): Lang {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "he") return stored;
  return navigator.language.toLowerCase().startsWith("he") ? "he" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "en" so SSR and the first client render match
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = readStoredLang();
    setLang(stored);
    applyDocumentAttrs(stored);
  }, []);

  useEffect(() => {
    applyDocumentAttrs(lang);
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === "en" ? "he" : "en";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
