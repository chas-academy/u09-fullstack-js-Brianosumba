import NavBar from "../../components/NavBar";
import HeroBannerCarousel from "../../components/HeroBannerCarousel";
import HeroSection from "../../components/HeroSection";

const HomePage = () => {
  return (
    <div className="flex flex-col flex-grow">
      <NavBar />
      <HeroBannerCarousel />
      <HeroSection />
    </div>
  );
};

export default HomePage;
