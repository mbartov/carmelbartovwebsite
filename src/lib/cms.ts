import "server-only";

import type { CardColor } from "./colors";
import { isCardColor } from "./colors";
import type { PortfolioItem, Testimonial } from "./content";
import { getSql } from "./db";
import { seedPortfolio, seedTestimonials } from "./seed-data";
import { fetchYouTubeTitle } from "./youtube";

export class OrderConflictError extends Error {
  constructor() {
    super("הרשימה השתנתה. רענני ונסי שוב.");
    this.name = "OrderConflictError";
  }
}

function timestamp(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapPortfolio(row: Record<string, unknown>): PortfolioItem {
  const color = String(row.color);
  if (!isCardColor(color)) throw new Error(`Unknown portfolio color: ${color}`);
  return {
    id: String(row.id),
    videoId: String(row.video_id),
    color,
    titleEn: String(row.title_en),
    titleHe: String(row.title_he),
    sortOrder: Number(row.sort_order),
    hidden: Boolean(row.hidden),
    deletedAt: timestamp(row.deleted_at),
  };
}

function mapTestimonial(row: Record<string, unknown>): Testimonial {
  const color = String(row.color);
  if (!isCardColor(color)) throw new Error(`Unknown testimonial color: ${color}`);
  return {
    id: String(row.id),
    color,
    quoteEn: String(row.quote_en),
    quoteHe: String(row.quote_he),
    nameEn: String(row.name_en),
    nameHe: String(row.name_he),
    roleEn: String(row.role_en),
    roleHe: String(row.role_he),
    sortOrder: Number(row.sort_order),
    hidden: Boolean(row.hidden),
    deletedAt: timestamp(row.deleted_at),
  };
}

export async function getPublicPortfolio(): Promise<PortfolioItem[]> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, video_id, color, title_en, title_he, sort_order, hidden, deleted_at
      FROM portfolio_items
      WHERE deleted_at IS NULL AND hidden = false
      ORDER BY sort_order ASC, created_at ASC
    `;
    return rows.map(mapPortfolio);
  } catch (error) {
    console.error("Portfolio read failed, using seed content", error);
    return seedPortfolio.filter((item) => !item.hidden && !item.deletedAt);
  }
}

export async function getPublicTestimonials(): Promise<Testimonial[]> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, color, quote_en, quote_he, name_en, name_he, role_en, role_he,
             sort_order, hidden, deleted_at
      FROM testimonials
      WHERE deleted_at IS NULL AND hidden = false
      ORDER BY sort_order ASC, created_at ASC
    `;
    return rows.map(mapTestimonial);
  } catch (error) {
    console.error("Testimonials read failed, using seed content", error);
    return seedTestimonials.filter((item) => !item.hidden && !item.deletedAt);
  }
}

async function withYouTubeTitles(items: PortfolioItem[]) {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      youtubeTitle: await fetchYouTubeTitle(item.videoId),
    })),
  );
}

export async function getAdminPortfolio(): Promise<PortfolioItem[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, video_id, color, title_en, title_he, sort_order, hidden, deleted_at
    FROM portfolio_items
    WHERE deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `;
  return withYouTubeTitles(rows.map(mapPortfolio));
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, color, quote_en, quote_he, name_en, name_he, role_en, role_he,
           sort_order, hidden, deleted_at
    FROM testimonials
    WHERE deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `;
  return rows.map(mapTestimonial);
}

export async function getArchivedPortfolio(): Promise<PortfolioItem[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, video_id, color, title_en, title_he, sort_order, hidden, deleted_at
    FROM portfolio_items
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `;
  return withYouTubeTitles(rows.map(mapPortfolio));
}

export async function getArchivedTestimonials(): Promise<Testimonial[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, color, quote_en, quote_he, name_en, name_he, role_en, role_he,
           sort_order, hidden, deleted_at
    FROM testimonials
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `;
  return rows.map(mapTestimonial);
}

export type PortfolioInput = {
  videoId: string;
  color: CardColor;
  titleEn: string;
  titleHe: string;
};

export type TestimonialInput = {
  color: CardColor;
  quoteEn: string;
  quoteHe: string;
  nameEn: string;
  nameHe: string;
  roleEn: string;
  roleHe: string;
};

export async function createPortfolioItem(input: PortfolioInput) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO portfolio_items (video_id, color, title_en, title_he, sort_order)
    VALUES (
      ${input.videoId},
      ${input.color},
      ${input.titleEn},
      ${input.titleHe},
      (
        SELECT COALESCE(MAX(sort_order), 0) + 1
        FROM portfolio_items
        WHERE deleted_at IS NULL
      )
    )
    RETURNING id
  `;
  return String(rows[0]?.id);
}

export async function updatePortfolioItem(id: string, input: PortfolioInput) {
  const sql = getSql();
  const rows = await sql`
    UPDATE portfolio_items
    SET video_id = ${input.videoId},
        color = ${input.color},
        title_en = ${input.titleEn},
        title_he = ${input.titleHe},
        updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function createTestimonial(input: TestimonialInput) {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO testimonials (
      color, quote_en, quote_he, name_en, name_he, role_en, role_he, sort_order
    )
    VALUES (
      ${input.color},
      ${input.quoteEn},
      ${input.quoteHe},
      ${input.nameEn},
      ${input.nameHe},
      ${input.roleEn},
      ${input.roleHe},
      (
        SELECT COALESCE(MAX(sort_order), 0) + 1
        FROM testimonials
        WHERE deleted_at IS NULL
      )
    )
    RETURNING id
  `;
  return String(rows[0]?.id);
}

export async function updateTestimonial(id: string, input: TestimonialInput) {
  const sql = getSql();
  const rows = await sql`
    UPDATE testimonials
    SET color = ${input.color},
        quote_en = ${input.quoteEn},
        quote_he = ${input.quoteHe},
        name_en = ${input.nameEn},
        name_he = ${input.nameHe},
        role_en = ${input.roleEn},
        role_he = ${input.roleHe},
        updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

async function liveIds(table: "portfolio_items" | "testimonials") {
  const sql = getSql();
  const rows =
    table === "portfolio_items"
      ? await sql`SELECT id FROM portfolio_items WHERE deleted_at IS NULL`
      : await sql`SELECT id FROM testimonials WHERE deleted_at IS NULL`;
  return new Set(rows.map((row) => String(row.id)));
}

function sameIdSet(ids: string[], live: Set<string>) {
  return (
    ids.length === live.size &&
    new Set(ids).size === ids.length &&
    ids.every((id) => live.has(id))
  );
}

export async function reorderPortfolio(ids: string[]) {
  const live = await liveIds("portfolio_items");
  if (!sameIdSet(ids, live)) throw new OrderConflictError();
  const sql = getSql();
  await sql`
    UPDATE portfolio_items AS p
    SET sort_order = v.ord::int, updated_at = now()
    FROM unnest(${ids}::uuid[]) WITH ORDINALITY AS v(id, ord)
    WHERE p.id = v.id AND p.deleted_at IS NULL
  `;
}

export async function reorderTestimonials(ids: string[]) {
  const live = await liveIds("testimonials");
  if (!sameIdSet(ids, live)) throw new OrderConflictError();
  const sql = getSql();
  await sql`
    UPDATE testimonials AS t
    SET sort_order = v.ord::int, updated_at = now()
    FROM unnest(${ids}::uuid[]) WITH ORDINALITY AS v(id, ord)
    WHERE t.id = v.id AND t.deleted_at IS NULL
  `;
}

export async function togglePortfolioHidden(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE portfolio_items
    SET hidden = NOT hidden, updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function toggleTestimonialHidden(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE testimonials
    SET hidden = NOT hidden, updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function softDeletePortfolio(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE portfolio_items
    SET deleted_at = now(), updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function softDeleteTestimonial(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE testimonials
    SET deleted_at = now(), updated_at = now()
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function restorePortfolio(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE portfolio_items
    SET deleted_at = NULL,
        updated_at = now(),
        sort_order = (
          SELECT COALESCE(MAX(sort_order), 0) + 1
          FROM portfolio_items
          WHERE deleted_at IS NULL
        )
    WHERE id = ${id} AND deleted_at IS NOT NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function restoreTestimonial(id: string) {
  const sql = getSql();
  const rows = await sql`
    UPDATE testimonials
    SET deleted_at = NULL,
        updated_at = now(),
        sort_order = (
          SELECT COALESCE(MAX(sort_order), 0) + 1
          FROM testimonials
          WHERE deleted_at IS NULL
        )
    WHERE id = ${id} AND deleted_at IS NOT NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function purgePortfolio(id: string) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM portfolio_items
    WHERE id = ${id} AND deleted_at IS NOT NULL
    RETURNING id
  `;
  return rows.length > 0;
}

export async function purgeTestimonial(id: string) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM testimonials
    WHERE id = ${id} AND deleted_at IS NOT NULL
    RETURNING id
  `;
  return rows.length > 0;
}
