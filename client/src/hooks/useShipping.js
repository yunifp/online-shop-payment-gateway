import { useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function useShipping() {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]); // Kecamatan
  const [subDistricts, setSubDistricts] = useState([]); // Kelurahan/Desa
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // 1. Ambil Data Provinsi
  const getProvinces = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/shipping/provinces`, { withCredentials: true });
      if (res.data?.data) setProvinces(res.data.data);
    } catch (error) {
      console.error("Gagal ambil provinsi:", error);
      toast.error("Gagal memuat data provinsi");
    }
  }, [API_URL]);

  // 2. Ambil Data Kota berdasarkan Provinsi
  const getCities = useCallback(async (provinceId) => {
    if (!provinceId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shipping/cities/${provinceId}`, { withCredentials: true });
      if (res.data?.data) setCities(res.data.data);
    } catch (error) {
      console.error("Gagal ambil kota:", error);
      toast.error("Gagal memuat data kota");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 3. Ambil Data Kecamatan berdasarkan Kota
  const getDistricts = useCallback(async (cityId) => {
    if (!cityId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shipping/districts/${cityId}`, { withCredentials: true });
      if (res.data?.data) setDistricts(res.data.data);
    } catch (error) {
      console.error("Gagal ambil kecamatan:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 4. Ambil Data Kelurahan berdasarkan Kecamatan
  const getSubDistricts = useCallback(async (districtId) => {
    if (!districtId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/shipping/sub-districts/${districtId}`, { withCredentials: true });
      if (res.data?.data) setSubDistricts(res.data.data);
    } catch (error) {
      console.error("Gagal ambil kelurahan:", error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 5. Hitung Ongkir (Cost)
  const calculateCost = async ({ destination, weight, courier }) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/shipping/cost`,
        { destination, weight, courier }, // Origin biasanya diambil dari ShopAddress di Backend secara otomatis atau dikirim manual jika perlu
        { withCredentials: true }
      );
      if (res.data?.data) {
        setShippingCosts(res.data.data);
        return res.data.data;
      }
    } catch (error) {
      const msg = error.response?.data?.meta?.message || "Gagal hitung ongkir";
      toast.error(msg);
      setShippingCosts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    provinces,
    cities,
    districts,
    subDistricts,
    shippingCosts,
    loading,
    getProvinces,
    getCities,
    getDistricts,
    getSubDistricts,
    calculateCost,
    setCities,      // Untuk reset manual jika perlu
    setDistricts,
    setSubDistricts,
    setShippingCosts
  };
}