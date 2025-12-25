import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

// Fungsi helper
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Data dummy (ganti dengan state)
const cartItems = [
  { id: 1, name: 'Tenda Dome Pro 4P', price: 1200000, quantity: 1, image: '' },
  { id: 2, name: 'Carrier Ultralight 60L', price: 850000, quantity: 1, image: '' },
];
const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

const Cart = () => {
  return (
    <div className="bg-app-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text-main mb-8">
          Keranjang Anda
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-content-bg p-12 border border-border-main rounded-lg">
            <ShoppingBag size={48} className="mx-auto text-text-subtle" />
            <p className="mt-4 text-xl font-medium text-text-main">Keranjang Anda kosong</p>
            <p className="mt-2 text-text-muted">Ayo mulai berbelanja!</p>
            <Link 
              to="/products"
              className="inline-block mt-6 bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all"
            >
              Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Daftar Item */}
            <div className="lg:col-span-2 bg-content-bg border border-border-main rounded-lg shadow-sm">
              <ul className="divide-y divide-border-main">
                {cartItems.map(item => (
                  <li key={item.id} className="flex flex-col sm:flex-row gap-4 p-6">
                    <div className="w-24 h-24 bg-zinc-100 rounded-md border border-border-main flex-shrink-0">
                      {/* Placeholder Gambar */}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-text-main">{item.name}</h3>
                        <p className="text-sm text-text-muted">Jumlah: {item.quantity}</p>
                      </div>
                      <p className="text-lg font-medium text-theme-primary-dark mt-2 sm:mt-0">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <button className="text-red-500 hover:text-red-700 p-2 self-start sm:self-center">
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ringkasan Belanja */}
            <div className="lg:col-span-1">
              <div className="bg-content-bg border border-border-main rounded-lg shadow-sm p-6 sticky top-28">
                <h2 className="text-2xl font-semibold text-text-main mb-4">
                  Ringkasan Belanja
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-medium text-text-main">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Pengiriman</span>
                    <span className="font-medium text-text-main">Gratis</span>
                  </div>
                </div>
                <hr className="border-border-main my-4" />
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span className="text-text-main">Total</span>
                  <span className="text-text-main">{formatCurrency(subtotal)}</span>
                </div>
                <button className="w-full bg-theme-primary text-white font-medium py-3 px-8 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all">
                  Lanjut ke Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;