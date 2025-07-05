import FAQ from "@/components/homepage/faq";
import Features from "@/components/homepage/features";
import Footer from "@/components/homepage/footer";
import Hero from "@/components/homepage/hero";
import Pricing from "@/components/homepage/pricing";
import Testimonial from "@/components/homepage/testimonial";
import Navbarr from "@/components/navbar/navbar";


export default function Home() {
  return (
    <>
      <Navbarr />
      <Hero />
      <Features />
      <FAQ />
      <Testimonial />
      <Pricing />
      <Footer />
    </>
  );
}
