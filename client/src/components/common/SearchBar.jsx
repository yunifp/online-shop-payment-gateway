import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-main bg-content-bg focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
      />
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle">
        <Search size={20} />
      </div>
    </div>
  );
};

export default SearchBar;