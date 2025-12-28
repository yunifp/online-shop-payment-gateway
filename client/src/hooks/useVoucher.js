import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Mengambil semua voucher (Backend akan memfilter Active Only untuk Guest/User)
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/vouchers`, {
        withCredentials: true,
      });
      // Pastikan mengakses array data dengan benar sesuai format responseHandler backend
      // Biasanya res.data.data jika pakai responseHandler standar
      const data = res.data.data || res.data; 
      setVouchers(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      // Jangan toast error saat fetch awal (agar tidak mengganggu UX jika user belum login/tidak ada voucher)
      console.error(`Gagal mengambil data voucher: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  return {
    vouchers,
    loading,
    error,
    refreshVouchers: fetchVouchers
  };
};