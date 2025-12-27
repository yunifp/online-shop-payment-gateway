import React from 'react';
import { useKategori } from '../../hooks/useKategori';

const ProductFilter = ({ selectedCategories, onCategoryChange, onResetFilters }) => {
  // Ambil data kategori dari hook
  const { categories, loading } = useKategori();
  
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    onCategoryChange(value, checked);
  };

  return (
    <aside className="w-full md:w-64 lg:w-72">
      <div className="bg-content-bg p-6 rounded-lg shadow-sm border border-border-main sticky top-28">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-text-main">Filter</h3>
          <button
            onClick={onResetFilters}
            className="text-sm font-medium text-theme-primary-dark hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Filter Kategori */}
        <div>
          <h4 className="font-semibold text-text-main mb-3">Kategori</h4>
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm text-text-muted">Memuat kategori...</p>
            ) : (
              categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={category.name} 
                    checked={selectedCategories.includes(category.name)}
                    onChange={handleCheckboxChange}
                    className="rounded border-border-main text-theme-primary focus:ring-theme-primary"
                  />
                  <span className="text-sm text-text-muted">{category.name}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ProductFilter;