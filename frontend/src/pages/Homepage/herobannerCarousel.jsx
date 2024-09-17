import React from "react";
import { Carousel } from "react-responsive-carousel"; // Make sure this is installed
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import slide1 from "../../images/slide1.jpg";
import slide3 from "../../images/slide3.jpg";
import slide5 from "../../images/slide5.jpg"; // Ensure these paths are correct

const HeroBannerCarousel = () => {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      className="relative w-full h-full"
    >
      <div className="relative">
        <img src={slide1} alt="Slide 1" className="w-full h-80 object-cover" />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Track your fitness with ease
        </p>
      </div>
      <div className="relative">
        <img src={slide3} alt="Slide 2" className="w-full h-80 object-cover" />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Achieve your fitness goals faster
        </p>
      </div>
      <div className="relative">
        <img src={slide5} alt="Slide 3" className="w-full h-80 object-cover" />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Analyze your performance
        </p>
      </div>
    </Carousel>
  );
};

export default HeroBannerCarousel;
