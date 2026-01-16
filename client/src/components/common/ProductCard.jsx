import React from 'react';
import { Link } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductCard = ({ product }) => {
  // Logika BASE_URL seperti di ProdukList
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.replace('/api/v1', '') : '';

  // Helper untuk mendapatkan URL thumbnail
  const getProductThumbnail = (variants) => {
    if (!variants || variants.length === 0) return null;
    for (const variant of variants) {
      if (variant.images && variant.images.length > 0) {
        return variant.images[0].image_url;
      }
    }
    return null;
  };

  const thumbUrl = getProductThumbnail(product.variants);
  const price = product.variants && product.variants.length > 0 ? product.variants[0].price : 0;

  return (
    <div className="bg-content-bg rounded-lg shadow-sm border border-border-main overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      <Link to={`/product/${product.id}`} className="block flex-grow">
        {/* Kontainer Gambar */}
        <div className="w-full h-60 bg-zinc-100 flex items-center justify-center overflow-hidden border-b border-border-main">
          {thumbUrl ? (
            <img 
              src={`${BASE_URL}${thumbUrl}`} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FaImage size={32} />
              <span className="text-xs mt-2 italic">No Image</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <span className="text-[10px] uppercase tracking-wider text-theme-primary font-bold">
            {product.category?.name || 'Outdoor'}
          </span>
          <h3 className="text-base font-semibold text-text-main truncate mt-1" title={product.name}>
            {product.name}
          </h3>
          <p className="text-lg font-bold text-theme-primary-dark mt-2">
            {formatCurrency(price)}
          </p>
        </div>
      </Link>
      
      {/* UPDATE DI SINI: Menambahkan block dan text-center */}
      <div className="p-4 border-t border-border-main bg-zinc-50/50">
        <Link 
          to={`/product/${product.id}`} 
          className="block w-full text-center bg-theme-primary text-white font-medium py-2 px-4 rounded-md text-sm hover:bg-theme-primary-dark transition-all active:scale-95 shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;