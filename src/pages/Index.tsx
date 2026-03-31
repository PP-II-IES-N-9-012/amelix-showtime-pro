import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarteleraSection from "@/components/CarteleraSection";
import ProximamenteSection from "@/components/ProximamenteSection";
import NosotrosSection from "@/components/NosotrosSection";
import PreciosSection from "@/components/PreciosSection";
import MapaSection from "@/components/MapaSection";
import ContactoFaqSection from "@/components/ContactoFaqSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CarteleraSection />
      <ProximamenteSection />
      <NosotrosSection />
      <PreciosSection />
      <MapaSection />
      <ContactoFaqSection />
      <FooterSection />
    </div>
  );
};

export default Index;
