"use client";

import { serviceTagsByLang } from "@/lib/services";
import { CONTACT_EMAIL } from "@/lib/contact";
import StackReveal from "./StackReveal";
import { useLanguage } from "./LanguageContext";

const bodiesByLang = {
  en: [
    "Short-form, scroll-stopping cuts built for Instagram, TikTok, and YouTube Shorts.",
    "Interviews, documentaries, and brand films edited for pacing and clarity.",
    "Short-film storyline editing, filming, editing and social clips.",
    "Clean audio, mixed dialogue, and sound that supports the story.",
  ],
  he: [
    "עריכות קצרות שעוצרות גלילה, בנויות לאינסטגרם, טיקטוק ויוטיוב שורטס.",
    "ראיונות, סרטים תיעודיים וסרטי מותג, ערוכים לקצב ובהירות.",
    "ליווי סרטים קצרים משלב ההפקה ועד העריכה הסופית, כולל תוכן לרשתות החברתיות.",
    "אודיו נקי, דיאלוג ממוקסס וסאונד שתומך בסיפור.",
  ],
};

const bgs = ["bg-orange", "bg-green", "bg-pink-bright", "bg-blue"] as const;

function servicesFor(lang: keyof typeof serviceTagsByLang) {
  return serviceTagsByLang[lang].map((name, i) => ({
    name: lang === "en" ? name.toUpperCase() : name,
    bg: bgs[i],
    body: bodiesByLang[lang][i],
  }));
}

const copy = {
  en: {
    heading: "THE FULL SETLIST: MY EDITING SERVICES",
    ctaHeading: (
      <>
        DID NOT FIND
        <br />
        WHAT YOU NEED?
      </>
    ),
    cta: "Let's talk",
  },
  he: {
    heading: "רשימת השירותים שלי",
    ctaHeading: (
      <>
        לא מצאתם
        <br />
        מה שאתם צריכים?
      </>
    ),
    cta: "בואו נדבר",
  },
};

export default function Services() {
  const { lang } = useLanguage();
  const services = servicesFor(lang);
  const t = copy[lang];

  return (
    <section id="services" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h2>

        <StackReveal className="mt-16 flex flex-wrap justify-center gap-12">
          {[
            ...services.map((s) => (
              <div
                key={s.name}
                className={`flex aspect-[5/7] w-[22rem] flex-col items-center rounded-[2rem] border-2 border-ink/10 px-12 pb-14 pt-12 text-center text-ink shadow-lg ${s.bg}`}
              >
                <div className="mt-8 flex h-48 w-48 shrink-0 items-center justify-center rounded-2xl bg-cream px-4 text-center">
                  <span className="font-display text-2xl leading-none">
                    {s.name}
                  </span>
                </div>
                <div className="mt-10 w-full max-w-[16rem] border-t-2 border-dotted border-ink/60 pt-8 text-base font-bold leading-relaxed text-cream sm:text-lg">
                  {s.body}
                </div>
              </div>
            )),
            <div
              key="contact-card"
              className="flex aspect-[5/7] w-[22rem] flex-col items-center justify-center gap-8 rounded-[2rem] border-2 border-cream/10 bg-purple px-12 py-16 text-center text-cream shadow-lg"
            >
              <span className="font-display text-4xl leading-tight">
                {t.ctaHeading}
              </span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="rounded-full bg-cream px-10 py-4 text-lg font-medium text-ink"
              >
                {t.cta}
              </a>
            </div>,
          ]}
        </StackReveal>
      </div>
    </section>
  );
}
