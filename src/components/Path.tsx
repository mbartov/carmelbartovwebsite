"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

const milestonesByLang = {
  en: [
    {
      range: "2020 – 2024",
      title: "FREELANCE VIDEO EDITOR AND PRODUCER",
      meta: "FREELANCE",
      color: "bg-blue",
    },
    {
      range: "2024 – 2026",
      title: "VIDEO EDITOR, DIGITAL CONTENT",
      meta: "IDF SPOKESPERSON'S UNIT",
      color: "bg-orange",
    },
    {
      range: "2026 – NOW",
      title: "VIDEO EDITOR & CONTENT DIRECTOR",
      meta: "INDEPENDENT",
      color: "bg-purple",
    },
    {
      range: "2026 – NOW",
      title: "FILM STUDENT",
      meta: "TEL AVIV UNIVERSITY",
      color: "bg-purple",
    }],
  he: [
    {
      range: "2020 – 2024",
      title: "עורכת וידאו ומפיקה עצמאית",
      meta: "עבודה עצמאית",
      color: "bg-blue",
    },
    {
      range: "2024 – 2026",
      title: "עורכת וידאו, תוכן דיגיטלי",
      meta: 'יחידת דובר צה"ל',
      color: "bg-orange",
    },
    {
      range: "2026 – היום",
      title: "עורכת וידאו ומפיקת תוכן",
      meta: "עצמאית",
      color: "bg-purple",
    },
  ],
};

const copy = {
  en: { kicker: "[ Where it started, where it's headed ]", heading: "THE PATH SO FAR" },
  he: { kicker: "[ מאיפה זה התחיל, ולאן זה הולך ]", heading: "הדרך עד כה" },
};

export default function Path() {
  const { lang } = useLanguage();
  const milestones = milestonesByLang[lang];
  const t = copy[lang];

  return (
    <section id="path" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
          {t.kicker}
        </p>
        <h2 className="mb-16 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h2>

        <div className="relative border-l-2 border-cream/15 pl-12 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-12">
          <div className="flex flex-col gap-16">
            {milestones.map((m, i) => (
              <motion.div
                key={m.title}
                className="relative"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <span
                  className={`absolute -left-14 top-1 h-4 w-4 rounded-full ring-4 ring-ink rtl:left-auto rtl:-right-14 ${m.color}`}
                />
                <p className="text-sm uppercase tracking-widest text-cream/50">
                  {m.range}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-widest text-cream/60">
                  {m.meta}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
