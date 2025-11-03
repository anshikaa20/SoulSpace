import React, { useState, useEffect } from "react";

const About = () => {
  const images = ["/image1.jpg", "/image2.jpg", "/image3.jpg", "/image4.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section
      id="about"
      className="flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-20 py-16 
                 min-h-screen text-black 
                 [background:radial-gradient(125%_125%_at_50%_10%,#FBD3E9_50%,#BBDEFB_100%)]
                 space-y-12 md:space-y-0 transition-all duration-700"
    >
      {/* Left Text Section */}
      <div className="max-w-md text-center md:text-left flex flex-col justify-center mt-6 md:mt-0">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center md:justify-start gap-2 whitespace-nowrap">
          🌙 About Soul Space 🌙
        </h2>

        {/* Mobile Text */}
        <p className="text-base md:text-lg leading-relaxed text-gray-700 md:hidden">
          Soul Space is your safe haven to heal and grow. Sit back, take a deep
          breath, and relax. ✨
        </p>

        {/* Desktop Text */}
        <p className="hidden md:block text-lg leading-relaxed text-gray-700">
          Soul Space is where simplicity meets depth. It’s designed to help you
          slow down, reflect, and reconnect with your inner self. Here,
          stillness isn’t emptiness — it’s clarity. It’s your space to breathe,
          to remember, and to find calm again. ✨
        </p>
      </div>

      {/* Right Image + Arch Shape */}
      <div className="relative flex justify-center items-center">
        <div className="bg-[#BFD3FF]/70 w-[65vw] max-w-[320px] md:w-[80vw] md:max-w-[360px] aspect-[3/4] rounded-t-[40vw] flex items-center justify-center shadow-lg overflow-hidden backdrop-blur-md border border-white/60">
          <img
            src={images[currentIndex]}
            alt="Carousel"
            className="w-[70%] h-[50%] md:w-[75%] md:h-[50%] object-contain rounded-t-full z-10"
          />
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 flex space-x-2">
          {images.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-[#9CB5F8] scale-110"
                  : "bg-gray-300 opacity-70"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
