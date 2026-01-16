import React, { useState, useEffect } from 'react';
import { X, MapPin, Truck, CreditCard, AlertCircle, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Hooks
import useAddress from '../hooks/useAddress';
import useShipping from '../hooks/useShipping';
import useShopAddress from '../hooks/useShopAddress';
import { useTransaction } from '../hooks/useTransaction';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const CheckoutModal = ({ isOpen, onClose, cart, appliedVoucher, discountAmount }) => {
  const navigate = useNavigate();
  
  // --- HOOKS ---
  const { getAddress, loading: addressLoading } = useAddress();
  const { shopAddresses, refresh: fetchShopAddresses, loading: shopLoading } = useShopAddress(); 
  const { calculateCost, shippingCosts, loading: shippingLoading, setShippingCosts } = useShipping();
  const { createTransaction, loading: trxLoading } = useTransaction();

  // --- STATE ---
  const [address, setAddress] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // State lokal untuk memastikan loading awal berjalan mulus
  const [isInitializing, setIsInitializing] = useState(true);

  const shopAddress = shopAddresses && shopAddresses.length > 0 ? shopAddresses[0] : null;

  // --- EFFECT: INIT DATA SAAT MODAL DIBUKA ---
  useEffect(() => {
    if (isOpen) {
      // 1. Reset state & Set Loading Awal
      setIsInitializing(true);
      setShippingCosts([]);
      setSelectedOption(null);
      
      const initData = async () => {
        try {
          // 2. Fetch Data Paralel/Sequential
          // Refresh alamat toko
          if (fetchShopAddresses) await fetchShopAddresses();

          // Fetch alamat user
          const addrs = await getAddress();
          
          if (addrs && addrs.length > 0) {
            // Cari alamat utama atau ambil yang pertama
            const primary = addrs.find(a => a.is_primary || a.is_default) || addrs[0];
            setAddress(primary);
            
            // Hitung ongkir otomatis jika wilayah user lengkap
            if (primary.district_id) {
               await calculateCost(); 
            } else {
               toast.error("Shipping address is incomplete. Please edit your address.");
            }
          } else {
            setAddress(null);
          }
        } catch (error) {
          console.error("Error init checkout:", error);
        } finally {
          // 3. Matikan Loading setelah semua selesai
          setIsInitializing(false);
        }
      };
      
      initData();
    }
  }, [isOpen]); 

  // --- HANDLERS ---
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const handlePay = async () => {
    if (!address) return toast.error("Shipping address is required");
    if (!selectedOption) return toast.error("Please select a shipping service");

    const payload = {
      voucher_code: appliedVoucher?.code || null,
      shipping_code: selectedOption.code, 
      shipping_service: selectedOption.service,
      shipping_cost: selectedOption.cost,
    };

    try {
      const res = await createTransaction(payload);
      const transactionData = res.data?.transaction;
      const token = transactionData?.midtrans_token;

      if (token) {
        onClose();
        navigate('/payment', { state: { token: token, transaction: transactionData } });
      } else {
        toast.error("Failed to retrieve payment token");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const subtotal = Number(cart?.subtotal) || 0;
  const shippingCost = selectedOption ? (selectedOption.cost || 0) : 0;
  const grandTotal = subtotal + shippingCost - discountAmount;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={20} /> Checkout & Shipping
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* CONTENT SCROLLABLE */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Section 1: Dikirim dari (Info Toko) */}
          <section className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Store size={18} className="text-blue-600" /> Shipped From
            </h3>
            
            {(isInitializing || shopLoading) ? (
              <div className="animate-pulse h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">Loading Shop Info...</div>
            ) : shopAddress ? (
              <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg relative">
                <p className="font-bold text-gray-800">{shopAddress.label}</p>
                <p className="text-sm text-gray-600 mt-1">{shopAddress.full_address}</p>
                <p className="text-sm text-gray-600">
                  {shopAddress.sub_district_name}, {shopAddress.district_name}, {shopAddress.city_name}, {shopAddress.province_name} {shopAddress.postal_code}
                </p>
                {shopAddress.phone_number && (
                  <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                    📞 {shopAddress.phone_number}
                  </p>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-500">
                Shop information is not available.
              </div>
            )}
          </section>

          {/* Section 2: Alamat Pengiriman (Info User) */}
          <section className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-green-600" /> Shipping Address
            </h3>
            
            {/* Menggunakan isInitializing untuk mencegah 'Empty State' muncul duluan */}
            {(isInitializing || addressLoading) ? (
              <div className="animate-pulse h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">Loading Your Address...</div>
            ) : address ? (
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg relative">
                 <div className="absolute top-4 right-4 text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">Primary</div>
                <p className="font-bold text-gray-800">{address.recipient_name} <span className="text-gray-500 font-normal">({address.recipient_phone || address.phone_number})</span></p>
                <p className="text-sm text-gray-600 mt-1">{address.full_address}</p>
                <p className="text-sm text-gray-600">
                  {address.sub_district_name}, {address.district_name}, {address.city_name}, {address.province_name} {address.postal_code}
                </p>
                {address.details && <p className="text-gray-800 text-sm font-medium mt-1">({address.details})</p>}
              </div>
            ) : (
              <div className="border border-red-200 bg-red-50 p-4 rounded-lg text-center">
                <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-red-600 text-sm font-medium mb-3">You don't have a primary shipping address.</p>
                <button 
                  onClick={() => { onClose(); navigate('/customer/profil'); }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 shadow-sm"
                >
                  Add Address
                </button>
              </div>
            )}
          </section>

          {/* Section 3: Opsi Pengiriman */}
          {address && (
            <section className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Truck size={18} /> Select Courier
              </h3>

              {shippingLoading && (
                 <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg animate-pulse border border-gray-100">
                   <div className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                   <p className="text-sm">Calculating shipping rates...</p>
                 </div>
              )}
              
              {!shippingLoading && shippingCosts.length === 0 && (
                <div className="p-4 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm">Failed to load shipping costs or route unavailable.</p>
                  <button onClick={() => calculateCost()} className="mt-2 text-sm underline hover:text-red-700 font-medium">Try Again</button>
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
                            <p className="font-bold text-gray-800 uppercase text-sm">
                              {option.name} <span className="text-blue-600">- {option.service}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {option.description} • Estimate: {option.etd} Days
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-gray-700">{formatCurrency(option.cost)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Section 4: Ringkasan Biaya */}
          <section className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Price ({cart?.items?.length} items)</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping Cost</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            {discountAmount > 0 && (
               <div className="flex justify-between text-sm text-green-600">
                 <span>Voucher Discount</span>
                 <span>- {formatCurrency(discountAmount)}</span>
               </div>
            )}
            <div className="border-t border-gray-300 my-2 pt-2 flex justify-between items-center">
               <span className="font-bold text-gray-800">Total Payment</span>
               <span className="font-bold text-xl text-blue-600">{formatCurrency(grandTotal)}</span>
            </div>
          </section>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handlePay}
            disabled={trxLoading || !selectedOption || !address}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {trxLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;