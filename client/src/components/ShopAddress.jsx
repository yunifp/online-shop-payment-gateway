import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import useShipping from '../hooks/useShipping'; // Hook RajaOngkir yang sudah ada
import { toast } from 'react-hot-toast';

const ShopAddress = ({ isOpen, onClose, initialData, onSubmit, loading }) => {
  // Hook Shipping untuk Dropdown Wilayah
  const { 
    provinces, cities, districts, subDistricts,
    getProvinces, getCities, getDistricts, getSubDistricts 
  } = useShipping();

  const [formData, setFormData] = useState({
    name: '', // Nama Toko / Label Alamat
    phone_number: '',
    street: '',
    details: '',
    postal_code: '',
    
    // Wilayah
    province_id: '',
    province_name: '',
    city_id: '',
    city_name: '',
    district_id: '',
    district_name: '',
    sub_district_id: '',
    sub_district_name: ''
  });

  // Load Data Wilayah & Isi Form saat Edit
  useEffect(() => {
    if (isOpen) {
      getProvinces(); 

      if (initialData) {
        setFormData({
          name: initialData.name || '',
          phone_number: initialData.phone_number || '',
          street: initialData.full_address || initialData.street || '',
          details: initialData.details || '',
          postal_code: initialData.postal_code || '',
          
          province_id: initialData.province_id || '',
          province_name: initialData.province_name || '',
          city_id: initialData.city_id || '',
          city_name: initialData.city_name || '',
          district_id: initialData.district_id || '',
          district_name: initialData.district_name || '',
          sub_district_id: initialData.sub_district_id || '',
          sub_district_name: initialData.sub_district_name || ''
        });

        // Trigger fetch berjenjang
        if(initialData.province_id) getCities(initialData.province_id);
        if(initialData.city_id) getDistricts(initialData.city_id);
        if(initialData.district_id) getSubDistricts(initialData.district_id);
      } else {
        // Reset form jika tambah baru
        setFormData({
            name: '', phone_number: '', street: '', details: '', postal_code: '',
            province_id: '', province_name: '', city_id: '', city_name: '',
            district_id: '', district_name: '', sub_district_id: '', sub_district_name: ''
        });
      }
    }
  }, [isOpen, initialData, getProvinces, getCities, getDistricts, getSubDistricts]);

  // --- HANDLER DROPDOWN (Mirip dengan Customer Profile) ---
  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const selected = provinces.find(p => String(p.id) === String(id));
    setFormData(prev => ({
      ...prev, province_id: id, province_name: selected ? selected.name : '',
      city_id: '', city_name: '', district_id: '', district_name: '', sub_district_id: '', sub_district_name: ''
    }));
    getCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const selected = cities.find(c => String(c.id) === String(id));
    setFormData(prev => ({
      ...prev, city_id: id, city_name: selected ? selected.name : '',
      district_id: '', district_name: '', sub_district_id: '', sub_district_name: ''
    }));
    getDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const selected = districts.find(d => String(d.id) === String(id));
    setFormData(prev => ({
      ...prev, district_id: id, district_name: selected ? selected.name : '',
      sub_district_id: '', sub_district_name: ''
    }));
    getSubDistricts(id);
  };

  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const selected = subDistricts.find(sd => String(sd.id) === String(id));
    setFormData(prev => ({
      ...prev, sub_district_id: id, sub_district_name: selected ? selected.name : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mapping payload agar sesuai dengan backend shopAddress
    const payload = {
        ...formData,
        full_address: formData.street, // Pastikan backend terima full_address atau street
    };
    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <MapPin className="mr-2 text-theme-primary" size={20} />
            {initialData ? 'Edit Alamat Toko' : 'Tambah Alamat Toko'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Identitas Toko */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko / Label</label>
               <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" placeholder="Pusat, Cabang Bandung, dll" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon Toko</label>
               <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
             </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Wilayah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
              <select required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white" value={formData.province_id} onChange={handleProvinceChange}>
                <option value="">Pilih Provinsi</option>
                {Array.isArray(provinces) && provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kota/Kabupaten</label>
              <select required disabled={!formData.province_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.city_id} onChange={handleCityChange}>
                <option value="">Pilih Kota</option>
                {Array.isArray(cities) && cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
              <select required disabled={!formData.city_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.district_id} onChange={handleDistrictChange}>
                <option value="">Pilih Kecamatan</option>
                {Array.isArray(districts) && districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan</label>
               <select disabled={!formData.district_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.sub_district_id} onChange={handleSubDistrictChange}>
                 <option value="">Pilih Kelurahan</option>
                 {Array.isArray(subDistricts) && subDistricts.map(sd => <option key={sd.id} value={sd.id}>{sd.name}</option>)}
               </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea required rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Lain (Patokan)</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kode Pos</label>
                <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
             <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">Batal</button>
             <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-lg bg-theme-primary text-white hover:bg-theme-primary-dark font-medium shadow-md flex items-center">
                {loading ? 'Menyimpan...' : <><Save size={18} className="mr-2" /> Simpan Alamat</>}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopAddress;