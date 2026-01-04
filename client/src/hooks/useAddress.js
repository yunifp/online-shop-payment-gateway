import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useAddress() {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const getAddress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/addresses`, { withCredentials: true });
      return res.data?.data || [];
    } catch (error) {
      // Silent error atau handle sesuai kebutuhan
      console.error("Gagal ambil alamat:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const addAddress = useCallback(async (data) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/addresses`, data, { withCredentials: true });
      toast.success("Alamat berhasil disimpan");
      return true;
    } catch (error) {
      const msg = error.response?.data?.meta?.message || "Gagal simpan alamat";
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  return {
    getAddress,
    addAddress,
    loading
  };
}