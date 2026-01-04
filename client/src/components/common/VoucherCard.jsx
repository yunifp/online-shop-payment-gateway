import React, { useState, useEffect } from 'react';
import { TicketPercent, Calendar, Copy, CheckCircle2, X } from 'lucide-react';
// Hapus toast jika ingin full modal, atau biarkan sebagai cadangan

const VoucherCard = ({ voucher }) => {
  const { 
    code, 
    type, 
    value, 
    min_purchase, 
    max_discount, 
    end_date, 
    description,
    is_active 
  } = voucher;

  const [showCopyModal, setShowCopyModal] = useState(false);

  const now = new Date();
  const expiryDate = new Date(end_date);
  const isExpired = expiryDate < now;
  const isActive = is_active && !isExpired;

  // Format Mata Uang
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Auto close modal
  useEffect(() => {
    let timer;
    if (showCopyModal) {
      timer = setTimeout(() => setShowCopyModal(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showCopyModal]);

  // Handler Copy Code
  const handleCopy = (e) => {
    // Stop propagasi agar tidak memicu Link parent (jika ada)
    e.preventDefault(); 
    e.stopPropagation();

    if (isActive) {
      navigator.clipboard.writeText(code);
      setShowCopyModal(true);
    }
  };

  return (
    <>
      <div className={`relative flex w-full bg-white rounded-lg border overflow-hidden transition-all hover:shadow-md group
        ${isActive ? 'border-border-main' : 'border-zinc-200 opacity-60 grayscale'}`}
      >
        {/* Bagian Kiri (Visual Diskon) */}
        <div className={`w-32 flex-shrink-0 flex flex-col items-center justify-center p-4 border-r-2 border-dashed border-zinc-200
          ${isActive ? 'bg-theme-primary-light text-theme-primary-dark' : 'bg-zinc-100 text-zinc-400'}`}
        >
          <TicketPercent size={32} className="mb-2 opacity-80" />
          <div className="text-center">
            {type === 'percentage' ? (
              <span className="text-2xl font-bold block">{Math.floor(value)}%</span>
            ) : (
              <span className="text-lg font-bold block">{formatCurrency(value)}</span>
            )}
            <span className="text-[10px] font-semibold uppercase tracking-wider">OFF</span>
          </div>
        </div>

        {/* Dekorasi Bulatan */}
        <div className="absolute top-0 bottom-0 left-[7.9rem] w-4 flex flex-col justify-between z-10">
          <div className="w-4 h-2 bg-app-bg rounded-b-full border-b border-border-main -mt-[1px]"></div>
          <div className="w-4 h-2 bg-app-bg rounded-t-full border-t border-border-main -mb-[1px]"></div>
        </div>

        {/* Bagian Kanan (Detail Info) */}
        <div className="flex-1 p-4 flex flex-col justify-between pl-6 relative">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">
                <h3 className="font-bold text-text-main text-lg tracking-wide uppercase truncate" title={code}>{code}</h3>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                  {description || (type === 'percentage' 
                    ? `Discount ${value}%` 
                    : `OFF ${formatCurrency(value)}`
                  )}
                </p>
              </div>
              {isActive ? (
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                  Active
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                  Expired
                </span>
              )}
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                <span className="font-medium text-zinc-700">Min. Shopping:</span> 
                {formatCurrency(min_purchase)}
              </p>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Calendar size={12} />
                Until {formatDate(end_date)}
              </p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="mt-4 flex justify-end">
            <button 
              onClick={handleCopy}
              disabled={!isActive}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all
                ${isActive 
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95 shadow-sm' 
                  : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'}`}
            >
              <Copy size={12} />
              Copy Code
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP COPY --- */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[60] flex justify-center px-4 pb-6 pointer-events-none transition-all duration-500 ease-out
          ${showCopyModal ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      >
        <div className="bg-zinc-900 text-white w-full max-w-sm shadow-2xl rounded-xl p-4 flex items-center gap-4 pointer-events-auto border border-zinc-700">
          <div className="bg-green-500/20 p-2 rounded-full">
            <CheckCircle2 className="text-green-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Successfully Copied!</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Use code <span className="text-white font-mono font-bold bg-zinc-800 px-1 rounded">{code}</span>
            </p>
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); setShowCopyModal(false); }}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default VoucherCard;