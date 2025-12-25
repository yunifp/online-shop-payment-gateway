import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if(res?.data?.data?.user){
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
      }
      navigate("/admin");
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return { login, logout, loading };
}
