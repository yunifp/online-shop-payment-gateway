import React from 'react';
import ProductCard from '../common/ProductCard'; // Komponen card produk

// Data dummy (bisa diganti dengan data dari API)
const products = [
  { id: 1, name: 'Tenda Dome Pro 4P', price: 1200000, imageUrl: '/placeholder-tenda.jpg' },
  { id: 2, name: 'Carrier Ultralight 60L', price: 850000, imageUrl: '/placeholder-carrier.jpg' },
  { id: 3, name: 'Sepatu Hiking Waterproof', price: 1500000, imageUrl: '/placeholder-sepatu.jpg' },
  { id: 4, name: 'Kompor Lipat Portable', price: 150000, imageUrl: '/placeholder-kompor.jpg' },
];

const FeaturedProducts = () => {
  return (
    <section className="bg-app-bg py-16 md:py-20 border-t border-border-main">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-text-main mb-12">
          Featured
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;