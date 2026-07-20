"use client";

import { useLanguage } from "./LanguageContext";

const copy = {
  en: {
    unit: "AVAILABLE FOR NEW PROJECTS",
    tiny: "CARMEL BARTOV · VIDEO EDITOR · ©2026",
  },
  he: {
    unit: "זמינה לפרויקטים חדשים",
    tiny: "CARMEL BARTOV · עורכת וידאו · ©2026",
  },
};

function Segment({ i, unit, tiny }: { i: number; unit: string; tiny: string }) {
  const isDark = i % 2 === 0;
  return (
    <div
      className={`flex items-center gap-4 border-x-2 border-ink px-6 py-4 ${
        isDark ? "bg-purple text-cream" : "bg-cream text-ink"
      }`}
    >
      <span className="text-lg">&#10047;</span>
      <span className="whitespace-nowrap font-display text-2xl sm:text-4xl">
        {unit}
      </span>
      <span className="whitespace-nowrap text-[10px] uppercase tracking-widest opacity-70 sm:text-xs">
        {tiny}
      </span>
    </div>
  );
}

export default function Ribbon() {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <div className="overflow-hidden bg-ink py-10">
      <div className="-rotate-2 border-y-2 border-ink">
        <div className="flex overflow-hidden whitespace-nowrap">
          <div className="flex animate-marquee">
            {Array.from({ length: 8 }).map((_, i) => (
              <Segment key={i} i={i} unit={t.unit} tiny={t.tiny} />
            ))}
          </div>
          <div className="flex animate-marquee" aria-hidden>
            {Array.from({ length: 8 }).map((_, i) => (
              <Segment key={i} i={i} unit={t.unit} tiny={t.tiny} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
