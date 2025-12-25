import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useVoucher } from '../../hooks/useVoucher';
import VoucherModal from '../../components/VoucherModal';
import { Toaster } from 'react-hot-toast';

const formatCurrency = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

const formatVoucherValue = (voucher) => {
  if (voucher.type === 'percentage') {
    return `${parseFloat(voucher.value)}%`;
  }
  return formatCurrency(voucher.value);
};

const getVoucherStatus = (voucher) => {
  const now = new Date();
  const endDate = new Date(voucher.end_date);
  
  if (!voucher.is_active) {
    return { text: 'Tidak Aktif', color: 'bg-red-100 text-red-800' };
  }
  if (endDate < now) {
    return { text: 'Kedaluwarsa', color: 'bg-yellow-100 text-yellow-800' };
  }
  return { text: 'Aktif', color: 'bg-green-100 text-green-800' };
};

const Voucher = () => {
  const { vouchers, loading, error, addVoucher, updateVoucher, deleteVoucher } = useVoucher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const handleOpenModal = (voucher = null) => {
    setCurrentVoucher(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentVoucher(null);
  };

  const handleSave = async (formData) => {
    try {
      if (currentVoucher) {
        await updateVoucher(currentVoucher.id, formData);
      } else {
        await addVoucher(formData);
      }
      handleCloseModal();
    } catch (err) {
      // Biarkan hook `useVoucher` yang menampilkan toast error
    }
  };
  
  const handleDelete = (id) => {
    deleteVoucher(id);
  };

  return (
    <>
      <Toaster position="top-right" />
    
      <div className="bg-content-bg shadow-xl rounded-xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-text-main">Manajemen Voucher</h1>
          <button
            onClick={() => handleOpenModal(null)}
            className="flex items-center bg-theme-primary hover:bg-theme-primary-dark text-white font-medium py-2 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <FaPlus className="mr-2" />
            Tambah Voucher
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border-main">
          <table className="min-w-full divide-y divide-border-main">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Kode Voucher
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Nilai
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-content-bg divide-y divide-border-main">
              {loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-text-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                    Error: {error}
                  </td>
                </tr>
              )}
              {!loading && !error && vouchers.map((voucher) => {
                const status = getVoucherStatus(voucher);
                return (
                  <tr key={voucher.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-text-main">{voucher.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-muted">
                        {voucher.type === 'percentage' ? 'Persentase' : 'Potongan Tetap'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-text-muted">{formatVoucherValue(voucher)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleOpenModal(voucher)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-150 p-2 rounded-full hover:bg-blue-100"
                        title="Edit"
                      >
                        <FaPencilAlt size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-150 p-2 rounded-full hover:bg-red-100"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <VoucherModal
          voucher={currentVoucher}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default Voucher;