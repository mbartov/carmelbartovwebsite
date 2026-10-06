import { track } from "@vercel/analytics";
import type { Lang } from "@/components/LanguageContext";

/**
 * Speed Insights needs a paid Vercel plan.
 * Set this to true after that plan is on, then deploy again.
 */
export const speedInsightsEnabled = false;

type EventData = Record<string, string | number | boolean | null>;

/** Sends one custom event and always includes the visitor's language. */
export function trackSiteEvent(name: string, lang: Lang, data?: EventData) {
  track(name, { ...data, lang });
}
