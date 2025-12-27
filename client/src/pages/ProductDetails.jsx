import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Star, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { useProduk } from '../hooks/useProduct';
import { toast } from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading } = useProduk();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Perbaikan logika BASE_URL: Pastikan tidak ada double slash atau missing slash
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.replace('/api/v1', '') : '';

  // Helper function untuk membangun URL gambar yang benar
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Jika sudah URL lengkap
    
    // Pastikan ada satu '/' di antara BASE_URL dan path
    const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => String(p.id) === id);
      if (found) {
        setProduct(found);
        if (found.variants && found.variants.length > 0) {
          setSelectedVariant(found.variants[0]);
          if (found.variants[0].images && found.variants[0].images.length > 0) {
            // Set path gambar (string)
            setMainImage(found.variants[0].images[0].image_url);
          }
        }
      }
    }
  }, [id, products]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  if (loading) return <div className="py-20 text-center">Memuat produk...</div>;
  if (!product) return <div className="py-20 text-center">Produk tidak ditemukan</div>;

  return (
    <div className="bg-content-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Kolom Gambar & Galeri */}
          <div className="space-y-4">
            <div className="bg-zinc-100 border border-border-main rounded-xl overflow-hidden aspect-square flex items-center justify-center">
              {mainImage ? (
                <img 
                  src={getFullImageUrl(mainImage)}
                  alt={product.name} 
                  className="w-full h-full object-fill"
                  onError={(e) => {
                    console.error("Gagal memuat gambar:", getFullImageUrl(mainImage));
                    e.target.src = 'https://via.placeholder.com/400?text=Gambar+Rusak';
                  }}
                />
              ) : (
                <ImageIcon size={64} className="text-zinc-300" />
              )}
            </div>
          </div>

          {/* Kolom Info Produk */}
          <div className="flex flex-col">
            <span className="text-theme-primary font-bold uppercase tracking-widest text-sm">
              {product.category?.name || 'Outdoor Gear'}
            </span>
            <h1 className="text-4xl font-bold text-text-main mt-2">
              {product.name}
            </h1>
            
            <p className="text-3xl font-bold text-theme-primary-dark mt-6">
              {formatCurrency(selectedVariant?.price || 0)}
            </p>

            <div className="mt-8">
              <h4 className="font-semibold text-text-main mb-3">Pilih Varian:</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.images?.length > 0) {
                        setMainImage(v.images[0].image_url);
                      }
                    }}
                    className={`px-4 py-2 rounded-md border-2 text-sm transition-all 
                      ${selectedVariant?.id === v.id 
                        ? 'border-theme-primary bg-theme-primary-light text-theme-primary-dark font-bold' 
                        : 'border-border-main hover:border-zinc-400'}`}
                  >
                    {v.color} / {v.size}
                  </button>
                ))}
              </div>
              <p className="text-sm text-text-muted mt-2 font-medium">
                Stok: {selectedVariant?.stock || 0}
              </p>
            </div>

            <p className="text-base text-text-muted mt-8 leading-relaxed">
              {product.description}
            </p>
            
            <hr className="border-border-main my-8" />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Input Quantity */}
              <div className="flex items-center border border-border-main rounded-lg w-min bg-white">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="p-4 hover:text-theme-primary transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="px-4 font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="p-4 hover:text-theme-primary transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                className="flex-1 bg-theme-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg 
                         hover:bg-theme-primary-dark transition-all flex items-center justify-center gap-2 
                         disabled:bg-zinc-300 disabled:cursor-not-allowed"
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                <ShoppingCart size={20} />
                {selectedVariant?.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;