import StackReveal from "./StackReveal";

const services = [
  {
    name: "SOCIAL REELS",
    bg: "bg-orange",
    body: "Short-form, scroll-stopping cuts built for Instagram, TikTok, and YouTube Shorts.",
  },
  {
    name: "LONG-FORM EDITS",
    bg: "bg-green",
    body: "Interviews, documentaries, and brand films edited for pacing and clarity.",
  },
  {
    name: "SHORT FILM PRODUCTION",
    bg: "bg-pink-bright",
    body: "Short-film storyline editing, filming, editing and social clips.",
  },
  {
    name: "PODCAST PRODUCTION",
    bg: "bg-blue",
    body: "Clean audio, mixed dialogue, and sound that supports the story.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          THE FULL SETLIST: MY EDITING SERVICES
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-cream/70">
          [ From social reels to full campaigns, I offer a complete range of
          editing services to make your story shine ]
        </p>

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
                DID NOT FIND
                <br />
                WHAT YOU NEED?
              </span>
              <a
                href="mailto:hello@carmel.video"
                className="rounded-full bg-cream px-10 py-4 text-lg font-medium text-ink"
              >
                Let&apos;s talk
              </a>
            </div>,
          ]}
        </StackReveal>
      </div>
    </section>
  );
}
