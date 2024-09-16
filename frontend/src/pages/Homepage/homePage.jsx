import React from "react";
import NavBar from "../../components/NavBar"; // Adjusted import path
import HeroSection from "./HeroSection";
import HeroBannerCarousel from "./HeroBannerCarousel";
import Footer from "../../components/Footer"; // Ensure Footer import path is also correct

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <HeroBannerCarousel />
      <Footer />
    </div>
  );
};

export default HomePage;
