import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import {
  User,
  Mail,
  MapPin,
  Edit2,
  LogOut,
  Save,
  X,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAddress from "../../hooks/useAddress";
import axios from "axios";

// Import Komponen Alamat
import Address from "../../components/Address";
import AddressEdit from "../../components/AddressEdit";

const Profile = () => {
  const navigate = useNavigate(); // 2. Inisialisasi navigate
  const { getMe, logout } = useAuth();
  const { getAddress } = useAddress();
  const API_URL = import.meta.env.VITE_API_URL;

  // --- STATE DATA USER ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State Edit Profile (User Info)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "" });

  // --- STATE EDIT ALAMAT ---
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressDataToEdit, setAddressDataToEdit] = useState(null);

  // 1. FETCH USER ONLY
  const fetchUser = useCallback(async () => {
    try {
      const userData = await getMe();
      if (userData) {
        setUser(userData);
        setProfileForm({ name: userData.name || "" });
      }
    } catch (error) {
      console.error("Gagal memuat user:", error);
    }
  }, [getMe]);

  useEffect(() => {
    setLoading(true);
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  // 2. HANDLER: SIMPAN PROFILE
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await axios.put(
        `${API_URL}/users/customer/${user.id}`,
        { name: profileForm.name },
        { withCredentials: true }
      );
      toast.success("Profil berhasil diperbarui!");
      setUser((prev) => ({ ...prev, ...profileForm }));
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Gagal memperbarui profil");
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. HANDLER: KIRIM ULANG VERIFIKASI (BARU)
  const handleResendVerification = async () => {
    const toastId = toast.loading("Mengirim kode verifikasi...");
    try {
      await axios.post(
        `${API_URL}/auth/resend-verification`,
        { email: user.email },
        { withCredentials: true }
      );
      
      toast.success("Kode verifikasi telah dikirim ke email!", { id: toastId });
      // Redirect ke halaman input OTP/Verify
      navigate("/verify");
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.meta?.message || "Gagal mengirim ulang kode";
      toast.error(msg, { id: toastId });
    }
  };

  // 4. HANDLER: MODAL ALAMAT
  const handleEditAddress = (addressData) => {
    setAddressDataToEdit(addressData);
    setIsEditingAddress(true);
  };

  const handleAddressSuccess = () => {
    setIsEditingAddress(false);
    setAddressDataToEdit(null);
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
        <p className="text-gray-500 text-sm mt-1">
          Kelola informasi akun dan alamat pengiriman Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- KOLOM KIRI: Ringkasan User --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-theme-primary/10 to-theme-primary/5 z-0"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md mb-4">
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-theme-primary overflow-hidden">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
              
              {/* STATUS VERIFIKASI EMAIL */}
              {user?.is_email_verified ? (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  <ShieldCheck size={14} className="mr-1" /> Terverifikasi
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <AlertTriangle size={14} className="mr-1" /> Belum Verifikasi
                  </div>
                  {/* TOMBOL DIGANTI DARI LINK KE BUTTON AGAR BISA HIT API */}
                  <button 
                    onClick={handleResendVerification}
                    className="text-xs font-semibold text-theme-primary hover:text-theme-primary-dark hover:underline transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Verifikasi Email Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition duration-200 font-medium"
          >
            <LogOut size={18} /> <span>Keluar Aplikasi</span>
          </button>
        </div>

        {/* --- KOLOM KANAN: Form --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. INFORMASI PRIBADI */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <User size={20} className="mr-2 text-theme-primary" /> Informasi
                Pribadi
              </h3>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`text-sm font-medium flex items-center ${
                  isEditingProfile
                    ? "text-gray-500 hover:text-gray-700"
                    : "text-theme-primary hover:text-theme-primary-dark"
                }`}
              >
                {isEditingProfile ? (
                  <>
                    <X size={16} className="mr-1" /> Batal
                  </>
                ) : (
                  <>
                    <Edit2 size={16} className="mr-1" /> Edit Profil
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    disabled={!isEditingProfile}
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                      isEditingProfile
                        ? "border-gray-300 bg-white focus:ring-2 focus:ring-theme-primary/20"
                        : "border-transparent bg-gray-50 text-gray-600"
                    } transition-all outline-none`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-transparent bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {isEditingProfile && (
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex items-center px-6 py-2.5 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition shadow-md disabled:opacity-70"
                  >
                    {savingProfile ? (
                      "Menyimpan..."
                    ) : (
                      <>
                        <Save size={18} className="mr-2" /> Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* 2. ALAMAT PENGIRIMAN (Conditional Render) */}
          {isEditingAddress ? (
            <AddressEdit
              initialData={addressDataToEdit}
              onCancel={() => setIsEditingAddress(false)}
              onSuccess={handleAddressSuccess}
            />
          ) : (
            <Address onEdit={handleEditAddress} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;