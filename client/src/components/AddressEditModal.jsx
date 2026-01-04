import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import useShipping from '../hooks/useShipping';
import useAddress from '../hooks/useAddress';
import { toast } from 'react-hot-toast';

const AddressEditModal = ({ isOpen, onClose, initialData, onSuccess }) => {
  const { 
    provinces, cities, districts, subDistricts,
    getProvinces, getCities, getDistricts, getSubDistricts 
  } = useShipping();
  
  const { addAddress } = useAddress(); 
  
  const [formData, setFormData] = useState({
    province_id: '',
    city_id: '',
    district_id: '',
    sub_district_id: '',
    street: '',
    details: '',
    postal_code: '',
    recipient_name: '',
    phone_number: ''
  });

  const [loading, setLoading] = useState(false);

  // Load Data Wilayah & Isi Form
  useEffect(() => {
    if (isOpen) {
      getProvinces(); // Load provinsi

      if (initialData) {
         // ISI FORM JIKA EDIT
         setFormData({
            province_id: initialData.province_id || '',
            city_id: initialData.city_id || '',
            district_id: initialData.district_id || '',
            sub_district_id: initialData.sub_district_id || '',
            street: initialData.street || '',
            details: initialData.details || '',
            postal_code: initialData.postal_code || '',
            recipient_name: initialData.recipient_name || '',
            phone_number: initialData.phone_number || ''
         });
         // Trigger fetch berjenjang
         if(initialData.province_id) getCities(initialData.province_id);
         if(initialData.city_id) getDistricts(initialData.city_id);
         if(initialData.district_id) getSubDistricts(initialData.district_id);
      } else {
        // RESET FORM JIKA BARU
        setFormData({
            province_id: '', city_id: '', district_id: '', sub_district_id: '',
            street: '', details: '', postal_code: '', recipient_name: '', phone_number: ''
        });
      }
    }
  }, [isOpen, initialData, getProvinces, getCities, getDistricts, getSubDistricts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, is_primary: true };
      // Panggil API simpan
      await addAddress(payload); 
      
      toast.success("Alamat berhasil disimpan!");
      onSuccess(); // Refresh parent & tutup modal
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <MapPin className="mr-2 text-theme-primary" size={20} />
            {initialData ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Penerima */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
               <input type="text"  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">No. HP Penerima</label>
               <input type="text"  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
             </div>
          </div>
          
          <div className="h-px bg-gray-100"></div>

          {/* Wilayah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <select  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.province_id} onChange={(e) => { setFormData({...formData, province_id: e.target.value, city_id: '', district_id: '', sub_district_id: ''}); getCities(e.target.value); }}>
                <option value="">Pilih Provinsi</option>
                {/* SAFE GUARD: Cek array sebelum map */}
                {Array.isArray(provinces) && provinces.map(p => (
                  <option key={p.province_id} value={p.province_id}>{p.province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kota</label>
              <select  disabled={!formData.province_id} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary disabled:bg-gray-100" value={formData.city_id} onChange={(e) => { setFormData({...formData, city_id: e.target.value, district_id: '', sub_district_id: ''}); getDistricts(e.target.value); }}>
                <option value="">Pilih Kota</option>
                {Array.isArray(cities) && cities.map(c => (
                  <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
              <select  disabled={!formData.city_id} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary disabled:bg-gray-100" value={formData.district_id} onChange={(e) => { setFormData({...formData, district_id: e.target.value, sub_district_id: ''}); getSubDistricts(e.target.value); }}>
                <option value="">Pilih Kecamatan</option>
                {Array.isArray(districts) && districts.map(d => (
                  <option key={d.subdistrict_id} value={d.subdistrict_id}>{d.subdistrict_name}</option>
                ))}
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
               <select disabled={!formData.district_id} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary disabled:bg-gray-100" value={formData.sub_district_id} onChange={(e) => setFormData({...formData, sub_district_id: e.target.value})}>
                 <option value="">Pilih Kelurahan</option>
                 {Array.isArray(subDistricts) && subDistricts.map(sd => (
                   <option key={sd.id} value={sd.id}>{sd.name}</option>
                 ))}
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea  rows={2} placeholder="Jl. Mawar No. 123" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Lain</label>
                <input type="text" placeholder="Warna pagar..." className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                <input type="number" placeholder="Kode Pos" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
             <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">Batal</button>
             <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-theme-primary text-white hover:bg-theme-primary-dark font-medium shadow-md">
                {loading ? 'Menyimpan...' : 'Simpan Alamat'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressEditModal;