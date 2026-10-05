"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";

export type Lang = "en" | "he";

const STORAGE_KEY = "lang";

type LanguageContextValue = {
  lang: Lang;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentAttrs(lang: Lang, isAdmin: boolean) {
  if (isAdmin) {
    document.documentElement.lang = "he";
    document.documentElement.dir = "rtl";
    return;
  }
  document.documentElement.lang = lang === "he" ? "he" : "en";
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
}

const listeners = new Set<() => void>();

function readStoredLang(): Lang {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "he") return stored;
  return navigator.language.toLowerCase().startsWith("he") ? "he" : "en";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function serverLang(): Lang {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server snapshot is always "en" so the first render matches SSR.
  const lang = useSyncExternalStore(subscribe, readStoredLang, serverLang);
  const isAdmin = usePathname().startsWith("/admin");

  useEffect(() => {
    applyDocumentAttrs(lang, isAdmin);
  }, [lang, isAdmin]);

  const toggle = useCallback(() => {
    const next: Lang = lang === "en" ? "he" : "en";
    window.localStorage.setItem(STORAGE_KEY, next);
    listeners.forEach((listener) => listener());
  }, [lang]);

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
