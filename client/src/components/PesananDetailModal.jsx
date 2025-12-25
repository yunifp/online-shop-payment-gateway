import React from 'react';
import { FaTimes, FaUser, FaMapPin, FaBoxOpen } from 'react-icons/fa';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    sukses: 'bg-theme-primary-light text-theme-primary-dark',
    gagal: 'bg-red-100 text-red-800',
    dikirim: 'bg-orange-100 text-orange-800',
  };
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const PesananDetailModal = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const total = transaction.items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/20"
      onClick={onClose}
    >
      <div 
        className="bg-content-bg rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-border-main">
          <div>
            <h2 className="text-2xl font-semibold text-text-main">Detail Pesanan</h2>
            <span className="text-sm text-theme-primary font-medium">{transaction.id}</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-text-main p-1 rounded-full hover:bg-gray-100"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-text-muted">Status</h4>
              <StatusBadge status={transaction.status} />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-text-muted">Tanggal</h4>
              <p className="text-text-main font-medium">{transaction.date}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-text-muted">No. Resi</h4>
              <p className="text-text-main font-medium">{transaction.resi}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-text-main mb-3 flex items-center">
                <FaUser className="mr-2 text-theme-primary" /> Pelanggan
              </h3>
              <div className="space-y-1 text-sm">
                <p className="text-text-main">{transaction.customer.name}</p>
                <p className="text-text-muted">{transaction.customer.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-main mb-3 flex items-center">
                <FaMapPin className="mr-2 text-theme-primary" /> Alamat Pengiriman
              </h3>
              <p className="text-sm text-text-muted">
                {transaction.address.street}, {transaction.address.city}, {transaction.address.zip}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-main mb-3 flex items-center">
              <FaBoxOpen className="mr-2 text-theme-primary" /> Rincian Item
            </h3>
            <ul className="divide-y divide-border-main border-y border-border-main">
              {transaction.items.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium text-text-main">{item.name}</p>
                    <p className="text-sm text-text-muted">
                      {item.qty} x {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-medium text-text-main">
                    {formatCurrency(item.qty * item.price)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-text-main font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Pengiriman</span>
                <span className="text-text-main font-medium">{formatCurrency(15000)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border-main">
                <span className="text-text-main">Total</span>
                <span className="text-theme-primary-dark">{formatCurrency(total + 15000)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PesananDetailModal;