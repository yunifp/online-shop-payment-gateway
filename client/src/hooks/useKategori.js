import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useKategori = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data.data);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      toast.error(`Gagal mengambil data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (categoryData) => {
    if (!categoryData.name || !categoryData.slug) {
      toast.error('Nama dan Slug wajib diisi');
      return;
    }
    
    try {
      await axios.post(`${API_URL}/categories`, categoryData, {
        withCredentials: true,
      });
      toast.success('Kategori berhasil ditambahkan!');
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menambah: ${message}`);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      await axios.put(`${API_URL}/categories/${id}`, categoryData, {
        withCredentials: true,
      });
      toast.success('Kategori berhasil diperbarui!');
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memperbarui: ${message}`);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_URL}/categories/${id}`, {
        withCredentials: true,
      });
      toast.success('Kategori berhasil dihapus!');
      fetchCategories();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menghapus: ${message}`);
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};