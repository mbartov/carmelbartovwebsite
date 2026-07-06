import Badge3D from "./Badge3DClient";

export default function Hero() {
  return (
    <section className="relative min-h-[900px] overflow-hidden bg-pink px-6 pb-24 pt-10 text-ink sm:px-10">
      {/* star badge */}
      <div className="absolute left-6 top-0 z-20 hidden -translate-y-1/2 -rotate-6 sm:block">
        <div
          className="flex h-28 w-28 items-center justify-center border-2 border-ink bg-yellow text-center font-display text-sm leading-tight"
          style={{
            clipPath:
              "polygon(50% 0%, 61% 15%, 78% 6%, 80% 25%, 98% 28%, 90% 45%, 100% 60%, 82% 68%, 85% 87%, 66% 82%, 55% 100%, 44% 84%, 25% 95%, 21% 76%, 3% 72%, 13% 55%, 0% 40%, 18% 32%, 15% 13%, 34% 18%)",
          }}
        >
          AVAILABLE
          <br />
          WORLDWIDE
        </div>
      </div>

      {/* nav pill */}
      <nav className="relative z-20 mx-auto mb-14 hidden w-fit items-center gap-1 rounded-full bg-ink p-1.5 md:flex">
        {[
          ["About me", "#about"],
          ["My portfolio", "#portfolio"],
          ["My services", "#services"],
          ["My contacts", "#contact"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-pink"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* social icons */}
      <div className="absolute right-6 top-8 z-20 flex gap-3 sm:right-10">
        <a
          href="https://instagram.com/carmelbartov"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream transition-transform hover:-translate-y-0.5"
          aria-label="Instagram"
        >
          IG
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg text-cream transition-transform hover:-translate-y-0.5"
          aria-label="YouTube"
        >
          YT
        </a>
      </div>

      {/* free-floating 3D badge, spans the whole section */}
      <Badge3D />

      <div className="relative z-10 mx-auto max-w-6xl pt-16 lg:pt-0">
        <div className="pointer-events-none max-w-lg">
          <h1 className="font-display text-5xl leading-[0.95] sm:text-6xl md:text-7xl">
            YOUR STORY&apos;S
            <br />
            BACKSTAGE PASS
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/80">
            Let&apos;s find your story&apos;s rhythm and get your footage
            ready to rock the stage!
          </p>

          <div className="pointer-events-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream">
            <span className="h-2.5 w-2.5 rounded-full bg-green" />
            Available for new projects
          </div>
        </div>
      </div>
    </section>
  );
}
