"use client";

import { useLanguage } from "./LanguageContext";

const quotesByLang = {
  en: [
    {
      quote:
        "Fast, precise, and genuinely creative. Carmel understood the story we needed before we did.",
      name: "AVIA ROZALIO",
      role: "MAJOR, IDF SPOKESMAN",
      bg: "bg-pink-bright",
    },
    {
      quote:
        "She is a dedicated team member who contributes a lot to a film's success.",
      name: "YARON ROTENBERG",
      role: "FILM TEACHER",
      bg: "bg-orange",
    },
  ],
  he: [
    {
      quote:
        "מהירה, מדויקת ויצירתית באמת. כרמל הבינה את הסיפור שהיינו צריכים עוד לפני שאנחנו הבנו.",
      name: "אביה רוזליו",
      role: 'סרן, דובר צה"ל',
      bg: "bg-pink-bright",
    },
    {
      quote:
        "כל צוות שיפיק ויצור סרט יזכה בה כחברת צוות משקיעה ותורמת רבות להצלחת הסרט.",
      name: "ירון רוטנברג",
      role: "מורה לקולנוע",
      bg: "bg-orange",
    },
  ],
};

const copy = {
  en: {
    kicker: "[ Kind words ]",
    heading: "WHAT CLIENTS SAY",
  },
  he: {
    kicker: "[ מילים טובות ]",
    heading: "מה הלקוחות אומרים",
  },
};

export default function Testimonials() {
  const { lang } = useLanguage();
  const quotes = quotesByLang[lang];
  const t = copy[lang];
  const isRtl = lang === "he";

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-ink px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
            {t.kicker}
          </p>
          <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
            {t.heading}
          </h2>
        </div>

        {/*
          Native overflow scroll (dir=ltr) — framer dragConstraints invert under
          page RTL and trap Hebrew mobile users on the wrong axis.
        */}
        <div
          className="touch-pan-x overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          dir="ltr"
        >
          <div className="flex w-max gap-8 pb-1">
            {quotes.map((item) => (
              <div
                key={item.name}
                className={`w-[min(20rem,calc(100vw-3rem))] shrink-0 rounded-3xl p-8 text-ink sm:w-[24rem] sm:p-10 ${item.bg}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <p className="font-display text-2xl leading-snug sm:text-3xl">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-8 text-sm font-semibold uppercase tracking-widest">
                  {item.name}
                </p>
                <p className="text-xs uppercase tracking-widest opacity-70">
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
