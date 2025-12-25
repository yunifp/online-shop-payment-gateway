import React from 'react';
import { FaSearch, FaBox, FaTruckLoading, FaShippingFast, FaCheckCircle } from 'react-icons/fa';

const StatusStepper = ({ status }) => {
  const steps = [
    { name: 'Dikemas', icon: FaBox },
    { name: 'Dikirim', icon: FaTruckLoading },
    { name: 'Dalam Perjalanan', icon: FaShippingFast },
    { name: 'Tiba', icon: FaCheckCircle },
  ];
  
  const statusIndex = {
    'dikemas': 0,
    'dikirim': 1,
    'perjalanan': 2,
    'tiba': 3,
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
  const trackingInfo = {
    resi: 'JNE-123456789',
    status: 'perjalanan',
    estimasi: '31 Oktober 2025',
  };

  const daftarPengiriman = [
    { id: 'TRX-001', resi: 'JNE-123456789', status: 'perjalanan', pelanggan: 'Budi' },
    { id: 'TRX-002', resi: 'SICEPAT-987654', status: 'dikirim', pelanggan: 'Citra' },
    { id: 'TRX-003', resi: 'JNT-001122', status: 'tiba', pelanggan: 'Doni' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl font-semibold text-text-main">
        Manajemen Pengiriman
      </h1>

      <div className="bg-content-bg shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-text-main mb-4">Lacak Pesanan</h2>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-text-subtle" />
            </span>
            <input 
              type="text" 
              placeholder="Masukkan Nomor Resi..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-main bg-slate-50 focus:border-theme-primary"
            />
          </div>
          <button className="bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2 px-6 rounded-lg w-full md:w-auto">
            Lacak
          </button>
        </div>
        
        <div className="mt-6 border-t border-border-main pt-6">
          <h3 className="text-base md:text-lg font-semibold">Hasil: {trackingInfo.resi}</h3>
          <p className="text-text-muted text-sm md:text-base">Estimasi Tiba: {trackingInfo.estimasi}</p>
          <div className="mt-4">
            <StatusStepper status={trackingInfo.status} />
          </div>
        </div>
      </div>

      <div className="bg-content-bg shadow-md rounded-lg overflow-hidden">
        <h2 className="text-lg md:text-xl font-semibold text-text-main p-4 md:p-6">Daftar Pengiriman Aktif</h2>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">No. Resi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-border-main">
              {daftarPengiriman.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-primary">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{item.resi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{item.pelanggan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'tiba' ? 'bg-green-100 text-green-800' : item.status === 'perjalanan' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3 p-3">
          {daftarPengiriman.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 space-y-1 shadow-sm active:scale-[.98]">
              <p className="text-theme-primary font-semibold text-sm">{item.id}</p>
              <p className="text-sm text-text-main">{item.resi}</p>
              <p className="text-sm text-text-muted">{item.pelanggan}</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'tiba' ? 'bg-green-100 text-green-800' : item.status === 'perjalanan' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pengiriman;
