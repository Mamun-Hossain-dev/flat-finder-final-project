import HeroSection from "@/components/home/HeroSection";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";
import WhatsAppFloat from "@/components/common/WhatsAppFloat";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBadges />
      <FeaturedListings />
      <div className="text-center mt-12">
        <Link href="/listings">
          <Button size="lg" variant="outline">
            Browse All Properties
          </Button>
        </Link>
      </div>
      <HowItWorks />
      <Testimonials />
      <WhatsAppFloat />
    </div>
  );
}
