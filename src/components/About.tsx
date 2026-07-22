"use client";

import { useLanguage } from "./LanguageContext";

const instruments: { label: string; bg: string; icon: React.ReactNode }[] = [
  {
    label: "MacBook",
    bg: "bg-purple",
    icon: (
      <svg viewBox="0 0 64 64" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="10" y="12" width="44" height="28" rx="3" />
        <line x1="10" y1="34" x2="54" y2="34" />
        <path d="M4 48h56l-6 8H10z" />
      </svg>
    ),
  },
  {
    label: "Camera",
    bg: "bg-blue",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="8" y="18" width="40" height="28" rx="4" />
        <path d="M20 18l4-8h8l4 8" />
        <path d="M48 26l10-6v22l-10-6z" />
        <circle cx="28" cy="32" r="8" />
      </svg>
    ),
  },
  {
    label: "Microphone",
    bg: "bg-pink-bright",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="24" y="6" width="16" height="30" rx="8" />
        <path d="M16 28a16 16 0 0 0 32 0" />
        <path d="M32 44v10M22 54h20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Audio Mixer",
    bg: "bg-green",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="8" y="8" width="48" height="48" rx="4" />
        <line x1="20" y1="16" x2="20" y2="40" />
        <circle cx="20" cy="24" r="3" fill="currentColor" />
        <line x1="32" y1="16" x2="32" y2="40" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
        <line x1="44" y1="16" x2="44" y2="40" />
        <circle cx="44" cy="20" r="3" fill="currentColor" />
        <line x1="14" y1="48" x2="50" y2="48" />
      </svg>
    ),
  },
  {
    label: "Stage Light",
    bg: "bg-orange",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 10h24l-4 20H24z" />
        <line x1="24" y1="30" x2="40" y2="30" />
        <path d="M22 30l-8 24M42 30l8 24" />
        <line x1="20" y1="54" x2="44" y2="54" />
      </svg>
    ),
  },
];

const copy = {
  en: {
    bio: "I'm Carmel Bartov, a video editor with years of experience in content creation and video editing. During my service in the IDF Spokesperson's Unit, I edited digital content while collaborating with senior officers in a fast-paced environment that demanded precision, creativity, and the ability to meet daily releases and tight deadlines. I believe every video should tell a story, capture the viewer's attention, and leave a lasting impression.",
    currentlyEditing: (
      <>
        CURRENTLY EDITING
        <br />
        FOR CREATORS &amp; BRANDS
      </>
    ),
    hoverHint: "[ Hover the icons — they like to dance ]",
  },
  he: {
    bio: "שלום, אני כרמל ברטוב, עורכת וידאו עם ניסיון של מספר שנים ביצירת תוכן ועריכת וידאו. במהלך שירותי ביחידת דובר צה”ל ערכתי תוכן דיגיטלי וסרטונים פנימיים בשיתוף פעולה עם קצינים בכירים, בסביבה דינמית שדרשה דיוק, יצירתיות ועמידה בלוחות זמנים. עבורי, עריכה היא הרבה יותר מחיבור של שוטים- היא הדרך לספר סיפור, להעביר רגש ולגרום לצופים להישאר עד הפריים האחרון.",
    currentlyEditing: <>עורכת תוכן ליוצרים, עסקים ומותגים</>,
    hoverHint: "[ רחפו מעל האייקונים — הם אוהבים לרקוד ]",
  },
};

export default function About() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section id="about" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-cream/90 sm:text-xl">
          {t.bio}
        </p>

        <p className="mt-16 text-center font-display text-3xl leading-tight sm:text-4xl">
          {t.currentlyEditing}
        </p>

        <div className="mt-16 flex flex-wrap items-end justify-center gap-8 sm:gap-10">
          {instruments.map((inst) => (
            <div
              key={inst.label}
              className={`flex h-28 w-28 cursor-grab items-center justify-center rounded-[40%] text-cream shadow-lg transition-transform hover:-translate-y-1 active:cursor-grabbing sm:h-32 sm:w-32 ${inst.bg}`}
            >
              {inst.icon}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm uppercase tracking-widest text-cream/50">
          {t.hoverHint}
        </p>
      </div>
    </section>
  );
}
