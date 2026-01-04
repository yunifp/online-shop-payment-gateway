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

  // 1. Fetch Transactions (Support Filter & Pagination)
  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
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
      // Optional: console.error jika tidak ingin toast saat load awal gagal
      console.error(`Gagal mengambil data transaksi: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. Create Transaction (Checkout)
  const createTransaction = async (payload) => {
    // Payload harus berisi: address_id, shipping_cost, shipping_service, courier
    // Opsional: voucher_id
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/transactions`, payload, {
        withCredentials: true,
      });
      
      // Biasanya mengembalikan snap_token Midtrans
      toast.success('Pesanan berhasil dibuat!');
      return res.data; 
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Checkout Gagal: ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 3. Update Status (Admin/Staff) - Input Resi
  const updateTransactionStatus = async (id, status, shipping_receipt_number = null) => {
    try {
      setLoading(true);
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
      toast.error(`Gagal update status: ${message}`);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Repay (Bayar Ulang Transaksi Pending/Expired)
  const repayTransaction = async (transactionId) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/transactions/${transactionId}/repay`, {}, {
        withCredentials: true,
      });
      return res.data; // Mengembalikan token snap baru
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memproses pembayaran ulang: ${message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    pagination,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransactionStatus,
    repayTransaction,
  };
};