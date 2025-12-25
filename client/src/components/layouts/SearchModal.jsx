import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);

  // Otomatis fokus ke input saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      // Tambahkan sedikit delay agar transisi CSS selesai
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 z-50 flex justify-center p-4 pt-[20vh] bg-black/40 backdrop-blur-sm"
      onClick={onClose} // Menutup modal saat backdrop diklik
    >
      <div 
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat konten modal diklik
      >
        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari produk, tenda, sepatu..."
            className="w-full pl-12 pr-12 py-4 rounded-lg border border-border-main bg-content-bg text-text-main text-lg focus:outline-none focus:ring-2 focus:ring-theme-primary"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            <Search size={22} />
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
          >
            <X size={24} />
          </button>
        </div>

        {/* Dummy Results */}
        <div className="bg-content-bg rounded-lg shadow-lg mt-2 p-4">
          <h4 className="text-sm font-semibold text-text-muted mb-3">
            Populer Saat Ini
          </h4>
          <div className="flex flex-col gap-2">
            <Link to="/shop/tenda" onClick={onClose} className="p-2 rounded-md hover:bg-theme-primary-light">
              Tenda Dome
            </Link>
            <Link to="/shop/sepatu" onClick={onClose} className="p-2 rounded-md hover:bg-theme-primary-light">
              Sepatu Hiking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;