"use server";

import { redirect } from "next/navigation";
import {
  clearFailedLogins,
  clientIp,
  isRateLimited,
  passphraseMatches,
  recordFailedLogin,
} from "@/lib/auth";
import type { ActionState } from "@/lib/content";
import { createSession } from "@/lib/session";

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!process.env.ADMIN_PASSPHRASE || !process.env.SESSION_SECRET) {
    return { ok: false, error: "ההתחברות לא מוגדרת." };
  }

  const phrase = String(formData.get("passphrase") ?? "");

  try {
    const ip = await clientIp();
    if (await isRateLimited(ip)) {
      return {
        ok: false,
        error: "יותר מדי ניסיונות. נסי שוב בעוד כמה דקות.",
      };
    }
    if (!passphraseMatches(phrase)) {
      await recordFailedLogin(ip);
      return { ok: false, error: "מילת הכניסה שגויה." };
    }
    await clearFailedLogins(ip);
    await createSession();
  } catch (error) {
    console.error(error);
    return { ok: false, error: "לא הצלחתי להתחבר. בדקי את החיבור למסד." };
  }

  redirect("/admin");
}
