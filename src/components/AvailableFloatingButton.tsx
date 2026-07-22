"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CONTACT_EMAIL } from "@/lib/contact";
import { LANGUAGE_TOGGLE_ID } from "./LanguageToggle";
import { useLanguage } from "./LanguageContext";

export const AVAILABLE_BUTTON_ANCHOR_ID = "available-button-anchor";

const SCROLL_THRESHOLD = 48;
const BASE_LEFT = 16;
const BASE_TOP = 16;
const DOCK_GAP = 12;

const label = {
  en: "Available for new projects",
  he: "זמינה לפרויקטים חדשים",
};

function GlowingBulb() {
  return (
    <span
      className="relative flex h-10 w-10 shrink-0 items-center justify-center"
      aria-hidden
    >
      <span className="absolute inset-0 animate-bulb-halo rounded-full bg-[#9dff57]/50 blur-[6px]" />
      <svg
        viewBox="0 0 24 24"
        className="relative h-10 w-10 animate-bulb-glow text-[#9dff57]"
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

  if (!toggleRect) {
    return { left: BASE_LEFT, top: BASE_TOP };
  }

  const top =
    toggleRect.top + toggleRect.height / 2 - buttonRect.height / 2;

  if (isRtl) {
    return {
      left: toggleRect.right + DOCK_GAP,
      top,
    };
  }

  return {
    left: toggleRect.left - buttonRect.width - DOCK_GAP,
    top,
  };
}

export default function AvailableFloatingButton() {
  const { lang } = useLanguage();
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  const updatePosition = useCallback(() => {
    const anchor = document.getElementById(AVAILABLE_BUTTON_ANCHOR_ID);
    const button = buttonRef.current;
    if (!anchor || !button) return;

    const isRtl = document.documentElement.dir === "rtl";
    const buttonRect = button.getBoundingClientRect();
    const scrolled = window.scrollY > SCROLL_THRESHOLD;

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
      <a
        ref={buttonRef}
        href={`mailto:${CONTACT_EMAIL}`}
        aria-label={label[lang]}
        className="pointer-events-auto flex max-w-[min(22rem,calc(100vw-3rem))] items-center gap-5 rounded-full bg-ink px-10 py-6 text-xl font-medium text-cream shadow-[4px_4px_0_0_#161614] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#161614] sm:text-2xl"
      >
        <GlowingBulb />
        <span className="leading-tight">{label[lang]}</span>
      </a>
    </div>
  );
}
