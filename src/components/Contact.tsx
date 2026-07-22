"use client";

import { CONTACT_EMAIL } from "@/lib/contact";
import { useLanguage } from "./LanguageContext";
import {
  WireframeEmail,
  WireframeInstagram,
  WireframeYouTube,
} from "./SocialIcons";

const copy = {
  en: {
    heading: (
      <>
        LET&apos;S JAM TOGETHER:
        <br />
        CONNECT AND CREATE!
      </>
    ),
    body: "I'd love to hear about your project's vision and how I can help it shine!",
    cta: "Contact me",
  },
  he: {
    heading: (
      <>
        צור קשר
        <br />
        וניצור ביחד
      </>
    ),
    body: "ש לכם פרויקט? אשמח לשמוע עליו ולחשוב יחד איך להפוך אותו לסרטון מדויק ומרשים",
    cta: "צרו איתי קשר",
  },
};

export default function Contact() {
  const { lang } = useLanguage();
  const t = copy[lang];
  return (
    <section id="contact" className="bg-ink px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-green p-8 text-cream sm:p-14">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl">
              {t.heading}
            </h2>
            <p className="mt-6 max-w-sm text-cream/80">{t.body}</p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-medium text-cream transition-transform hover:-translate-y-0.5"
            >
              {t.cta}
            </a>

            <p className="mt-14 font-display text-3xl sm:text-4xl">
              {CONTACT_EMAIL}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="https://instagram.com/carmelbartov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-green"
              aria-label="Instagram"
            >
              <WireframeInstagram className="h-6 w-6" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-green"
              aria-label="YouTube"
            >
              <WireframeYouTube className="h-6 w-6" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-green"
              aria-label={lang === "en" ? "Email" : "אימייל"}
            >
              <WireframeEmail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
