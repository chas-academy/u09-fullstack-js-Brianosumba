import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import HeroSection from "../../components/HeroSection";

const HomePage = () => {
  return (
    <div className="flex flex-col flex-grow">
      <HeroBannerCarousel />
      <HeroSection />
    </div>
  );
};

export default HomePage;
