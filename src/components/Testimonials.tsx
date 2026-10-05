"use client";

import { colorMap } from "@/lib/colors";
import type { Testimonial } from "@/lib/content";
import { useLanguage } from "./LanguageContext";

const copy = {
  en: {
    kicker: "[ Kind words ]",
    heading: "WHAT CLIENTS SAY",
    drag: "[ Swipe → ]",
  },
  he: {
    kicker: "[ מילים טובות ]",
    heading: "מה הלקוחות אומרים",
    drag: "[ החליקו → ]",
  },
};

export default function Testimonials({ items }: { items: Testimonial[] }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const isRtl = lang === "he";

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

        {/*
          Native overflow scroll (dir=ltr) — framer dragConstraints invert under
          page RTL and trap Hebrew mobile users on the wrong axis.
        */}
        <div
          className="touch-pan-x overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          dir="ltr"
        >
          <div className="flex w-max gap-8 pb-1">
            {items.map((item) => (
              <div
                key={item.id}
                className={`w-[min(20rem,calc(100vw-3rem))] shrink-0 rounded-3xl p-8 text-ink sm:w-[24rem] sm:p-10 ${colorMap[item.color]}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <p className="font-display text-2xl leading-snug sm:text-3xl">
                  &ldquo;{lang === "he" ? item.quoteHe : item.quoteEn}&rdquo;
                </p>
                <p className="mt-8 text-sm font-semibold uppercase tracking-widest">
                  {lang === "he" ? item.nameHe : item.nameEn}
                </p>
                <p className="text-xs uppercase tracking-widest opacity-70">
                  {lang === "he" ? item.roleHe : item.roleEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
