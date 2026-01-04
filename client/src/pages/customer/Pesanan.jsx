import React, { useState, useEffect } from 'react';
import PesananDetailModal from '../../components/PesananDetailModal';
import { useTransaction } from '../../hooks/useTransaction';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Pesanan = () => {
  const { transactions, loading, fetchMyTransactions, } = useTransaction();
  const [activeTab, setActiveTab] = useState('pending');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const tabs = [
    { key: 'pending', label: 'Belum Bayar' },
    { key: 'paid', label: 'Perlu Diproses' },
    { key: 'processing', label: 'Sedang Dikemas' },
    { key: 'shipped', label: 'Dalam Pengiriman' },
    { key: 'completed', label: 'Selesai' },
    { key: 'cancelled', label: 'Dibatalkan' },
  ];

  useEffect(() => {
    fetchMyTransactions({ status: activeTab, limit: 50 });
  }, [activeTab, fetchMyTransactions]);

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const renderTable = () => {
    if (loading) return <p className="p-6 text-text-muted">Memuat data...</p>;
    if (transactions.length === 0) return <p className="p-6 text-text-muted">Tidak ada transaksi pada status ini.</p>;
    
    return (
      <>
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">No. Resi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-main">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(tx)}>
                  <td className="px-6 py-4 text-sm font-medium text-theme-primary">{tx.order_id_display || tx.invoice_number || tx.id}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {new Date(tx.created_at || tx.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-main">{formatCurrency(tx.grand_total || tx.total_amount)}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{tx.shipping_receipt_number || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tx.status === 'paid' ? 'bg-yellow-100 text-yellow-800' : 
                        tx.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        tx.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        tx.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3 p-3">
          {transactions.map((tx) => (
            <div key={tx.id} onClick={() => handleRowClick(tx)} className="bg-white border rounded-lg p-4 space-y-1 shadow-sm cursor-pointer active:scale-[.98]">
              <div className="flex justify-between items-start">
                <p className="text-theme-primary font-semibold text-sm">{tx.order_id_display || tx.invoice_number || tx.id}</p>
                <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded text-text-muted">{tx.status}</span>
              </div>
              <p className="text-xs text-text-muted">{new Date(tx.created_at || tx.createdAt).toLocaleDateString('id-ID')}</p>
              <p className="font-semibold">{formatCurrency(tx.grand_total || tx.total_amount)}</p>
              <p className="text-xs text-text-muted mt-1">Resi: {tx.shipping_receipt_number || '-'}</p>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-4 md:mb-6">Riwayat Pesanan</h1>

      <div className="bg-content-bg shadow-md rounded-lg">
        <div className="px-3 md:px-6">
          <nav className="-mb-px flex overflow-x-auto md:space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-theme-primary text-theme-primary'
                    : 'border-transparent text-text-muted hover:text-text-main hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="h-[1px] bg-gray-200 w-full"></div>
        
        <div>{renderTable()}</div>
      </div>

      {selectedTransaction && (
        <PesananDetailModal 
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </>
  );
};

export default Pesanan;