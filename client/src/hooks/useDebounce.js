import { useState, useEffect } from 'react';

/**
 * Hook kustom untuk menunda (debounce) sebuah nilai.
 * @param {any} value Nilai yang ingin ditunda
 * @param {number} delay Waktu tunda dalam milidetik (default 500ms)
 * @returns {any} Nilai yang sudah ditunda
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Atur timer untuk memperbarui nilai
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Batalkan timer jika 'value' berubah (pengguna mengetik lagi)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Hanya jalankan ulang jika value atau delay berubah

  return debouncedValue;
}

export default useDebounce;