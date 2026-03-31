import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CarteleraSection from "@/components/CarteleraSection";
import ProximamenteSection from "@/components/ProximamenteSection";
import PreciosSection from "@/components/PreciosSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CarteleraSection />
      <ProximamenteSection />
      <PreciosSection />
      <FooterSection />
    </div>
  );
};

export default Index;
