"use client";

import Link from "next/link";
import VideoTicketCard from "@/components/VideoTicketCard";
import { VideoPlaybackProvider } from "@/components/VideoPlaybackContext";
import type { PortfolioItem } from "@/lib/content";
import { useLanguage } from "@/components/LanguageContext";

const copy = {
  en: {
    heading: "PORTFOLIO",
    sub: "Every reel, cut, and story from the edit bay.",
    back: "← Back to home",
  },
  he: {
    heading: "תיק עבודות",
    sub: "כל הקליפים, העריכות והסיפורים מחדר העריכה.",
    back: "→ חזרה לדף הבית",
  },
};

export default function PortfolioPageContent({ items }: { items: PortfolioItem[] }) {
  const { lang } = useLanguage();
  const t = copy[lang];

  return (
    <main className="flex-1 bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-10 inline-block text-sm uppercase tracking-widest text-cream/60 transition-colors hover:text-cream"
        >
          {t.back}
        </Link>

        <h1 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          {t.sub}
        </p>

        <VideoPlaybackProvider>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <VideoTicketCard
                key={item.id}
                videoId={item.videoId}
                title={lang === "he" ? item.titleHe : item.titleEn}
                color={item.color}
              />
            ))}
          </div>
        </VideoPlaybackProvider>
      </div>
    </main>
  );
}
