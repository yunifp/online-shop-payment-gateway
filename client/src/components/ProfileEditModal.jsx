// client/src/components/ProfileEditModal.jsx
import React, { useState } from "react";
import axios from "axios";
import useAddress from "../hooks/useAddress";
import useAuth from "../hooks/useAuth";
import { X, Save, Loader2, AlertCircle } from "lucide-react";

const ProfileEditModal = ({ profile, address, onClose, onRefresh }) => {
  const { saveAddress } = useAddress();
  const { resendOTP, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    recipient_name: address?.recipient_name || profile?.name || "",
    recipient_phone: address?.recipient_phone || "",
    full_address: address?.full_address || "",
    province_id: address?.province_id || "",
    province_name: address?.province_name || "",
    city_id: address?.city_id || "",
    city_name: address?.city_name || "",
    district_id: address?.district_id || "",
    district_name: address?.district_name || "",
    postal_code: address?.postal_code || "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(`${API_URL}/users/${profile.id}`, { name: formData.name }, { withCredentials: true });
      await saveAddress(formData);
      onRefresh();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };    

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[60] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold">Edit Profil & Address</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
          {Number(profile?.isVerified) === 0 && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
              <AlertCircle className="text-orange-500" size={20} />
              <div>
                <p className="text-sm font-bold text-orange-800">Account Not Verified</p>
                <button type="button" onClick={resendOTP} className="text-xs text-orange-600 font-bold hover:underline">
                  {authLoading ? "Sending..." : "Resend verification OTP →"}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-blue-600 font-bold text-xs uppercase tracking-widest">Informasi Account</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Akun" className="w-full border p-3 rounded-xl outline-none" required />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <label className="text-red-500 font-bold text-xs uppercase tracking-widest">Address</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="recipient_name" value={formData.recipient_name} onChange={handleChange} placeholder="Nama Penerima" className="border p-3 rounded-xl" required />
              <input type="text" name="recipient_phone" value={formData.recipient_phone} onChange={handleChange} placeholder="No. Telepon" className="border p-3 rounded-xl" required />
            </div>
            <textarea name="full_address" value={formData.full_address} onChange={handleChange} placeholder="Alamat Lengkap" className="w-full border p-3 rounded-xl h-24" required />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="province_name" value={formData.province_name} onChange={handleChange} placeholder="Provinsi" className="border p-3 rounded-xl" required />
              <input type="number" name="province_id" value={formData.province_id} onChange={handleChange} placeholder="ID Prov" className="border p-3 rounded-xl" required />
              <input type="text" name="city_name" value={formData.city_name} onChange={handleChange} placeholder="Kota" className="border p-3 rounded-xl" required />
              <input type="number" name="city_id" value={formData.city_id} onChange={handleChange} placeholder="ID Kota" className="border p-3 rounded-xl" required />
              <input type="text" name="district_name" value={formData.district_name} onChange={handleChange} placeholder="Kecamatan" className="border p-3 rounded-xl" required />
              <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="Kode Pos" className="border p-3 rounded-xl" required />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border rounded-2xl font-bold text-gray-500">Batal</button>
            <button type="submit" disabled={loading} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20}/>} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;