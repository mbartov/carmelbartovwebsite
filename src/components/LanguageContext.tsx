"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

export type Lang = "en" | "he";

const STORAGE_KEY = "lang";
const LANG_EVENT = "carmel-lang-change";

type LanguageContextValue = {
  lang: Lang;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentAttrs(lang: Lang) {
  document.documentElement.lang = lang === "he" ? "he" : "en";
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
}

function readLangFromDocument(): Lang {
  return document.documentElement.lang === "he" ? "he" : "en";
}

function subscribeLang(callback: () => void) {
  window.addEventListener(LANG_EVENT, callback);
  return () => window.removeEventListener(LANG_EVENT, callback);
}

function useLang(initialLang: Lang) {
  return useSyncExternalStore(
    subscribeLang,
    readLangFromDocument,
    () => initialLang
  );
}

export function LanguageProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const lang = useLang(initialLang);

  const toggle = useCallback(() => {
    const next: Lang = lang === "en" ? "he" : "en";
    window.localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `lang=${next};path=/;max-age=31536000;SameSite=Lax`;
    applyDocumentAttrs(next);
    window.dispatchEvent(new Event(LANG_EVENT));
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
