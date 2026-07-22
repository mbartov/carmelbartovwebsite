"use client";

import { serviceTagsByLang } from "@/lib/services";
import { useLanguage } from "./LanguageContext";

const remoteLabel = {
  en: "Remote",
  he: "עבודה מרחוק",
};

export default function Ticker() {
  const { lang } = useLanguage();
  const tags = serviceTagsByLang[lang];

  return (
    <div className="relative bg-purple">
      <div className="absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 -rotate-6 sm:block rtl:left-auto rtl:right-6 rtl:rotate-6">
        <div
          className={`flex items-center justify-center border-2 border-ink bg-yellow px-2 text-center font-display leading-tight text-ink ${
            lang === "he"
              ? "h-32 w-32 text-base"
              : "h-28 w-28 text-sm"
          }`}
          style={{
            clipPath:
              "polygon(50% 0%, 61% 15%, 78% 6%, 80% 25%, 98% 28%, 90% 45%, 100% 60%, 82% 68%, 85% 87%, 66% 82%, 55% 100%, 44% 84%, 25% 95%, 21% 76%, 3% 72%, 13% 55%, 0% 40%, 18% 32%, 15% 13%, 34% 18%)",
          }}
        >
          {remoteLabel[lang]}
        </div>
      </div>

      <div className="overflow-hidden whitespace-nowrap py-2">
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
    </div>
  );
}
