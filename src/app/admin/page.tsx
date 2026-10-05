import { redirect } from "next/navigation";
import { PortfolioManager, TestimonialManager } from "@/components/admin/Managers";
import {
  getAdminPortfolio,
  getAdminTestimonials,
} from "@/lib/cms";
import type { PortfolioItem, Testimonial } from "@/lib/content";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await getSession())) redirect("/admin/login");

  let portfolio: PortfolioItem[] | null = null;
  let testimonials: Testimonial[] | null = null;
  try {
    [portfolio, testimonials] = await Promise.all([
      getAdminPortfolio(),
      getAdminTestimonials(),
    ]);
  } catch (error) {
    console.error(error);
  }

  if (!portfolio || !testimonials) {
    return (
      <p className="max-w-lg text-sm leading-relaxed text-cream/80">
        לא הצלחתי לטעון את הניהול. בדקי ש-<code>DATABASE_URL</code> מוגדר והריצי{" "}
        <code>npm run db:setup</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-16 pb-16">
      <PortfolioManager items={portfolio} />
      <TestimonialManager items={testimonials} />
    </div>
  );
}
