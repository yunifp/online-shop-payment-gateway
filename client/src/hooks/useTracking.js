import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useTracking = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const getTracking = useCallback(async (orderId) => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setTrackingData(null);
    try {
      const res = await axios.get(`${API_URL}/tracking/order/${orderId}`, {
        withCredentials: true,
      });
      const result = res.data.data;
      setTrackingData(result);
      
      if (result.is_cached) {
         toast('Menampilkan data terakhir (Cached)', { icon: '🕒' });
      } else {
         toast.success('Data pelacakan terbaru berhasil diambil');
      }
    } catch (err) {
      const message = err.response?.data?.meta?.message || 'Gagal melacak paket.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const clearTracking = useCallback(() => {
    setTrackingData(null);
    setError(null);
  }, []);

  return {
    trackingData,
    loading,
    error,
    getTracking,
    clearTracking
  };
};