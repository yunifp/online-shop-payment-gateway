import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const CartDropdown = ({ isOpen, items = [], subtotal = 0 }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = API_URL ? API_URL.split('/api/v1')[0] : '';

  const constructImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

    if (cleanPath.startsWith('uploads/')) {
      return `${BASE_URL}/${cleanPath}`;
    }
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-80 bg-content-bg rounded-lg shadow-xl border border-border-main z-40
                  transition-all duration-200 ease-out transform origin-top-right
                  ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
    >
      <div className="p-4 border-b border-border-main flex justify-between items-center bg-gray-50/50 rounded-t-lg">
        <h3 className="text-lg font-bold text-text-main">Your Cart</h3>
        <span className="text-xs font-medium text-text-muted bg-zinc-100 px-2 py-1 rounded-full border border-zinc-200">
            {items.length} Item
        </span>
      </div>

      {items.length > 0 ? (
        <>
          <ul className="divide-y divide-border-main max-h-72 overflow-y-auto custom-scrollbar">
            {items.map((item) => (
              <li key={item.cart_item_id} className="flex items-start p-4 space-x-3 hover:bg-zinc-50 transition-colors">
                <div className="w-16 h-16 bg-zinc-100 rounded-md flex-shrink-0 overflow-hidden border border-border-main relative">
                  {item.image_url ? (
                    <img
                        src={constructImageUrl(item.image_url)}
                        alt={item.product_name}
                        className="w-full h-full object-fill"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/64x64?text=No+Img";
                        }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                        No Img
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text-main truncate" title={item.product_name}>
                    {item.product_name}
                  </p>
                  {item.variant_name && (
                    <p className="text-xs text-zinc-500 truncate mb-1">
                        {item.variant_name}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-text-muted">
                        {item.quantity} x {formatCurrency(item.price)}
                    </p>
                    <p className="text-xs font-bold text-theme-primary">
                        {formatCurrency(item.item_total || (item.price * item.quantity))}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-4 space-y-3 border-t border-border-main bg-gray-50/30 rounded-b-lg">
            <div className="flex justify-between font-bold text-sm">
              <span className="text-text-muted">Subtotal:</span>
              <span className="text-theme-primary-dark">{formatCurrency(subtotal)}</span>
            </div>
            <Link
              to="/cart"
              className="block w-full text-center bg-theme-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-theme-primary-dark transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              View Cart
            </Link>
          </div>
        </>
      ) : (
        <div className="p-8 text-center flex flex-col items-center justify-center text-text-muted">
            <ShoppingBag className="mb-3 text-zinc-300" size={48} />
            <p className="font-medium">Your cart is empty.</p>
        </div>
      )}
    </div>
  );
};

export default CartDropdown;