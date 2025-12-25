import React from 'react';

// Data filter (bisa didapat dari API nanti)
const categories = [
  { id: 'tenda', name: 'Tenda' },
  { id: 'tas', name: 'Tas' }, // 'Tas' cocok dengan data dummy
  { id: 'sepatu', name: 'Sepatu' }, // 'Sepatu' cocok dengan data dummy
  { id: 'alat_masak', name: 'Alat Masak' }, // 'Alat Masak' cocok dengan data dummy
  { id: 'alat_tidur', name: 'Alat Tidur' }, // 'Alat Tidur' cocok dengan data dummy
];

const ProductFilter = ({ selectedCategories, onCategoryChange, onResetFilters }) => {
  
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
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={category.name} // Filter berdasarkan nama kategori
                  checked={selectedCategories.includes(category.name)}
                  onChange={handleCheckboxChange}
                  className="rounded border-border-main text-theme-primary focus:ring-theme-primary"
                />
                <span className="text-sm text-text-muted">{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Anda bisa menambahkan filter lain di sini, misal:
        <div className="mt-6 border-t border-border-main pt-4">
          <h4 className="font-semibold text-text-main mb-3">Rentang Harga</h4>
          ...
        </div>
        */}
      </div>
    </aside>
  );
};

export default ProductFilter;