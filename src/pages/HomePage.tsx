import { staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import FAQ from "@/components/homepage/faq";
import Features from "@/components/homepage/features";
import Footer from "@/components/homepage/footer";
import Hero from "@/components/homepage/hero";
import Pricing from "@/components/homepage/pricing";
import Testimonial from "@/components/homepage/testimonial";
import Navbar from "@/components/navbar/navbar";
import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <SEO {...seoConfigs.home} />
      <Navbar />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="min-h-screen"
      >
        <motion.div variants={staggerItem}>
          <Hero />
        </motion.div>

        <motion.div variants={staggerItem}>
          <Features />
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="h-8 xs:h-12"
        />

        <motion.div variants={staggerItem}>
          <FAQ />
        </motion.div>

        <motion.div variants={staggerItem}>
          <Testimonial />
        </motion.div>

        <motion.div variants={staggerItem}>
          <Pricing />
        </motion.div>

        <motion.div variants={staggerItem}>
          <Footer />
        </motion.div>
      </motion.div>
    </>
  );
}
