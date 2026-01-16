import React, { useState, useEffect } from 'react';
import { MapPin, X, Save } from 'lucide-react';
import useShipping from '../hooks/useShipping';
import useAddress from '../hooks/useAddress';
import { toast } from 'react-hot-toast';

const AddressEdit = ({ initialData, onCancel, onSuccess }) => {
  const { addAddress } = useAddress();
  
  const { 
    provinces, cities, districts, subDistricts,
    getProvinces, getCities, getDistricts, getSubDistricts 
  } = useShipping();

  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone_number: '',
    street: '',
    details: '',
    postal_code: '',
    
    province_id: '',
    province_name: '',
    city_id: '',
    city_name: '',
    district_id: '',
    district_name: '',
    sub_district_id: '',
    sub_district_name: ''
  });

  // Load Data
  useEffect(() => {
    getProvinces(); 

    if (initialData) {
      setFormData({
        recipient_name: initialData.recipient_name || '',
        phone_number: initialData.recipient_phone || initialData.phone_number || '',
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

      // Trigger fetch untuk dropdown
      if(initialData.province_id) getCities(initialData.province_id);
      if(initialData.city_id) getDistricts(initialData.city_id);
      if(initialData.district_id) getSubDistricts(initialData.district_id);
    }
  }, [initialData, getProvinces, getCities, getDistricts, getSubDistricts]);

  // --- HANDLER CHANGE (Gunakan .id dan .name) ---

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    // Cari object provinsi berdasarkan ID
    const selected = provinces.find(p => String(p.id) === String(id));
    
    setFormData(prev => ({
      ...prev,
      province_id: id,
      province_name: selected ? selected.name : '', // API: name
      city_id: '', city_name: '', district_id: '', district_name: '', sub_district_id: '', sub_district_name: ''
    }));
    getCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const selected = cities.find(c => String(c.id) === String(id));
    
    setFormData(prev => ({
      ...prev,
      city_id: id,
      city_name: selected ? selected.name : '', // API: name
      district_id: '', district_name: '', sub_district_id: '', sub_district_name: ''
    }));
    getDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const selected = districts.find(d => String(d.id) === String(id));
    
    setFormData(prev => ({
      ...prev,
      district_id: id,
      district_name: selected ? selected.name : '', // API: name
      sub_district_id: '', sub_district_name: ''
    }));
    getSubDistricts(id);
  };

  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const selected = subDistricts.find(sd => String(sd.id) === String(id));
    setFormData(prev => ({
      ...prev,
      sub_district_id: id,
      sub_district_name: selected ? selected.name : '' // API: name
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, is_primary: true, is_default: true };
      await addAddress(payload);
      toast.success("Alamat berhasil disimpan!");
      onSuccess(); 
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan alamat");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <MapPin size={20} className="mr-2 text-theme-primary" /> 
          {initialData ? 'Edit Address' : 'Add New Address'}
        </h3>
        <button onClick={onCancel} className="text-sm font-medium flex items-center text-gray-500 hover:text-gray-700">
          <X size={16} className="mr-1" /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
        
        {/* Identitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
             <input type="text" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.recipient_name} onChange={e => setFormData({...formData, recipient_name: e.target.value})} />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Phone</label>
             <input type="number" required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
           </div>
        </div>

        <div className="h-px bg-gray-100"></div>

        {/* Wilayah Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <select required className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white" value={formData.province_id} onChange={handleProvinceChange}>
              <option value="">Pilih Provinsi</option>
              {/* Map menggunakan .id dan .name */}
              {Array.isArray(provinces) && provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City/Regency</label>
            <select required disabled={!formData.province_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.city_id} onChange={handleCityChange}>
              <option value="">Pilih Kota</option>
              {Array.isArray(cities) && cities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <select required disabled={!formData.city_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.district_id} onChange={handleDistrictChange}>
              <option value="">Pilih Kecamatan</option>
              {Array.isArray(districts) && districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Sub District</label>
             <select disabled={!formData.district_id} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary bg-white disabled:bg-gray-100" value={formData.sub_district_id} onChange={handleSubDistrictChange}>
               <option value="">Pilih Kelurahan</option>
               {Array.isArray(subDistricts) && subDistricts.map(sd => (
                 <option key={sd.id} value={sd.id}>{sd.name}</option>
               ))}
             </select>
          </div>
        </div>

        {/* Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <textarea required rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} placeholder="Jl. Mawar No. 10..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input type="number"  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-theme-primary" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="flex items-center px-6 py-2.5 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition shadow-md disabled:opacity-70">
            {saving ? 'Menyimpan...' : <><Save size={18} className="mr-2" /> Save Address</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressEdit;