"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "./LanguageContext";

const quotesByLang = {
  en: [
    {
      quote:
        "Carmel is a talented, creative and professional video editor whose work always brings a high standard, dedication, and results that are deeply satisfying. She is responsible, thorough and committed, and you can always count on her to give her maximum.",
      name: "AVIA ROZALIO",
      role: "MAJOR, IDF SPOKESMAN",
      bg: "bg-pink-bright",
    },
    {
      quote:
        "I had the pleasure of taking part in a film Carmel shot and edited — professional, talented, and I really loved the final result.",
      name: "AMIRAM TOVIM",
      role: "STAND-UP COMEDIAN",
      bg: "bg-purple",
    },
    {
      quote:
        "I came back from Africa with a camera full of photos and videos, and Carmel wove them into a moving film that earned compliments from friends and family!",
      name: "RONI BAR-SHAREL",
      role: "ANIMAL-ASSISTED THERAPIST",
      bg: "bg-orange",
    },
    {
      quote:
        "Carmel is very creative, fast and precise, and knows how to take an idea and bring it to life without much hassle. It was really easy and pleasant to work with her, and the results came out exactly as I imagined.",
      name: "TOHAR SAGI",
      role: "MANICURIST & CONTENT CREATOR",
      bg: "bg-green",
    },
    {
      quote:
        "She is a dedicated team member who contributes a lot to a film's success.",
      name: "YARON ROTENBERG",
      role: "FILM TEACHER",
      bg: "bg-blue",
    },
  ],
  he: [
    {
      quote:
        "כרמל עורכת וידאו מוכשרת, יצירתית ומקצועית, שהעבודה שלה תמיד מביאה איתה רמה גבוהה, השקעה ותוצאה שמביאה הרבה נחת. היא אחראית, יסודית ומסורה, ותמיד אפשר לסמוך עליה שתיתן את המקסימום.",
      name: "אביה רוזליו",
      role: 'סרן, דובר צה"ל',
      bg: "bg-pink-bright",
    },
    {
      quote:
        "היה לי העונג להשתתף בסרט שכרמל צילמה וערכה, מקצוענית ומוכשרת ואהבתי מאוד את התוצאה הסופית.",
      name: "אמירם טובים",
      role: "סטנדאפיסט וקומיקאי",
      bg: "bg-purple",
    },
    {
      quote:
        "חזרתי מאפריקה עם מצלמה מלאה בתמונות וסרטונים, כרמל חיברה לי אותם לסרט מרגש שקטף מחמאות מחברים ומשפחה!",
      name: "רוני בר שראל",
      role: "מטפלת באמצעות בע״ח",
      bg: "bg-orange",
    },
    {
      quote:
        "כרמל מאוד יצירתית, זריזה ומדויקת, ויודעת לקחת רעיון ולהוציא אותו לפועל בלי הרבה כאב ראש. היה לי ממש קל ונעים לעבוד איתה, והתוצרים יצאו בדיוק מה שחשבתי",
      name: "טוהר שגיא",
      role: "מניקוריסטית ויוצרת תוכן",
      bg: "bg-green",
    },
    {
      quote:
        "כל צוות שיפיק ויצור סרט יזכה בה כחברת צוות משקיעה ותורמת רבות להצלחת הסרט.",
      name: "ירון רוטנברג",
      role: "מורה לקולנוע",
      bg: "bg-blue",
    },
  ],
};

const DESKTOP_STEP = 2;

/** Mobile-only slide widths — desktop cards stay uniform at 24rem. */
const MOBILE_SLIDE_WIDTHS = ["86%", "92%", "84%", "90%", "88%"] as const;
const MOBILE_CARD_PADDING = ["p-5", "p-6", "p-5", "p-7", "p-6"] as const;
const MOBILE_QUOTE_SIZE = [
  "text-lg",
  "text-xl",
  "text-lg",
  "text-xl",
  "text-lg",
] as const;

const copy = {
  en: {
    heading: "WHAT CLIENTS SAY",
    prev: "Previous testimonial",
    prevMany: "Previous testimonials",
    next: "Next testimonial",
    nextMany: "Next testimonials",
  },
  he: {
    heading: "מה הלקוחות אומרים",
    prev: "המלצה קודמת",
    prevMany: "המלצות קודמות",
    next: "המלצה הבאה",
    nextMany: "המלצות הבאות",
  },
};

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}

export default function Testimonials() {
  const { lang } = useLanguage();
  const quotes = quotesByLang[lang];
  const t = copy[lang];
  const isRtl = lang === "he";
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const step = isDesktop ? DESKTOP_STEP : 1;

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const targetLeft =
      card.getBoundingClientRect().left -
      container.getBoundingClientRect().left +
      container.scrollLeft;

    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let timeout: ReturnType<typeof setTimeout>;
    const syncActiveIndex = () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      const scrollLeft = container.scrollLeft;
      let closest = 0;
      let minDistance = Infinity;

      cards.forEach((card, index) => {
        const cardLeft =
          card.getBoundingClientRect().left -
          container.getBoundingClientRect().left +
          scrollLeft;
        const distance = Math.abs(cardLeft - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(syncActiveIndex, 120);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timeout);
      container.removeEventListener("scroll", onScroll);
    };
  }, [quotes.length, lang]);

  useEffect(() => {
    scrollToIndex(0);
  }, [lang, scrollToIndex]);

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < quotes.length - 1;

  const goBy = (delta: number) => {
    const nextIndex = Math.min(
      quotes.length - 1,
      Math.max(0, activeIndex + delta),
    );
    scrollToIndex(nextIndex);
  };

  const arrowButtonClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-cream/30 text-cream transition enabled:hover:border-cream enabled:hover:bg-cream/10 disabled:cursor-not-allowed disabled:opacity-30 md:h-12 md:w-12";

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-ink px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
            {t.heading}
          </h2>
        </div>

        <div className="flex items-center gap-2 md:gap-4" dir="ltr">
          <button
            type="button"
            aria-label={step > 1 ? t.prevMany : t.prev}
            disabled={!canGoPrev}
            onClick={() => goBy(-step)}
            className={arrowButtonClass}
          >
            <ChevronIcon direction="left" />
          </button>

          <div
            ref={scrollRef}
            className="flex min-w-0 flex-1 touch-pan-x snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden"
          >
            {quotes.map((item, index) => (
              <div
                key={item.name}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={
                  isDesktop
                    ? undefined
                    : {
                        flex: `0 0 ${MOBILE_SLIDE_WIDTHS[index % MOBILE_SLIDE_WIDTHS.length]}`,
                      }
                }
                className="box-border snap-center px-1 md:flex-[0_0_24rem] md:snap-start md:px-0"
              >
                <div
                  className={`rounded-3xl text-ink md:p-8 ${MOBILE_CARD_PADDING[index % MOBILE_CARD_PADDING.length]} ${item.bg}`}
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <p
                    className={`font-display leading-snug md:text-3xl ${MOBILE_QUOTE_SIZE[index % MOBILE_QUOTE_SIZE.length]}`}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-widest md:mt-8">
                    {item.name}
                  </p>
                  <p className="text-xs uppercase tracking-widest opacity-70">
                    {item.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label={step > 1 ? t.nextMany : t.next}
            disabled={!canGoNext}
            onClick={() => goBy(step)}
            className={arrowButtonClass}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
