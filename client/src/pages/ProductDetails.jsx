import React, { useState } from 'react';
import { Minus, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fungsi helper (bisa juga diimpor dari file util)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Data dummy untuk satu produk
const product = {
  id: 1,
  name: 'Tenda Dome Pro 4P',
  price: 1200000,
  description: 'Tenda dome profesional dengan kapasitas 4 orang, dirancang untuk cuaca ekstrem. Dilengkapi frame aluminium yang ringan namun kokoh dan bahan flysheet waterproof 5000mm.',
  rating: 4.5,
  reviews: 32,
};

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  return (
    <div className="bg-content-bg py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Kolom Gambar Produk */}
          <div className="bg-zinc-100 border border-border-main rounded-lg flex items-center justify-center aspect-square">
            <span className="text-text-muted">[Placeholder Gambar Produk]</span>
          </div>

          {/* Kolom Info Produk */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-text-main">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-yellow-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" className="opacity-50" />
              </div>
              <span className="text-sm text-text-muted">({product.reviews} ulasan)</span>
            </div>

            <p className="text-3xl font-medium text-theme-primary-dark mt-4">
              {formatCurrency(product.price)}
            </p>

            <p className="text-base text-text-muted mt-6 leading-relaxed">
              {product.description}
            </p>
            
            <hr className="border-border-main my-8" />

            {/* Aksi */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border-main rounded-lg w-min">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="p-3 text-text-muted hover:text-text-main"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="p-3 text-text-muted hover:text-text-main"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button className="flex-1 bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all">
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;