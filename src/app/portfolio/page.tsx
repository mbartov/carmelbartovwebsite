import type { Metadata } from "next";
import PortfolioPageContent from "@/components/PortfolioPageContent";

export const metadata: Metadata = {
  title: "Portfolio — Carmel Bartov",
  description: "Video editing portfolio by Carmel Bartov — reels, cuts, and stories.",
};

export default function PortfolioPage() {
  return <PortfolioPageContent />;
}
