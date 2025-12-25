import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

// Helper format mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// 1. Terima 'items' sebagai props (BUKAN lagi data dummy)
const CartDropdown = ({ isOpen, items = [] }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-80 bg-content-bg rounded-lg shadow-xl border border-border-main z-40
                  transition-all duration-200 ease-out transform
                  ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      style={{ transformOrigin: 'top right' }}
    >
      <div className="p-4 border-b border-border-main">
        <h3 className="text-lg font-semibold text-text-main">Keranjang Anda</h3>
      </div>

      {/* 2. Gunakan 'items' dari props */}
      {items.length > 0 ? (
        <>
          <ul className="divide-y divide-border-main max-h-60 overflow-y-auto">
            {/* 3. Gunakan 'items' dari props */}
            {items.map((item) => (
              <li key={item.id} className="flex items-center p-4 space-x-3">
                <div className="w-16 h-16 bg-zinc-200 rounded-md flex-shrink-0">
                  {/* Placeholder Gambar */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-main truncate">{item.name}</p>
                  <p className="text-sm text-text-muted">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <button className="text-text-subtle hover:text-red-500">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>

          <div className="p-4 space-y-3 border-t border-border-main">
            <div className="flex justify-between font-medium">
              <span className="text-text-muted">Subtotal:</span>
              <span className="text-text-main">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              to="/cart"
              className="block w-full text-center bg-theme-primary-light text-theme-primary-dark font-medium py-2.5 px-4 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Lihat Keranjang
            </Link>
          </div>
        </>
      ) : (
        <p className="p-6 text-center text-text-muted">
          Keranjang Anda kosong.
        </p>
      )}
    </div>
  );
};

export default CartDropdown;