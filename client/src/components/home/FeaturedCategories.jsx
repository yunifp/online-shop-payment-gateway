import React from 'react';
import { Link } from 'react-router-dom';
import { Tent, Backpack, Footprints, Layers } from 'lucide-react'; 
import { useKategori } from '../../hooks/useKategori';

const getCategoryIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('tenda')) return <Tent size={32} />;
  if (n.includes('tas') || n.includes('carrier')) return <Backpack size={32} />;
  if (n.includes('sepatu')) return <Footprints size={32} />;
  return <Layers size={32} />; 
};

const FeaturedCategories = () => {
  const { categories, loading, error } = useKategori();

  if (loading) return <div className="py-10 text-center">Memuat kategori...</div>;
  if (error) return null; 

  return (
    <section className="bg-content-bg py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text-main mb-12">
          Jelajahi Kategori
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category) => (
            <Link 
              key={category.id} 
              to={`/product?category=${encodeURIComponent(category.name)}`} 
              className="group"
            >
              <div className="bg-zinc-100 p-8 rounded-lg flex flex-col items-center justify-center aspect-square border border-border-main
                          transition-all duration-300 group-hover:shadow-lg group-hover:bg-white group-hover:-translate-y-1">
                <div className="text-theme-primary-dark mb-4">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="text-lg font-semibold text-text-main text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link 
            to="/product" 
            className="bg-theme-primary text-white font-medium py-3 px-10 rounded-lg shadow-lg 
                       hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Lihat Semua
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;