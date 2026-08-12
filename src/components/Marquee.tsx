"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  speed?: number;
};

export default function Marquee({
  children,
  className = "",
  trackClassName = "",
  speed = 25,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(3);
  const [halfWidth, setHalfWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const unit = unitRef.current;
    if (!container || !unit) return;

    const updateRepeats = () => {
      const containerWidth = container.getBoundingClientRect().width;
      const unitWidth = unit.getBoundingClientRect().width;
      if (unitWidth <= 0) return;

      // Each half must fully cover the viewport so content never runs out
      const minHalfWidth = Math.max(containerWidth, window.innerWidth) * 1.15;
      setRepeatCount(Math.max(2, Math.ceil(minHalfWidth / unitWidth)));
    };

    updateRepeats();
    const ro = new ResizeObserver(updateRepeats);
    ro.observe(container);
    ro.observe(unit);
    window.addEventListener("resize", updateRepeats);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateRepeats);
    };
  }, [children]);

  useLayoutEffect(() => {
    const half = halfRef.current;
    if (!half) return;

    const measureHalf = () => {
      setHalfWidth(half.getBoundingClientRect().width);
    };

    measureHalf();
    document.fonts?.ready.then(measureHalf).catch(() => undefined);

    const ro = new ResizeObserver(measureHalf);
    ro.observe(half);
    return () => ro.disconnect();
  }, [repeatCount, children]);

  const renderHalf = (key: string, hidden?: boolean) => (
    <div
      key={key}
      ref={hidden ? undefined : halfRef}
      className={`flex shrink-0 flex-nowrap ${trackClassName}`}
      aria-hidden={hidden || undefined}
    >
      {Array.from({ length: repeatCount }).map((_, i) => (
        <div key={i} className="flex shrink-0">
          {children}
        </div>
      ))}
    </div>
  );

  const trackStyle = {
    "--marquee-duration": `${speed}s`,
    "--marquee-offset": `${halfWidth}px`,
  } as CSSProperties;

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className={`relative overflow-hidden ${className}`}
    >
      <div
        ref={unitRef}
        dir="ltr"
        className="pointer-events-none absolute left-0 top-0 flex w-max shrink-0 opacity-0"
        aria-hidden
      >
        {children}
      </div>
      <div
        dir="ltr"
        className={`marquee-track flex w-max flex-nowrap ${halfWidth > 0 ? "marquee-track--active" : ""}`}
        style={trackStyle}
      >
        {renderHalf("a")}
        {renderHalf("b", true)}
      </div>
    </div>
  );
}
