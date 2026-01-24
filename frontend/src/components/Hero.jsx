import { useEffect, useState } from "react";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const Hero = () => {
  const slides = [hero1, hero2, hero3];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] mt-5 rounded-xl overflow-hidden relative">
      
      {/* Image */}
      <img
        src={slides[slide]}
        alt="hero"
        className="w-full h-full object-cover"
      />

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Indicator Lines */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-0.75 transition-all duration-300 ${
              slide === index
                ? "w-10 bg-white"
                : "w-5 bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
