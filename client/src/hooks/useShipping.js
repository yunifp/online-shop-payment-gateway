import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function useShipping() {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const getProvinces = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/shipping/provinces`, {
        withCredentials: true,
      });
      if (res.data?.data) setProvinces(res.data.data);
    } catch (error) {
      toast.error("Gagal memuat provinsi");
    }
  }, [API_URL]);

  const getCities = useCallback(
    async (provinceId) => {
      if (!provinceId) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/shipping/cities/${provinceId}`,
          { withCredentials: true }
        );
        if (res.data?.data) setCities(res.data.data);
      } catch (error) {
        toast.error("Gagal memuat kota");
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const getDistricts = useCallback(
    async (cityId) => {
      if (!cityId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/shipping/districts/${cityId}`, {
          withCredentials: true,
        });
        if (res.data?.data) setDistricts(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const getSubDistricts = useCallback(
    async (districtId) => {
      if (!districtId) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}/shipping/sub-districts/${districtId}`,
          { withCredentials: true }
        );
        if (res.data?.data) setSubDistricts(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  const calculateCost = async () => {
    try {
      setLoading(true);
      setShippingCosts([]);

      const res = await axios.post(
        `${API_URL}/shipping/cost`,
        {},
        { withCredentials: true }
      );

      // PERUBAHAN DISINI: Menyesuaikan dengan struktur { data: { results: [...] } }
      const options = res.data?.data?.results || [];

      if (options.length === 0) {
        toast.error("Tidak ada layanan pengiriman tersedia.");
      }

      setShippingCosts(options);
      return options;
    } catch (error) {
      const msg =
        error.response?.data?.meta?.message || "Gagal menghitung ongkir.";
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
    setCities,
    setDistricts,
    setSubDistricts,
    setShippingCosts,
  };
}
