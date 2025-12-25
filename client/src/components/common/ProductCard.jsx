import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductCard = ({ product }) => {
  return (
    <div className="bg-content-bg rounded-lg shadow-sm border border-border-main overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        {/* Placeholder Gambar */}
        <div className="w-full h-48 bg-zinc-200 flex items-center justify-center text-text-subtle">
          [Gambar Produk]
        </div>
        
        <div className="p-4">
          <h3 className="text-base font-semibold text-text-main truncate" title={product.name}>
            {product.name}
          </h3>
          <p className="text-lg font-medium text-theme-primary-dark mt-2">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
      
      <div className="p-4 border-t border-border-main">
        <button className="w-full bg-theme-primary-light text-theme-primary-dark font-medium py-2 px-4 rounded-md text-sm
                       hover:bg-zinc-200 transition-colors">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;