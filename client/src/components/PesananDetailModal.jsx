import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaUser, FaMapPin, FaBoxOpen, 
  FaTruck, FaEdit, FaClipboardList, FaCheckCircle 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const getStatusBadge = (status) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    failed: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
};

const PesananDetailModal = ({ isOpen, onClose, transaction, onUpdateStatus, userRole = 'customer' }) => {
  const [status, setStatus] = useState('');
  const [resi, setResi] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setStatus(transaction.status || 'pending');
      setResi(transaction.shipping_receipt_number || '');
      setIsEditing(false);
    }
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const isAdmin = userRole === 'admin' || userRole === 'staff';

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
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  // penyesuaian parsing berdasarkan response log:
  // shipping_address: {"recipient_name":"...","recipient_phone":"...","full_address":"..."}
  let addressObj = {};
  try {
    addressObj = typeof transaction.shipping_address === 'string' 
      ? JSON.parse(transaction.shipping_address) 
      : (transaction.shipping_address || {});
  } catch (e) { addressObj = {}; }

  // TransactionDetails biasanya datang sebagai array objek
  const items = transaction.TransactionDetails || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 p-4 transition-all">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-theme-primary/10 p-3 rounded-2xl text-theme-primary shadow-sm">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Detail Pesanan</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{transaction.order_id_display}</span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${getStatusBadge(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-md rounded-full transition-all text-gray-400 hover:text-red-500">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Admin Edit Panel - Hanya muncul jika Admin */}
          {isAdmin && (
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="font-black text-blue-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <FaEdit /> Kontrol Admin
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all border border-blue-200"
                  >
                    Ubah Status & Resi
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Update Status</label>
                  <select
                    disabled={!isEditing}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-100/50 disabled:text-gray-400 text-sm font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid (Lunas)</option>
                    <option value="processing">Processing (Dikemas)</option>
                    <option value="shipped">Shipped (Dikirim)</option>
                    <option value="completed">Completed (Selesai)</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Nomor Resi</label>
                  <div className="relative">
                    <FaTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={resi}
                      onChange={(e) => setResi(e.target.value)}
                      placeholder="Masukkan No. Resi..."
                      className="w-full pl-11 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-100/50 disabled:text-gray-400 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-5 gap-3 relative z-10">
                  <button 
                    onClick={() => { setIsEditing(false); setStatus(transaction.status); setResi(transaction.shipping_receipt_number || ''); }}
                    className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                  >
                    {loading ? 'Menyimpan...' : <><FaCheckCircle /> Simpan Perubahan</>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Customer & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
                <FaUser className="text-theme-primary" /> Informasi Pelanggan
              </h4>
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Nama Pembeli</p>
                  <p className="text-sm font-bold text-gray-800">{transaction.user?.name || 'Customer'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Email / WhatsApp</p>
                  <p className="text-sm text-gray-600 font-medium">{transaction.user?.email || '-'}</p>
                  <p className="text-sm text-gray-600 font-medium">{transaction.user?.phone_number || '-'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
                <FaMapPin className="text-theme-primary" /> Alamat Pengiriman
              </h4>
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30">
                <p className="text-sm font-black text-gray-900 mb-1">{addressObj.recipient_name}</p>
                <p className="text-xs font-bold text-theme-primary mb-3">{addressObj.recipient_phone}</p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {addressObj.full_address}, {addressObj.district_name}, {addressObj.city_name}, {addressObj.province_name} {addressObj.postal_code}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded uppercase">{transaction.courier}</span>
                    <span className="text-[10px] font-bold text-gray-400">{transaction.shipping_service}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rincian Produk */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
              <FaBoxOpen className="text-theme-primary" /> Produk Dipesan ({items.length})
            </h4>
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Nama Produk</th>
                    <th className="px-6 py-4 text-center">Jumlah</th>
                    <th className="px-6 py-4 text-right">Harga Satuan</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {items.length > 0 ? items.map((item) => {
                    let productInfo = {};
                    try {
                      productInfo = typeof item.product_snapshot === 'string' 
                        ? JSON.parse(item.product_snapshot) 
                        : (item.product_snapshot || {});
                    } catch (e) {}

                    return (
                      <tr key={item.id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-gray-800">{productInfo.product?.name || 'Produk'}</div>
                          <div className="text-[11px] font-bold text-theme-primary/60">Varian: {productInfo.size || '-'}</div>
                        </td>
                        <td className="px-6 py-5 text-center font-black text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-5 text-right text-gray-500 font-medium">{formatCurrency(item.price_at_purchase)}</td>
                        <td className="px-6 py-5 text-right font-black text-gray-900">{formatCurrency(item.quantity * item.price_at_purchase)}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic text-xs font-bold">
                        Rincian item tidak tersedia. Pastikan backend melakukan "include: TransactionDetails".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-80 space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Total Barang</span>
                <span className="text-gray-700">{formatCurrency(transaction.total_price)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Ongkos Kirim</span>
                <span className="text-gray-700">{formatCurrency(transaction.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Biaya Layanan</span>
                <span className="text-gray-700">{formatCurrency(transaction.service_fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
                <span className="text-sm font-black text-gray-900 uppercase">Total Bayar</span>
                <span className="text-2xl font-black text-theme-primary">{formatCurrency(transaction.grand_total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesananDetailModal;