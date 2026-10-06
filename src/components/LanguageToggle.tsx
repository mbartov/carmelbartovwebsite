"use client";

import { trackSiteEvent } from "@/lib/analytics";
import { useLanguage } from "./LanguageContext";

export const LANGUAGE_TOGGLE_ID = "language-toggle";

function FlagUK({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="9" />
      <path
        d="M0 0l60 40M60 0L0 40"
        stroke="#C8102E"
        strokeWidth="5.5"
        strokeLinecap="square"
      />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="14" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
    </svg>
  );
}

function FlagIL({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="40" fill="#fff" />
      <rect y="4.5" width="60" height="5" fill="#0038B8" />
      <rect y="30.5" width="60" height="5" fill="#0038B8" />
      <path
        d="M30 11.5 L37.5 24.5 H22.5 Z"
        fill="none"
        stroke="#0038B8"
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
      <path
        d="M30 28.5 L22.5 15.5 H37.5 Z"
        fill="none"
        stroke="#0038B8"
        strokeWidth="1.7"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function LanguageToggle() {
  const { lang, toggle } = useLanguage();
  const switchingToHebrew = lang === "en";

  return (
    <button
      id={LANGUAGE_TOGGLE_ID}
      type="button"
      onClick={() => {
        toggle();
        trackSiteEvent("Language", switchingToHebrew ? "he" : "en");
      }}
      aria-label={switchingToHebrew ? "Switch to Hebrew" : "עבור לאנגלית"}
      title={switchingToHebrew ? "עברית" : "English"}
      className="group fixed right-4 top-4 z-50 h-12 w-12 overflow-hidden rounded-full border-2 border-ink shadow-[3px_3px_0_0_#161614] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_#161614] active:translate-y-0 active:shadow-[2px_2px_0_0_#161614] rtl:right-auto rtl:left-4"
    >
      {switchingToHebrew ? (
        <FlagIL className="h-full w-full transition-transform group-hover:scale-110" />
      ) : (
        <FlagUK className="h-full w-full transition-transform group-hover:scale-110" />
      )}
    </button>
  );
}
