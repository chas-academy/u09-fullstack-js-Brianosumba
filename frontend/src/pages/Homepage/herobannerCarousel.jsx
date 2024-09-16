import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import default carousel styles

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
        <img
          src="path_to_image1.jpg"
          alt="Slide 1"
          className="w-full h-80 object-cover"
        />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Track your fitness with ease
        </p>
      </div>
      <div className="relative">
        <img
          src="path_to_image2.jpg"
          alt="Slide 2"
          className="w-full h-80 object-cover"
        />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Achieve your fitness goals faster
        </p>
      </div>
      <div className="relative">
        <img
          src="path_to_image3.jpg"
          alt="Slide 3"
          className="w-full h-80 object-cover"
        />
        <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded">
          Analyze your performance
        </p>
      </div>
    </Carousel>
  );
};

export default HeroBannerCarousel;
