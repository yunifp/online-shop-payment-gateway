import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useAddress() {
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. GET ADDRESS
  const getAddress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/addresses`, { withCredentials: true });
      
      const responseData = res.data?.data;

      // PERBAIKAN: Handle jika data adalah Array atau Object
      if (responseData) {
        if (Array.isArray(responseData)) {
          return responseData; // Jika sudah array, kembalikan langsung
        } else if (typeof responseData === 'object') {
          return [responseData]; // Jika object tunggal, bungkus dalam array
        }
      }
      
      return [];
    } catch (error) {
      console.error("Gagal ambil alamat:", error);
      return []; 
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. ADD ADDRESS
  const addAddress = useCallback(async (data) => {
    try {
      setLoading(true);
      
      // Normalisasi payload agar sesuai database
      const payload = {
        ...data,
        full_address: data.street, 
        recipient_phone: data.phone_number 
      };

      await axios.post(`${API_URL}/addresses`, payload, { withCredentials: true });
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