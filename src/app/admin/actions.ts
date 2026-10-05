"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthError, requireAdmin } from "@/lib/auth";
import {
  OrderConflictError,
  createPortfolioItem,
  createTestimonial,
  purgePortfolio,
  purgeTestimonial,
  reorderPortfolio,
  reorderTestimonials,
  restorePortfolio,
  restoreTestimonial,
  softDeletePortfolio,
  softDeleteTestimonial,
  togglePortfolioHidden,
  toggleTestimonialHidden,
  updatePortfolioItem,
  updateTestimonial,
} from "@/lib/cms";
import { CARD_COLORS } from "@/lib/colors";
import type { ActionState } from "@/lib/content";
import { deleteSession } from "@/lib/session";
import { parseYouTubeId } from "@/lib/youtube";

const portfolioSchema = z.object({
  video: z.string().trim().min(1, "צריך קישור או מזהה יוטיוב"),
  color: z.enum(CARD_COLORS, { error: "צריך לבחור צבע" }),
  titleEn: z.string().trim().min(1, "צריך כותרת באנגלית").max(120),
  titleHe: z.string().trim().min(1, "צריך כותרת בעברית").max(120),
});

const testimonialSchema = z.object({
  color: z.enum(CARD_COLORS, { error: "צריך לבחור צבע" }),
  quoteEn: z.string().trim().min(1, "צריך ציטוט באנגלית").max(600),
  quoteHe: z.string().trim().min(1, "צריך ציטוט בעברית").max(600),
  nameEn: z.string().trim().min(1, "צריך שם באנגלית").max(80),
  nameHe: z.string().trim().min(1, "צריך שם בעברית").max(80),
  roleEn: z.string().trim().min(1, "צריך תפקיד באנגלית").max(80),
  roleHe: z.string().trim().min(1, "צריך תפקיד בעברית").max(80),
});

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function readId(formData: FormData) {
  const value = formData.get("id");
  const parsed = z.uuid().safeParse(value);
  return parsed.success ? parsed.data : null;
}

function readIds(ids: string[]) {
  const parsed = z.array(z.uuid()).safeParse(ids);
  return parsed.success ? parsed.data : null;
}

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "בדקי את הטופס ונסי שוב.";
}

function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/archive");
}

async function guard(run: () => Promise<ActionState>): Promise<ActionState> {
  try {
    await requireAdmin();
    return await run();
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "הסשן פג. צריך להתחבר שוב." };
    }
    if (error instanceof OrderConflictError) {
      return { ok: false, error: error.message };
    }
    console.error(error);
    return { ok: false, error: "משהו השתבש. נסי שוב." };
  }
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function savePortfolio(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return guard(async () => {
    const parsed = portfolioSchema.safeParse({
      video: text(formData, "video"),
      color: text(formData, "color"),
      titleEn: text(formData, "titleEn"),
      titleHe: text(formData, "titleHe"),
    });
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const videoId = parseYouTubeId(parsed.data.video);
    if (!videoId) {
      return { ok: false, error: "הקישור ליוטיוב לא זוהה." };
    }

    const input = {
      videoId,
      color: parsed.data.color,
      titleEn: parsed.data.titleEn,
      titleHe: parsed.data.titleHe,
    };
    const id = readId(formData);
    if (formData.get("id")) {
      if (!id) return { ok: false, error: "הפריט לא נמצא." };
      const updated = await updatePortfolioItem(id, input);
      if (!updated) return { ok: false, error: "הפריט לא נמצא." };
    } else {
      await createPortfolioItem(input);
    }

    revalidateContent();
    return { ok: true };
  });
}

export async function saveTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return guard(async () => {
    const parsed = testimonialSchema.safeParse({
      color: text(formData, "color"),
      quoteEn: text(formData, "quoteEn"),
      quoteHe: text(formData, "quoteHe"),
      nameEn: text(formData, "nameEn"),
      nameHe: text(formData, "nameHe"),
      roleEn: text(formData, "roleEn"),
      roleHe: text(formData, "roleHe"),
    });
    if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) };

    const id = readId(formData);
    if (formData.get("id")) {
      if (!id) return { ok: false, error: "הפריט לא נמצא." };
      const updated = await updateTestimonial(id, parsed.data);
      if (!updated) return { ok: false, error: "הפריט לא נמצא." };
    } else {
      await createTestimonial(parsed.data);
    }

    revalidateContent();
    return { ok: true };
  });
}

async function mutateById(
  formData: FormData,
  run: (id: string) => Promise<boolean>,
): Promise<ActionState> {
  return guard(async () => {
    const id = readId(formData);
    if (!id) return { ok: false, error: "הפריט לא נמצא." };
    const changed = await run(id);
    if (!changed) return { ok: false, error: "הפריט לא נמצא." };
    revalidateContent();
    return { ok: true };
  });
}

export async function hidePortfolio(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, togglePortfolioHidden);
}

export async function hideTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, toggleTestimonialHidden);
}

export async function deletePortfolio(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, softDeletePortfolio);
}

export async function deleteTestimonial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, softDeleteTestimonial);
}

export async function restorePortfolioItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, restorePortfolio);
}

export async function restoreTestimonialItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, restoreTestimonial);
}

export async function purgePortfolioItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, purgePortfolio);
}

export async function purgeTestimonialItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return mutateById(formData, purgeTestimonial);
}

async function reorder(
  ids: string[],
  run: (ids: string[]) => Promise<void>,
): Promise<ActionState> {
  return guard(async () => {
    const parsed = readIds(ids);
    if (!parsed) return { ok: false, error: "לא ניתן לשמור את הסדר." };
    await run(parsed);
    revalidateContent();
    return { ok: true };
  });
}

export async function reorderPortfolioItems(ids: string[]): Promise<ActionState> {
  return reorder(ids, reorderPortfolio);
}

export async function reorderTestimonialItems(
  ids: string[],
): Promise<ActionState> {
  return reorder(ids, reorderTestimonials);
}
