import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Edit2, Plus } from 'lucide-react';
import useAddress from '../hooks/useAddress';

const Address = ({ onEdit }) => {
  const { getAddress } = useAddress();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAddress = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAddress();
      
      if (data && data.length > 0) {
        // Ambil yang default/primary, atau yang pertama
        const primary = data.find(a => a.is_default || a.is_primary) || data[0];
        setAddress(primary);
      } else {
        setAddress(null);
      }
    } catch (error) {
      console.error("Gagal memuat alamat:", error);
    } finally {
      setLoading(false);
    }
  }, [getAddress]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <MapPin size={20} className="mr-2 text-theme-primary" /> 
          Delivery Address
        </h3>
        
        <button 
          onClick={() => onEdit(address)}
          className="text-sm font-medium flex items-center text-theme-primary hover:text-theme-primary-dark transition-colors"
        >
          {address ? (
            <><Edit2 size={16} className="mr-1" /> Edit Address</>
          ) : (
            <><Plus size={16} className="mr-1" /> Add Address</>
          )}
        </button>
      </div>

      {address ? (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative animate-in fade-in duration-300">
           {/* Baris 1: Penerima & Kontak */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Recipient</p>
                  <p className="font-semibold text-gray-900">{address.recipient_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-semibold text-gray-900">{address.recipient_phone || address.phone_number}</p>
              </div>
           </div>

           <div className="h-px bg-gray-200 my-4"></div>

           {/* Baris 2: Wilayah (Grid 2 kolom agar rapi mencakup Kelurahan) */}
           <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-4">
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Province</p>
                  <p className="text-gray-800 text-sm font-medium">{address.province_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">City/Regency</p>
                  <p className="text-gray-800 text-sm font-medium">{address.city_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">District</p>
                  <p className="text-gray-800 text-sm font-medium">{address.district_name}</p>
              </div>
              
              {/* Tampilkan Kelurahan jika ada */}
              {(address.sub_district_name) && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sub District</p>
                    <p className="text-gray-800 text-sm font-medium">{address.sub_district_name}</p>
                </div>
              )}
           </div>

           {/* Baris 3: Alamat Lengkap */}
           <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Address</p>
              <p className="text-gray-800 text-sm leading-relaxed bg-white p-2 rounded border border-gray-100">
                  {address.full_address || address.street}
              </p>
           </div>

           {/* Baris 4: Detail & Kode Pos */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {address.details && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Detail</p>
                    <p className="text-gray-800 text-sm font-medium">{address.details}</p>
                </div>
              )}
              
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Postal Code</p>
                  <p className="text-gray-800 text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {address.postal_code}
                  </p>
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm italic">No address saved yet.</p>
        </div>
      )}
    </div>
  );
};

export default Address;