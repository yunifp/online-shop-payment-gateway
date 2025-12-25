import React, { useState, useEffect } from 'react';
import ProductFilter from '../components/common/ProductFilter';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/common/ProductCard'; // Menggunakan ulang ProductCard
import useDebounce from '../hooks/useDebounce'; // Menggunakan hook debounce

// Data dummy (nantinya bisa diganti dari API)
const allProducts = [
  { id: 1, name: 'Tenda Dome Pro 4P', category: 'Tenda', price: 1200000 },
  { id: 2, name: 'Carrier Ultralight 60L', category: 'Tas', price: 850000 },
  { id: 3, name: 'Sepatu Hiking Waterproof', category: 'Sepatu', price: 1500000 },
  { id: 4, name: 'Kompor Lipat Portable', category: 'Alat Masak', price: 150000 },
  { id: 5, name: 'Sleeping Bag Comfort -5°C', category: 'Alat Tidur', price: 350000 },
  { id: 6, name: 'Tenda Flysheet 3x4', category: 'Tenda', price: 250000 },
  { id: 7, name: 'Daypack 30L', category: 'Tas', price: 450000 },
];

const Products = () => {
  const [products, setProducts] = useState(allProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 1. Gunakan hook debounce. Nilai ini hanya akan update 500ms
  //    setelah pengguna selesai mengetik.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 2. Terapkan filter
  useEffect(() => {
    // Saat menggunakan API, Anda akan memanggil API di sini:
    // fetchAPI(debouncedSearchTerm, selectedCategories);
    //
    // Untuk data dummy, kita filter di client-side:
    
    let filtered = allProducts;

    // Filter berdasarkan pencarian (debounced)
    if (debouncedSearchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filter berdasarkan kategori
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    setProducts(filtered);

  }, [debouncedSearchTerm, selectedCategories]); // Efek ini berjalan saat filter atau debounced search berubah

  // Handler untuk mengubah filter kategori
  const handleCategoryChange = (category, isChecked) => {
    setSelectedCategories((prev) =>
      isChecked
        ? [...prev, category] // Tambah kategori ke array
        : prev.filter((c) => c !== category) // Hapus kategori dari array
    );
  };

  // Handler untuk mereset semua filter
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* 1. Sidebar Filter (Kiri) */}
        <ProductFilter
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          onResetFilters={handleResetFilters}
        />

        {/* 2. Konten Utama (Kanan) */}
        <main className="flex-1">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm} // Update searchTerm secara instan
            />
          </div>

          {/* Grid Produk */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
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