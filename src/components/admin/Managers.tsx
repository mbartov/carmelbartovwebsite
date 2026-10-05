"use client";

import Image from "next/image";
import { useState } from "react";
import {
  deletePortfolio,
  deleteTestimonial,
  hidePortfolio,
  hideTestimonial,
  reorderPortfolioItems,
  reorderTestimonialItems,
  savePortfolio,
  saveTestimonial,
} from "@/app/admin/actions";
import { colorBorder, type CardColor } from "@/lib/colors";
import type { PortfolioItem, Testimonial } from "@/lib/content";
import { youtubeThumbnailUrl } from "@/lib/youtube";
import ConfirmForm from "./ConfirmForm";
import { PortfolioForm, TestimonialForm } from "./ContentForm";
import ReorderList from "./ReorderList";
import { iconButton, iconDangerButton, primaryButton } from "./styles";

function cardFrame(color: CardColor) {
  return `flex items-start gap-3 rounded-2xl border-4 bg-cream/5 p-3 ${colorBorder[color]}`;
}

export function PortfolioManager({ items }: { items: PortfolioItem[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const signature = items
    .map((item) =>
      [item.id, item.hidden, item.titleEn, item.videoId, item.color].join(":"),
    )
    .join("|");

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-cream/60">[ תיק עבודות ]</p>
          <h2 className="font-display text-4xl leading-none">רילס</h2>
        </div>
        <button type="button" className={primaryButton} onClick={() => setAdding((open) => !open)}>
          {adding ? "סגירה" : "ריל חדש"}
        </button>
      </header>

      {adding ? (
        <div className="mb-6 rounded-2xl border border-cream/15 p-4">
          <PortfolioForm action={savePortfolio} onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-cream/60">אין עדיין רילס.</p>
      ) : (
        <ReorderList
          key={signature}
          items={items}
          persist={reorderPortfolioItems}
          itemClassName={(item) => cardFrame(item.color)}
          render={(item) => (
            <div className={item.hidden ? "opacity-50" : undefined}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 text-start"
                  onClick={() =>
                    setEditingId((current) => (current === item.id ? null : item.id))
                  }
                >
                  <Image
                    src={youtubeThumbnailUrl(item.videoId)}
                    alt=""
                    width={90}
                    height={160}
                    className="h-20 w-12 shrink-0 rounded-lg border border-ink/40 object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {item.youtubeTitle || item.titleEn}
                    </span>
                    <span className="mt-1 block truncate text-xs text-cream/50">
                      {item.titleHe}
                      {item.titleEn ? ` · ${item.titleEn}` : ""}
                      {item.hidden ? " · מוסתר" : ""}
                    </span>
                  </span>
                </button>
                <div className="flex shrink-0 gap-2">
                  <ConfirmForm
                    id={item.id}
                    action={hidePortfolio}
                    label={item.hidden ? "הצגת הריל" : "הסתרת הריל"}
                    className={iconButton}
                    icon={item.hidden ? <EyeIcon /> : <EyeOffIcon />}
                  />
                  <ConfirmForm
                    id={item.id}
                    action={deletePortfolio}
                    label="מחיקת הריל"
                    confirm={`למחוק את „${item.titleHe || item.titleEn}”? אפשר לשחזר מהארכיון.`}
                    className={iconDangerButton}
                    icon={<TrashIcon />}
                  />
                </div>
              </div>
              {editingId === item.id ? (
                <PortfolioForm
                  item={item}
                  action={savePortfolio}
                  onDone={() => setEditingId(null)}
                />
              ) : null}
            </div>
          )}
        />
      )}
    </section>
  );
}

export function TestimonialManager({ items }: { items: Testimonial[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const signature = items
    .map((item) =>
      [item.id, item.hidden, item.nameEn, item.quoteEn, item.color].join(":"),
    )
    .join("|");

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-cream/60">[ מילים טובות ]</p>
          <h2 className="font-display text-4xl leading-none">המלצות</h2>
        </div>
        <button
          type="button"
          className={primaryButton}
          onClick={() => setAdding((open) => !open)}
        >
          {adding ? "סגירה" : "המלצה חדשה"}
        </button>
      </header>

      {adding ? (
        <div className="mb-6 rounded-2xl border border-cream/15 p-4">
          <TestimonialForm action={saveTestimonial} onDone={() => setAdding(false)} />
        </div>
      ) : null}

      {items.length === 0 ? (
        <p className="text-sm text-cream/60">אין עדיין המלצות.</p>
      ) : (
        <ReorderList
          key={signature}
          items={items}
          persist={reorderTestimonialItems}
          itemClassName={(item) => cardFrame(item.color)}
          render={(item) => (
            <div className={item.hidden ? "opacity-50" : undefined}>
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-start"
                  onClick={() =>
                    setEditingId((current) => (current === item.id ? null : item.id))
                  }
                >
                  <span className="block text-lg font-black leading-snug">
                    &ldquo;{item.quoteHe}&rdquo;
                  </span>
                  <span className="mt-4 block text-xs font-semibold">{item.nameHe}</span>
                  <span className="mt-1 block text-[11px] text-cream/70">{item.roleHe}</span>
                  {item.hidden ? (
                    <span className="mt-2 block text-[11px] text-cream/50">מוסתר</span>
                  ) : null}
                </button>
                <div className="flex shrink-0 flex-col gap-2">
                  <ConfirmForm
                    id={item.id}
                    action={hideTestimonial}
                    label={item.hidden ? "הצגת ההמלצה" : "הסתרת ההמלצה"}
                    className={iconButton}
                    icon={item.hidden ? <EyeIcon /> : <EyeOffIcon />}
                  />
                  <ConfirmForm
                    id={item.id}
                    action={deleteTestimonial}
                    label="מחיקת ההמלצה"
                    confirm={`למחוק את ההמלצה של ${item.nameHe}? אפשר לשחזר מהארכיון.`}
                    className={iconDangerButton}
                    icon={<TrashIcon />}
                  />
                </div>
              </div>
              {editingId === item.id ? (
                <TestimonialForm
                  item={item}
                  action={saveTestimonial}
                  onDone={() => setEditingId(null)}
                />
              ) : null}
            </div>
          )}
        />
      )}
    </section>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6" strokeLinecap="round" />
      <path d="M9.9 5.1A10.8 10.8 0 0 1 12 5c5.5 0 9.5 4.2 11 7-.6 1.1-1.5 2.3-2.6 3.4" strokeLinecap="round" />
      <path d="M6.1 6.1C4.2 7.4 2.7 9.1 1 12c1.5 2.8 5.5 7 11 7 1.3 0 2.5-.2 3.6-.7" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4.5-7 11-7 11 7 11 7-4.5 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7l1 13h8l1-13" strokeLinejoin="round" />
    </svg>
  );
}
