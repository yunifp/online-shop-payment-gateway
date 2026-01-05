import React, { useState, useEffect } from 'react';
import { X, MapPin, Truck, CreditCard, AlertCircle } from 'lucide-react';
import useAddress from '../hooks/useAddress';
import useShipping from '../hooks/useShipping';
import { useTransaction } from '../hooks/useTransaction';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const CheckoutModal = ({ isOpen, onClose, cart, appliedVoucher, discountAmount }) => {
  const navigate = useNavigate();
  const { getAddress, loading: addressLoading } = useAddress();
  const { calculateCost, shippingCosts, loading: shippingLoading, setShippingCosts } = useShipping();
  const { createTransaction, loading: trxLoading } = useTransaction();

  const [address, setAddress] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setShippingCosts([]);
      setSelectedOption(null);
      
      const initData = async () => {
        const addrs = await getAddress();
        if (addrs && addrs.length > 0) {
          const primary = addrs.find(a => a.is_primary) || addrs[0];
          setAddress(primary);
          
          if (primary.district_id) {
             await calculateCost(); 
          } else {
             toast.error("Alamat kurang lengkap. Mohon edit alamat.");
          }
        } else {
          setAddress(null);
        }
      };
      
      initData();
    }
  }, [isOpen]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handlePay = async () => {
    if (!address) return toast.error("Alamat pengiriman wajib ada");
    if (!selectedOption) return toast.error("Mohon pilih layanan pengiriman");

    const payload = {
      voucher_code: appliedVoucher?.code || null,
      shipping_code: selectedOption.courier_name || selectedOption.shipment_code,
      shipping_service: selectedOption.service_name || selectedOption.service_type,
      shipping_cost: selectedOption.price || selectedOption.cost,
    };

    try {
      const res = await createTransaction(payload);
      const transactionData = res.data?.transaction;
      const token = transactionData?.midtrans_token;

      if (window.snap && token) {
        window.snap.pay(token, {
          onSuccess: function(result) {
            toast.success("Pembayaran Berhasil!");
            onClose();
            navigate('/customer/pesanan');
          },
          onPending: function(result) {
            toast.success("Menunggu Pembayaran...");
            onClose();
            navigate('/customer/pesanan');
          },
          onError: function(result) {
            toast.error("Pembayaran Error");
          },
          onClose: function() {
            navigate('/customer/pesanan');
          }
        });
      } else {
        toast.error("Gagal memuat sistem pembayaran");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = Number(cart?.subtotal) || 0;
  const shippingCost = selectedOption ? (selectedOption.price || selectedOption.cost || 0) : 0;
  const grandTotal = subtotal + shippingCost - discountAmount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={20} /> Checkout
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <section className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin size={18} /> Alamat Pengiriman
            </h3>
            
            {addressLoading ? (
              <div className="animate-pulse h-20 bg-gray-100 rounded-lg"></div>
            ) : address ? (
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <p className="font-bold text-gray-800">{address.recipient_name} <span className="text-gray-500 font-normal">({address.phone_number})</span></p>
                <p className="text-sm text-gray-600 mt-1">{address.full_address}</p>
                <p className="text-sm text-gray-600">{address.city}, {address.province}, {address.postal_code}</p>
              </div>
            ) : (
              <div className="border border-red-200 bg-red-50 p-4 rounded-lg text-center">
                <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-red-600 text-sm font-medium mb-3">Anda belum memiliki alamat pengiriman.</p>
                <button 
                  onClick={() => { onClose(); navigate('/customer/profil'); }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  Tambah Alamat
                </button>
              </div>
            )}
          </section>

          {address && (
            <section className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Truck size={18} /> Opsi Pengiriman
              </h3>

              {shippingLoading && (
                 <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg animate-pulse">
                   <div className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                   <p>Mencari ongkir terbaik untukmu...</p>
                 </div>
              )}
              
              {!shippingLoading && shippingCosts.length === 0 && (
                <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
                  <p>Gagal memuat ongkir atau rute tidak tersedia.</p>
                  <button onClick={() => calculateCost()} className="mt-2 text-sm underline hover:text-red-700">Coba Lagi</button>
                </div>
              )}

              {!shippingLoading && shippingCosts.length > 0 && (
                <div className="space-y-3">
                  {shippingCosts.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleSelectOption(option)}
                        className={`
                          relative border rounded-lg p-4 cursor-pointer transition-all flex justify-between items-center
                          ${isSelected ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600' : 'border-gray-400'}`}>
                            {isSelected && <div className="w-3 h-3 rounded-full bg-blue-600"></div>}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 uppercase">
                              {option.courier_name} <span className="text-blue-600">- {option.service_name || option.service_type}</span>
                            </p>
                            <p className="text-xs text-gray-500">Estimasi: {option.etd}</p>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-gray-700">{formatCurrency(option.price || option.cost)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          <section className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Harga ({cart?.items?.length} barang)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Ongkos Kirim</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            {discountAmount > 0 && (
               <div className="flex justify-between text-sm text-green-600">
                 <span>Diskon Voucher</span>
                 <span>- {formatCurrency(discountAmount)}</span>
               </div>
            )}
            <div className="border-t border-gray-300 my-2 pt-2 flex justify-between items-center">
               <span className="font-bold text-gray-800">Total Bayar</span>
               <span className="font-bold text-xl text-blue-600">{formatCurrency(grandTotal)}</span>
            </div>
          </section>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={handlePay}
            disabled={trxLoading || !selectedOption || !address}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {trxLoading ? 'Memproses...' : 'Bayar Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;