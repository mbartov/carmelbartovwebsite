"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { speedInsightsEnabled } from "@/lib/analytics";

function isAdminUrl(url: string) {
  try {
    const path = new URL(url, "https://carmelbartov.com").pathname;
    return path === "/admin" || path.startsWith("/admin/");
  } catch {
    return false;
  }
}

export default function SiteAnalytics() {
  return (
    <>
      <Analytics
        beforeSend={(event: BeforeSendEvent) => {
          if (isAdminUrl(event.url)) return null;
          return event;
        }}
      />
      {speedInsightsEnabled ? (
        <SpeedInsights
          beforeSend={(event) => {
            if (isAdminUrl(event.url)) return null;
            return event;
          }}
        />
      ) : null}
    </>
  );
}
