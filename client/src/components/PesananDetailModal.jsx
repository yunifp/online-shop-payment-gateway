import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaMapPin, FaBoxOpen, FaTruck, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PesananDetailModal = ({ isOpen, onClose, transaction, onUpdateStatus }) => {
  const [status, setStatus] = useState('');
  const [resi, setResi] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form saat modal dibuka atau transaksi berubah
  useEffect(() => {
    if (transaction) {
      setStatus(transaction.status || 'pending');
      setResi(transaction.shipping_receipt_number || '');
      setIsEditing(false);
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const handleSave = async () => {
    if (status === 'shipped' && !resi.trim()) {
      toast.error('Nomor resi wajib diisi jika status dikirim!');
      return;
    }

    setLoading(true);
    try {
      await onUpdateStatus(transaction.id, status, resi);
      setIsEditing(false);
    } catch (error) {
      // Error sudah dihandle di hook, tapi kita stop loading
    } finally {
      setLoading(false);
    }
  };

  // Parsing JSON alamat dan item karena dari DB seringkali string JSON
  let addressObj = {};
  try {
    addressObj = typeof transaction.shipping_address === 'string' 
      ? JSON.parse(transaction.shipping_address) 
      : transaction.shipping_address;
  } catch (e) { addressObj = {}; }

  // Transaction Items biasanya perlu diambil dari include/join, 
  // Asumsi data transaction sudah include TransactionDetails atau similar
  // Disini kita sesuaikan dengan struktur data backend yang umum
  // Jika backend mengirim array kosong atau struktur beda, perlu penyesuaian.
  const items = transaction.TransactionDetails || []; 

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
            <span className="text-sm text-theme-primary font-semibold">{transaction.order_id_display}</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Update Status & Resi */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                <FaEdit /> Update Pesanan
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  Ubah Status
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status Pesanan</label>
                <select
                  disabled={!isEditing}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-theme-primary focus:border-theme-primary sm:text-sm ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                >
                  <option value="pending">Pending (Menunggu Bayar)</option>
                  <option value="paid">Paid (Sudah Dibayar)</option>
                  <option value="processing">Processing (Dikemas)</option>
                  <option value="shipped">Shipped (Dikirim)</option>
                  <option value="completed">Completed (Selesai)</option>
                  <option value="cancelled">Cancelled (Dibatalkan)</option>
                  <option value="failed">Failed (Gagal)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTruck className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={resi}
                    onChange={(e) => setResi(e.target.value)}
                    placeholder="Input Resi..."
                    className={`pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-theme-primary focus:border-theme-primary sm:text-sm ${!isEditing ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setStatus(transaction.status);
                    setResi(transaction.shipping_receipt_number || '');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-theme-primary rounded-lg hover:bg-theme-primary-dark shadow-sm flex items-center"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pelanggan */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FaUser className="text-gray-400" /> Informasi Pelanggan
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-2">
                <div>
                  <span className="block text-xs text-gray-500">Nama</span>
                  <span className="font-medium text-gray-900">{transaction.user?.name || 'Guest / Terhapus'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{transaction.user?.email || '-'}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500">No. Telepon</span>
                  <span className="font-medium text-gray-900">{transaction.user?.phone_number || '-'}</span>
                </div>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FaMapPin className="text-gray-400" /> Alamat Pengiriman
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm h-full">
                <p className="font-medium text-gray-900 mb-1">
                  {addressObj.recipient_name} <span className="text-gray-500 font-normal">({addressObj.phone_number})</span>
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {addressObj.full_address_line}, {addressObj.district}, {addressObj.city}, {addressObj.province} {addressObj.postal_code}
                </p>
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                  <span>Kurir: {(transaction.courier || '').toUpperCase()}</span>
                  <span>Layanan: {transaction.shipping_service}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item List */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
              <FaBoxOpen className="text-gray-400" /> Rincian Item
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Karena TransactionDetails belum tentu ada di fetch list utama, 
                      pastikan backend include 'TransactionDetails' atau gunakan data dummy jika perlu */}
                  {items.length > 0 ? items.map((item, idx) => {
                    // Parsing snapshot produk
                    let productData = {};
                    try {
                      productData = JSON.parse(item.product_snapshot);
                    } catch (e) {}

                    return (
                      <tr key={item.id || idx}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="font-medium">{productData.product?.name || 'Produk'}</div>
                          <div className="text-xs text-gray-500">
                             Var: {productData.size} | Qty: {item.quantity}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-gray-600">
                          {formatCurrency(item.price_at_purchase)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                          {formatCurrency(item.quantity * item.price_at_purchase)}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500 italic">
                        Detail item tidak tersedia di view ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal Barang</span>
                <span>{formatCurrency(transaction.total_price)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ongkos Kirim</span>
                <span>{formatCurrency(transaction.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Biaya Layanan</span>
                <span>{formatCurrency(transaction.service_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                <span>Total Bayar</span>
                <span className="text-theme-primary">{formatCurrency(transaction.grand_total)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PesananDetailModal;