"use client";

import StackReveal from "./StackReveal";
import { useLanguage } from "./LanguageContext";

const stepsByLang = {
  en: [
    {
      title: "Initial contact",
      body: "Reach out on email or through the form — tell me what you're making and when you need it.",
      bar: "bg-orange",
    },
    {
      title: "Brief discovery call",
      body: "A short call to nail the goal, the audience, the tone, and the deadline.",
      bar: "bg-pink-bright",
    },
    {
      title: "Video editing",
      body: "I build the story — structure, pacing, sound, and color — into a first cut you can react to.",
      bar: "bg-purple",
    },
    {
      title: "Revision rounds",
      body: "Focused feedback loops until every frame earns its place.",
      bar: "bg-green",
    },
    {
      title: "Final delivery",
      body: "Master files exported for every platform you publish on — delivered on time.",
      bar: "bg-blue",
    },
  ],
  he: [
    {
      title: "יצירת קשר ראשונית",
      body: "צרו קשר במייל או דרך הטופס — ספרו לי מה אתם יוצרים ומתי אתם צריכים את זה.",
      bar: "bg-orange",
    },
    {
      title: "שיחת היכרות קצרה",
      body: "שיחה קצרה כדי לסכם את המטרה, הקהל, הטון ולוח הזמנים.",
      bar: "bg-pink-bright",
    },
    {
      title: "עריכת וידאו",
      body: "אני בונה את הסיפור — מבנה, קצב, סאונד וצבע — לטיוטה ראשונה שתוכלו להגיב עליה.",
      bar: "bg-purple",
    },
    {
      title: "סבבי תיקונים",
      body: "מבצעים תיקונים בהתאם למשוב עד שהתוצאה מדויקת לשביעות רצונכם.",
      bar: "bg-green",
    },
    {
      title: "מסירה סופית",
      body: "הסרטון נמסר בפורמט המתאים לכל פלטפורמה, מוכן לפרסום",
      bar: "bg-blue",
    },
  ],
};

const copy = {
  en: { heading: "HOW WE'LL WORK" },
  he: { heading: "איך נעבוד" },
};

export default function Process() {
  const { lang } = useLanguage();
  const steps = stepsByLang[lang];
  const t = copy[lang];

  return (
    <section id="process" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-16 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          {t.heading}
        </h2>

        <StackReveal className="grid grid-cols-1 gap-8">
          {steps.map((step, i) => {
            const order = i + 1;
            return (
              <div
                key={step.title}
                className="rounded-3xl bg-cream p-8 text-ink shadow-lg sm:p-10"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
                  <span className="font-display text-7xl leading-none sm:text-8xl">
                    {String(order).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-relaxed sm:text-lg">
                      {step.body}
                    </p>
                  </div>
                </div>

                <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full rounded-full ${step.bar}`}
                    style={{ width: `${(order / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </StackReveal>
      </div>
    </section>
  );
}
