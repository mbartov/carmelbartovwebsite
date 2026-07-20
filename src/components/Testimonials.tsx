"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    {
      quote:
        "Our engagement doubled after Carmel started cutting our content. The numbers don't lie.",
      name: "DANIEL ROSEN",
      role: "CREATOR",
      bg: "bg-purple",
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
    {
      quote:
        "מעורבות הקהל שלנו הכפילה את עצמה מאז שכרמל התחילה לערוך את התוכן שלנו. המספרים לא משקרים.",
      name: "דניאל רוזן",
      role: "יוצר תוכן",
      bg: "bg-purple",
    },
  ],
};

const copy = {
  en: { kicker: "[ Kind words ]", heading: "WHAT CLIENTS SAY", drag: "[ Drag → ]" },
  he: { kicker: "[ מילים טובות ]", heading: "מה הלקוחות אומרים", drag: "[ גררו ← ]" },
};

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);
  const { lang } = useLanguage();
  const quotes = quotesByLang[lang];
  const t = copy[lang];

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current || !trackRef.current) return;
      const diff =
        trackRef.current.scrollWidth - containerRef.current.offsetWidth;
      setConstraint(Math.max(diff, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-ink px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
              {t.kicker}
            </p>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              {t.heading}
            </h2>
          </div>
          <p className="hidden text-sm uppercase tracking-widest text-cream/50 sm:block">
            {t.drag}
          </p>
        </div>

        <div ref={containerRef} className="cursor-grab active:cursor-grabbing">
          <motion.div
            ref={trackRef}
            className="flex gap-8"
            drag="x"
            dragConstraints={{ left: -constraint, right: 0 }}
            dragElastic={0.08}
          >
            {quotes.map((t) => (
              <div
                key={t.name}
                className={`w-[20rem] shrink-0 rounded-3xl p-8 text-ink sm:w-[24rem] sm:p-10 ${t.bg}`}
              >
                <p className="font-display text-2xl leading-snug sm:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-8 text-sm font-semibold uppercase tracking-widest">
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-widest opacity-70">
                  {t.role}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
