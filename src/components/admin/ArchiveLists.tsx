"use client";

import Image from "next/image";
import {
  purgePortfolioItem,
  purgeTestimonialItem,
  restorePortfolioItem,
  restoreTestimonialItem,
} from "@/app/admin/actions";
import { colorBorder } from "@/lib/colors";
import type { PortfolioItem, Testimonial } from "@/lib/content";
import { youtubeThumbnailUrl } from "@/lib/youtube";
import ConfirmForm from "./ConfirmForm";
import { dangerButton, quietButton } from "./styles";

export function PortfolioArchive({ items }: { items: PortfolioItem[] }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-3xl leading-none">רילס</h2>
      {items.length === 0 ? (
        <p className="text-sm text-cream/60">אין פריטים בארכיון.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 bg-cream/5 px-4 py-3 ${colorBorder[item.color]}`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src={youtubeThumbnailUrl(item.videoId)}
                  alt=""
                  width={80}
                  height={142}
                  className="h-16 w-10 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.youtubeTitle || item.titleHe}</p>
                  <p className="truncate text-xs text-cream/50">
                    {item.titleHe}
                    {item.deletedAt ? ` · ${formatDeleted(item.deletedAt)}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <ConfirmForm
                  id={item.id}
                  action={restorePortfolioItem}
                  label="שחזור"
                  className={quietButton}
                />
                <ConfirmForm
                  id={item.id}
                  action={purgePortfolioItem}
                  label="מחיקה לצמיתות"
                  confirm={`למחוק לצמיתות את „${item.titleHe || item.titleEn}”? אי אפשר לבטל.`}
                  className={dangerButton}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TestimonialArchive({ items }: { items: Testimonial[] }) {
  return (
    <section>
      <h2 className="mb-4 font-display text-3xl leading-none">המלצות</h2>
      {items.length === 0 ? (
        <p className="text-sm text-cream/60">אין פריטים בארכיון.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border-4 bg-cream/5 px-4 py-3 ${colorBorder[item.color]}`}
            >
              <div>
                <p className="font-medium">{item.nameHe}</p>
                <p className="text-xs text-cream/50">
                  {item.deletedAt ? formatDeleted(item.deletedAt) : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <ConfirmForm
                  id={item.id}
                  action={restoreTestimonialItem}
                  label="שחזור"
                  className={quietButton}
                />
                <ConfirmForm
                  id={item.id}
                  action={purgeTestimonialItem}
                  label="מחיקה לצמיתות"
                  confirm={`למחוק לצמיתות את ההמלצה של ${item.nameHe}? אי אפשר לבטל.`}
                  className={dangerButton}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function formatDeleted(value: string) {
  return new Date(value).toLocaleString("he-IL", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
