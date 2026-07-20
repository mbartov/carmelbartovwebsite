"use client";

import { useLanguage } from "./LanguageContext";

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={lang === "en" ? "Switch to Hebrew" : "עבור לאנגלית"}
      className="fixed right-4 top-4 z-50 rounded-full border-2 border-ink bg-yellow px-4 py-2 text-sm font-semibold uppercase tracking-widest text-ink shadow-lg transition-transform hover:-translate-y-0.5 rtl:right-auto rtl:left-4"
    >
      {lang === "en" ? "עב" : "EN"}
    </button>
  );
}
