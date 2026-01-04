import React, { useEffect, useState } from 'react';
import { FaSearch, FaBox, FaTruck, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useTransaction } from '../../hooks/useTransaction';
import { useTracking } from '../../hooks/useTracking';
import { toast } from 'react-hot-toast';

const TrackingTimeline = ({ data }) => {
  if (!data || !data.history || data.history.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
        <p>Belum ada riwayat perjalanan paket dari ekspedisi.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
        <FaTruck className="mr-2 text-theme-primary" /> Riwayat Perjalanan (Real-time)
      </h4>
      <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
        {data.history.map((log, index) => (
          <div key={index} className="mb-8 ml-6 relative">
            <span className={`absolute -left-[31px] top-0 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${index === 0 ? 'bg-theme-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {index === 0 ? <FaMapMarkerAlt size={12} /> : <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
            </span>
            <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <time className="block mb-1 text-xs font-normal text-gray-400 flex items-center">
                <FaClock className="mr-1" size={10} />
                {new Date(log.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </time>
              
              <h3 className="text-sm font-semibold text-gray-900">
                {log.desc || log.message || 'Status diperbarui'}
              </h3>
              
              {log.location && (
                 <p className="text-xs text-gray-600 mt-1 flex items-center font-medium">
                   <FaMapMarkerAlt className="mr-1 text-gray-400" size={10} /> 
                   Lokasi: {log.location}
                 </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pengiriman = () => {
  const { transactions, loading: loadingList, fetchTransactions } = useTransaction();
  const { getTracking, trackingData, loading: trackingLoading, clearTracking } = useTracking();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchTransactions({ status: 'shipped', limit: 50 });
  }, [fetchTransactions]);

  const handleSearch = () => {
    if (!searchTerm) return;
    
    const found = transactions.find(t => 
      t.order_id_display?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (t.shipping_receipt_number && t.shipping_receipt_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (found) {
      setSelectedOrder(found);
      getTracking(found.order_id_display);
    } else {
      toast.error('Data tidak ditemukan di daftar pengiriman aktif.');
      setSelectedOrder(null);
      clearTracking();
    }
  };

  const handleSelectOrder = (transaction) => {
    setSelectedOrder(transaction);
    setSearchTerm(transaction.order_id_display);
    getTracking(transaction.order_id_display);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manajemen Pengiriman
        </h1>
        <div className="hidden md:block text-sm text-gray-500">
          Total Aktif: <span className="font-bold text-theme-primary">{transactions.length}</span>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Lacak Pesanan</h2>
        
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Masukkan Order ID (TRX-...) atau No. Resi" 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-theme-primary/20 focus:border-theme-primary outline-none transition"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={trackingLoading}
            className="bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2.5 px-6 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2">
            {trackingLoading ? 'Melacak...' : 'Cari Paket'}
          </button>
        </div>
        
        {selectedOrder && (
          <div className="animate-fade-in">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                   <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Informasi Pesanan</p>
                   <h3 className="text-xl font-bold text-gray-900">{selectedOrder.order_id_display}</h3>
                   <p className="text-gray-600 text-sm mt-1">Penerima: <span className="font-medium">{selectedOrder.user?.name || 'Customer'}</span></p>
                </div>
                <div className="text-left md:text-right bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                   <p className="text-xs text-gray-500">Ekspedisi & Resi</p>
                   <p className="font-bold text-theme-primary text-lg">
                     {(selectedOrder.courier || '').toUpperCase()}
                   </p>
                   <p className="font-mono text-sm text-gray-700 select-all">
                     {selectedOrder.shipping_receipt_number || 'Belum Input Resi'}
                   </p>
                </div>
              </div>

              {trackingData && trackingData.summary && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t border-blue-200 pt-4">
                    <div>
                      <p className="text-xs text-gray-500">Status Terkini</p>
                      <p className="font-bold text-blue-700">{trackingData.summary.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tanggal Kirim</p>
                      <p className="font-medium text-gray-700">{trackingData.summary.date || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Deskripsi</p>
                      <p className="font-medium text-gray-700 text-sm truncate">{trackingData.summary.courier || '-'}</p>
                    </div>
                 </div>
              )}
            </div>

            {trackingLoading ? (
              <div className="py-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Menghubungi server ekspedisi...</p>
              </div>
            ) : (
              <TrackingTimeline data={trackingData} />
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Daftar Pengiriman Aktif</h2>
          <button onClick={() => fetchTransactions({ status: 'shipped', limit: 50 })} className="text-sm text-theme-primary hover:underline">
             Refresh Data
          </button>
        </div>

        {loadingList ? (
            <div className="p-8 text-center text-gray-500">Memuat data pengiriman...</div>
        ) : transactions.length === 0 ? (
            <div className="p-12 text-center bg-gray-50">
              <FaBox size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Tidak ada paket dalam pengiriman (Status: Shipped) saat ini.</p>
            </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Resi & Ekspedisi</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-theme-primary">{item.order_id_display}</span>
                        <br/>
                        <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">{item.shipping_receipt_number || '-'}</div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1">
                          {(item.courier || 'Ekspedisi').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                         {item.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleSelectOrder(item)}
                          className="text-white bg-theme-primary hover:bg-theme-primary-dark px-3 py-1.5 rounded-md text-xs transition shadow-sm"
                        >
                          Lacak Paket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-3 p-4 bg-gray-50">
              {transactions.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                     <p className="text-theme-primary font-bold">{item.order_id_display}</p>
                     <span className="px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                       {(item.courier || 'N/A').toUpperCase()}
                     </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Resi: <span className="font-mono font-medium">{item.shipping_receipt_number || '-'}</span></p>
                  <p className="text-sm text-gray-500 mb-3">Pelanggan: {item.user?.name}</p>
                  
                  <button 
                    onClick={() => handleSelectOrder(item)}
                    className="w-full text-center bg-white border border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-white py-2 rounded-md text-sm font-medium transition"
                  >
                    Lacak Detail
                  </button>
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