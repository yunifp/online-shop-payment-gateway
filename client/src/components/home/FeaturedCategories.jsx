import React from 'react';
import { Link } from 'react-router-dom';
// PERBAIKAN: Menggunakan ikon dari lucide-react
import { Tent, Backpack, Footprints } from 'lucide-react';

const categories = [
  // PERBAIKAN: Mengganti komponen ikon
  { name: 'Tenda', icon: <Tent size={32} />, path: '/product/tenda' },
  { name: 'Tas & Carrier', icon: <Backpack size={32} />, path: '/product/tas' },
  { name: 'Sepatu', icon: <Footprints size={32} />, path: '/product/sepatu' },
];

const FeaturedCategories = () => {
  return (
    <section className="bg-content-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text-main mb-12">
          Jelajahi Kategori
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              to={category.path} 
              className="group"
            >
              <div className="bg-zinc-100 p-8 rounded-lg flex flex-col items-center justify-center aspect-square border border-border-main
                          transition-all duration-300 group-hover:shadow-lg group-hover:bg-white group-hover:-translate-y-1">
                <div className="text-theme-primary-dark mb-4">
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-main">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;