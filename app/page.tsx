import HeroSection from "@/components/home/HeroSection";
// import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/common/WhatsAppFloat";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <TrustBadges />
      {/* <FeaturedListings /> */}
      <HowItWorks />
      <Testimonials />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
