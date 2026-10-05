import type { CardColor } from "./colors";

export type PortfolioItem = {
  id: string;
  videoId: string;
  color: CardColor;
  titleEn: string;
  titleHe: string;
  youtubeTitle?: string | null;
  sortOrder: number;
  hidden: boolean;
  deletedAt: string | null;
};

export type Testimonial = {
  id: string;
  color: CardColor;
  quoteEn: string;
  quoteHe: string;
  nameEn: string;
  nameHe: string;
  roleEn: string;
  roleHe: string;
  sortOrder: number;
  hidden: boolean;
  deletedAt: string | null;
};

export type ActionState = { ok: true } | { ok: false; error: string } | null;
