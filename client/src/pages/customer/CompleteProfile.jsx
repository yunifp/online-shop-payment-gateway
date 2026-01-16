import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useShipping from "../../hooks/useShipping"; 
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // State User (Hanya untuk mengambil nama default)
  const [user] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  // Hook Shipping (RajaOngkir)
  const {
    provinces,
    cities,
    districts,
    subDistricts,
    getProvinces,
    getCities,
    getDistricts,
    getSubDistricts,
    loading: shippingLoading,
  } = useShipping();

  // State Alamat Lengkap (Termasuk Phone Number)
  const [addressData, setAddressData] = useState({
    province_id: "",
    province_name: "",
    city_id: "",
    city_name: "",
    district_id: "",
    district_name: "",
    sub_district_id: "",
    sub_district_name: "",
    street: "",
    details: "",
    postal_code: "",
    phone_number: "", // Disimpan di state alamat, bukan user
  });

  const [loading, setLoading] = useState(false);

  // Load Provinces saat mount
  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  // --- HANDLER DROPDOWN ---
  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const selected = provinces.find(p => String(p.id) === String(id));
    
    setAddressData(prev => ({
      ...prev,
      province_id: id,
      province_name: selected ? selected.name : "",
      city_id: "", city_name: "", district_id: "", district_name: "", sub_district_id: "", sub_district_name: ""
    }));
    getCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const selected = cities.find(c => String(c.id) === String(id));
    
    setAddressData(prev => ({
      ...prev,
      city_id: id,
      city_name: selected ? selected.name : "",
      district_id: "", district_name: "", sub_district_id: "", sub_district_name: ""
    }));
    getDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const selected = districts.find(d => String(d.id) === String(id));
    
    setAddressData(prev => ({
      ...prev,
      district_id: id,
      district_name: selected ? selected.name : "",
      sub_district_id: "", sub_district_name: ""
    }));
    getSubDistricts(id);
  };

  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const selected = subDistricts.find(sd => String(sd.id) === String(id));
    
    setAddressData(prev => ({
      ...prev,
      sub_district_id: id,
      sub_district_name: selected ? selected.name : ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PERUBAHAN: Tidak ada update ke tabel Users (axios.put dihapus)

      // 2. Buat Alamat Baru
      const payloadAddress = {
        ...addressData,
        full_address: addressData.street, // Mapping street -> full_address
        recipient_name: user.name,        // Default nama user
        recipient_phone: addressData.phone_number, // Mapping ke recipient_phone (Tabel Addresses)
        is_primary: true,
        is_default: true,
      };

      await axios.post(`${API_URL}/addresses`, payloadAddress, {
        withCredentials: true,
      });

      toast.success("Profil berhasil dilengkapi!");

      // Update local storage user (flag only)
      const updatedUser = { ...user, is_completed: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.meta?.message || "Gagal menyimpan data";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              One more step to complete your profile
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Fill your contact and delivery address details below. 
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Bagian Kontak Penerima */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number/WhatsApp
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 08123456789"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-theme-primary focus:border-theme-primary outline-none"
                    value={addressData.phone_number}
                    onChange={(e) => setAddressData({...addressData, phone_number: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Bagian Alamat */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Provinsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Province</label>
                  <select
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-theme-primary focus:border-theme-primary sm:text-sm rounded-md"
                    value={addressData.province_id}
                    onChange={handleProvinceChange}
                  >
                    <option value="">Select Province</option>
                    {Array.isArray(provinces) && provinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">City/Regency</label>
                  <select
                    required
                    disabled={!addressData.province_id}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-theme-primary focus:border-theme-primary sm:text-sm rounded-md disabled:bg-gray-100"
                    value={addressData.city_id}
                    onChange={handleCityChange}
                  >
                    <option value="">Select City</option>
                    {Array.isArray(cities) && cities.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kecamatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <select
                    required
                    disabled={!addressData.city_id}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-theme-primary focus:border-theme-primary sm:text-sm rounded-md disabled:bg-gray-100"
                    value={addressData.district_id}
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select District</option>
                    {Array.isArray(districts) && districts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Kelurahan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sub-District</label>
                  <select
                    disabled={!addressData.district_id}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-theme-primary focus:border-theme-primary sm:text-sm rounded-md disabled:bg-gray-100"
                    value={addressData.sub_district_id}
                    onChange={handleSubDistrictChange}
                  >
                    <option value="">Select Sub-District</option>
                    {Array.isArray(subDistricts) && subDistricts.map((sd) => (
                      <option key={sd.id} value={sd.id}>{sd.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detail Jalan */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Full Address (Street, House Number, RT/RW)
                </label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-theme-primary focus:border-theme-primary sm:text-sm outline-none"
                  placeholder="Jl. Merbabu No. 123, RT 01/RW 02"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                ></textarea>
              </div>

              {/* Grid Detail Lain & Kode Pos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Landmark / Other Details
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-theme-primary focus:border-theme-primary sm:text-sm outline-none"
                    placeholder="Pagar hitam, sebelah warung"
                    value={addressData.details}
                    onChange={(e) => setAddressData({ ...addressData, details: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-theme-primary focus:border-theme-primary sm:text-sm outline-none"
                    placeholder="40123"
                    value={addressData.postal_code}
                    onChange={(e) => setAddressData({ ...addressData, postal_code: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                disabled={loading || shippingLoading}
                className="w-full flex items-center justify-center bg-theme-primary text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-theme-primary-dark transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Menyimpan Data..." : "Simpan & Lanjutkan Belanja"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}