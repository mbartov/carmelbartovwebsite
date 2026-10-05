import type { Metadata } from "next";
import PortfolioPageContent from "@/components/PortfolioPageContent";
import { getPublicPortfolio } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Portfolio — Carmel Bartov",
  description: "Video editing portfolio by Carmel Bartov — reels, cuts, and stories.",
};

export default async function PortfolioPage() {
  const items = await getPublicPortfolio();
  return <PortfolioPageContent items={items} />;
}
