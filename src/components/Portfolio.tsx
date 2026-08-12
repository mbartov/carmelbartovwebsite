"use client";

import Link from "next/link";
import VideoTicketCard from "./VideoTicketCard";
import StackReveal from "./StackReveal";
import { VideoPlaybackProvider } from "./VideoPlaybackContext";
import { useLanguage } from "./LanguageContext";
import { getFeaturedProjects, projectTitle } from "@/lib/portfolio";

const copy = {
  en: {
    kicker: "[ Your ticket to visual storytelling ]",
    heading: (
      <>
        COME ON IN:
        <br />
        EXPLORE MY CREATIVE SHOWCASE
      </>
    ),
    cta: "Check out more projects",
  },
  he: {
    kicker: "[ הכרטיס שלכם לסיפור חזותי ]",
    heading: (
      <>
        צללו פנימה:
        <br />
        בקרו בגלריה שלי
      </>
    ),
    cta: "לצפייה בעוד פרויקטים",
  },
};

export default function Portfolio() {
  const { lang } = useLanguage();
  const reels = getFeaturedProjects();
  const t = copy[lang];

  return (
    <section id="portfolio" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
          {t.kicker}
        </p>
        <h2 className="mb-12 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h2>

        <VideoPlaybackProvider>
          <StackReveal className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reels.map((reel) => (
              <VideoTicketCard
                key={reel.id}
                videoId={reel.videoId}
                title={projectTitle(reel, lang)}
                color={reel.color}
              />
            ))}
          </StackReveal>
        </VideoPlaybackProvider>

        <div className="mt-14 flex justify-center">
          <Link
            href="/portfolio"
            className="rounded-full bg-yellow px-8 py-4 font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
