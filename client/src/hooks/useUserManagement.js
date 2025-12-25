import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { withCredentials: true };
      const [adminStaffRes, customerRes] = await Promise.all([
        axios.get(`${API_URL}/users/adminstaff`, config),
        axios.get(`${API_URL}/users/customer`, config)
      ]);
      
      const combinedUsers = [
        ...adminStaffRes.data.data,
        ...customerRes.data.data
      ];
      setUsers(combinedUsers);
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      setError(message);
      toast.error(`Gagal mengambil data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const addUser = async (userData) => {
    try {
      await axios.post(`${API_URL}/users`, userData, {
        withCredentials: true,
      });
      toast.success('User berhasil ditambahkan!');
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menambah: ${message}`);
      throw new Error(message);
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await axios.put(`${API_URL}/users/${id}`, userData, {
        withCredentials: true,
      });
      toast.success('User berhasil diperbarui!');
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal memperbarui: ${message}`);
      throw new Error(message);
    }
  };

  const deleteUser = async (id, role) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }
    
    const deleteUrl = role === 'customer'
      ? `${API_URL}/users/customer/${id}`
      : `${API_URL}/users/adminstaff/${id}`;
      
    try {
      await axios.delete(deleteUrl, {
        withCredentials: true,
      });
      toast.success('User berhasil dihapus!');
      fetchUsers();
    } catch (err) {
      const message = err.response?.data?.meta?.message || err.message;
      toast.error(`Gagal menghapus: ${message}`);
    }
  };

  return {
    users,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
  };
};