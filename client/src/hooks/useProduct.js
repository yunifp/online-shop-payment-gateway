import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const useProduk = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data.data);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      toast.error(`Gagal mengambil produk: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/categories`);
      setCategories(res.data.data);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal mengambil kategori: ${message}`);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const addProduct = async (formData) => {
    try {
      await axios.post(`${API_URL}/products`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produk berhasil ditambahkan!');
      fetchProducts();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menambah: ${message}`);
      throw new Error(message);
    }
  };

  const updateProduct = async (id, formData) => {
    try {
      await axios.put(`${API_URL}/products/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Produk berhasil diperbarui!');
      fetchProducts();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memperbarui: ${message}`);
      throw new Error(message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/products/${id}`, {
        withCredentials: true,
      });
      toast.success('Produk berhasil dihapus!');
      fetchProducts();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menghapus: ${message}`);
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    slugify,
  };
};