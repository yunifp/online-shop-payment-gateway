import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductFilter from '../components/common/ProductFilter';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/common/ProductCard';
import VoucherCard from '../components/common/VoucherCard';
import useDebounce from '../hooks/useDebounce';
import { useProduk } from '../hooks/useProduct';
import { useVoucher } from '../hooks/useVoucher';
import { Tag, ArrowRight } from 'lucide-react';

const Products = () => {
  const { products: allProducts, loading, error } = useProduk();
  const { vouchers, loading: voucherLoading } = useVoucher();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Logic Voucher: Ambil yang aktif, Urutkan (Diskon Terbesar -> Terbaru), Ambil 3 Teratas
  const featuredVouchers = useMemo(() => {
    if (!vouchers) return [];
    
    const now = new Date();
    return vouchers
      .filter(v => v.is_active && new Date(v.end_date) > now) // Filter aktif
      .sort((a, b) => {
        // Prioritas 1: Tipe Percentage (Nilai lebih besar di atas)
        if (a.type === 'percentage' && b.type !== 'percentage') return -1;
        if (a.type !== 'percentage' && b.type === 'percentage') return 1;
        // Prioritas 2: Nilai Value (Descending)
        if (b.value !== a.value) return b.value - a.value;
        // Prioritas 3: ID (Terbaru)
        return b.id - a.id;
      })
      .slice(0, 3); // Batasi 3
  }, [vouchers]);

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    let filtered = [...allProducts];

    if (debouncedSearchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?.name) || 
        selectedCategories.includes(product.category)
      );
    }

    setFilteredProducts(filtered);
  }, [debouncedSearchTerm, selectedCategories, allProducts]);

  const handleCategoryChange = (category, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked
        ? [...prev, category]
        : prev.filter((c) => c !== category)
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  if (error) {
    return <div className="text-center py-20 text-red-500">Terjadi kesalahan: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* --- BAGIAN VOUCHER FEATURED --- */}
      {featuredVouchers.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Tag className="text-theme-primary" />
              <h2 className="text-2xl font-bold text-text-main">Voucher Spesial</h2>
            </div>
            <Link 
              to="/vouchers" 
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-all transform active:scale-95 shadow-md hover:shadow-lg"
            >
              Lihat Semua Voucher <ArrowRight size={18} />
            </Link>
          </div>  
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredVouchers.map(voucher => (
              <div key={voucher.id} className="relative group">
                <Link to={`/voucher/${voucher.id}`} className="block">
                   <VoucherCard voucher={voucher} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilter
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          onResetFilters={handleResetFilters}
        />

        <main className="flex-1">
          <div className="mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {loading ? (
            <div className="text-center py-16">Memuat produk...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-text-main">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-text-muted mt-2">
                Coba ubah filter atau kata kunci pencarian Anda.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;