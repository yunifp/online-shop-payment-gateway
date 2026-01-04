import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/vouchers`, {
        withCredentials: true,
      });
      setVouchers(res.data.data);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      toast.error(`Gagal mengambil data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const addVoucher = async (voucherData) => {
    try {
      await axios.post(`${API_URL}/vouchers`, voucherData, {
        withCredentials: true,
      });
      toast.success('Voucher berhasil ditambahkan!');
      fetchVouchers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menambah: ${message}`);
      throw new Error(message);
    }
  };

  const updateVoucher = async (id, voucherData) => {
    try {
      await axios.put(`${API_URL}/vouchers/${id}`, voucherData, {
        withCredentials: true,
      });
      toast.success('Voucher berhasil diperbarui!');
      fetchVouchers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memperbarui: ${message}`);
      throw new Error(message);
    }
  };

  const deleteVoucher = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus voucher ini?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/vouchers/${id}`, {
        withCredentials: true,
      });
      toast.success('Voucher berhasil dihapus!');
      fetchVouchers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menghapus: ${message}`);
    }
  };

  return {
    vouchers,
    loading,
    error,
    addVoucher,
    updateVoucher,
    deleteVoucher,
  };
};