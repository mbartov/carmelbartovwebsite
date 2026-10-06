"use client";

import { useEffect, useRef } from "react";
import { trackSiteEvent } from "@/lib/analytics";
import { useLanguage } from "./LanguageContext";

const SECTIONS = ["about", "portfolio", "services", "contact"] as const;
const STORAGE_KEY = "carmel-analytics-sections";

function readSeen(): Set<string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((value) => typeof value === "string"));
  } catch {
    return new Set();
  }
}

/** Records each home section once per tab, after it scrolls into view. */
export default function SectionSeen() {
  const { lang } = useLanguage();
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    const seen = readSeen();
    const nodes = SECTIONS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null && !seen.has(node.id),
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (seen.has(id)) continue;
          seen.add(id);
          changed = true;
          trackSiteEvent("Section Seen", langRef.current, { section: id });
          observer.unobserve(entry.target);
        }
        if (!changed) return;
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
        } catch {
          // Private mode can block storage. The in-memory set still avoids repeats.
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return null;
}
