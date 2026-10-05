import { redirect } from "next/navigation";
import { PortfolioArchive, TestimonialArchive } from "@/components/admin/ArchiveLists";
import { getArchivedPortfolio, getArchivedTestimonials } from "@/lib/cms";
import type { PortfolioItem, Testimonial } from "@/lib/content";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ArchivePage() {
  if (!(await getSession())) redirect("/admin/login");

  let portfolio: PortfolioItem[] | null = null;
  let testimonials: Testimonial[] | null = null;
  try {
    [portfolio, testimonials] = await Promise.all([
      getArchivedPortfolio(),
      getArchivedTestimonials(),
    ]);
  } catch (error) {
    console.error(error);
  }

  if (!portfolio || !testimonials) {
    return <p className="text-sm text-cream/80">לא הצלחתי לטעון את הארכיון.</p>;
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      <div>
        <p className="mb-2 text-sm text-cream/60">[ ארכיון ]</p>
        <h1 className="font-display text-5xl leading-none">פריטים שנמחקו</h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-cream/70">
          שחזור מחזיר את הפריט לסוף הרשימה. מחיקה לצמיתות מוחקת אותו לגמרי.
        </p>
      </div>
      <PortfolioArchive items={portfolio} />
      <TestimonialArchive items={testimonials} />
    </div>
  );
}
