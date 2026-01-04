import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Mail, Phone, MapPin, Edit2, LogOut, 
  Camera, Save, X, ShieldCheck, AlertTriangle, Plus 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useAddress from '../../hooks/useAddress';
import axios from 'axios';
import AddressEditModal from '../../components/AddressEditModal'; // Pastikan file ini ada

const CustomerProfile = () => {
  const { getMe, logout } = useAuth();
  const { getAddress } = useAddress();
  const API_URL = import.meta.env.VITE_API_URL;

  // State Data
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  
  // State UI
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // State Modal Alamat
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Form State untuk Edit Profil
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
  });

  // 1. Fetch Data
  const fetchData = useCallback(async () => {
    try {
      // Fetch User
      const userData = await getMe();
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          phone_number: userData.phone_number || '',
        });
      }

      // Fetch Address
      const addressData = await getAddress();
      if (addressData && addressData.length > 0) {
        // Ambil alamat utama (is_primary) atau yang pertama
        const primary = addressData.find(a => a.is_primary) || addressData[0];
        setAddress(primary);
      } else {
        setAddress(null);
      }

    } catch (error) {
      console.error("Gagal memuat profil:", error);
    }
  }, [getMe, getAddress]);

  // 2. Initial Mount
  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  // 3. Handle Update Profile (Data Diri)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `${API_URL}/users/customer/${user.id}`,
        {
          name: formData.name,
          phone_number: formData.phone_number
        },
        { withCredentials: true }
      );
      toast.success("Profil berhasil diperbarui!");
      setUser(prev => ({ ...prev, ...formData }));
      setIsEditing(false);
    } catch (error) {
      const msg = error.response?.data?.meta?.message || "Gagal memperbarui profil";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      await logout();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 text-sm mt-1">Kelola informasi akun dan alamat pengiriman Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- KOLOM KIRI: Ringkasan & Menu --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-theme-primary/10 to-theme-primary/5 z-0"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-theme-primary overflow-hidden">
                   {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
                </div>
                {/* Tombol Kamera (UI Only) */}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-theme-primary text-white p-2 rounded-full shadow-lg hover:bg-theme-primary-dark transition">
                    <Camera size={16} />
                  </button>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user?.email}</p>

              {/* --- PERBAIKAN STATUS VERIFIKASI --- */}
              {/* Mengecek user.is_email_verified (boolean) sesuai database */}
              {user?.is_email_verified ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <ShieldCheck size={14} className="mr-1" />
                  Terverifikasi
                </div>
              ) : (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                  <AlertTriangle size={14} className="mr-1" />
                  Belum Verifikasi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- KOLOM KANAN: Form Edit & Alamat --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Informasi Pribadi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <User size={20} className="mr-2 text-theme-primary" />
                Informasi Pribadi
              </h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-theme-primary hover:text-theme-primary-dark font-medium flex items-center"
                >
                  <Edit2 size={16} className="mr-1" /> Edit Profil
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center"
                >
                  <X size={16} className="mr-1" /> Batal
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></span>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-theme-primary/20' : 'border-transparent bg-gray-50 text-gray-600'} transition-all outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></span>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-transparent bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                  {user?.is_email_verified && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-600 font-medium">Verified</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. HP / WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></span>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="Belum diatur"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-theme-primary/20' : 'border-transparent bg-gray-50 text-gray-600'} transition-all outline-none`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-6 py-2.5 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition shadow-md disabled:opacity-70"
                  >
                    {saving ? 'Menyimpan...' : <><Save size={18} className="mr-2" /> Simpan Perubahan</>}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Card: Alamat Utama */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <MapPin size={20} className="mr-2 text-theme-primary" />
                Alamat Pengiriman Utama
              </h3>
              
              {address ? (
                 <button 
                   onClick={() => setIsAddressModalOpen(true)}
                   className="text-sm text-theme-primary hover:text-theme-primary-dark font-medium flex items-center"
                 >
                   <Edit2 size={16} className="mr-1" /> Ubah Alamat
                 </button>
              ) : (
                <button 
                   onClick={() => setIsAddressModalOpen(true)}
                   className="text-sm text-theme-primary hover:text-theme-primary-dark font-medium flex items-center"
                 >
                   <Plus size={16} className="mr-1" /> Tambah Alamat
                 </button>
              )}
            </div>

            {address ? (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                 <div className="absolute top-4 right-4 text-theme-primary">
                    <ShieldCheck size={20} className="text-theme-primary" />
                 </div>
                 <p className="font-semibold text-gray-900 mb-1">{address.recipient_name} <span className="text-gray-400 font-normal">| {address.phone_number}</span></p>
                 <p className="text-gray-600 text-sm leading-relaxed">
                   {address.street}, {address.details && `(${address.details})`}
                   <br />
                   {address.subdistrict_name}, {address.city_name}
                   <br />
                   {address.province_name} - {address.postal_code || 'Kode Pos -'}
                 </p>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 text-sm">Belum ada alamat tersimpan.</p>
                <button 
                   onClick={() => setIsAddressModalOpen(true)}
                   className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-theme-primary hover:bg-theme-primary-dark"
                >
                  <Plus size={16} className="mr-2" /> Tambah Alamat Baru
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- MODAL EDIT ALAMAT --- */}
      {/* Menggunakan AddressEditModal yang sama seperti di CompleteProfile */}
      <AddressEditModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        initialData={address} 
        onSuccess={() => {
          fetchData(); // Refresh data setelah simpan
          setIsAddressModalOpen(false);
        }}
      />
    </div>
  );
};

export default CustomerProfile;