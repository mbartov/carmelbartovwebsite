import { getPublicPortfolio, getPublicTestimonials } from "@/lib/cms";
import Ticker from "@/components/Ticker";
import Hero from "@/components/Hero";
import NameBanner from "@/components/NameBanner";
import About from "@/components/About";
import Ribbon from "@/components/Ribbon";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import Path from "@/components/Path";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

export default async function Home() {
  const [portfolio, testimonials] = await Promise.all([
    getPublicPortfolio(),
    getPublicTestimonials(),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <Ticker />
      <main className="flex-1">
        <Hero />
        <NameBanner />
        <About />
        <Ribbon />
        <Portfolio items={portfolio} />
        <Process />
        <Path />
        <Services />
        <Testimonials items={testimonials} />
        <Contact />
      </main>
    </div>
  );
}
