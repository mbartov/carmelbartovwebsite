export default function Contact() {
  return (
    <section id="contact" className="bg-ink px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-green p-8 text-cream sm:p-14">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">
          <div>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl">
              LET&apos;S JAM TOGETHER:
              <br />
              CONNECT AND CREATE!
            </h2>
            <p className="mt-6 max-w-sm text-cream/80">
              I&apos;d love to hear about your project&apos;s vision and how
              I can help it shine!
            </p>

            <a
              href="mailto:hello@carmel.video"
              className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-medium text-cream transition-transform hover:-translate-y-0.5"
            >
              Contact me
            </a>

            <p className="mt-14 font-display text-3xl sm:text-4xl">
              hello@carmel.video
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="https://instagram.com/carmelbartov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cream font-medium text-green"
              aria-label="Instagram"
            >
              IG
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cream font-display text-lg text-green"
              aria-label="YouTube"
            >
              YT
            </a>
            <a
              href="mailto:hello@carmel.video"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-xl text-green"
              aria-label="Email"
            >
              &#9993;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
