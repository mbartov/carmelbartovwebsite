"use client";

import Badge3D from "./Badge3DClient";
import { AVAILABLE_BUTTON_ANCHOR_ID } from "./AvailableFloatingButton";
import { useLanguage } from "./LanguageContext";
import { WireframeInstagram, WireframeYouTube } from "./SocialIcons";

const nav = {
  en: [
    ["About me", "#about"],
    ["My portfolio", "#portfolio"],
    ["My services", "#services"],
    ["My contacts", "#contact"],
  ],
  he: [
    ["עליי", "#about"],
    ["תיק העבודות שלי", "#portfolio"],
    ["השירותים שלי", "#services"],
    ["יצירת קשר", "#contact"],
  ],
};

const copy = {
  en: {
    heading: (
      <>
        YOUR STORY&apos;S
        <br />
        BACKSTAGE PASS
      </>
    ),
    sub: "Let's find your story's rhythm and get your footage ready to rock the stage!",
  },
  he: {
    heading: (
      <>
       הפריים הראשון של הסיפור שלכם
      </>
    ),
    sub: "כל סרטון מתחיל בסיפור טוב ומסתיים בעריכה מדויקת. בואו נהפוך את החומרים שלכם לסרטון שאי אפשר להתעלם ממנו!",
  },
};

export default function Hero() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-pink px-6 pb-24 pt-10 text-ink sm:px-10">
      {/* nav pill */}
      <nav className="relative z-20 mx-auto mb-14 hidden w-fit items-center gap-1 rounded-full bg-ink p-1.5 md:flex">
        {nav[lang].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-pink"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* social icons */}
      <div className="absolute right-6 top-8 z-20 flex gap-3 sm:right-10 rtl:right-auto rtl:left-6 sm:rtl:left-10">
        <a
          href="https://instagram.com/carmelbartov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:-translate-y-0.5"
          aria-label="Instagram"
        >
          <WireframeInstagram className="h-6 w-6" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:-translate-y-0.5"
          aria-label="YouTube"
        >
          <WireframeYouTube className="h-6 w-6" />
        </a>
      </div>

      {/* free-floating 3D badge, spans the whole section */}
      <Badge3D />

      <div className="relative z-10 mx-auto max-w-6xl pt-16 lg:pt-0">
        <div className="pointer-events-none max-w-lg rtl:mr-0 rtl:ml-auto">
          <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            {t.heading}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
            {t.sub}
          </p>
          <div
            id={AVAILABLE_BUTTON_ANCHOR_ID}
            className="pointer-events-none mt-8 w-full max-w-md"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
