import React, { useState } from 'react';
import PesananDetailModal from '../../components/PesananDetailModal';

const mockPesanan = {
  perluDiproses: [
    { id: 'TRX-1005', date: '27 Okt 2025', customer: { name: 'Dewi Ayu', email:'dewi@example.com' }, total: 450000, resi: 'N/A', status: 'perluDiproses', items:[{ id:5,name:'Sleeping Bag',qty:1,price:450000 }], address:{street:'Jl. Sudirman 50',city:'Yogyakarta',zip:'55111'} },
  ],
  sukses: [
    { id:'TRX-1001',date:'25 Okt 2025',customer:{name:'Andi Wijaya',email:'andi@example.com'},total:1500000,resi:'JNT-001122',status:'sukses',items:[{id:1,name:'Tenda Dome',qty:1,price:1500000}],address:{street:'Jl. Merdeka 10',city:'Jakarta',zip:'10110'} },
    { id:'TRX-1003',date:'24 Okt 2025',customer:{name:'Siti Aminah',email:'siti@example.com'},total:850000,resi:'JNE-554433',status:'sukses',items:[{id:2,name:'Sepatu Gunung',qty:1,price:850000}],address:{street:'Jl. Kembang 2',city:'Bandung',zip:'40111'} },
  ],
  dikirim: [
    { id:'TRX-1004',date:'26 Okt 2025',customer:{name:'Citra Lestari',email:'citra@example.com'},total:2200000,resi:'SICEPAT-998877',status:'dikirim',items:[{id:4,name:'Carrier 60L',qty:1,price:2200000}],address:{street:'Jl. Anggrek 1',city:'Medan',zip:'20111'} },
  ],
  gagal: [
    { id:'TRX-1002',date:'24 Okt 2025',customer:{name:'Budi Hartono',email:'budi@example.com'},total:300000,resi:'N/A',status:'gagal',items:[{id:3,name:'Cooking Set',qty:1,price:300000}],address:{street:'Jl. Mawar 5',city:'Surabaya',zip:'60111'} },
  ],
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Pesanan = () => {
  const [activeTab, setActiveTab] = useState('perluDiproses');
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const tabs = [
    { key: 'perluDiproses', label: 'Perlu Diproses' },
    { key: 'sukses', label: 'Sukses' },
    { key: 'dikirim', label: 'Dalam Pengiriman' },
    { key: 'gagal', label: 'Gagal' },
  ];

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const renderTable = (status) => {
    const data = mockPesanan[status];
    if (data.length === 0) return <p className="p-6 text-text-muted">Tidak ada transaksi.</p>;
    
    return (
      <>
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">No. Resi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-main">
              {data.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(tx)}>
                  <td className="px-6 py-4 text-sm font-medium text-theme-primary">{tx.id}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{tx.date}</td>
                  <td className="px-6 py-4 text-sm text-text-main">{tx.customer.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-text-main">{formatCurrency(tx.total)}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{tx.resi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3 p-3">
          {data.map((tx) => (
            <div key={tx.id} onClick={() => handleRowClick(tx)} className="bg-white border rounded-lg p-4 space-y-1 shadow-sm cursor-pointer active:scale-[.98]">
              <p className="text-theme-primary font-semibold text-sm">{tx.id}</p>
              <p className="text-xs text-text-muted">{tx.date}</p>
              <p className="text-sm text-text-main">{tx.customer.name}</p>
              <p className="font-semibold">{formatCurrency(tx.total)}</p>
              <p className="text-xs text-text-muted">Resi: {tx.resi}</p>
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
                {tab.label} ({mockPesanan[tab.key].length})
              </button>
            ))}
          </nav>
        </div>

        <div className="h-[1px] bg-gray-200 w-full"></div>
        
        <div>{renderTable(activeTab)}</div>
      </div>

      <PesananDetailModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default Pesanan;
