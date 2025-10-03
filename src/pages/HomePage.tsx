import { HeroSection } from "../components/HeroSection";
import { MobileHeroSection } from "../components/MobileHeroSection";
import { PropertiesSection } from "../components/PropertiesSection";

export function HomePage() {
  return (
    <>
      {/* Desktop Hero */}
      <div className="hidden md:block">
        <HeroSection />
      </div>
      
      {/* Mobile Hero */}
      <div className="md:hidden">
        <MobileHeroSection />
      </div>
      
      <PropertiesSection />
    </>
  );
}
