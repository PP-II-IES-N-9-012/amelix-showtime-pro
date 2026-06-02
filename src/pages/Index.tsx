import Navbar from "@/components/Navbar";
import PromocionesCarouselSection from "@/components/PromocionesCarouselSection";
import HeroSection from "@/components/HeroSection";
import CarteleraSection from "@/components/CarteleraSection";
import ProximamenteSection from "@/components/ProximamenteSection";
import NosotrosSection from "@/components/NosotrosSection";
import PreciosSection from "@/components/PreciosSection";
import MapaSection from "@/components/MapaSection";
import ContactoFaqSection from "@/components/ContactoFaqSection";
import FooterSection from "@/components/FooterSection";
import SiteStatusBanner from "@/components/SiteStatusBanner";
import PurchaseModal from "@/components/PurchaseModal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SiteStatusBanner />
      <Navbar />
      <PromocionesCarouselSection />
      <HeroSection />
      <CarteleraSection />
      <ProximamenteSection />
      <NosotrosSection />
      <PreciosSection />
      <MapaSection />
      <ContactoFaqSection />
      <FooterSection />
      <PurchaseModal />
    </div>
  );
};

export default Index;
