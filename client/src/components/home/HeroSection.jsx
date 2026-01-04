import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import gambar dari folder assets
import HeroCarousel1 from "../../assets/hero-carousel-1.png";
import HeroCarousel2 from "../../assets/hero-carousel-2.png";
import HeroCarousel3 from "../../assets/hero-carousel-3.png";

const slides = [
  {
    id: 1,
    title: "Level Up Your Indoor Climbing",
    description: "Discover premium gear and expert-led classes designed for every climber.",
    ctaText: "Explore Products",
    ctaLink: "/product",
    backgroundImage: HeroCarousel1,
  },
{
    id: 2,
    title: "Your First Climbing Kit",
    description: "Everything you need to start: premium chalk bags, brushes, and beginner-friendly harnesses.",
    ctaText: "Explore Gear",
    ctaLink: "/product",
    backgroundImage: HeroCarousel2,
  },
  {
    id: 3,
    title: "New Arrival: Climbing Equipments",
    description: "Experience maximum precision and grip for you.",
    ctaText: "Explore Now",
    ctaLink: "/product",
    backgroundImage: HeroCarousel3,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] overflow-hidden">
      <div
        className="flex h-full transition-transform ease-out duration-700"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full flex-shrink-0 h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          >
            {/* Overlay gelap */}
            <div className="absolute inset-0 bg-black/20 bg-opacity-40"></div>

            {/* Konten Teks */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
              <div className="text-white max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 drop-shadow-md">
                  {slide.description}
                </p>
                <Link
                  to={slide.ctaLink}
                  className="inline-block bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-xl hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {slide.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigasi Kiri */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 z-20 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 transition-all shadow-md backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Navigasi Kanan */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 z-20 p-3 bg-white/30 rounded-full text-white hover:bg-white/50 transition-all shadow-md backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indikator Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-125" : "bg-gray-400 hover:bg-white/70"
            } border border-gray-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;