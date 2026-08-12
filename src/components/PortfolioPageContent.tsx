"use client";

import Link from "next/link";
import VideoTicketCard from "@/components/VideoTicketCard";
import { VideoPlaybackProvider } from "@/components/VideoPlaybackContext";
import { useLanguage } from "@/components/LanguageContext";
import { getAllProjects, projectTitle } from "@/lib/portfolio";

const copy = {
  en: {
    kicker: "[ Full archive ]",
    heading: "PORTFOLIO",
    sub: "Every reel, cut, and story from the edit bay.",
    back: "← Back to home",
  },
  he: {
    kicker: "[ כל העבודות ]",
    heading: "תיק עבודות",
    sub: "כל הקליפים, העריכות והסיפורים מחדר העריכה.",
    back: "→ חזרה לדף הבית",
  },
};

export default function PortfolioPageContent() {
  const { lang } = useLanguage();
  const projects = getAllProjects();
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

        <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
          {t.kicker}
        </p>
        <h1 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">
          {t.sub}
        </p>

        <VideoPlaybackProvider>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => (
              <VideoTicketCard
                key={project.id}
                videoId={project.videoId}
                title={projectTitle(project, lang)}
                color={project.color}
              />
            ))}
          </div>
        </VideoPlaybackProvider>
      </div>
    </main>
  );
}
