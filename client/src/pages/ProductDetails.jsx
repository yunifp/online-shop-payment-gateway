import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Image as ImageIcon, X, CheckCircle, ArrowRight } from 'lucide-react';
import { useProduk } from '../hooks/useProduct';
import { toast } from 'react-hot-toast';
import useCart from '../hooks/useCart';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProduk();
  const { addItem, loading: cartLoading } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // State untuk kontrol Modal Notifikasi
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.replace('/api/v1', '') : '';

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
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
            setMainImage(found.variants[0].images[0].image_url);
          }
        }
      }
    }
  }, [id, products]);

  // Efek untuk auto-close modal setelah 4 detik
  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (!selectedVariant) {
      toast.error("Silakan pilih varian terlebih dahulu");
      return;
    }

    try {
      const res = await addItem(selectedVariant.id, quantity);
      
      // Cek respon sukses standar atau dari context yang diperbarui
      if (res?.success || res?.message || res?.meta?.code === 200 || res?.meta?.code === 201) {
        // Tampilkan Modal Custom alih-alih toast biasa
        setShowSuccessModal(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambah ke keranjang");
    }
  };

  if (loading) return <div className="py-20 text-center">Memuat produk...</div>;
  if (!product) return <div className="py-20 text-center">Produk tidak ditemukan</div>;

  return (
    <div className="bg-content-bg py-12 relative h-min">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bagian Gambar */}
          <div className="space-y-4">
            <div className="bg-zinc-100 border border-border-main rounded-xl overflow-hidden aspect-square flex items-center justify-center relative group">
              {mainImage ? (
                <img 
                  src={getFullImageUrl(mainImage)}
                  alt={product.name} 
                  className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400?text=Gambar+Rusak';
                  }}
                />
              ) : (
                <ImageIcon size={64} className="text-zinc-300" />
              )}
            </div>
          </div>

          {/* Bagian Detail Produk */}
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
                onClick={handleAddToCart}
                className="flex-1 bg-theme-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg 
                         hover:bg-theme-primary-dark transition-all flex items-center justify-center gap-2 
                         disabled:bg-zinc-300 disabled:cursor-not-allowed"
                disabled={!selectedVariant || selectedVariant.stock === 0 || cartLoading}
              >
                <ShoppingCart size={20} />
                {cartLoading ? 'Memproses...' : (selectedVariant?.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL NOTIFIKASI BERHASIL (Bottom Sheet Style) --- */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-6 pointer-events-none`}
      >
        <div 
          className={`
            bg-white w-full max-w-lg shadow-2xl rounded-2xl border border-gray-100 p-5
            transform transition-all duration-500 ease-out pointer-events-auto
            ${showSuccessModal ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="fill-green-100" size={24} />
              <h3 className="font-bold text-lg">Berhasil Menambahkan ke Keranjang</h3>
            </div>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
              {mainImage && (
                <img 
                  src={getFullImageUrl(mainImage)} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-800 line-clamp-1">{product.name}</p>
              <p className="text-sm text-gray-500">
                Varian: {selectedVariant?.color} / {selectedVariant?.size}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Qty: <span className="font-semibold text-gray-800">{quantity}</span>
              </p>
            </div>
          </div>

          <div className="w-full ">
            <Link 
              to="/cart"
              className="py-2.5 px-4 rounded-lg font-bold bg-theme-primary text-white hover:bg-theme-primary-dark transition-colors text-center flex items-center justify-center gap-2"
            >
              Lihat Keranjang <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetails;