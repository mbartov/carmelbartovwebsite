"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";
import { LANGUAGE_TOGGLE_ID } from "./LanguageToggle";
import { useLanguage } from "./LanguageContext";

export const AVAILABLE_BUTTON_ANCHOR_ID = "available-button-anchor";

const SCROLL_THRESHOLD = 48;
const BASE_LEFT = 16;
const BASE_TOP = 16;
/** Clearance so the rotating glow frame isn't clipped by the viewport / toggle */
const GLOW_PAD = 10;
const DOCK_GAP = 16;

const label = {
  en: "Available for new projects",
  he: "זמינה לפרויקטים חדשים",
};

function GlowingBulb() {
  return (
    <span
      className="relative flex h-5 w-5 shrink-0 items-center justify-center sm:h-10 sm:w-10"
      aria-hidden
    >
      <span className="absolute inset-0 animate-bulb-halo rounded-full bg-[#9dff57]/50 blur-[3px] sm:blur-[6px]" />
      <svg
        viewBox="0 0 24 24"
        className="relative h-5 w-5 animate-bulb-glow text-[#9dff57] sm:h-10 sm:w-10"
        fill="currentColor"
      >
        <path d="M9 21h6v-1H9v1zm3-19a7 7 0 0 0-4 12.74V16a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.26A7 7 0 0 0 12 2zm0 2a5 5 0 0 1 3.9 8.32l-.4.53V15h-3V13.85l-.4-.53A5 5 0 0 1 12 4z" />
      </svg>
    </span>
  );
}

function getDockBesideToggle(button: HTMLElement, isRtl: boolean) {
  const toggle = document.getElementById(LANGUAGE_TOGGLE_ID);
  const toggleRect = toggle?.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const gap = DOCK_GAP + GLOW_PAD;

  // Leave room above the pill for the rotating glow frame
  const minTop = BASE_TOP + GLOW_PAD;
  const alignedTop = toggleRect
    ? toggleRect.top + toggleRect.height / 2 - buttonRect.height / 2
    : minTop;
  const top = Math.max(minTop, alignedTop);

  if (!toggleRect) {
    return { left: Math.max(GLOW_PAD, BASE_LEFT), top };
  }

  if (isRtl) {
    return {
      left: toggleRect.right + gap,
      top,
    };
  }

  return {
    left: Math.max(GLOW_PAD, toggleRect.left - buttonRect.width - gap),
    top,
  };
}

export default function AvailableFloatingButton() {
  const { lang } = useLanguage();
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [docked, setDocked] = useState(false);

  const updatePosition = useCallback(() => {
    const anchor = document.getElementById(AVAILABLE_BUTTON_ANCHOR_ID);
    const button = buttonRef.current;
    if (!anchor || !button) return;

    const isRtl = document.documentElement.dir === "rtl";
    const buttonRect = button.getBoundingClientRect();
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

    setDocked(scrolled);

    if (scrolled) {
      const dock = getDockBesideToggle(button, isRtl);
      setOffset({
        x: dock.left - BASE_LEFT,
        y: dock.top - BASE_TOP,
      });
      setReady(true);
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    const targetLeft = isRtl
      ? anchorRect.right - buttonRect.width
      : anchorRect.left;

    setOffset({
      x: targetLeft - BASE_LEFT,
      y: anchorRect.top - BASE_TOP,
    });
    setReady(true);
  }, [lang]);

  useLayoutEffect(() => {
    updatePosition();
  }, [updatePosition]);

  useEffect(() => {
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [updatePosition]);

  return (
    <div
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        opacity: ready ? 1 : 0,
      }}
      className="pointer-events-none fixed left-4 top-4 z-40 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div className="relative">
        {docked ? (
          <span className="available-glow-frame" aria-hidden />
        ) : null}
        <a
          ref={buttonRef}
          href={`mailto:${CONTACT_EMAIL}`}
          aria-label={label[lang]}
          className={`pointer-events-auto relative z-10 flex max-w-[min(22rem,calc(100vw-3rem))] items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 sm:gap-5 sm:px-10 sm:py-6 sm:text-2xl ${
            docked
              ? "shadow-none"
              : "shadow-[4px_4px_0_0_#161614] hover:shadow-[5px_5px_0_0_#161614]"
          }`}
        >
          <GlowingBulb />
          <span className="leading-tight">{label[lang]}</span>
        </a>
      </div>
    </div>
  );
}
