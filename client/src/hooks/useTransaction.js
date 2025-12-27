import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    total_data: 0,
    total_page: 0,
    current_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fokus utama: Get All Data dengan params (status, page, search)
  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Params akan dikonversi menjadi query string (misal: ?status=paid&page=1)
      const res = await axios.get(`${API_URL}/transactions`, {
        params, 
        withCredentials: true,
      });
      
      setTransactions(res.data.data.data);
      setPagination({
        total_data: res.data.data.total_data,
        total_page: res.data.data.total_page,
        current_page: res.data.data.current_page,
      });
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      // Opsional: toast.error bisa dihilangkan jika ingin handle error di UI saja
      console.error(`Gagal mengambil data transaksi: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const updateTransactionStatus = async (id, status, shipping_receipt_number = null) => {
    try {
      const payload = { status };
      if (shipping_receipt_number) {
        payload.shipping_receipt_number = shipping_receipt_number;
      }

      await axios.put(`${API_URL}/transactions/${id}/status`, payload, {
        withCredentials: true,
      });
      
      toast.success('Status transaksi berhasil diperbarui!');
      return true;
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memperbarui status: ${message}`);
      throw new Error(message);
    }
  };

  return {
    transactions,
    pagination,
    loading,
    error,
    fetchTransactions,
    updateTransactionStatus,
  };
};