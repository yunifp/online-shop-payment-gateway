import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useShipping from "../../hooks/useShipping"; // Pastikan hook ini dibuat (dari jawaban sebelumnya)
import axios from "axios";
import { toast } from "react-hot-toast";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // State User
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  // State Alamat
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

  const [addressData, setAddressData] = useState({
    province_id: "",
    city_id: "",
    district_id: "",
    sub_district_id: "",
    street: "",
    details: "", // Patokan/Detail
  });

  const [loading, setLoading] = useState(false);

  // Load Provinces saat mount
  useEffect(() => {
    getProvinces();
  }, [getProvinces]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update Profile User (Nomor HP)
      // Kita pakai endpoint customer update. Sesuaikan ID user.
      await axios.put(
        `${API_URL}/users/customer/${user.id}`,
        { phone_number: phoneNumber },
        { withCredentials: true }
      );

      // 2. Buat Alamat Baru
      // Kita perlu menyusun nama lokasi (Provinsi, Kota, dll) untuk disimpan string-nya juga jika DB butuh string
      // Tapi biasanya endpoint address menerima ID-nya saja atau string-nya.
      // Asumsi endpoint address menerima field sesuai DB.

      const payloadAddress = {
        ...addressData,
        is_primary: true, // Jadikan alamat utama
        recipient_name: user.name,
        phone_number: phoneNumber,
      };

      await axios.post(`${API_URL}/addresses`, payloadAddress, {
        withCredentials: true,
      });

      toast.success("Profil berhasil dilengkapi!");

      // 3. Selesai -> Ke Beranda
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
              Satu langkah lagi!
            </h2>
            <p className="mt-2 text-center text-gray-600">
              Lengkapi data diri dan alamat pengiriman Anda untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Bagian Data Diri */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informasi Kontak
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nama Lengkap
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
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <hr />

            {/* Bagian Alamat */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Alamat Pengiriman Utama
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Provinsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Provinsi
                  </label>
                  <select
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    onChange={(e) => {
                      setAddressData({
                        ...addressData,
                        province_id: e.target.value,
                      });
                      getCities(e.target.value);
                    }}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((p) => (
                      <option key={p.province_id} value={p.province_id}>
                        {p.province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kota */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kota/Kabupaten
                  </label>
                  <select
                    required
                    disabled={!addressData.province_id}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100"
                    onChange={(e) => {
                      setAddressData({
                        ...addressData,
                        city_id: e.target.value,
                      });
                      getDistricts(e.target.value);
                    }}
                  >
                    <option value="">Pilih Kota</option>
                    {cities.map((c) => (
                      <option key={c.city_id} value={c.city_id}>
                        {c.type} {c.city_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kecamatan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Kecamatan
                  </label>
                  <select
                    required
                    disabled={!addressData.city_id}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md disabled:bg-gray-100"
                    onChange={(e) => {
                      setAddressData({
                        ...addressData,
                        district_id: e.target.value,
                      });
                      getSubDistricts(e.target.value);
                    }}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((d) => (
                      <option key={d.subdistrict_id} value={d.subdistrict_id}>
                        {d.subdistrict_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kelurahan (Optional jika API RajaOngkir Basic biasanya cuma sampai Kecamatan) */}
                {/* Jika subDistricts kosong, disable atau hide */}
                {subDistricts.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kelurahan/Desa
                    </label>
                    <select
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      onChange={(e) =>
                        setAddressData({
                          ...addressData,
                          sub_district_id: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih Kelurahan</option>
                      {subDistricts.map((sd) => (
                        <option key={sd.id} value={sd.id}>
                          {sd.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Detail Jalan */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Alamat Lengkap (Jalan, No. Rumah, RT/RW)
                </label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Jl. Merbabu No. 123, RT 01/RW 02"
                  onChange={(e) =>
                    setAddressData({ ...addressData, street: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Patokan / Detail Lainnya
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Pagar hitam, sebelah warung"
                  onChange={(e) =>
                    setAddressData({ ...addressData, details: e.target.value })
                  }
                />
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
