import type { Metadata } from "next";
import AdminFrame from "@/components/admin/AdminFrame";

export const metadata: Metadata = {
  title: "ניהול — כרמל ברטוב",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminFrame>{children}</AdminFrame>;
}
