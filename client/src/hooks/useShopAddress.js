import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useShopAddress() {
  const [shopAddresses, setShopAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchShopAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shop-addresses`, { withCredentials: true });
      setShopAddresses(res.data.data || []);
    } catch (error) {
      console.error("Gagal ambil alamat toko:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchShopAddresses();
  }, [fetchShopAddresses]);

  const addShopAddress = async (data) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/shop-addresses`, data, { withCredentials: true });
      toast.success("Alamat toko berhasil ditambah");
      fetchShopAddresses();
    } catch (error) {
      toast.error(error.response?.data?.meta?.message || "Gagal tambah alamat");
    } finally {
      setLoading(false);
    }
  };

  const updateShopAddress = async (id, data) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/shop-addresses/${id}`, data, { withCredentials: true });
      toast.success("Alamat toko berhasil diupdate");
      fetchShopAddresses();
    } catch (error) {
      toast.error("Gagal update alamat");
    } finally {
      setLoading(false);
    }
  };

  const deleteShopAddress = async (id) => {
    if(!window.confirm("Hapus alamat ini?")) return;
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/shop-addresses/${id}`, { withCredentials: true });
      toast.success("Alamat dihapus");
      fetchShopAddresses();
    } catch (error) {
      toast.error("Gagal hapus alamat");
    } finally {
      setLoading(false);
    }
  };

  return {
    shopAddresses,
    loading,
    addShopAddress,
    updateShopAddress,
    deleteShopAddress,
    refresh: fetchShopAddresses
  };
}