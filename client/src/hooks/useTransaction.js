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
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchMyTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/transactions/history`, {
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
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const createTransaction = async (payload) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/transactions`, payload, {
        withCredentials: true,
      });
      
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

  const repayTransaction = async (transactionId) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/transactions/${transactionId}/repay`, {}, {
        withCredentials: true,
      });
      return res.data;
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
    fetchMyTransactions,
    createTransaction,
    updateTransactionStatus,
    repayTransaction,
  };
};