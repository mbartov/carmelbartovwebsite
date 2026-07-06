"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const quotes = [
  {
    quote:
      "Fast, precise, and genuinely creative. Carmel understood the story we needed before we did.",
    name: "NOA LEVI",
    role: "MARKETING LEAD",
    bg: "bg-pink-bright",
  },
  {
    quote:
      "Every deadline met, every note nailed. The safest pair of hands I've handed footage to.",
    name: "AMIT SHAHAR",
    role: "CONTENT MANAGER",
    bg: "bg-orange",
  },
  {
    quote:
      "Our engagement doubled after Carmel started cutting our content. The numbers don't lie.",
    name: "DANIEL ROSEN",
    role: "CREATOR",
    bg: "bg-purple",
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [constraint, setConstraint] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current || !trackRef.current) return;
      const diff =
        trackRef.current.scrollWidth - containerRef.current.offsetWidth;
      setConstraint(Math.max(diff, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-ink px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-cream/60">
              [ Kind words ]
            </p>
            <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl md:text-6xl">
              WHAT CLIENTS SAY
            </h2>
          </div>
          <p className="hidden text-sm uppercase tracking-widest text-cream/50 sm:block">
            [ Drag &rarr; ]
          </p>
        </div>

        <div ref={containerRef} className="cursor-grab active:cursor-grabbing">
          <motion.div
            ref={trackRef}
            className="flex gap-8"
            drag="x"
            dragConstraints={{ left: -constraint, right: 0 }}
            dragElastic={0.08}
          >
            {quotes.map((t) => (
              <div
                key={t.name}
                className={`w-[20rem] shrink-0 rounded-3xl p-8 text-ink sm:w-[24rem] sm:p-10 ${t.bg}`}
              >
                <p className="font-display text-2xl leading-snug sm:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-8 text-sm font-semibold uppercase tracking-widest">
                  {t.name}
                </p>
                <p className="text-xs uppercase tracking-widest opacity-70">
                  {t.role}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
