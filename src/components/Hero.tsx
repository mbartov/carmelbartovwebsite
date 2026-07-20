"use client";

import Badge3D from "./Badge3DClient";
import { useLanguage } from "./LanguageContext";

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
    available: (
      <>
        AVAILABLE
        <br />
        WORLDWIDE
      </>
    ),
    heading: (
      <>
        YOUR STORY&apos;S
        <br />
        BACKSTAGE PASS
      </>
    ),
    sub: "Let's find your story's rhythm and get your footage ready to rock the stage!",
    availableForProjects: "Available for new projects",
  },
  he: {
    available: (
      <>
        זמינה
        <br />
        בכל העולם
      </>
    ),
    heading: (
      <>
        כרטיס ה־
        <bdi>VIP</bdi>
        <br />
        לסיפור שלך
      </>
    ),
    sub: "בואו נמצא את הקצב של הסיפור שלכם ונכין את החומרים שלכם לעלות לבמה!",
    availableForProjects: "זמינה לפרויקטים חדשים",
  },
};

export default function Hero() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-pink px-6 pb-24 pt-10 text-ink sm:px-10">
      {/* star badge */}
      <div className="absolute left-6 top-0 z-20 hidden -translate-y-1/2 -rotate-6 sm:block rtl:left-auto rtl:right-6 rtl:rotate-6">
        <div
          className="flex h-28 w-28 items-center justify-center border-2 border-ink bg-yellow text-center font-display text-sm leading-tight"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 15%, 78% 6%, 80% 25%, 98% 28%, 90% 45%, 100% 60%, 82% 68%, 85% 87%, 66% 82%, 55% 100%, 44% 84%, 25% 95%, 21% 76%, 3% 72%, 13% 55%, 0% 40%, 18% 32%, 15% 13%, 34% 18%)",
          }}
        >
          {t.available}
        </div>
      </div>

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
          IG
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
          aria-label="YouTube"
        >
          YT
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

          <div className="pointer-events-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream">
            <span className="h-2.5 w-2.5 rounded-full bg-green" />
            {t.availableForProjects}
          </div>
        </div>
      </div>
    </section>
  );
}
