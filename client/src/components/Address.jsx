import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Edit2, Plus, ShieldCheck } from 'lucide-react';
import useAddress from '../hooks/useAddress'; // Import Hook

const Address = ({ onEdit }) => {
  const { getAddress } = useAddress(); // Gunakan Hook
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Alamat
  const fetchAddress = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAddress();
      
      if (data && data.length > 0) {
        // Cari alamat utama (is_default/is_primary) atau ambil yg pertama
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

  // Fetch saat component di-mount
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
          Alamat Pengiriman Utama
        </h3>
        
        <button 
          // Kirim data address ke parent saat tombol diklik
          onClick={() => onEdit(address)}
          className="text-sm font-medium flex items-center text-theme-primary hover:text-theme-primary-dark transition-colors"
        >
          {address ? (
            <><Edit2 size={16} className="mr-1" /> Ubah Alamat</>
          ) : (
            <><Plus size={16} className="mr-1" /> Tambah Alamat</>
          )}
        </button>
      </div>

      {address ? (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative animate-in fade-in duration-300">
           <div className="absolute top-4 right-4 text-theme-primary flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-theme-primary/20">
              <ShieldCheck size={16} /> <span className="text-xs font-bold">Utama</span>
           </div>

           {/* Baris 1: Penerima & Kontak */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Penerima</p>
                  <p className="font-semibold text-gray-900">{address.recipient_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kontak</p>
                  <p className="font-semibold text-gray-900">{address.recipient_phone || address.phone_number}</p>
              </div>
           </div>

           <div className="h-px bg-gray-200 my-4"></div>

           {/* Baris 2: Wilayah */}
           <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Provinsi</p>
                  <p className="text-gray-800 text-sm font-medium">{address.province_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kota/Kab.</p>
                  <p className="text-gray-800 text-sm font-medium">{address.city_name}</p>
              </div>
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kecamatan</p>
                  <p className="text-gray-800 text-sm font-medium">{address.district_name || address.subdistrict_name}</p>
              </div>
              
              {/* Tampilkan Kelurahan jika ada */}
              {(address.sub_district_name || address.kelurahan) && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kelurahan</p>
                    <p className="text-gray-800 text-sm font-medium">{address.sub_district_name || address.kelurahan}</p>
                </div>
              )}
           </div>

           {/* Baris 3: Alamat Lengkap */}
           <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Alamat Lengkap</p>
              <p className="text-gray-800 text-sm leading-relaxed bg-white p-2 rounded border border-gray-100">
                  {address.full_address || address.street}
              </p>
           </div>

           {/* Baris 4: Detail & Kode Pos */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {address.details && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Patokan / Detail</p>
                    <p className="text-gray-800 text-sm font-medium">{address.details}</p>
                </div>
              )}
              
              <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Kode Pos</p>
                  <p className="text-gray-800 text-sm font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {address.postal_code || '-'}
                  </p>
              </div>
           </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm italic">Belum ada alamat tersimpan.</p>
        </div>
      )}
    </div>
  );
};

export default Address;