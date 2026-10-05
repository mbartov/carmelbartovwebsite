"use client";

import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {isAdmin ? null : <LanguageToggle />}
      {children}
    </>
  );
}
