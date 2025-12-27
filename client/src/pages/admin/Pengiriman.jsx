import React, { useEffect, useState } from 'react';
import { FaSearch, FaBox, FaTruckLoading, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import { useTransaction } from '../../hooks/useTransaction';

const StatusStepper = ({ status }) => {
  // Mapping urutan status untuk visualisasi stepper
  const steps = [
    { name: 'Dibayar', icon: FaBox },
    { name: 'Dikemas', icon: FaTruckLoading },
    { name: 'Dikirim', icon: FaShippingFast },
    { name: 'Selesai', icon: FaCheckCircle },
  ];
  
  const statusIndex = {
    'paid': 0,
    'processing': 1,
    'shipped': 2,
    'completed': 3,
  };
  
  const currentIndex = statusIndex[status] ?? 0;

  return (
    <div className="flex items-center justify-between w-full px-2 md:px-4 py-6">
      {steps.map((step, index) => (
        <React.Fragment key={step.name}>
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full ${index <= currentIndex ? 'bg-theme-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
              <step.icon size={22} />
            </div>
            <p className={`mt-2 text-xs md:text-sm font-medium ${index <= currentIndex ? 'text-theme-primary-dark' : 'text-text-muted'}`}>
              {step.name}
            </p>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-[2px] ${index < currentIndex ? 'bg-theme-primary' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Pengiriman = () => {
  const { transactions, loading, fetchTransactions } = useTransaction();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // Halaman Pengiriman fokus menampilkan barang yang statusnya 'shipped' (Dalam Pengiriman)
    fetchTransactions({ status: 'shipped', limit: 20 });
  }, [fetchTransactions]);

  const handleSearch = () => {
    if (!searchTerm) return;
    // Mencari di list yang sudah di-fetch (lokal)
    const found = transactions.find(t => 
      t.order_id_display.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.shipping_receipt_number && t.shipping_receipt_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (found) {
        setSearchResult(found);
    } else {
        setSearchResult(null);
        alert('Data tidak ditemukan di daftar pengiriman aktif.');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-main">
        Manajemen Pengiriman
      </h1>

      <div className="bg-content-bg shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-text-main mb-4">Lacak & Cek Pesanan</h2>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-text-subtle" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Masukkan Order ID atau No. Resi..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-main bg-slate-50 focus:border-theme-primary"
            />
          </div>
          <button 
            onClick={handleSearch}
            className="bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2 px-6 rounded-lg w-full md:w-auto">
            Cari
          </button>
        </div>
        
        {searchResult && (
          <div className="mt-6 border-t border-border-main pt-6">
            <h3 className="text-base md:text-lg font-semibold">Order: {searchResult.order_id_display}</h3>
            <p className="text-text-muted text-sm md:text-base">Resi: {searchResult.shipping_receipt_number || 'Belum ada resi'}</p>
            <div className="mt-4">
              <StatusStepper status={searchResult.status} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-content-bg shadow-md rounded-lg overflow-hidden">
        <h2 className="text-lg md:text-xl font-semibold text-text-main p-4 md:p-6">Daftar Pengiriman Aktif</h2>

        {loading ? (
            <p className="p-6 text-text-muted">Memuat data...</p>
        ) : transactions.length === 0 ? (
            <p className="p-6 text-text-muted">Tidak ada pengiriman aktif (Shipped) saat ini.</p>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-border-main">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">No. Resi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Ekspedisi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border-main">
                  {transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">{item.order_id_display}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{item.shipping_receipt_number || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{item.user?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {(item.courier || 'Ekspedisi').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3 p-3">
              {transactions.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg p-4 space-y-1 shadow-sm active:scale-[.98]">
                  <p className="text-theme-primary font-semibold text-sm">{item.order_id_display}</p>
                  <p className="text-sm text-text-main">Resi: {item.shipping_receipt_number || '-'}</p>
                  <p className="text-sm text-text-muted">{item.user?.name}</p>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {(item.courier || 'Ekspedisi').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pengiriman;