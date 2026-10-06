"use client";

import { useEffect } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { useLanguage } from "./LanguageContext";

const STORAGE_KEY = "carmel-analytics-language";

/** Records the language once per browser tab, when the visit starts. */
export default function VisitLanguage() {
  const { lang } = useLanguage();

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      sessionStorage.setItem(STORAGE_KEY, lang);
    } catch {
      return;
    }
    trackSiteEvent("Language", lang);
  }, [lang]);

  return null;
}
