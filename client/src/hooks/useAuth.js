import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fungsi pembantu untuk redirect sesuai role
  const redirectByRole = (role) => {
    if (role === "admin" || role === "staff") {
      navigate("/admin");
    } else {
      // Role customer diarahkan ke homepage sebagai dashboard-nya
      navigate("/"); 
    }
  };

  const login = async (email, password) => {
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
        redirectByRole(user.role); 
      }
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/users/register`,
        { name, email, password },
        { withCredentials: true }
      );

      if (res?.data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/verify");
      }
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/auth/verify-email`,
        { otp },
        { withCredentials: true }
      );
      if (res.data.success && res.data.data?.user) {
        const user = res.data.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        redirectByRole(user.role); 
      }
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/auth/resend-verification`,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return { login, register, verifyOTP, resendOTP, logout, loading, redirectByRole };
}