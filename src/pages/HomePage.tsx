import FAQ from "@/components/homepage/faq";
import Features from "@/components/homepage/features";
import Footer from "@/components/homepage/footer";
import Hero from "@/components/homepage/hero";
import Pricing from "@/components/homepage/pricing";
import Testimonial from "@/components/homepage/testimonial";
import Navbar from "@/components/navbar/navbar";
import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";

export default function Home() {
  return (
    <>
      <SEO {...seoConfigs.home} />
      <Navbar />
      <Hero />
      <Features />
      <div className="h-8 xs:h-12" />
      <FAQ />
      <Testimonial />
      <Pricing />
      <Footer />
    </>
  );
}
