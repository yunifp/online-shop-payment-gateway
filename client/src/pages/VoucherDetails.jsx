import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TicketPercent, Calendar, ArrowLeft, Clock, Info, AlertCircle, Copy, CheckCircle2, X } from 'lucide-react';
import { useVoucher } from '../hooks/useVoucher';

const VoucherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vouchers, loading } = useVoucher();
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Cari voucher
  const voucher = useMemo(() => {
    return vouchers.find(v => String(v.id) === id);
  }, [vouchers, id]);

  // Auto close modal
  useEffect(() => {
    let timer;
    if (showCopyModal) {
      timer = setTimeout(() => setShowCopyModal(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showCopyModal]);

  const handleCopy = () => {
    if (voucher?.code) {
      navigator.clipboard.writeText(voucher.code);
      setShowCopyModal(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat detail voucher...</div>;
  
  if (!voucher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voucher Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-6">Voucher yang Anda cari mungkin sudah dihapus atau tidak tersedia.</p>
        <button onClick={() => navigate(-1)} className="text-theme-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Kembali
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const now = new Date();
  const isExpired = new Date(voucher.end_date) < now;
  const isActive = voucher.is_active && !isExpired;

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/product" className="inline-flex items-center text-gray-500 hover:text-theme-primary mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Produk
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className={`p-8 text-center relative overflow-hidden ${isActive ? 'bg-theme-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <TicketPercent size={48} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                {voucher.type === 'percentage' ? `${Math.floor(voucher.value)}% OFF` : formatCurrency(voucher.value)}
              </h1>
              <p className="opacity-90 font-medium">
                {voucher.type === 'percentage' ? `Diskon hingga ${formatCurrency(voucher.max_discount)}` : 'Potongan Langsung'}
              </p>
            </div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-8">
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Info size={20} className="text-theme-primary" /> Deskripsi
                </h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {voucher.description || "Tidak ada deskripsi tambahan."}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-theme-primary" /> Syarat Penggunaan
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Min. Belanja: <span className="font-bold text-gray-800">{formatCurrency(voucher.min_purchase)}</span></span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Berlaku untuk semua produk</span>
                        </li>
                        {voucher.max_discount && (
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Maks. Potongan: <span className="font-bold text-gray-800">{formatCurrency(voucher.max_discount)}</span></span>
                            </li>
                        )}
                         <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Sisa Kuota: <span className="font-bold text-gray-800">{voucher.quota}</span></span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-theme-primary" /> Periode Aktif
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Clock size={16} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Mulai</p>
                                <p className="text-sm font-medium text-gray-800">{formatDate(voucher.start_date)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Clock size={16} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Berakhir</p>
                                <p className="text-sm font-medium text-gray-800">{formatDate(voucher.end_date)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                      {/* Copy Section */}
          <div className="p-8">
             <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 font-medium mb-3 uppercase tracking-wider">Kode Voucher</p>
                <div 
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 p-2 pr-4 rounded-lg hover:border-theme-primary transition-all cursor-pointer group active:scale-95 select-none"
                >
                    <div className="bg-white px-4 py-2 rounded shadow-sm font-mono text-xl font-bold text-gray-800 group-hover:text-theme-primary transition-colors">
                        {voucher.code}
                    </div>
                    <Copy size={20} className="text-gray-400 group-hover:text-theme-primary transition-colors" />
                </div>
                <p className="text-xs text-gray-400 mt-2">Klik kode untuk menyalin</p>
             </div>
          </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center">
            <button     
                onClick={() => navigate('/product')}
                className="bg-theme-primary hover:bg-theme-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95"
            >
                Gunakan Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[60] flex justify-center px-4 pb-6 pointer-events-none transition-all duration-500 ease-out
          ${showCopyModal ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="bg-zinc-900 text-white w-full max-w-sm shadow-2xl rounded-xl p-4 flex items-center gap-4 pointer-events-auto border border-zinc-700">
          <div className="bg-green-500/20 p-2 rounded-full">
            <CheckCircle2 className="text-green-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Kode Disalin!</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kode <span className="text-white font-mono font-bold bg-zinc-800 px-1 rounded">{voucher.code}</span> siap digunakan.
            </p>
          </div>
          <button 
            onClick={() => setShowCopyModal(false)}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetails;