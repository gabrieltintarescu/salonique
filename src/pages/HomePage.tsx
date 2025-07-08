import Footer from "@/components/homepage/footer";
import Hero from "@/components/homepage/hero";
import Navbar from "@/components/navbar/navbar";
import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";
import { lazy, Suspense } from "react";

// Lazy load components to improve initial load performance
const LazyAppPreview = lazy(() => import("@/components/homepage/app-preview"));
const LazyStats = lazy(() => import("@/components/homepage/stats"));
const LazyFeatures = lazy(() => import("@/components/homepage/features"));
const LazyFAQ = lazy(() => import("@/components/homepage/faq"));
const LazyTestimonial = lazy(() => import("@/components/homepage/testimonial"));
const LazyPricing = lazy(() => import("@/components/homepage/pricing"));

export default function Home() {
  return (
    <>
      <SEO {...seoConfigs.home} />
      <Navbar />
      <div className="min-h-screen">
        {/* Hero always loads immediately */}
        <Hero />

        {/* Other components lazy loaded */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>}>
          <LazyAppPreview />
        </Suspense>

        <Suspense fallback={<div className="h-96"></div>}>
          <LazyStats />
        </Suspense>

        <Suspense fallback={<div className="h-96"></div>}>
          <LazyFeatures />
        </Suspense>

        <div className="h-8 xs:h-12" />

        <Suspense fallback={<div className="h-96"></div>}>
          <LazyFAQ />
        </Suspense>

        <div className="lg:hidden">
          <Suspense fallback={<div className="h-96"></div>}>
            <LazyTestimonial />
          </Suspense>
        </div>

        <Suspense fallback={<div className="h-96"></div>}>
          <LazyPricing />
        </Suspense>

        <Footer />
      </div>
    </>
  );
}
