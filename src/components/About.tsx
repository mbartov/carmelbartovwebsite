function MicIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="3">
      <rect x="24" y="6" width="16" height="30" rx="8" />
      <path d="M16 28a16 16 0 0 0 32 0" />
      <path d="M32 44v10M22 54h20" strokeLinecap="round" />
    </svg>
  );
}

const instruments: { label: string; bg: string; icon: React.ReactNode }[] = [
  {
    label: "Keys",
    bg: "bg-purple",
    icon: (
      <svg viewBox="0 0 64 64" className="h-12 w-16" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="6" y="18" width="52" height="28" rx="4" />
        {[16, 26, 36, 46].map((x) => (
          <line key={x} x1={x} y1="18" x2={x} y2="46" />
        ))}
      </svg>
    ),
  },
  {
    label: "Strings",
    bg: "bg-blue",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 12v20a18 18 0 0 0 36 0V12" />
        <line x1="20" y1="14" x2="20" y2="30" />
        <line x1="32" y1="10" x2="32" y2="34" />
        <line x1="44" y1="14" x2="44" y2="30" />
        <rect x="24" y="50" width="16" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: "Drum",
    bg: "bg-pink-bright",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <ellipse cx="32" cy="18" rx="22" ry="8" />
        <path d="M10 18v18c0 4.4 9.8 8 22 8s22-3.6 22-8V18" />
      </svg>
    ),
  },
  {
    label: "Sax",
    bg: "bg-green",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M24 8h14v22" />
        <path d="M38 30a12 12 0 1 1 -16 11" />
        <circle cx="26" cy="24" r="1.5" fill="currentColor" />
        <circle cx="26" cy="30" r="1.5" fill="currentColor" />
        <circle cx="26" cy="36" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Guitar",
    bg: "bg-orange",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="32" y1="6" x2="32" y2="34" />
        <circle cx="32" cy="46" r="14" />
        <circle cx="32" cy="46" r="5" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-5xl">
        {/* ticket illustration */}
        <div
          className="relative mx-auto mb-16 flex w-full max-w-2xl -rotate-2 items-center gap-4 border-[3px] border-ink bg-pink-bright p-6 text-ink sm:p-8"
          style={{
            clipPath:
              "polygon(0 0, 82% 0, 82% 8%, 86% 0, 100% 0, 100% 100%, 18% 100%, 18% 92%, 14% 100%, 0 100%)",
          }}
        >
          <div className="flex-1">
            <p className="max-w-xs text-sm sm:text-base">
              I&apos;m Carmel, your backstage pass to unforgettable video
              experiences.
            </p>
            <p className="mt-6 font-display text-2xl leading-none sm:text-3xl">
              CARMEL BARTOV &mdash;
              <br />
              BEHIND THE SCENES
            </p>
          </div>
          <MicIcon />
          <p className="hidden -rotate-90 whitespace-nowrap text-xs uppercase tracking-[0.3em] sm:block">
            General admission
          </p>
        </div>

        <p className="mx-auto max-w-2xl text-center text-lg leading-relaxed text-cream/90 sm:text-xl">
          I&apos;m Carmel Bartov, a video editor with several years of
          experience in content creation and video editing. During my
          service in the IDF Spokesperson&apos;s Unit, I edited digital
          content while collaborating with senior officers &mdash; a
          fast-paced environment that demanded precision, creativity, and
          the ability to meet tight deadlines. I believe every video should
          tell a story, capture the viewer&apos;s attention, and leave a
          lasting impression.
        </p>

        <p className="mt-16 text-center font-display text-3xl leading-tight sm:text-4xl">
          CURRENTLY EDITING
          <br />
          FOR CREATORS &amp; BRANDS
        </p>

        <div className="mt-16 flex flex-wrap items-end justify-center gap-8 sm:gap-10">
          {instruments.map((inst) => (
            <div
              key={inst.label}
              className={`flex h-28 w-28 cursor-grab items-center justify-center rounded-[40%] text-cream shadow-lg transition-transform hover:-translate-y-1 active:cursor-grabbing sm:h-32 sm:w-32 ${inst.bg}`}
            >
              {inst.icon}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm uppercase tracking-widest text-cream/50">
          [ Hover the icons &mdash; they like to dance ]
        </p>
      </div>
    </section>
  );
}
