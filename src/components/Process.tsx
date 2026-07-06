import StackReveal from "./StackReveal";

const steps: {
  title: string;
  body: string;
  bar: string;
}[] = [
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
];

export default function Process() {
  return (
    <section id="process" className="bg-ink px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
          [ Scroll to spread the deck ]
        </p>
        <h2 className="mb-16 font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
          HOW WE&apos;LL WORK
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
