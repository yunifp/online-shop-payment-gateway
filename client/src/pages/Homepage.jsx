import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Newsletter from '../components/home/Newsletter';

const Homepage = () => {
  return (
    <div className="flex flex-col">
      {/* 1. Bagian Hero/Banner Utama */}
      <HeroSection />

      {/* 2. Bagian Kategori Unggulan */}
      <FeaturedCategories />

      {/* 3. Bagian Produk Unggulan */}
      <FeaturedProducts />

      {/* 4. Bagian Newsletter/CTA */}
      <Newsletter />
    </div>
  );
};

export default Homepage;