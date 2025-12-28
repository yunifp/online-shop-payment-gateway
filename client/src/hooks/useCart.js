import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Nama event khusus untuk sinkronisasi
const CART_UPDATED_EVENT = 'cart-updated';

export default function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Fungsi Fetch Cart (Data Source)
  const fetchCart = useCallback(async () => {
    try {
      // Jangan set loading true jika hanya update background (agar dropdown tidak kedip)
      // Gunakan loading state lokal jika diperlukan, tapi di sini kita biarkan silent update
      // kecuali cart masih kosong
      if (!cart) setLoading(true); 
      
      const res = await axios.get(`${API_URL}/carts`, { withCredentials: true });
      
      if (res.data?.meta?.code === 200 || res.data?.data) {
        setCart(res.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setCart(null);
      }
      console.error("Gagal mengambil keranjang:", error.response?.data?.meta?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. Fungsi Helper untuk memicu event global
  const triggerUpdate = () => {
    // Dispatch event ke window agar hook useCart di komponen lain (Navbar) bereaksi
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  };

  const addItem = async (variant_id, quantity) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/carts`,
        { variant_id, quantity },
        { withCredentials: true }
      );
      
      if (res.data?.meta?.code === 200 || res.data?.meta?.code === 201) {
        // Panggil triggerUpdate SETELAH sukses menambah data
        triggerUpdate(); 
      }
      return res.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (cartItemId, quantity) => {
    try {
      const res = await axios.put(
        `${API_URL}/carts/${cartItemId}`,
        { quantity },
        { withCredentials: true }
      );
      if (res.data?.meta?.code === 200) {
        triggerUpdate();
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteItem = async (cartItemId) => {
    try {
      const res = await axios.delete(`${API_URL}/carts/${cartItemId}`, {
        withCredentials: true,
      });
      if (res.data?.meta?.code === 200) {
        triggerUpdate();
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete(`${API_URL}/carts`, { withCredentials: true });
      if (res.data?.meta?.code === 200) {
        setCart(null);
        triggerUpdate();
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // 3. Effect untuk Initial Load & Listen Event
  useEffect(() => {
    const user = localStorage.getItem("user");
    
    // Fetch pertama kali saat komponen mount
    if (user) {
        fetchCart();
    }

    // Fungsi handler saat event 'cart-updated' terjadi
    const handleCartUpdate = () => {
        fetchCart();
    };

    // Pasang listener
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdate);

    // Bersihkan listener saat unmount
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdate);
    };
  }, [fetchCart]);

  return { 
    cart, 
    loading, 
    addItem, 
    updateItem, 
    deleteItem, 
    clearCart, 
    refreshCart: fetchCart 
  };
}