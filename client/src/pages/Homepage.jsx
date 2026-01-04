import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";

const Homepage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Bagian Hero/Banner Utama */}
      <HeroSection />

      {/* 2. Bagian Kategori Unggulan */}
      <FeaturedCategories />

      {/* 3. Bagian Produk Unggulan */}
      <FeaturedProducts />
    </div>
  );
};

export default Homepage;
