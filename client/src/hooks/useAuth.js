import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const redirectByRole = useCallback(
    (role) => {
      if (role === "admin" || role === "staff") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },
    [navigate]
  );

  const handleError = useCallback((error, defaultMsg) => {
    const msg = error.response?.data?.meta?.message || defaultMsg;
    toast.error(msg);
    throw error;
  }, []);

  // 1. LOGIN
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        if (res?.data?.data?.user) {
          const user = res.data.data.user;
          localStorage.setItem("user", JSON.stringify(user));

          // PERBAIKAN: Gunakan 'is_email_verified' (boolean) sesuai DB
          // Karena di DB tipe BOOLEAN, cek !user.is_email_verified
          if (!user.is_email_verified) {
            navigate("/verify");
            toast("Silakan verifikasi email Anda.", { icon: "ℹ️" });
          } else {
            redirectByRole(user.role);
          }
        }
        return res.data;
      } catch (error) {
        handleError(error, "Login gagal");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, navigate, redirectByRole, handleError]
  );

  // 2. REGISTER
  const register = useCallback(
    async (name, email, password) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/users/register`,
          { name, email, password },
          { withCredentials: true }
        );

        if (res?.data?.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.data.user));
          toast.success("Registrasi berhasil! Silakan verifikasi email.");
          navigate("/verify");
        }
        return res.data;
      } catch (error) {
        handleError(error, "Registrasi gagal");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, navigate, handleError]
  );

  // 3. VERIFY OTP
  const verifyOTP = useCallback(
    async (otp) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${API_URL}/auth/verify-email`,
          { otp },
          { withCredentials: true }
        );

        // Cek apakah data user ada di response
        if (res.data?.data?.user) {
          const user = res.data.data.user;
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Email terverifikasi!");

          if (["admin", "staff"].includes(user.role)) {
            navigate("/admin", { replace: true });
          } else {
            navigate("/complete-profile", { replace: true });
          }
        }
        return res.data;
      } catch (error) {
        handleError(error, "Kode OTP salah");
      } finally {
        setLoading(false);
      }
    },
    [API_URL, navigate, handleError]
  );

  // 4. GET ME
  const getMe = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });
      if (res.data?.data) {
        localStorage.setItem("user", JSON.stringify(res.data.data));
        return res.data.data;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
      }
    }
  }, [API_URL]);

  // 5. LOGOUT
  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.warn("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [API_URL, navigate]);

  // 6. RESEND OTP
  const resendOTP = useCallback(async () => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/auth/resend-verification`,
        {},
        { withCredentials: true }
      );
      toast.success("OTP dikirim ulang");
    } catch (error) {
      handleError(error, "Gagal kirim ulang OTP");
    } finally {
      setLoading(false);
    }
  }, [API_URL, handleError]);

  // 7. FINALIZE PROFILE
  const finalizeProfileCompletion = useCallback(async () => {
    try {
      await getMe();
      toast.success("Profil lengkap!");
      navigate("/", { replace: true });
    } catch (error) {
      navigate("/");
    }
  }, [getMe, navigate]);

  // 1. REQUEST LINK RESET PASSWORD
  const forgotPassword = useCallback(
    async (email) => {
      try {
        setLoading(true);
        await axios.post(`${API_URL}/auth/forgot-password`, { email });
        toast.success("Link reset password telah dikirim ke email Anda.");
        return true;
      } catch (error) {
        const msg =
          error.response?.data?.meta?.message || "Gagal memproses permintaan";
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // 2. EKSEKUSI RESET PASSWORD (TOKEN DARI URL)
  const resetPassword = useCallback(
    async (token, newPassword) => {
      try {
        setLoading(true);
        await axios.post(`${API_URL}/auth/reset-password`, {
          token,
          newPassword,
        });

        toast.success("Password berhasil diubah! Silakan login.");
        navigate("/login", { replace: true });
        return true;
      } catch (error) {
        const msg =
          error.response?.data?.meta?.message ||
          "Gagal mengubah password atau link expired";
        toast.error(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [API_URL, navigate]
  );
  
  return {
    login,
    register,
    verifyOTP,
    getMe,
    logout,
    resendOTP,
    finalizeProfileCompletion,
    forgotPassword,
    resetPassword,
    loading,
  };
}
