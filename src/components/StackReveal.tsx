"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

type Delta = { x: number; y: number };

function StackItem({
  children,
  index,
  total,
  delta,
  progress,
  setRef,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  delta: Delta;
  progress: MotionValue<number>;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  const fanRotation = (index % 2 === 0 ? -1 : 1) * (6 + index * 2.5);

  const x = useTransform(progress, [0, 1], [-delta.x, 0]);
  const y = useTransform(progress, [0, 1], [-delta.y - 24, 0]);
  const rotate = useTransform(progress, [0, 1], [fanRotation, 0]);
  const scale = useTransform(progress, [0, 1], [0.86, 1]);
  const opacity = useTransform(progress, [0, 0.12, 1], [0.85, 1, 1]);

  return (
    <motion.div
      ref={setRef}
      style={{ x, y, rotate, scale, opacity, zIndex: total - index }}
    >
      {children}
    </motion.div>
  );
}

export default function StackReveal({
  children,
  className = "",
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [deltas, setDeltas] = useState<Delta[]>(() =>
    children.map(() => ({ x: 0, y: 0 }))
  );

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.35"],
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;
      setDeltas(
        itemRefs.current.map((el) => {
          if (!el) return { x: 0, y: 0 };
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - centerX,
            y: r.top + r.height / 2 - centerY,
          };
        })
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children.length]);

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, i) => (
        <StackItem
          key={i}
          index={i}
          total={children.length}
          delta={deltas[i] ?? { x: 0, y: 0 }}
          progress={scrollYProgress}
          setRef={(el) => {
            itemRefs.current[i] = el;
          }}
        >
          {child}
        </StackItem>
      ))}
    </div>
  );
}
