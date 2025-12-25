import React, { useState, useEffect } from 'react';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '';
  
  const numberValue = parseFloat(value); 
  
  if (isNaN(numberValue) || numberValue === 0) return '';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numberValue); 
};

const parseCurrency = (value) => {
  return value.replace(/[^0-9]/g, '');
};

const formatDateForInput = (isoDate) => {
  if (!isoDate) return '';
  return isoDate.split('T')[0];
};

const VoucherModal = ({ voucher, onClose, onSave }) => {
  const isEditMode = !!voucher;
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    max_discount: '',
    min_purchase: '',
    quota: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const [displayedValue, setDisplayedValue] = useState('');
  const [displayedMaxDiscount, setDisplayedMaxDiscount] = useState('');
  const [displayedMinPurchase, setDisplayedMinPurchase] = useState('');

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        code: voucher.code || '',
        description: voucher.description || '',
        type: voucher.type || 'percentage',
        value: voucher.value || '',
        max_discount: voucher.max_discount || '',
        min_purchase: voucher.min_purchase || '',
        quota: voucher.quota || '',
        start_date: formatDateForInput(voucher.start_date),
        end_date: formatDateForInput(voucher.end_date),
        is_active: voucher.is_active,
      });

      if (voucher.type === 'fixed_amount') {
        setDisplayedValue(formatCurrency(voucher.value));
      } else {
        setDisplayedValue(voucher.value); 
      }
      setDisplayedMaxDiscount(formatCurrency(voucher.max_discount));
      setDisplayedMinPurchase(formatCurrency(voucher.min_purchase));
    }
  }, [voucher, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name === 'type') {
      setFormData((prev) => ({ ...prev, type: val, value: '', max_discount: '' }));
      setDisplayedValue('');
      setDisplayedMaxDiscount('');
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: val }));
  };
  
  const handleCurrencyChange = (e, setter, stateName) => {
    const { value } = e.target;
    const numberValue = parseCurrency(value) || 0;
    setter(formatCurrency(numberValue));
    setFormData((prev) => ({ ...prev, [stateName]: numberValue }));
  };
  
  const handleValueChange = (e) => {
    const { value } = e.target;
    if (formData.type === 'percentage') {
      setDisplayedValue(value);
      setFormData((prev) => ({ ...prev, value: value }));
    } else {
      handleCurrencyChange(e, setDisplayedValue, 'value');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      max_discount: formData.type === 'percentage' ? formData.max_discount : null,
    };
    onSave(dataToSave);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex justify-center items-start z-50 overflow-y-auto py-10">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Edit Voucher' : 'Tambah Voucher'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Voucher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="percentage">Persentase</option>
                <option value="fixed_amount">Potongan Tetap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.type === 'percentage' ? 'Persentase (%)' : 'Jumlah Potongan (Rp)'} <span className="text-red-500">*</span>
              </label>
              <input
                type={formData.type === 'percentage' ? 'number' : 'text'}
                name="value"
                value={displayedValue}
                onChange={handleValueChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            {formData.type === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maks. Potongan (Rp)
                </label>
                <input
                  type="text"
                  name="max_discount"
                  value={displayedMaxDiscount}
                  onChange={(e) => handleCurrencyChange(e, setDisplayedMaxDiscount, 'max_discount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Pembelian (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="min_purchase"
                value={displayedMinPurchase}
                onChange={(e) => handleCurrencyChange(e, setDisplayedMinPurchase, 'min_purchase')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kuota <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quota"
                value={formData.quota}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              id="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-theme-primary border-gray-300 rounded"
            />
            <label
              htmlFor="is_active"
              className="ml-2 block text-sm text-gray-900"
            >
              Aktifkan Voucher
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-theme-primary hover:bg-theme-primary-dark text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherModal;