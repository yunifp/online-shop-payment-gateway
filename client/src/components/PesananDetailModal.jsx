import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaUser, FaMapPin, FaBoxOpen, 
  FaTruck, FaEdit, FaClipboardList, FaCheckCircle, FaSpinner, FaCreditCard 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useTransaction } from '../hooks/useTransaction';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Rp 0';
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

const PesananDetailModal = ({ isOpen, onClose, transaction: initialTransaction, userRole = 'customer', onRefresh }) => {
  const { getTransactionDetail, updateTransactionStatus } = useTransaction();
  const navigate = useNavigate(); // 2. Init useNavigate
  
  const [transactionData, setTransactionData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  
  // State untuk form edit
  const [status, setStatus] = useState('');
  const [resi, setResi] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load detail saat modal dibuka
  useEffect(() => {
    const loadDetails = async () => {
      if (isOpen && initialTransaction?.id) {
        setIsFetching(true);
        // Set data awal dari props agar tidak kosong saat loading (Optimistic UI)
        setTransactionData(initialTransaction); 
        setStatus(initialTransaction.status || 'pending');
        setResi(initialTransaction.shipping_receipt_number || '');
        
        // Ambil data lengkap (termasuk item details terbaru & token midtrans) dari server
        const fullData = await getTransactionDetail(initialTransaction.id);
        if (fullData) {
          setTransactionData(fullData);
          setStatus(fullData.status || 'pending');
          setResi(fullData.shipping_receipt_number || '');
        }
        setIsFetching(false);
      }
    };
    loadDetails();
  }, [isOpen, initialTransaction, getTransactionDetail]);

  if (!isOpen || !transactionData) return null;

  const isAdmin = userRole === 'admin' || userRole === 'staff';

  const handleSave = async () => {
    if (status === 'shipped' && !resi.trim()) {
      toast.error('Nomor resi wajib diisi jika status dikirim!');
      return;
    }
    setSaving(true);
    try {
      await updateTransactionStatus(transactionData.id, status, resi);
      setIsEditing(false);
      
      const updated = await getTransactionDetail(transactionData.id);
      if (updated) setTransactionData(updated);

      if (onRefresh) onRefresh();
    } catch (error) {
      // Error handled by hook
    } finally {
      setSaving(false);
    }
  };

  // 3. Fungsi Redirect Pembayaran
  const handlePayment = () => {
    // Cek apakah token ada
    if (transactionData.midtrans_token) {
      onClose(); // Tutup modal dulu
      navigate('/payment', { 
        state: { 
          token: transactionData.midtrans_token, 
          transaction: transactionData 
        } 
      });
    } else {
      toast.error("Token pembayaran tidak ditemukan atau sudah kadaluarsa.");
    }
  };

  // Helper parsing address
  let addressObj = {};
  try {
    addressObj = typeof transactionData.shipping_address === 'string' 
      ? JSON.parse(transactionData.shipping_address) 
      : (transactionData.shipping_address || {});
  } catch (e) { addressObj = {}; }

  // Normalisasi items
  const items = transactionData.TransactionDetails || transactionData.details || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 p-4 transition-all">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-theme-primary/10 p-3 rounded-2xl text-theme-primary shadow-sm">
              <FaClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Order Details</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  {transactionData.order_id_display || transactionData.id}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-black uppercase tracking-wider ${getStatusBadge(transactionData.status)}`}>
                  {transactionData.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-md rounded-full transition-all text-gray-400 hover:text-red-500">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Admin Edit Panel */}
          {isAdmin && (
            <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-5 relative overflow-hidden transition-all">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="font-black text-blue-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <FaEdit /> Admin Control
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-all border border-blue-200"
                  >
                    Update Status & Tracking Number
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
                    className="w-full border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-100/50 disabled:text-gray-400 text-sm font-bold p-2.5"
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
                  <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Tracking Number</label>
                  <div className="relative">
                    <FaTruck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={resi}
                      onChange={(e) => setResi(e.target.value)}
                      placeholder="Masukkan No. Resi..."
                      className="w-full pl-11 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-200 transition-all disabled:bg-gray-100/50 disabled:text-gray-400 text-sm font-mono p-2.5"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end mt-5 gap-3 relative z-10 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => { 
                      setIsEditing(false); 
                      setStatus(transactionData.status); 
                      setResi(transactionData.shipping_receipt_number || ''); 
                    }}
                    className="px-5 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
                  >
                    {saving ? <><FaSpinner className="animate-spin"/> Saving...</> : <><FaCheckCircle /> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          )}

         {/* Customer Info */}
          {/* Hapus space-y-3 di sini, cukup gap-6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kolom 1: Tambahkan flex flex-col */}
            <div className="space-y-3 flex flex-col">
              <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
                <FaUser className="text-theme-primary" /> Customer Information
              </h4>
              {/* Card: Tambahkan flex-1 agar memanjang ke bawah */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-4 flex-1">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Username</p>
                  <p className="text-sm font-bold text-gray-800">{transactionData.user?.name || 'Customer'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Email / Contact</p>
                  <p className="text-sm text-gray-600 font-medium">{transactionData.user?.email || '-'}</p>
                </div>
              </div>
            </div>

            {/* Kolom 2: Tambahkan flex flex-col */}
            <div className="space-y-3 flex flex-col">
              <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
                <FaMapPin className="text-theme-primary" /> Delivery Address
              </h4>
              {/* Card: Tambahkan flex-1 agar memanjang ke bawah */}
              <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/30 flex-1">
                <p className="text-sm font-black text-gray-900 mb-1">{addressObj.recipient_name}</p>
                <p className="text-xs font-bold text-theme-primary mb-3">{addressObj.recipient_phone}</p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {addressObj.full_address}, {addressObj.district_name}, {addressObj.city_name}, {addressObj.province_name} {addressObj.postal_code}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded uppercase">{transactionData.courier || 'Kurir'}</span>
                    <span className="text-xs font-bold text-gray-400">{transactionData.shipping_service}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="flex items-center gap-2 text-xs font-black text-gray-800 uppercase tracking-[0.2em]">
                <FaBoxOpen className="text-theme-primary" /> Your Products ({items.length})
              </h4>
              {isFetching && <span className="text-xs text-theme-primary flex items-center gap-1 font-bold"><FaSpinner className="animate-spin"/> Syncronizing data...</span>}
            </div>
            
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 bg-white">
                  {items.length > 0 ? items.map((item, idx) => {
                    let snapshot = {};
                    try {
                      snapshot = typeof item.product_snapshot === 'string' 
                        ? JSON.parse(item.product_snapshot) 
                        : (item.product_snapshot || {});
                    } catch (e) {}
                    
                    const productName = item.product?.name || snapshot.product?.name || 'Produk';
                    const variantName = item.product_variant?.size || snapshot.size || '-';
                    const price = item.price_at_purchase || item.price || 0;

                    return (
                      <tr key={item.id || idx} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="font-bold text-gray-800">{productName}</div>
                          <div className="text-[11px] font-bold text-theme-primary/60">Varian: {variantName}</div>
                        </td>
                        <td className="px-6 py-5 text-center font-black text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-5 text-right text-gray-500 font-medium">{formatCurrency(price)}</td>
                        <td className="px-6 py-5 text-right font-black text-gray-900">{formatCurrency(price * item.quantity)}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic text-xs font-bold">
                        {isFetching ? 'Sedang mengambil detail item...' : 'Tidak ada rincian produk.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-end pt-4">
            <div className="w-full md:w-80 space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Subtotal Products</span>
                <span className="text-gray-700">
                  {formatCurrency(transactionData.total_price)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Shipping Cost</span>
                <span className="text-gray-700">
                  {formatCurrency(transactionData.shipping_cost)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase">Service Fee</span>
                <span className="text-gray-700">
                  {formatCurrency(transactionData.service_fee)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
                <span className="text-sm font-black text-gray-900 uppercase">Total</span>
                <span className="text-2xl font-black text-theme-primary">
                  {formatCurrency(transactionData.grand_total)}
                </span>
              </div>

              {/* 4. Tombol Bayar Sekarang (Hanya muncul jika Pending & User bukan Admin) */}
              {!isAdmin && transactionData.status === 'pending' && (
                <button
                  onClick={handlePayment}
                  className="w-full mt-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 animate-pulse"
                >
                  <FaCreditCard /> Bayar Sekarang
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesananDetailModal;