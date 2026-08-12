"use client";

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

const copy = {
  en: {
    heading: "WHAT CLIENTS SAY",
  },
  he: {
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
