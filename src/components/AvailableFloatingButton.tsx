"use client";

import { trackSiteEvent } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/contact";
import { useLanguage } from "./LanguageContext";

const label = {
  en: "Available for new projects",
  he: "זמינה לפרויקטים חדשים",
};

function GlowingDot() {
  return (
    <span
      className="relative h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5"
      aria-hidden
    >
      <span className="absolute inset-0 rounded-full bg-[#9dff57] shadow-[0_0_6px_#9dff57,0_0_14px_rgba(157,255,87,0.65)]" />
    </span>
  );
}

export default function AvailableFloatingButton() {
  const { lang } = useLanguage();

  return (
    <div className="relative mt-8 w-fit">
      <span className="available-glow-frame" aria-hidden />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        onClick={() => trackSiteEvent("Contact Click", lang, { place: "available", kind: "email" })}
        aria-label={label[lang]}
        className="pointer-events-auto relative z-10 flex max-w-[min(22rem,calc(100vw-3rem))] items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition-transform duration-200 hover:-translate-y-0.5 sm:gap-4 sm:px-8 sm:py-4 sm:text-lg"
      >
        <GlowingDot />
        <span className="leading-tight">{label[lang]}</span>
      </a>
    </div>
  );
}
