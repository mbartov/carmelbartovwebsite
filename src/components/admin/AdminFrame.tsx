"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";
import { logout } from "@/app/admin/actions";
import { quietButton } from "./styles";

const currentLink =
  "rounded-full border border-yellow px-3 py-1.5 text-[11px] text-yellow";

export default function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onLogin = pathname === "/admin/login";
  const onArchive = pathname.startsWith("/admin/archive");

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDir = root.dir;
    root.lang = "he";
    root.dir = "rtl";
    return () => {
      root.lang = previousLang;
      root.dir = previousDir;
    };
  }, []);

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen bg-ink px-6 py-8 text-cream sm:px-10 [font-family:var(--font-rubik),var(--font-body),sans-serif]"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={onLogin ? "/" : "/admin"} className="font-display text-2xl leading-none">
            ניהול
          </Link>
          {onLogin ? null : (
            <nav className="flex items-center gap-2">
              <Link href="/admin" className={onArchive ? quietButton : currentLink} aria-current={onArchive ? undefined : "page"}>
                עריכה
              </Link>
              <Link
                href="/admin/archive"
                className={onArchive ? currentLink : quietButton}
                aria-current={onArchive ? "page" : undefined}
              >
                ארכיון
              </Link>
            </nav>
          )}
        </div>
        {onLogin ? null : (
          <nav className="flex flex-wrap items-center gap-2">
            <Link href="/" className={quietButton}>
              לאתר
            </Link>
            <form action={logout}>
              <button type="submit" className={quietButton}>
                יציאה
              </button>
            </form>
          </nav>
        )}
      </div>
      <div className="mx-auto mt-10 w-full max-w-3xl">{children}</div>
    </div>
  );
}
