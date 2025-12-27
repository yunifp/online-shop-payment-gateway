import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductFilter from '../components/common/ProductFilter';
import SearchBar from '../components/common/SearchBar';
import ProductCard from '../components/common/ProductCard';
import useDebounce from '../hooks/useDebounce';
import { useProduk } from '../hooks/useProduct';

const Products = () => {
  const { products: allProducts, loading, error } = useProduk();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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