import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "כניסה — כרמל ברטוב",
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return <LoginForm />;
}
