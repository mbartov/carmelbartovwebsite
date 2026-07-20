"use client";

import { serviceTagsByLang } from "@/lib/services";
import { useLanguage } from "./LanguageContext";

export default function Ticker() {
  const { lang } = useLanguage();
  const tags = serviceTagsByLang[lang];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-purple py-2">
      <div
        className={`inline-flex animate-marquee items-center font-display uppercase leading-none text-cream ${
          lang === "he" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {Array.from({ length: 4 }).map((_, copy) => (
          <span key={copy} className="mx-6 inline-flex items-center gap-6">
            {tags.map((t) => (
              <span
                key={`${copy}-${t}`}
                className="inline-flex items-center gap-[0.12em]"
              >
                <span aria-hidden className="leading-none">
                  [
                </span>
                <span className="leading-none">{t}</span>
                <span aria-hidden className="leading-none">
                  ]
                </span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
